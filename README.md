# Lingcoo App Starter

基于成熟 TypeScript Web 生态的 Lingcoo 业务应用起点：

- NestJS + Fastify API
- NestJS standalone Worker
- PostgreSQL + Drizzle ORM
- React + Vite Admin/Web
- pnpm Workspace
- Docker + Caddy + GitHub Actions

本仓库是应用模板，不是 Lingcoo Runtime，也不提供自研扩展框架。

## 环境要求

- Node.js 24 LTS
- Corepack
- Docker Desktop 或兼容的 Docker Engine/Compose

## 本地启动

```bash
cp .env.example .env
corepack enable
pnpm install
docker compose up -d postgres
pnpm db:migrate
pnpm dev
```

默认入口：

- API liveness: <http://localhost:8090/health/live>
- API readiness: <http://localhost:8090/health/ready>
- OpenAPI: <http://localhost:8090/api/docs>
- Admin: <http://localhost:5173/admin/>
- Web: <http://localhost:5174/>

Worker 使用独立命令启动：

```bash
pnpm dev:worker
```

## 验证

```bash
pnpm check
docker compose -f docker-compose.prod.yml --env-file deploy/production.env.example config
```

## 生产部署

生产镜像只由 GitHub Actions 构建，成功后同时推送到阿里云 ACR 和 GHCR。服务器不执行 `docker build`，只拉取指定 SHA 镜像、执行数据库迁移、启动 API/Worker/Caddy，并通过 `frame.lingcoo.com` 做冒烟验证。

Deploy workflow 需要以下 GitHub Actions Secrets：

- `ACR_REGISTRY`
- `ACR_NAMESPACE`
- `ACR_USERNAME`
- `ACR_PASSWORD`
- `DEPLOY_SSH_PRIVATE_KEY`
- `DEPLOY_SSH_KNOWN_HOSTS`

服务器首次部署前，在 `/opt/lingcoo-app-starter/.env` 写入生产变量。可参考 [生产环境模板](deploy/production.env.example)，其中数据库密码必须随机生成，且要与 `DATABASE_URL` 中的密码一致。

生产 Compose 文件不包含 `build` 配置；发布脚本只执行 `docker compose pull`，避免低配置服务器因本地编译耗尽资源。

完整阶段规划见 [实施方案](docs/implementation-plan.md)。
