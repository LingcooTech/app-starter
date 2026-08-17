# Lingcoo TS App Starter

一个建立在成熟 TypeScript Web 技术栈之上的、可直接开发和部署完整业务应用的起始工程。

语言 / Language: 中文 · [English](README.en.md)

## 1. 项目定位

Node.js + TypeScript 是当前主流 Web 和业务应用开发中成熟、现代且广泛采用的技术组合之一。只要应用的核心业务是“接收请求 → 处理业务逻辑 → 查询数据库或外部 API → 返回结果”，Node.js + TypeScript 通常都是非常合适的技术路线。

TS App Starter 在这条成熟技术路线之上，把后端、前端、数据库、工程结构、Docker 和 CI/CD 组合成一套可以直接开发、构建和部署的完整应用基础。

它的目标很明确：为有真实业务流程的应用提供一个成熟、清晰、可部署的起点。

## 2. 它最适合开发什么？

它最适合有用户端、有管理后台、有 API、有数据库，并围绕明确业务流程持续开发的完整业务应用。

用户端可以是 Web、小程序、App、H5 或其他终端；管理后台用于工作人员、商家、机构或企业内部管理；API 负责业务能力和数据访问；数据库保存核心业务数据。

### 行业应用

围绕一个行业的完整业务流程构建系统，例如教培、零售、门店、物业、物流、企业服务等。这类应用通常需要把多个业务环节放在同一个系统中协同运行。

### 垂直领域应用

围绕一个明确业务领域深入开发，例如 CRM、预约、会员、订单、内容、售后、工单、项目或订阅管理。它们不一定属于某一个行业，也可以服务多个行业。

TS App Starter 不追求覆盖所有软件形态。对于只有几个页面的简单网站，它可能偏重；对于需要复杂分布式基础设施的超大型系统，也需要进一步设计。它专注的是最常见的完整业务应用。

## 3. 为什么要使用它？

一个想法怎样才能变成一套技术上合理、工程上规范、最终可以稳定交付的软件？这通常包括需求分析、产品规划、技术选型、架构设计、工程治理、部署运维等多个过程。

其中，技术选型、架构设计、工程治理尤为重要。尽管 Vibe Coding 已经降低了编程门槛，但是很多跨界编程的人对技术栈和架构了解不多，容易被 AI 牵着走，重复造轮子，最终制造大泥球。

清晰的技术组合、架构设计和工程基础，是任何项目的必要基础，也是决定一个产品能否长期维护和使用的关键。设计完成后，深入论证和完整测试同样不可缺少。

TS App Starter 把这些基础工作预先完成。新项目可以直接建立在这套已经完成架构设计、技术选型和工程化配置的基础上，把主要精力放到业务本身。

## 4. 为什么值得信任？

### 基于成熟技术栈

它把业务应用建立在成熟、主流的 TypeScript Web 技术之上，而不是把核心能力建立在未经验证的自定义底座上。

TS App Starter 重点解决的是选型、组合、规范和工程化：HTTP、后端模块、数据库、前端、容器和 CI/CD 分别交给成熟技术负责，再把它们组织成一套完整应用。

| 层级      | 技术                   | 主要作用                              |
| --------- | ---------------------- | ------------------------------------- |
| 语言      | TypeScript             | 统一前后端开发语言和类型系统          |
| 运行环境  | Node.js                | 运行 API、Worker 和服务端工具         |
| 后端架构  | NestJS                 | 组织模块、依赖、业务代码和测试        |
| HTTP      | Fastify                | 处理 HTTP 请求和响应                  |
| 数据库    | PostgreSQL             | 保存核心业务数据                      |
| 数据访问  | Drizzle ORM            | 以 TypeScript 管理数据库访问和 Schema |
| 数据校验  | Zod / JSON Schema      | 校验配置和接口数据                    |
| 前端      | React + Vite / Next.js | 构建管理后台和 Web 用户端             |
| Workspace | pnpm                   | 管理依赖和多工程 Workspace            |
| 应用交付  | Docker                 | 构建可重复部署的运行镜像              |
| CI/CD     | GitHub Actions         | 自动检查、测试、构建和发布            |

