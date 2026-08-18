# Architecture

本文档说明 `ts-app-starter` 当前已经实现的架构，以及后续目录演进方向。

## Architectural layers

```text
clients  ────────▶  services  ────────▶  database / integrations
   │                   │
   │                   └──────────────▶ worker / jobs
   │
   └── static assets served through the API container in production
```

### Clients

当前仓库有两个客户端：

- `admin/`：管理后台；
- `web/`：公共 Web 应用。

它们使用 React、Vite 和 TypeScript 构建。客户端通过 HTTP API 与后端通信，不直接访问 PostgreSQL。

### Services

当前 `server/` 包含两个运行入口：

```text
server/src/main.ts    # HTTP API
server/src/worker.ts  # standalone Worker
```

API 进程负责请求处理和静态资源，Worker 进程负责后台任务。两者使用相同的 Docker runtime image，但使用不同的启动命令。

后续目录可以规范为：

```text
services/
├── api/
└── worker/
```

这只是代码组织的改进，不意味着需要建立新的 Runtime。

### Application modules

业务能力应该使用 NestJS Module 表达：

```text
server/src/modules/<module>/
├── <module>.module.ts
├── <module>.controller.ts
├── <module>.service.ts
├── dto/
├── schemas/
└── repositories/
```

模块内部负责自己的 Controller、Service、DTO、Schema 和 Repository。跨模块共享的内容必须有明确边界，不能通过全局单例或隐式注册表连接。

## Runtime topology

生产 Compose 拓扑包含四个服务：

```text
postgres ────────┐
                 ├── api ─── caddy ─── public traffic
                 └── worker
```

- `postgres`：持久化关系型数据库；
- `api`：NestJS + Fastify HTTP 服务；
- `worker`：NestJS standalone application context；
- `caddy`：反向代理和安全响应头。

API 和 Worker 依赖 PostgreSQL 健康状态。发布脚本在迁移前显式等待数据库 ready，避免容器已经启动但数据库仍拒绝连接。

## Configuration boundary

配置通过环境变量进入应用，并在启动时使用 Zod 校验。仓库只提交：

- `.env.example`；
- `deploy/production.env.example`；
- 不含凭据的配置说明。

密码、Token、SSH 私钥和生产环境文件不进入 Git。部署目标由开发者自己的 GitHub Variables 配置，凭据由 GitHub Secrets 或外部 Secret Manager 管理。

## Data boundary

数据库结构由 Drizzle migration 管理：

```text
server/drizzle/*.sql
```

迁移必须可重复执行。CI 会执行两次迁移，验证第二次执行不会产生额外变更。

## Why this architecture

- NestJS 提供模块、依赖注入、Controller、Provider 和测试边界；
- Fastify 提供低开销 HTTP 层和插件体系；
- Worker 与 API 分进程，避免后台任务阻塞请求处理；
- PostgreSQL 适合事务、关系建模和成熟运维；
- Drizzle 保留 SQL 迁移，同时提供 TypeScript 类型能力；
- Docker 保证开发、CI 和生产使用相同的构建边界；
- GitHub Actions 将构建放在 Runner，低配置生产服务器只拉取镜像。

## What this architecture deliberately avoids

本项目不引入：

- 自研后端 Runtime；
- Extension Manifest；
- Capability Registry；
- 全局模块注册表；
- 复制源码代替版本化依赖；
- 把业务模块强行塞进 Starter。

跨应用的公共能力应通过独立的包仓库发布；这些包不属于当前 Starter，
也不会在本仓库中提前实现。只有在多个真实应用中形成稳定边界后，才应提取共享包。
