#!/bin/sh

set -eu

: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
: "${DEPLOY_REPOSITORY:?DEPLOY_REPOSITORY is required}"
: "${ACR_REGISTRY:?ACR_REGISTRY is required}"
: "${ACR_USERNAME:?ACR_USERNAME is required}"
: "${ACR_PASSWORD:?ACR_PASSWORD is required}"
: "${APP_IMAGE:?APP_IMAGE is required}"
: "${IMAGE_TAG:?IMAGE_TAG is required}"

DEPLOY_COMPOSE_FILE="${DEPLOY_COMPOSE_FILE:-docker-compose.prod.yml}"
DEPLOY_HEALTHCHECK_URL="${DEPLOY_HEALTHCHECK_URL:?DEPLOY_HEALTHCHECK_URL is required}"

if [ -n "${DEPLOY_GIT_KEY:-}" ]; then
  test -f "${DEPLOY_GIT_KEY}" || { echo "${DEPLOY_GIT_KEY} is required"; exit 1; }
  GIT_SSH_COMMAND="ssh -i ${DEPLOY_GIT_KEY} -o IdentitiesOnly=yes"
  export GIT_SSH_COMMAND
fi

if [ ! -d "${DEPLOY_PATH}/.git" ]; then
  install -d -m 755 "$(dirname "${DEPLOY_PATH}")"
  git clone "${DEPLOY_REPOSITORY}" "${DEPLOY_PATH}"
fi

cd "${DEPLOY_PATH}"
test -f .env || { echo "${DEPLOY_PATH}/.env is required"; exit 1; }

git fetch --prune origin
git checkout main
git reset --hard origin/main

printf '%s' "${ACR_PASSWORD}" | docker login "${ACR_REGISTRY}" --username "${ACR_USERNAME}" --password-stdin

export APP_VERSION="${IMAGE_TAG}"
export APP_IMAGE
docker compose -f "${DEPLOY_COMPOSE_FILE}" config >/dev/null
docker compose -f "${DEPLOY_COMPOSE_FILE}" pull postgres api worker caddy
docker compose -f "${DEPLOY_COMPOSE_FILE}" up -d postgres

postgres_container="$(docker compose -f "${DEPLOY_COMPOSE_FILE}" ps -q postgres)"
attempt=1
while [ "${attempt}" -le 30 ]; do
  postgres_health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}running{{end}}' "${postgres_container}" 2>/dev/null || true)"
  if [ "${postgres_health}" = healthy ] || [ "${postgres_health}" = running ]; then
    break
  fi
  if [ "${attempt}" -eq 30 ]; then
    docker compose -f "${DEPLOY_COMPOSE_FILE}" logs --tail=100 postgres || true
    exit 1
  fi
  sleep 2
  attempt=$((attempt + 1))
done

docker compose -f "${DEPLOY_COMPOSE_FILE}" run --rm --no-deps api node server/dist/migrate.js
docker compose -f "${DEPLOY_COMPOSE_FILE}" up -d --no-deps api worker

api_container_id="$(docker compose -f "${DEPLOY_COMPOSE_FILE}" ps -q api)"
worker_container_id="$(docker compose -f "${DEPLOY_COMPOSE_FILE}" ps -q worker)"
test -n "${api_container_id}"
test -n "${worker_container_id}"

attempt=1
while [ "${attempt}" -le 30 ]; do
  api_status="$(docker inspect --format '{{.State.Health.Status}}' "${api_container_id}" 2>/dev/null || true)"
  worker_status="$(docker inspect --format '{{.State.Status}}' "${worker_container_id}" 2>/dev/null || true)"
  if [ "${api_status}" = healthy ] && [ "${worker_status}" = running ]; then
    break
  fi
  if [ "${attempt}" -eq 30 ]; then
    docker compose -f "${DEPLOY_COMPOSE_FILE}" logs --tail=100 api worker || true
    exit 1
  fi
  sleep 5
  attempt=$((attempt + 1))
done

docker compose -f "${DEPLOY_COMPOSE_FILE}" up -d --no-deps caddy

attempt=1
while [ "${attempt}" -le 30 ]; do
  if curl -fsS "${DEPLOY_HEALTHCHECK_URL}" >/dev/null; then
    echo "health check passed on attempt ${attempt}"
    break
  fi
  if [ "${attempt}" -eq 30 ]; then
    docker compose -f "${DEPLOY_COMPOSE_FILE}" logs --tail=100 caddy api || true
    exit 1
  fi
  sleep 5
  attempt=$((attempt + 1))
done

sh ./deploy/scripts/verify-deployment.sh "${DEPLOY_HEALTHCHECK_URL%/health/ready}"
