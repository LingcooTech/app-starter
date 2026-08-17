# 从 Starter 到生产应用

本文描述开发者使用 `@lingcoo-tech/create-ts-app-starter` 创建项目后的完整流程。项目创建统一使用 npx，创建后可以选择两种交付方式：完整应用部署到自己的服务器，或将前端部署到 Vercel、后端继续部署到自己的服务器。

## 1. 使用 npx 创建独立项目

```bash
npx @lingcoo-tech/create-ts-app-starter@latest my-app
cd my-app
```

CLI 会下载 Starter、替换项目名称、移除模板 Git 历史、初始化新的 Git 仓库并安装依赖。生成项目后，开发者不需要修改 Starter 源码或 CI 脚本来完成初始化。

可选参数：

```bash
npx @lingcoo-tech/create-ts-app-starter@latest my-app --skip-install
npx @lingcoo-tech/create-ts-app-starter@latest my-app --no-git
npx @lingcoo-tech/create-ts-app-starter@latest my-app --package-manager npm
```

## 2. 本地开发

```bash
corepack enable
cp .env.example .env
docker compose up -d
pnpm db:migrate
pnpm dev
```

默认入口：

| 服务       | 地址                    |
| ---------- | ----------------------- |
| API        | `http://localhost:8090` |
| Admin      | `http://localhost:5173` |
| Web        | `http://localhost:5174` |
| PostgreSQL | `localhost:5438`        |

开发业务时，后端增加 NestJS Module，前端增加页面，数据库变化通过 Drizzle Schema 和 Migration 管理。

## 3. 创建自己的 GitHub 仓库

在 GitHub 创建一个自己的空仓库，然后推送 CLI 生成的项目：

```bash
git remote add origin git@github.com:<account>/<repository>.git
git add .
git commit -m "Initial project"
git push -u origin main
```

从这里开始，项目拥有独立的提交历史、CI/CD 配置、镜像和部署参数。

## 4. 发布前检查

```bash
pnpm check
```

该命令统一执行格式检查、Lint、TypeScript 类型检查、测试和构建。

## 5. 方案 A：完整应用部署到自己的服务器

适用于需要 API、Worker、PostgreSQL、Caddy 和前端由同一个生产环境统一管理的应用。

### 准备服务器

- Docker Engine 和 Docker Compose plugin；
- 一个专用部署用户；
- 生产域名和 HTTPS 入口；
- 服务器上的生产 `.env`；
- 服务器可以访问 GitHub 和镜像仓库。

### 准备镜像仓库

ACR、GHCR 或其他 Registry 都必须由开发者自己注册和配置。以 ACR 为例，需要先开通实例、创建 Namespace 和镜像仓库、配置网络访问，并创建推送/拉取凭证。ACR 不会因为创建 GitHub 仓库自动出现。

详细步骤见 [部署指南](deployment.md)。

### 配置 GitHub Actions

在自己的仓库配置：

- Variables：`DEPLOY_ENABLED`、`IMAGE_NAME`、`GHCR_IMAGE`、`DEPLOY_HOST`、`DEPLOY_USER`、`DEPLOY_PATH`、`DEPLOY_REPOSITORY`、`DEPLOY_HEALTHCHECK_URL`；
- Secrets：`ACR_REGISTRY`、`ACR_NAMESPACE`、`ACR_USERNAME`、`ACR_PASSWORD`、`DEPLOY_SSH_PRIVATE_KEY`、`DEPLOY_SSH_KNOWN_HOSTS`。

推送到 `main` 后，流程是：

```text
Git Push
  ↓
GitHub Actions CI
  ↓
Docker Build
  ↓
ACR / GHCR
  ↓
SSH 部署服务器
  ↓
迁移数据库 → 启动容器 → 健康检查
```

生产服务器只拉取镜像，不执行 Docker build。

## 6. 方案 B：前端部署到 Vercel

Vercel 负责静态前端构建和发布；它不替代 Starter 中的 NestJS API、Worker 或 PostgreSQL。推荐的生产结构是：

```text
Vercel Admin / Web
        ↓ HTTPS API
自己的 API / Worker / PostgreSQL 服务器
```

### 创建 Vercel 项目

在 Vercel 中将 GitHub 私有仓库授权给 Vercel GitHub App，然后为同一个仓库创建两个项目：

| 应用  | Root Directory | Framework | Build Command | Output Directory |
| ----- | -------------- | --------- | ------------- | ---------------- |
| Admin | `admin`        | Vite      | `pnpm build`  | `dist`           |
| Web   | `web`          | Vite      | `pnpm build`  | `dist`           |

Node.js 版本使用 `24.x`。每次推送到配置的生产分支后，Vercel 会分别构建 Admin 和 Web。

### 配置前端访问 API

如果前端需要访问生产 API，需要在业务代码中集中配置 API Base URL，例如：

```text
https://api.example.com
```

同时在服务器的 `CORS_ORIGIN` 中加入 Vercel 域名。不要把数据库密码、服务器 SSH 私钥或 ACR 凭证放入 Vercel 前端环境变量；前端变量会进入浏览器。

### 两种部署方式的区别

| 项目       | 自有服务器完整部署         | Vercel 前端部署                  |
| ---------- | -------------------------- | -------------------------------- |
| Admin/Web  | Caddy 或其他 Web 入口      | Vercel                           |
| API        | 自有服务器                 | 仍部署在自有服务器或其他后端平台 |
| Worker     | 自有服务器                 | 不由 Vercel 托管                 |
| PostgreSQL | 自有服务器或云数据库       | 不由 Vercel 托管                 |
| Docker     | API/Worker/数据库运行环境  | 前端构建不依赖生产服务器 Docker  |
| 适合场景   | 全栈一体化、内网、统一运维 | 前端 CDN、快速发布、前后端分离   |

## 7. 日常发布流程

```text
修改业务代码
  ↓
pnpm check
  ↓
git commit / git push
  ├── GitHub Actions：检查、构建、发布镜像、部署后端
  └── Vercel：构建并发布 Admin/Web（如果已连接）
```

数据库迁移必须通过版本化 Migration 管理；生产密码、Token、SSH 私钥和 Registry 凭证始终保存在服务器或 GitHub/Vercel Secrets 中，不进入 Git。