### 成熟的应用架构

后端默认采用模块化单体：一个应用保持整体部署简单，内部按业务模块划分边界。随着业务增长，可以增加 Worker、Redis、队列、对象存储或独立服务，而不需要一开始就引入微服务复杂度。

    server/src/modules/
    ├── users/
    ├── customers/
    ├── products/
    ├── orders/
    └── payments/

### 成熟的工程交付方式

生产服务器只负责运行，不负责构建。代码在 CI 中完成检查、测试、构建和 Docker 镜像制作，服务器只拉取已经构建完成的镜像并运行。

构建过程往往需要更高的瞬时 CPU 和内存，而应用正常运行并不需要同等配置。通过 CI 构建镜像、服务器直接拉取运行，可以降低硬件要求，也避免构建过程影响线上服务。

    Git Push
      ↓
    GitHub Actions
      ↓
    Check / Test / Build
      ↓
    Docker Image
      ↓
    Container Registry
      ↓
    Production Server
      ↓
    Pull → Migrate → Start → Health Check

### 轻量化运行

TS App Starter 默认采用尽可能简单的运行结构，不要求 Kubernetes、微服务集群或完整的分布式基础设施。

一个基础业务应用通常只需要 Application + PostgreSQL + Caddy。需要后台任务时，再增加 Worker；Redis、BullMQ、对象存储、搜索等能力按业务需要加入。

空白 Starter 在一台 2 核 CPU / 3.6GB 内存的服务器上实测，API、Worker、PostgreSQL 和 Caddy 四个容器合计占用约 161MB 内存。对于轻量行业应用，4GB 内存通常已经有比较充足的空间。

## 5. 总体应用架构

    TS App Starter
    ├── Frontend
    │   ├── Admin       React + Vite
    │   └── Web         React + Vite / Next.js
    ├── Server
    │   ├── API         NestJS + Fastify
    │   └── Worker      NestJS Application Context
    ├── Data
    │   └── PostgreSQL + Drizzle
    └── Engineering
        ├── pnpm Workspace
        ├── Docker / Docker Compose
        └── GitHub Actions

Admin 和 Web 是默认的两个前端入口；实际业务也可以由小程序、App 或其他终端通过 API 接入。Server 中 API 负责实时请求，Worker 负责异步任务和后台工作。

## 6. Repository 结构

推荐采用“一个业务应用，一个 Git 仓库”。每个应用独立进行开发、版本管理、CI、镜像发布和部署，保持边界清晰、轻量运行。

    ts-app-starter/
    ├── server/                  # NestJS API + Worker
    │   ├── src/
    │   │   ├── main.ts
    │   │   ├── worker.ts
    │   │   ├── app.module.ts
    │   │   ├── worker.module.ts
    │   │   ├── common/
    │   │   ├── infrastructure/
    │   │   └── modules/
    │   ├── drizzle/
    │   └── test/
    ├── admin/                   # React + Vite 管理后台
    ├── web/                     # React + Vite 公共 Web
    ├── packages/                # 项目内部共享包，按需使用
    ├── docker/                  # Caddy / Docker 配置
    ├── deploy/                  # 部署脚本和环境模板
    ├── .github/workflows/       # CI / Build / Publish / Deploy
    ├── Dockerfile
    ├── docker-compose.yml
    ├── docker-compose.prod.yml
    ├── pnpm-workspace.yaml
    └── package.json

新业务优先作为 NestJS Module 加入 server，而不是先抽成独立 package。只有真正需要被多个工程共享、并且边界已经稳定的代码，才进入 packages/。

## 7. 如何使用它开发一个新应用？

### 方式 A：GitHub Template（当前可用）

仓库已经开启 GitHub Template Repository。打开仓库主页，点击 **Use this template**，创建自己的新仓库。模板创建的是独立仓库，不会继承 Starter 的提交历史。

