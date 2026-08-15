# Lingcoo App Starter 重构实施方案

## 1. 目标

以成熟 TypeScript Web 生态重建 Lingcoo 应用底座，停止维护自研 Frame Runtime。新底座采用 NestJS、Fastify、PostgreSQL、Drizzle、Zod、React、Vite、Docker、GitHub Actions 与 Caddy。

核心约束：

- 一个业务应用对应一个 Git Repository、一个版本、一套 CI 和一个 Runtime Image。
- 单仓库内部只使用轻量 pnpm Workspace，默认不引入 Turborepo。
- 应用内扩展使用 NestJS Module，不建立 Extension Manifest、Capability Registry 或 Lingcoo Runtime。
- 跨应用包只有在至少两个真实应用中形成稳定边界后才提取。
- API 与 Worker 共享同一镜像，通过不同启动命令运行。

## 2. 目标结构

```text
server/       NestJS API、Worker、Drizzle Migration
admin/        React + Vite 管理后台
web/          React + Vite 公共 Web
packages/     经验证后才加入的共享代码
docker/       Caddy 等部署配置
```

业务后端统一位于 `server/src/modules/<module>`。每个模块包含 NestJS Module、Controller、Service、Repository、DTO、Zod Schema 以及该模块拥有的 Drizzle Schema。

## 3. 第一阶段：空白可运行底座

交付内容：

1. 初始化 Git、pnpm Workspace、Node 24 与统一 TypeScript/ESLint/Prettier 配置。
2. 建立 NestJS + Fastify API、Zod 环境校验和统一启动入口。
3. 建立无业务 Handler 的 NestJS standalone Worker，并支持优雅退出。
4. 建立 PostgreSQL/Drizzle DatabaseModule、标准迁移和数据库 readiness 检查。
5. 建立 `/health/live`、`/health/ready` 和 OpenAPI。
6. 建立 Admin/Web 两个 React + Vite 占位应用。
7. 建立单 Runtime Image，以及 API、Worker、Migration 使用同一镜像的 Compose 拓扑。
8. 建立 CI：安装、迁移、迁移幂等、格式、Lint、类型、测试、构建和镜像验证。

完成标准：

- 本地源码和生产容器两种方式均可启动。
- API、Worker、Admin、Web 四个运行面可独立构建。
- readiness 真实检查 PostgreSQL；liveness 不依赖数据库。
- 同一数据库重复迁移不会产生新变更。
- `pnpm check` 与 Docker Build 全部通过。
- 不存在任何 `@lingcootech/frame-*` 依赖、业务模块或业务数据表。

## 4. 第二阶段：身份与后台闭环

迁移 Identity、登录、数据库会话、RBAC、账号与角色管理。使用 Nest Guard、Decorator 和标准认证组件重写，保留会话撤销、账号停用即时生效、最后一个 Owner 保护等安全规则，同时完成 Admin 登录与账号管理页面。

## 5. 第三阶段：系统治理

依次迁移系统设置、审计日志、Request ID、结构化日志、异常过滤器、指标和服务状态。所有能力实现为普通 NestJS Module、Guard、Interceptor 或 Filter。

## 6. 第四阶段：集成与异步能力

迁移 Integrations、SMTP、对象存储、支付和 AI Provider；随后迁移 Jobs、Outbox、Notifications 与 Assets。任务执行优先采用成熟队列方案，不复制旧 Frame 自研的领取、重试和 Worker Registry Runtime。

## 7. 第五阶段：内容与应用体验

迁移 Presentation、CMS、Metadata、Taxonomy、Search 和 Data Exchange。每个后端模块与对应 Admin/Web 页面作为一个垂直切片交付。

## 8. 第六阶段：切换与产品化

完成 OpenAPI 契约对比、数据迁移演练、备份恢复、安全和性能验收、ACR 推送、Core Stack 部署，并通过一个真实行业应用验证 Starter。Starter 可以成为 GitHub Template，但不重新发展为共享 Runtime。

## 9. 模块迁移方法

每个模块遵循同一门禁：

1. 固化旧 API、表结构、权限和关键行为测试。
2. 在新仓库用 NestJS 原生方式重写，禁止引用旧 Frame 包。
3. 使用 Drizzle Migration 迁移或兼容既有数据。
4. 迁移对应前端页面。
5. 对比新旧接口契约、数据库结果与安全行为。
6. 验收通过后才移除旧实现。

## 10. 明确不迁移的底座

- `frame-extension-sdk`、`frame-kernel`、`frame-fastify`、`frame` 聚合包。
- System/Extension Manifest、Capability Registry 和版本匹配 Runtime。
- 自研 Migration Source Engine。
- Admin/Web Runtime Registry。
- Changesets、多包发布与 `create-frame-app` 升级 Runtime。

旧仓库中的领域规则、数据库语义、安全约束和测试案例可以作为迁移依据，但不整体复制旧包结构。
