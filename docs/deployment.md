# Deployment Guide

`ts-app-starter` 提供的是通用部署模板。它默认不部署任何服务器，也不包含任何特定域名、镜像仓库或生产凭据。

## Deployment flow

```text
Developer GitHub repository
          │
          ▼
      GitHub Actions
          │
          ├── install and test
          ├── build Docker image
          ├── push to developer registry
          └── SSH to developer server
                         │
                         ▼
                    Docker Compose
```

生产服务器不执行 Docker build。它只负责：

1. 拉取指定 commit SHA 的镜像；
2. 启动或等待 PostgreSQL；
3. 执行数据库迁移；
4. 启动 API、Worker 和 Caddy；
5. 等待健康检查并执行冒烟验证。

## Enable deployment

模板仓库的 Deploy workflow 默认关闭。开发者复制模板后，在自己的仓库配置：

```text
DEPLOY_ENABLED=true
```

没有这个变量时，CI 仍然运行，但镜像发布和服务器部署会被跳过。

## GitHub Variables

非敏感变量：

| Variable                 | Description                             |
| ------------------------ | --------------------------------------- |
| `DEPLOY_ENABLED`         | 是否启用发布和部署，必须为 `true`       |
| `IMAGE_NAME`             | 镜像名，例如 `my-business-app`          |
| `GHCR_IMAGE`             | 完整 GHCR 镜像地址                      |
| `DEPLOY_HOST`            | 开发者服务器地址                        |
| `DEPLOY_USER`            | 专用非-root SSH 用户                    |
| `DEPLOY_PATH`            | 服务器部署目录                          |
| `DEPLOY_HEALTHCHECK_URL` | 外部 readiness URL                      |
| `DEPLOY_REPOSITORY`      | 服务器拉取源码所用的 Git URL            |
| `DEPLOY_GIT_KEY`         | 可选，服务器拉取私有仓库所用的 key 路径 |

## GitHub Secrets

敏感信息必须使用 Secrets：

| Secret                   | Description                    |
| ------------------------ | ------------------------------ |
| `ACR_REGISTRY`           | 镜像仓库地址                   |
| `ACR_NAMESPACE`          | 镜像仓库命名空间               |
| `ACR_USERNAME`           | 镜像仓库账号                   |
| `ACR_PASSWORD`           | 镜像仓库密码                   |
| `DEPLOY_SSH_PRIVATE_KEY` | GitHub Runner 连接服务器的私钥 |
| `DEPLOY_SSH_KNOWN_HOSTS` | 服务器 SSH host key            |

如果只使用 GHCR，可以将 ACR 发布步骤替换为自己的 registry 登录和推送步骤。Starter 不要求特定云厂商。

## Server preparation

服务器需要预先安装：

- Docker Engine；
- Docker Compose plugin；
- curl；
- 一个非-root部署用户；
- 该用户访问目标 Git 仓库和镜像仓库的权限。

在部署目录创建 `.env`：

```bash
cp deploy/production.env.example /path/to/deployment/.env
```

数据库密码必须随机生成，并且与 `DATABASE_URL` 中的密码一致。`.env` 不应提交到 Git。

## Image tags and rollback

每次发布使用两个标签：

```text
latest
<git-commit-sha>
```

生产部署应优先使用 commit SHA，而不是 `latest`。回滚时，将 `APP_IMAGE` 指向上一个成功的 SHA，再重新执行 Compose 部署。

## Security rules

- 不使用 root 作为长期部署账号；
- 不在仓库中写入服务器密码或私钥；
- 不在生产服务器执行源码构建；
- 限制部署 SSH key 的权限和来源；
- 使用 GitHub Environment 保护 production 部署；
- 生产数据库和镜像仓库凭据独立管理。