如果使用网页模板创建，直接进入新仓库即可，不需要执行 rm -rf .git。不要把模板仓库当作业务项目直接开发。

### 方式 B：CLI（推荐）

CLI 包发布后，使用以下命令创建独立项目：

    npx @lingcoo-tech/create-ts-app-starter@latest my-app
    cd my-app

CLI 会下载模板、替换项目名称、删除原 Git 历史、初始化新 Git 仓库，并按选项安装依赖。

### 第 1 步：安装依赖并配置环境

    corepack enable
    pnpm install
    cp .env.example .env

在 .env 中配置本地数据库、端口和其他需要的环境变量。生产密码、Token 和私钥不要提交到 Git。

### 第 2 步：启动本地基础环境

    docker compose up -d
    pnpm db:migrate
    pnpm dev

启动后即可获得 API、Admin、Web 和 PostgreSQL 的本地开发环境。Worker 可以按需单独启动。

### 第 3 步：开发业务

后端按业务模块增加功能，Admin 增加管理页面，Web、小程序或 App 通过 API 使用业务能力。数据库变化通过 Drizzle Schema 和 Migration 管理。

    需求
     ↓
    业务模块
     ↓
    API / Database
     ↓
    Admin / Web / 小程序 / App
     ↓
    测试

### 第 4 步：运行工程检查

    pnpm check

### 第 5 步：创建自己的 GitHub 仓库并推送

如果使用 GitHub Template 或 CLI，项目已经是独立 Git 仓库。创建一个自己的 GitHub 空仓库后执行：

    git remote add origin git@github.com:<your-account>/<your-repository>.git
    git add .
    git commit -m "Initial project"
    git push -u origin main

### 第 6 步：构建并发布 Docker 镜像

    Source
      ↓
    GitHub Actions
      ↓
    Production Build
      ↓
    Docker Image
      ↓
    GHCR / ACR / Other Registry

镜像包含运行应用所需的生产代码和依赖。生产服务器不需要重新安装依赖或重新编译源码。

### 第 7 步：服务器拉取并启动

    docker compose pull
    docker compose up -d

部署流程根据项目配置执行数据库迁移，启动 API、Worker 和 Caddy，并完成健康检查。服务器只运行 CI 构建好的镜像，不直接构建源码。

### 第 8 步：通过域名访问应用

    用户
     ↓
    Domain / HTTPS
     ↓
    Caddy
     ↓
    Web / Admin / API
     ↓
    Business Application

## 8. 扩展方式

基础保持简单，能力按需要增加。

| 需求           | 建议扩展                       |
| -------------- | ------------------------------ |
| 异步任务增多   | Worker / BullMQ                |
| 需要缓存或队列 | Redis                          |
| 文件和图片     | S3 / OSS / COS 等对象存储      |
| 邮件和通知     | Email / SMS / Push 服务        |
| 在线支付       | 支付服务 SDK                   |
| 监控与追踪     | OpenTelemetry / Logs / Metrics |
| 独立扩缩容需求 | 拆分为独立 Service             |

这些能力不是 Starter 的强制依赖，只有业务真正需要时再加入。

## 9. 核心原则

- 成熟技术优先：优先采用主流、成熟、长期维护的技术作为底座。
- 模块化单体优先：先保持一个应用的开发和部署简单，再根据真实需求拆分。
- 一个产品一个仓库：源码、版本、CI、镜像和部署边界保持一致。
- 工程化从第一天开始：测试、构建、Docker、CI/CD 和健康检查不是上线前临时补。
- 生产只运行制品：在 CI 中构建镜像，生产服务器拉取并运行，不现场编译。
- 按需扩展：不预装一整套复杂基础设施，只加入业务真正需要的能力。

## 10. 一句话概括

TS App Starter 是一套建立在成熟 TypeScript Web 技术栈之上的、可直接开发和部署完整业务应用的起始工程。

## 许可证

Apache License 2.0。详见 LICENSE。
