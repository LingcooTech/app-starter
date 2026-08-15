ARG NODE_IMAGE=node:24-alpine

FROM ${NODE_IMAGE} AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable
WORKDIR /app

FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY server/package.json ./server/package.json
COPY admin/package.json ./admin/package.json
COPY web/package.json ./web/package.json
RUN pnpm install --frozen-lockfile

FROM dependencies AS build

COPY . .
RUN pnpm build
RUN pnpm --filter @lingcoo/server deploy --prod /prod/server

FROM ${NODE_IMAGE} AS runtime

ARG APP_VERSION=development
ENV NODE_ENV=production
ENV APP_VERSION=$APP_VERSION
ENV API_HOST=0.0.0.0
ENV API_PORT=8090

WORKDIR /app
RUN addgroup -S lingcoo && adduser -S lingcoo -G lingcoo

COPY --from=build --chown=lingcoo:lingcoo /prod/server ./server
COPY --from=build --chown=lingcoo:lingcoo /app/admin/dist ./admin/dist
COPY --from=build --chown=lingcoo:lingcoo /app/web/dist ./web/dist

USER lingcoo
EXPOSE 8090
CMD ["node", "server/dist/main.js"]
