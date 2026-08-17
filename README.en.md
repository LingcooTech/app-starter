# Lingcoo TS App Starter

A production-ready starting point for building, shipping, and deploying complete business applications on a mature TypeScript web stack.

Language: [中文](README.md) · English

## 1. Positioning

Node.js + TypeScript remains one of the most modern, mature, and widely adopted combinations for web and business application development. Whenever the core business flow is “receive a request → process business logic → query a database or external API → return a result,” Node.js + TypeScript is usually a strong technology choice.

TS App Starter combines that proven technology path with a backend, frontend, database, engineering structure, Docker, and CI/CD into a complete foundation that can be developed, built, and deployed directly.

Its goal is simple: provide a mature, clear, and deployable starting point for applications with real business workflows.

## 2. What is it best suited for?

It is designed for complete business applications with a user-facing client, an administration console, APIs, a database, and a clear business process that will evolve over time.

The client may be a web application, mini program, mobile app, H5 application, or another terminal. The administration console serves staff, merchants, institutions, or internal business teams. APIs provide business capabilities and data access, while PostgreSQL stores core business data.

### Industry applications

Build complete workflows for industries such as education and training, retail, stores, property management, logistics, and enterprise services. These applications usually coordinate multiple business processes in one system.

### Vertical applications

Build deeply around a defined business domain such as CRM, booking, membership, orders, content, after-sales, tickets, projects, or subscriptions. These applications do not have to belong to one industry and can serve multiple industries.

TS App Starter does not try to cover every software shape. It may be too heavy for a website with only a few pages, while a very large system with complex distributed infrastructure will need additional design. It focuses on the most common complete business applications.

## 3. Why use it?

Turning an idea into software that is technically sound, well engineered, and reliably deliverable usually involves requirements analysis, product planning, technology selection, architecture design, engineering governance, deployment, and operations.

Technology selection, architecture, and engineering governance are especially important. Although Vibe Coding has lowered the barrier to programming, many people crossing over from other fields do not yet have a strong understanding of technology stacks and architecture. It is easy to follow AI blindly, rebuild existing capabilities, and eventually create an unmaintainable monolith.

A clear technology combination, architecture, and engineering foundation are essential to every project and strongly influence whether a product can be maintained over the long term. Careful reasoning and complete testing remain necessary after the design is complete.

TS App Starter prepares these foundations in advance, allowing a new project to focus its main effort on the business itself.

## 4. Why trust it?

### A mature technology stack

Business applications are built on a mainstream, mature TypeScript web ecosystem instead of an unverified custom foundation.

TS App Starter focuses on selection, composition, conventions, and engineering: mature technologies handle HTTP, backend modules, databases, frontend applications, containers, and CI/CD, while the starter organizes them into one coherent application.

| Layer                | Technology             | Main responsibility                                       |
| -------------------- | ---------------------- | --------------------------------------------------------- |
| Language             | TypeScript             | One language and type system across frontend and backend  |
| Runtime              | Node.js                | Runs the API, Worker, and server-side tools               |
| Backend architecture | NestJS                 | Organizes modules, dependencies, business code, and tests |
| HTTP                 | Fastify                | Handles HTTP requests and responses                       |
| Database             | PostgreSQL             | Stores core business data                                 |
| Data access          | Drizzle ORM            | Manages database access and schemas with TypeScript       |
| Validation           | Zod / JSON Schema      | Validates configuration and API data                      |
| Frontend             | React + Vite / Next.js | Builds administration and user-facing applications        |
| Workspace            | pnpm                   | Manages dependencies and the multi-project workspace      |
| Delivery             | Docker                 | Builds reproducible runtime images                        |
| CI/CD                | GitHub Actions         | Automates checks, tests, builds, and publishing           |

### A proven application architecture

The backend uses a modular monolith by default: the application remains simple to deploy while internal boundaries are organized by business module. As the product grows, Worker processes, Redis, queues, object storage, or independent services can be added without introducing microservice complexity on day one.

    server/src/modules/
    ├── users/
    ├── customers/
    ├── products/
    ├── orders/
    └── payments/

### A reliable delivery model

Production servers run artifacts; they do not build source code. CI performs checks, tests, builds, and Docker image creation. The server pulls the completed image and runs it.

Builds often require more peak CPU and memory than normal application operation. Building images in CI and pulling them onto the server lowers hardware requirements and prevents builds from affecting online services.

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

### Lightweight runtime

TS App Starter keeps the runtime as simple as possible. It does not require Kubernetes, a microservice cluster, or a complete distributed platform.

A basic business application usually needs only Application + PostgreSQL + Caddy. Add a Worker for background jobs, and add Redis, BullMQ, object storage, or search only when the business requires them.

