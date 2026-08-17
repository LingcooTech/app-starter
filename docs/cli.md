# Project Generator

`@lingcoo-tech/create-ts-app-starter` is the recommended way to create an independent application from this starter. The package source is included in this repository and is published separately from the template repository.

```bash
npx @lingcoo-tech/create-ts-app-starter@latest my-app
cd my-app
cp .env.example .env
pnpm dev
```

The generator downloads the selected starter revision, removes the template's Git history, replaces the starter package names with the new project name, initializes a new Git repository, and installs dependencies.

## Options

```bash
npx @lingcoo-tech/create-ts-app-starter@latest my-app --package-manager npm
npx @lingcoo-tech/create-ts-app-starter@latest my-app --skip-install
npx @lingcoo-tech/create-ts-app-starter@latest my-app --no-git
npx @lingcoo-tech/create-ts-app-starter@latest my-app --example minimal
npx @lingcoo-tech/create-ts-app-starter@latest my-app --ref main
```

The `minimal` example is currently the only supported example. Additional examples will be added as independently verifiable application variants; they will not contain Lingcoo production credentials, domains, or deployment parameters.

## GitHub Template

The repository also supports GitHub's **Use this template** flow. It is useful for users who prefer a browser-based copy, while the CLI is preferred when project name replacement and repeatable options are required.
