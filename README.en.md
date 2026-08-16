# Lingcoo TS App Starter

[中文说明](README.md) · English

A production-ready TypeScript full-stack application starter for building,
developing, and deploying modern business applications.

## Overview

Most business applications need the same foundation:

- HTTP APIs;
- administration and public web clients;
- a relational database and repeatable migrations;
- background workers and asynchronous jobs;
- local development infrastructure;
- Docker images and production configuration;
- CI/CD and deployment health checks.

Building this foundation from scratch is possible, but it creates repeated
decisions around project structure, configuration validation, process models,
database migrations, image builds, and releases.

`ts-app-starter` provides a clear and replaceable starting point:

```text
Create a project → build features → build an image → publish → deploy your server
```

The template is intentionally not bound to any Lingcoo server, domain,
container registry, account, or production environment. Developers configure
their own infrastructure after creating a project from the template.

## What this project is

`ts-app-starter` is:

- a TypeScript full-stack application template;
- a NestJS + Fastify backend foundation;
- an API and Worker process model;
- a React + Vite frontend foundation;
- a PostgreSQL + Drizzle data layer foundation;
- a Docker application that can be built and published by GitHub Actions;
- a starting point for SaaS, CMS, commerce, education, retail, and internal
  business applications.

It is not:

- another backend framework;
- a runtime plugin system;
- a prebuilt business domain platform;
- a copy of an internal production environment;
- a deployment product tied to a specific cloud provider.

## Features

### Runtime

| Area            | Technology     |
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
- request IDs and secure HTTP headers;
- optional OpenAPI/Swagger documentation.

### Frontend

- React;
- Vite;
- TypeScript;
- independent Admin and Web applications;
- static assets served by the application container in production.

The template intentionally uses lightweight CSS instead of forcing a visual
framework. Tailwind CSS can be added by a generated business project when it
is useful for that project.

### Infrastructure

- Docker Compose for local and production topology;
- one runtime image for API, Worker, and migration commands;
- GitHub Actions CI;
- optional image publishing and deployment workflow;
- health checks and deployment smoke tests.

## Why this stack

Node.js + TypeScript is a runtime-and-language combination, not a complete
software architecture. A complete architecture also needs a web framework,
database, module boundaries, process model, configuration strategy,
containerization, and release process.

This starter combines:

```text
Node.js + TypeScript + NestJS + Fastify
          + React + Vite + PostgreSQL + Drizzle
          + Docker + GitHub Actions
```

This remains a mature and modern combination for Web and business software in 2026. Node.js is well suited to I/O-heavy services, NestJS supplies a
structured application architecture, Fastify provides a low-overhead HTTP
layer, and PostgreSQL provides mature relational data capabilities.

- [Node.js TypeScript support](https://nodejs.org/api/typescript.html)
- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://docs.nestjs.com/)
- [Fastify](https://fastify.dev/)

Node.js's built-in type stripping is intentionally lightweight and does not
transform decorators. This repository therefore uses a normal TypeScript
build pipeline for NestJS applications rather than relying on runtime type
stripping alone.

## Architecture

The current repository is a lightweight pnpm workspace:

```text
ts-app-starter/
├── server/                 # NestJS API, Worker, and Drizzle migrations
│   ├── src/
│   ├── drizzle/
│   └── test/
├── admin/                  # React + Vite administration client
├── web/                    # React + Vite public client
├── packages/               # project-local shared packages; currently empty
├── docker/                 # Caddy configuration
├── deploy/                 # generic deployment scripts and env templates
├── .github/workflows/      # CI, Docker verification, security, optional Deploy
├── Dockerfile              # single production runtime image
├── docker-compose.yml      # local PostgreSQL
└── docker-compose.prod.yml # PostgreSQL, API, Worker, and Caddy
```

The conceptual layers are:

```text
clients  ────────▶  services  ────────▶  database / integrations
   │                   │
   │                   └──────────────▶ worker / jobs
   └── static assets served through the API container in production
```

The current `server/`, `admin/`, and `web/` paths are stable. A future
directory normalization may use `services/api`, `services/worker`,
`clients/admin`, and `clients/web`; this is an organizational evolution, not a
new runtime.

See [architecture.md](docs/architecture.md) for the runtime topology and
module boundaries.

## Quick start

### Requirements

- Node.js 24 LTS or a compatible newer version;
- Corepack and pnpm 11;
- Docker Desktop or Docker Engine with Compose.

### Install

```bash
git clone https://github.com/LingcooTech/ts-app-starter.git
cd ts-app-starter
corepack enable
pnpm install
cp .env.example .env
```

### Start PostgreSQL and migrate

```bash
docker compose up -d
pnpm db:migrate
```

### Start development

```bash
pnpm dev
```

| Service       | URL                                  |
| ------------- | ------------------------------------ |
| API liveness  | <http://localhost:8090/health/live>  |
| API readiness | <http://localhost:8090/health/ready> |
| OpenAPI       | <http://localhost:8090/api/docs>     |
| Admin         | <http://localhost:5173/admin/>       |
| Web           | <http://localhost:5174/>             |

Start the Worker separately when needed:

```bash
pnpm dev:worker
```

Run the complete local validation suite with:

```bash
pnpm check
```

## Development

Add backend modules under the backend module boundary:

```text
server/src/modules/users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
├── dto/
├── schemas/
└── repositories/
```

Admin pages belong under `admin/src/pages/`; public Web pages belong under
`web/src/pages/`. Clients communicate with the backend through the HTTP API
and never access PostgreSQL directly.

Use the project-local `packages/` directory only for shared code that has a
stable boundary and is used by multiple modules. A future LingcooTech package
ecosystem will be versioned and published separately; it is not implemented
inside this Starter yet.

See [development.md](docs/development.md) for commands, configuration, tests,
and pull request expectations.

## Production deployment

The Deploy workflow is disabled by default. A developer enables it in their
own repository by setting:

```text
DEPLOY_ENABLED=true
```

The deployment flow is:

```text
Git push
   ↓
GitHub Actions CI
   ↓
Build Docker image
   ↓
Push to the developer's registry
   ↓
SSH to the developer's server
   ↓
docker compose pull
   ↓
Migrate and start API/Worker/Caddy
   ↓
Health check and smoke test
```

The production server never builds the application source. It only pulls a
commit-tagged image and runs the deployment steps. See
[deployment.md](docs/deployment.md) for Variables, Secrets, server
preparation, rollback, and security rules.

## Project philosophy

This project does not try to replace Node.js, TypeScript, NestJS, React,
PostgreSQL, or Docker with a new framework. It provides a tested combination
of mature technologies and leaves business decisions to the application team.

The goal is a useful starting point, not a hidden runtime that every project
must continue synchronizing forever.

## Roadmap

Current:

- full-stack TypeScript starter;
- NestJS API and Worker;
- React + Vite Admin/Web;
- PostgreSQL + Drizzle;
- Docker Compose;
- CI/CD and generic deployment template;
- Apache-2.0 open source governance.

Next:

- `npx create-ts-app-starter` project generator;
- more deployment presets;
- independent reusable packages;
- `services/` and `clients/` directory normalization;
- documentation site and compatibility matrix.

## Contributing and security

- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

Never commit passwords, tokens, SSH private keys, production `.env` files, or
cloud credentials.

## License

Apache-2.0. See [LICENSE](LICENSE).
