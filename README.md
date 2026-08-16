# Lingcoo TS App Starter

一个基于现代 TypeScript 技术栈的生产级全栈应用模板，用于快速构建、开发和部署商业应用。

`ts-app-starter` 解决的是工程启动问题，而不是重新发明一个后端框架。它把 API、Worker、前端、数据库、容器化、CI 和生产部署所需的基础结构组合起来，让开发者可以把主要精力放在业务开发上。

## Overview

一个完整的业务应用通常同时需要：

- HTTP API；
- 管理后台和公共 Web；
- 数据库和可重复迁移；
- 异步任务和后台 Worker；
- 本地开发环境；
- Docker 生产镜像；
- CI/CD 和部署健康检查。

从零搭建这些基础设施并不困难，但很容易在目录组织、配置校验、进程管理、数据库迁移、镜像构建和发布流程上重复踩坑。

这个项目提供一套清晰、可替换、可扩展的起点：

```text
创建项目 → 开发业务 → 构建镜像 → 发布镜像 → 部署自己的服务器
```

模板不绑定 Lingcoo 的服务器、域名、镜像仓库或生产账号。开发者创建自己的项目后，需要配置自己的环境和部署参数。

## What this project is

`ts-app-starter` 是：

- 一个 TypeScript 全栈应用模板；
- 一个 NestJS + Fastify 后端起点；
- 一个 API 和 Worker 分离的运行结构；
- 一个 React + Vite 前端起点；
- 一个 PostgreSQL + Drizzle 数据层起点；
- 一个可以由 GitHub Actions 构建和发布的 Docker 应用；
- 一个适合继续发展为 SaaS、管理系统、CMS、订单系统或行业应用的基础工程。

它不是：

- 另一个自研后端框架；
- 运行时插件系统；
- 预置业务模块集合；
- Lingcoo 内部生产环境的复制品；
- 绑定某个云厂商或某个服务器的部署产品。

## Features

### Runtime

| 类型            | 技术           |
| --------------- | -------------- |
| Runtime         | Node.js 24 LTS |
| Language        | TypeScript     |
| Package manager | pnpm 11        |
| Workspace       | pnpm workspace |
| Container       | Docker         |

### Backend

- NestJS application architecture;
- Fastify HTTP adapter;
- REST API foundation;
- standalone NestJS Worker process;
- PostgreSQL connection and health checks;
- Drizzle ORM and SQL migrations;
- Zod-based environment validation;
- request ID and secure HTTP headers;
- optional OpenAPI/Swagger documentation.

### Frontend

- React;
- Vite;
- TypeScript;
- independent Admin and Web applications;
- static assets served by the application container in production.

当前模板使用轻量 CSS 作为页面基础，没有强制绑定 UI 框架。Tailwind CSS 可以在生成的业务项目中按需引入，不会把不必要的视觉体系写死在 Starter 中。

### Database

- PostgreSQL;
- Drizzle ORM;
- checked-in SQL migrations;
- migration idempotency verification in CI;
- readiness checks that verify database connectivity.

### Infrastructure

- Docker Compose for local and production topology;
- one runtime image for API, Worker and migration commands;
- GitHub Actions CI;
- optional GitHub Actions image publishing and deployment template;
- health checks and deployment smoke tests.

## Why this technology stack

Node.js + TypeScript 是“运行时 + 编程语言”，本身不是完整的软件架构。真正的架构还包括 Web 框架、数据库、模块边界、进程模型、配置方式、容器化和发布流程。

本项目选择的完整组合是：

```text
Node.js
  + TypeScript
  + NestJS
  + Fastify
  + React + Vite
  + PostgreSQL + Drizzle
  + Docker
  + GitHub Actions
```

到 2026 年，这仍然是构建现代 Web 和业务应用的一套成熟组合：前后端可以共享 TypeScript 类型和工具链，Node.js 适合大量 I/O 型请求，NestJS 提供明确的模块化工程结构，Fastify 提供低开销 HTTP 层，PostgreSQL 提供成熟的关系型数据能力。

