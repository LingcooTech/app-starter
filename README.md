# TS App Starter

基于成熟 TypeScript Web 生态的通用业务应用起点：

- NestJS + Fastify API
- NestJS standalone Worker
- PostgreSQL + Drizzle ORM
- React + Vite Admin/Web
- pnpm Workspace
- Docker + Caddy + GitHub Actions

本仓库是应用模板，不提供自研 Runtime 或扩展框架。

## 开源协议

本项目以 [Apache License 2.0](LICENSE) 发布。你可以在遵守许可证和保留
必要声明的前提下使用、修改和分发本项目。

参与贡献前请阅读 [贡献指南](CONTRIBUTING.md) 和 [安全策略](SECURITY.md)。

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

## 部署模板

仓库提供可选的 Docker 部署工作流。模板默认不会发布镜像或连接任何服务器；
开发者创建自己的仓库后，配置部署变量并将 `DEPLOY_ENABLED` 设置为 `true`，
才会构建镜像、推送到自己的镜像仓库并部署到自己的服务器。

生产镜像只由 GitHub Actions 构建，服务器不执行 `docker build`，只拉取指定 SHA
镜像、执行数据库迁移、启动 API/Worker/Caddy，并执行开发者配置的健康检查。

Deploy workflow 需要以下 GitHub Actions Secrets：

- `ACR_REGISTRY`
- `ACR_NAMESPACE`
- `ACR_USERNAME`
- `ACR_PASSWORD`
- `DEPLOY_SSH_PRIVATE_KEY`
- `DEPLOY_SSH_KNOWN_HOSTS`

部署目标和镜像信息等非敏感参数通过 GitHub Actions Variables 配置：

- `DEPLOY_ENABLED=true`
- `IMAGE_NAME`
- `GHCR_IMAGE`
- `ACR_REGISTRY`
- `ACR_NAMESPACE`
- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PATH`
- `DEPLOY_HEALTHCHECK_URL`
- `DEPLOY_REPOSITORY`
- 可选的 `DEPLOY_GIT_KEY`

生产部署凭据不应写入仓库；建议使用专用的非-root 部署账号。公共模板不包含
任何 Lingcoo 域名、服务器、镜像仓库或部署路径。

服务器首次部署前，在开发者自己配置的部署路径中写入生产变量。可参考
[生产环境模板](deploy/production.env.example)，其中数据库密码必须随机生成，
且要与 `DATABASE_URL` 中的密码一致。

生产 Compose 文件不包含 `build` 配置；发布脚本只执行 `docker compose pull`，避免低配置服务器因本地编译耗尽资源。

完整阶段规划见 [实施方案](docs/implementation-plan.md)。
