# ARMK B2B Showcase

[![CI](https://github.com/arar228/armk-b2b-showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/arar228/armk-b2b-showcase/actions/workflows/ci.yml)

Public, runnable showcase of a B2B catalog experience. It demonstrates clean API boundaries, catalog search, synthetic product data, a lightweight browser interface, tests, and publication safeguards.

The production ARMK platform is maintained separately. This repository contains fictional products, generic domain concepts, and zero supplier credentials or operational configuration.

## What is included

- dependency-free Node.js HTTP API;
- responsive catalog interface;
- normalized search across name, manufacturer, part number, and category;
- deterministic synthetic fixtures;
- security headers and bounded request parameters;
- unit tests and CI security checks;
- documented boundary between showcase and production assets.

## Run locally

Requirements: Node.js 22 or newer.

```bash
npm install
npm test
npm start
```

Open <http://127.0.0.1:3100>.

## API

```text
GET /health
GET /api/catalog?q=keyboard&limit=12
GET /api/catalog/:id
```

Example:

```bash
curl "http://127.0.0.1:3100/api/catalog?q=monitor"
```

## Architecture

```text
synthetic fixtures → normalized search → read-only HTTP API → browser UI
```

The implementation intentionally excludes production pricing formulas, database schemas, authentication flows, supplier adapters, infrastructure addresses, and customer data. See [Architecture](docs/ARCHITECTURE.md) and [Publication boundary](docs/PUBLICATION_BOUNDARY.md).

## Security

Every change runs a sensitive-content check, Node.js syntax validation, unit tests, and Semgrep. Report a security concern through [GitHub private vulnerability reporting](https://github.com/arar228/armk-b2b-showcase/security/advisories/new).

## License

Source-visible portfolio project. Copyright © 2014–2026 ARMK. All rights reserved. See [LICENSE](LICENSE).