- [Node.js TypeScript support](https://nodejs.org/api/typescript.html)：Node.js 已提供轻量的 TypeScript 类型剥离支持，但装饰器等需要代码转换的能力仍应通过构建工具处理；本项目使用标准 TypeScript 构建流程。
- [TypeScript](https://www.typescriptlang.org/)：为 JavaScript 提供静态类型和适合大型应用的工具能力。
- [NestJS](https://docs.nestjs.com/)：提供可测试、可扩展、松耦合的 Node.js 应用架构，并支持 Fastify 适配器。
- [Fastify](https://fastify.dev/)：低开销、插件化、支持 TypeScript 的 Node.js Web 框架。

## Architecture

### Current repository structure

当前代码仓库采用轻量 pnpm workspace：

```text
ts-app-starter/
├── server/                 # NestJS API、Worker、Drizzle migration
│   ├── src/
│   ├── drizzle/
│   └── test/
├── admin/                  # React + Vite 管理端
├── web/                    # React + Vite 公共 Web
├── packages/               # 预留的项目内部共享包目录，目前为空
├── docker/                 # Caddy 配置
├── deploy/                 # 通用部署脚本和环境模板
├── .github/workflows/      # CI、Docker 验证、安全审计、可选 Deploy
├── Dockerfile              # 单一生产运行镜像
├── docker-compose.yml      # 本地 PostgreSQL
└── docker-compose.prod.yml # PostgreSQL、API、Worker、Caddy
```

`server/`、`admin/` 和 `web/` 是当前稳定实现。后续可以将目录演进为更强调职责的命名：

```text
services/
├── api/
└── worker/

clients/
├── admin/
└── web/
```

这属于目录规范化，不改变 API、Worker 和客户端的职责边界。

### Runtime topology

```text
                         ┌──────────────┐
Browser ───────────────▶ │ Caddy / TLS  │
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │ NestJS API   │
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │ PostgreSQL   │
                         └──────────────┘

                         ┌──────────────┐
                         │ NestJS Worker│
                         └──────────────┘
```

#### API

API 负责：

- HTTP 请求和响应；
- Controller、Service 和业务模块；
- 数据库访问；
- 健康检查；
- Admin/Web 静态资源服务。

#### Worker

Worker 使用相同的应用镜像，以独立进程运行，负责未来的：

- 后台任务；
- 队列消费者；
- 定时任务；
- 邮件、通知和异步集成。

#### packages

当前 `packages/` 只用于项目内部共享代码，例如：

- shared types；
- validation schemas；
- constants；
- utilities。

它不是 Lingcoo 公共能力包仓库。本阶段不把共享能力强行抽取到这里；公共包生态将在后续阶段单独设计和发布。

## Quick Start

### Requirements

- Node.js 24 LTS 或更高的兼容版本；
- Corepack；
- pnpm 11；
- Docker Desktop 或 Docker Engine + Compose。

### Clone and install

```bash
git clone https://github.com/LingcooTech/ts-app-starter.git
cd ts-app-starter
corepack enable
pnpm install
```

### Configure environment

```bash
cp .env.example .env
```

本地示例默认使用：

```text
API_PORT=8090
PostgreSQL=localhost:5438
```

生产密码、Token 和 SSH key 不应该写入 `.env.example` 或 Git 仓库。

### Start database

```bash
docker compose up -d
```

### Run migration

```bash
pnpm db:migrate
```

### Start development

```bash
pnpm dev
```

默认入口：

| 服务          | 地址                                 |
| ------------- | ------------------------------------ |
| API liveness  | <http://localhost:8090/health/live>  |
| API readiness | <http://localhost:8090/health/ready> |
| OpenAPI       | <http://localhost:8090/api/docs>     |
| Admin         | <http://localhost:5173/admin/>       |
| Web           | <http://localhost:5174/>             |

Worker 可以单独启动：

```bash
pnpm dev:worker
```

### Validate the project

```bash
pnpm check
```

`pnpm check` 会执行格式检查、Lint、TypeScript 类型检查、测试和构建。

## Development guide

### Add an API module

业务模块应该位于后端模块目录中。当前仓库可以从以下结构开始：

```text
server/src/modules/users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
├── dto/
├── schemas/
└── repositories/
```

模块应该通过 NestJS Module 组织，不引入自研的 Runtime、Manifest 或 Capability Registry。

### Add a frontend page

管理后台页面放在：

```text
admin/src/pages/
```

公共 Web 页面放在：

```text
web/src/pages/
```

前端通过 API 契约与后端通信，不直接访问数据库。

### Add shared code

只有当代码确实被多个模块使用，并且边界稳定时，才放入项目内部 `packages/`。不要为了目录完整而过早抽象。

## Production deployment

部署模板的默认行为是关闭的。开发者创建自己的仓库后，配置自己的镜像仓库、服务器、域名和环境变量，再设置：

```text
DEPLOY_ENABLED=true
```

部署流程：

```text
Git push
   ↓
GitHub Actions CI
   ↓
构建 Docker 镜像
   ↓
推送开发者自己的 Registry
   ↓
SSH 到开发者自己的服务器
   ↓
docker compose pull
   ↓
数据库迁移、API/Worker/Caddy 启动
   ↓
健康检查和冒烟测试
```

模板不包含任何特定服务器、域名或镜像仓库配置。完整变量和凭据说明见：

- [Deployment guide](docs/deployment.md)
- [生产环境模板](deploy/production.env.example)

## Project philosophy

### Why not another framework?

这个项目不是为了重新发明一个框架。它基于成熟生态组合工程能力：

```text
Node.js + TypeScript + NestJS + Fastify
          + React + PostgreSQL + Docker
```

目标是提供一套经过验证的工程组合，而不是创造新的底层技术。开发者可以替换数据库、前端组件、队列或部署平台，而不需要先理解一个自研 Runtime。

### What applications fit this stack?

只要核心业务是“接收请求 → 处理业务逻辑 → 查询数据库或外部 API → 返回结果”，这套组合通常都很合适，尤其适用于：

- REST API 和 GraphQL 服务；
- SaaS 和多租户系统；
- CRM、ERP、教培、零售等企业管理系统；
- 电商、订单、支付和库存系统；
- CMS 和 Headless CMS；
- BFF 和 Web/小程序/App API 聚合层；
- WebSocket、通知和实时状态应用；
- 后台管理系统；
- CLI、脚手架和开发工具；
- 定时任务和异步 Worker；
- NestJS/Fastify 微服务。

它不代表所有问题都应该使用 Node.js。CPU 密集型计算、长时间科学计算或极端低延迟内核通常需要单独评估语言、运行时和基础设施。

## Roadmap

### Current

- Full-stack TypeScript starter；
- NestJS API and Worker；
- React + Vite Admin/Web；
- PostgreSQL + Drizzle；
- Docker Compose；
- CI/CD and deployment template；
- Apache-2.0 open source governance。

### Next

- `npx create-ts-app-starter` project generator；
- More standalone starter examples；
- Generic deployment presets；
- Public reusable packages with independent versions；
- `services/` and `clients/` directory normalization；
- Documentation site and compatibility matrix。

## Contributing and security

- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

请不要提交密码、Token、SSH 私钥、生产 `.env` 或云厂商凭据。

## License

Apache-2.0. See [LICENSE](LICENSE).
