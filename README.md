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
docker compose -f docker-compose.prod.yml up --build
```

完整阶段规划见 [实施方案](docs/implementation-plan.md)。
