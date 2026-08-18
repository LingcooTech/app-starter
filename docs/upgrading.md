# Starter 升级指南

## Starter 的生命周期

通过 `npx @lingcoo-tech/create-ts-app-starter` 创建项目时，Starter 只是一个创建基线。创建完成后，应用拥有自己的 Git 仓库、依赖版本、部署配置和发布节奏，不会自动继承 Starter 的后续提交。

项目根目录的 `.starter-version` 记录创建时使用的 Starter 基线版本。它用于识别来源和评估升级范围，不是运行时依赖，也不会阻止应用独立演进。

## 哪些内容可以直接升级

- **依赖版本**：应用自己维护 `package.json` 和 lockfile，可使用 `pnpm update`、Dependabot 或 Renovate 升级 Node.js、NestJS、React、Drizzle 等依赖。
- **安全和工具链修复**：优先从 Starter 对应提交中查看 ESLint、Prettier、TypeScript、Docker 和 CI 配置的差异，再在应用中逐项合并。
- **基础设施能力**：只有应用确实需要时，才迁移 Worker、队列、缓存或对象存储等能力；Starter 不会为了覆盖更多场景而不断变重。

## 推荐的升级流程

1. 在应用中读取 `.starter-version`，记录当前基线和目标 Starter 版本。
2. 查看两个版本之间的 Git diff、变更说明和迁移注意事项。
3. 建立独立升级分支，先合并配置、依赖和 CI 变化，再运行 `pnpm check` 与 Docker 构建。
4. 对数据库迁移、启动命令、健康检查和部署流程做一次完整演练。
5. 通过测试后更新 `.starter-version`，与升级提交一起发布。

不要把应用的业务模块、业务数据表或领域配置反向复制回 Starter。Starter 必须保持无业务、无领域、无产品依赖。

## 大版本升级

跨越大版本时，优先逐项迁移基础设施，而不是覆盖应用目录。对于规模较小的应用，也可以用新的 Starter 创建临时项目，再迁移业务模块和数据库变更。无论采用哪种方式，都要保留应用自己的提交历史和回滚路径。

未来只有当迁移步骤足够稳定、重复执行成本足够高时，才考虑提供专用 codemod 或 `upgrade` CLI；在此之前，明确的 diff 和人工验收更安全。
