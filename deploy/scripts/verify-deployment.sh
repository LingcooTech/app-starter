#!/bin/sh

set -eu

base_url="${1:?usage: verify-deployment.sh <base-url>}"
base_url="${base_url%/}"

assert_status() {
  path="$1"
  expected="$2"
  status="$(curl -fsS -o /dev/null -w '%{http_code}' "${base_url}${path}")"
  if [ "${status}" != "${expected}" ]; then
    echo "smoke check failed: ${path} returned ${status}, expected ${expected}"
    exit 1
  fi
  echo "smoke check passed: ${path} (${status})"
}

assert_contains() {
  path="$1"
  expected="$2"
  body="$(curl -fsS "${base_url}${path}")"
  case "${body}" in
    *"${expected}"*) echo "content check passed: ${path}" ;;
    *) echo "content check failed: ${path} does not contain ${expected}"; exit 1 ;;
  esac
}

assert_header() {
  path="$1"
  header_name="$2"
  expected="$3"
  headers="$(curl -fsSI "${base_url}${path}" | tr -d '\r')"
  if ! printf '%s\n' "${headers}" | awk -v name="${header_name}" -v expected="${expected}" '
    BEGIN { found = 0; prefix = tolower(name) ":" }
    index(tolower($0), prefix) == 1 && index(tolower($0), tolower(expected)) > 0 { found = 1 }
    END { exit(found ? 0 : 1) }
  '; then
    echo "header check failed: ${path} ${header_name}"
    exit 1
  fi
  echo "header check passed: ${path} ${header_name}"
}

assert_status /health/live 200
assert_status /health/ready 200
assert_status / 200
assert_status /admin/ 200
assert_contains / '<title>Application</title>'
assert_contains /admin/ '<title>Application Admin</title>'
assert_header / 'X-Content-Type-Options' 'nosniff'
assert_header / 'Referrer-Policy' 'strict-origin-when-cross-origin'

echo "deployment smoke verification passed for ${base_url}"
