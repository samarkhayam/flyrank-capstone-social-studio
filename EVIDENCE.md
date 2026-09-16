# EVIDENCE

This file maps requirements to reproducible checks. It intentionally does not invent live outputs that were not executed.

| Requirement | Proof path |
|---|---|
| Constraint enforcement | `npm test` → over-limit and hashtag tests |
| Approval gate | `tests/social-studio.test.js` + API schedule guard |
| Adapter seam | `src/adapters/socialPublisher.js` + three adapters |
| Idempotency | deterministic key + unique DB constraint + tests |
| Durable scheduling | `jobs` table + `npm run worker` |
| Publish history | `publish_attempts` table + `/api/publish-attempts` |
| Secrets clean | `.env` ignored; `.env.example` contains placeholders |
| Real free target | `TelegramPublisher`; live proof requires user-owned runtime credentials |
| Documentation | README + DESIGN + BUILDLOG + this file |

## Suggested reviewer commands

```bash
npm install
npm test
npm run lint
npm run seed
npm start
```

Then:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/variants
curl http://localhost:3000/api/publish-attempts
```
