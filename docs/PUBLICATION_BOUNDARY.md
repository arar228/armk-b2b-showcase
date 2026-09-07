# Publication boundary

This repository demonstrates engineering structure while keeping commercial and operational assets private.

| Public showcase | Private production system |
| --- | --- |
| Fictional catalog fixtures | Supplier and customer records |
| Generic search behavior | Matching heuristics and ranking weights |
| Display prices | Costs, margins, discounts, and pricing rules |
| Read-only demonstration API | Authentication, roles, orders, and agent workflows |
| Generic architecture documentation | Infrastructure, network topology, and deployment state |
| Placeholder provider boundary | Supplier protocols, credentials, and request formats |

## Release checklist

1. Start from this repository's clean history.
2. Add only synthetic, reviewable content.
3. Run `npm run security:scan` and the complete `npm run check` suite.
4. Review the staged diff and repository history before publication.
5. Keep production exports, logs, screenshots, environment files, and credentials in approved private storage.