In a measurement of the blank starter on a server with 2 CPU cores and 3.6 GB RAM, API, Worker, PostgreSQL, and Caddy used approximately 161 MB of memory in total. For a lightweight industry application, 4 GB RAM generally provides comfortable headroom.

## 5. Overall application architecture

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

Admin and Web are the two default frontend entry points. A mini program, mobile app, or another terminal can also consume the API. The API handles real-time requests, while the Worker handles asynchronous jobs and background work.

## 6. Repository structure

The recommended boundary is one business application per Git repository. Each application has independent development, versioning, CI, image publishing, and deployment, keeping the system clear and lightweight.

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
    ├── admin/                   # React + Vite administration console
    ├── web/                     # React + Vite public web application
    ├── packages/                # Shared packages, added when needed
    ├── docker/                  # Caddy / Docker configuration
    ├── deploy/                  # Deployment scripts and environment templates
    ├── .github/workflows/       # CI / Build / Publish / Deploy
    ├── Dockerfile
    ├── docker-compose.yml
    ├── docker-compose.prod.yml
    ├── pnpm-workspace.yaml
    └── package.json

Add new business capabilities as NestJS Modules in server first instead of extracting them into independent packages prematurely. Only code that is genuinely shared across multiple projects and has stable boundaries should move into packages/.

## 7. How to build a new application with it

### Create a project with the CLI (the only recommended entry point)

After the package is published, use the following command to create an independent project:

    npx @lingcoo-tech/create-ts-app-starter@latest my-app
    cd my-app

The CLI downloads the template, replaces the project name, removes the original Git history, initializes a new Git repository, and installs dependencies according to the selected options.

See [从 Starter 到生产应用](docs/getting-started.md) for the complete flow from project creation to local development, self-hosted deployment, or Vercel frontend deployment.

### Step 1: Install dependencies and configure the environment

    corepack enable
    pnpm install
    cp .env.example .env

Configure the local database, ports, and other required variables in .env. Never commit production passwords, tokens, or private keys to Git.

### Step 2: Start the local foundation

    docker compose up -d
    pnpm db:migrate
    pnpm dev

This starts the local API, Admin, Web, and PostgreSQL development environment. Start the Worker separately when needed.

### Step 3: Develop the business

Add backend capabilities as business modules, add administration pages to Admin, and let Web, mini programs, or mobile apps consume the API. Manage database changes through Drizzle schemas and migrations.

    Requirement
        ↓
    Business module
        ↓
    API / Database
        ↓
    Admin / Web / Mini program / App
        ↓
    Tests

### Step 4: Run engineering checks

    pnpm check

### Step 5: Create and push your GitHub repository

The CLI-created project already has an independent Git repository. Create an empty repository under your own account and run:

    git remote add origin git@github.com:<your-account>/<your-repository>.git
    git add .
    git commit -m "Initial project"
    git push -u origin main

### Step 6: Build and publish the Docker image

    Source
      ↓
    GitHub Actions
      ↓
    Production Build
      ↓
    Docker Image
      ↓
    GHCR / ACR / Other Registry

The image contains the production code and dependencies required to run the application. The production server does not need to install dependencies or compile source code again.

### Step 7: Pull and start on the server

    docker compose pull
    docker compose up -d

The deployment process runs database migrations according to project configuration, starts API, Worker, and Caddy, and performs health checks. The server only runs the image built by CI; it does not build source code directly.

### Step 8: Access the application through the domain

    User
     ↓
    Domain / HTTPS
     ↓
    Caddy
     ↓
    Web / Admin / API
     ↓
    Business Application

## 8. How to extend it

Keep the foundation simple and add capabilities when the business needs them:

| Need                      | Suggested extension                    |
| ------------------------- | -------------------------------------- |
| More asynchronous work    | Worker / BullMQ                        |
| Caching or queues         | Redis                                  |
| Files and images          | S3 / OSS / COS or another object store |
| Email and notifications   | Email / SMS / Push provider            |
| Online payments           | Payment provider SDK                   |
| Observability and tracing | OpenTelemetry / Logs / Metrics         |
| Independent scaling       | Split into an independent Service      |

These capabilities are not mandatory dependencies. Add them only when the business actually needs them.

## 9. Core principles

- Mature technology first: choose mainstream, mature, and actively maintained foundations.
- Modular monolith first: keep development and deployment simple, then split based on real needs.
- One product, one repository: keep source, versions, CI, images, and deployment boundaries aligned.
- Engineering from day one: tests, builds, Docker, CI/CD, and health checks are not last-minute additions.
- Production runs artifacts: build images in CI and pull them into production; never compile on the server.
- Expand on demand: add only the infrastructure the business actually needs.

## 10. In one sentence

TS App Starter is a starting project built on a mature TypeScript web stack for directly developing and deploying complete business applications.

## License

Apache License 2.0. See LICENSE.
