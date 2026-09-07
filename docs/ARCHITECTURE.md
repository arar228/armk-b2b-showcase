# Architecture

The showcase is intentionally compact and dependency-free.

```text
public/index.html
        │
        ▼
public/app.js ── GET /api/catalog ──► src/server.js
                                           │
                                           ▼
                                     src/search.js
                                           │
                                           ▼
                                     src/catalog.js
                                  synthetic fixtures only
```

## Components

| Component | Responsibility |
| --- | --- |
| `src/catalog.js` | Immutable fictional catalog records |
| `src/search.js` | Normalization, filtering, and bounded result selection |
| `src/server.js` | Read-only JSON API, static assets, and response headers |
| `public/` | Browser interface rendered with safe DOM APIs |
| `test/` | Behavioral tests for public domain logic |
| `scripts/` | Repository publication checks |

The server exposes explicit static routes rather than accepting arbitrary file paths. API inputs are length-bounded, responses are JSON-encoded, and catalog records contain display prices only.
