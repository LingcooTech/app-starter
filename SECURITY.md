# Security Policy

## Supported versions

Only the `main` branch is currently supported. This project is an evolving
application starter and does not publish long-term support releases yet.

## Reporting a vulnerability

Please do not open a public issue for a suspected security vulnerability.
Use GitHub's private vulnerability reporting for this repository, or contact
the repository maintainers privately through the GitHub organization.

Include:

- a description of the vulnerability and its impact;
- affected versions or commit IDs;
- reproducible steps or a minimal proof of concept;
- any suggested mitigation.

Please allow maintainers reasonable time to investigate and release a fix
before publicly disclosing the issue.

## Secrets

Never commit passwords, access tokens, private keys, production `.env` files,
or cloud credentials. Local and production secrets must be supplied through
environment variables, GitHub Actions Secrets, or a dedicated secret
manager.
