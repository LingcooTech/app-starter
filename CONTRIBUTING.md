# Contributing

Contributions are welcome through GitHub pull requests.

## Development setup

Requirements:

- Node.js 24;
- Corepack and pnpm 11;
- Docker with Compose support.

```bash
corepack enable
pnpm install
cp .env.example .env
docker compose up -d postgres
pnpm db:migrate
pnpm dev
```

## Before opening a pull request

Run the same checks used by CI:

```bash
pnpm check
docker build --tag lingcoo-app-starter:local .
```

Keep pull requests focused, explain behavior changes, and add or update
tests where appropriate. Do not include secrets or production configuration.

## Commit and review expectations

- Use a clear imperative commit subject, such as `feat: add health probe`.
- Keep formatting and lint changes separate from behavioral changes when
  practical.
- Pull requests must pass CI before merging.

By contributing, you agree that your contribution is licensed under the
Apache License 2.0, as described in [LICENSE](LICENSE).
