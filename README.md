# FlyRank Backend Capstone — Social Media Studio

A Node.js/Express backend that turns one stored blog post into platform-specific social variants, requires human approval, schedules approved variants, and publishes through a common adapter interface.

## Capstone fit

This repository implements the **Social Media Studio** brief: ingestion, constraint profiles, review workflow, adapter architecture, idempotent scheduling, durable jobs, publish history, tests, README, EVIDENCE.md, BUILDLOG.md and `.env.example`.

## Architecture

```text
URL/Markdown -> Post Store -> Variant Generator -> Constraint Validator
                                      |                    |
                                      v                    v
                                Review: draft -> approved/rejected
                                                    |
                                                    v
                                          Durable SQLite Jobs
                                                    |
                                                    v
                                         SocialPublisher API
                                      /          |             \
                               Telegram      Mock X       Mock LinkedIn
                                                    |
                                                    v
                                           Publish History
```

## Stack

- Node.js 20+
- Express 5
- SQLite (allowed by the brief; zero setup)
- Zod validation
- Telegram adapter for the permitted real free target
- Mock X + Mock LinkedIn adapters

## Platform rules

| Platform | Max length | Hashtags |
|---|---:|---:|
| X-style | 280 | 0–3 |
| LinkedIn-style | 3000 | 1–5 |
| Telegram | 4096 | 0–5 |

Validation happens before approval/scheduling. A broken variant cannot enter the review/schedule path.

## Run

```bash
npm install
npm run seed
npm start
```

In another terminal:

```bash
npm run worker
```

Health:

```bash
curl http://localhost:3000/health
```

Tests:

```bash
npm test
npm run lint
```

## API

Create post:
```bash
curl -X POST http://localhost:3000/api/posts -H "Content-Type: application/json" -d '{"title":"Reliable jobs","body":"Retries need idempotency and durable state.","url":"https://example.com/reliable-jobs"}'
```

Generate variants:
```bash
curl -X POST http://localhost:3000/api/posts/1/generate
```

Approve:
```bash
curl -X POST http://localhost:3000/api/variants/1/approve
```

Schedule:
```bash
curl -X POST http://localhost:3000/api/variants/1/schedule -H "Content-Type: application/json" -d '{"scheduledFor":"2030-01-01T12:00:00.000Z","adapter":"mock_x"}'
```

Jobs/history:
```bash
curl http://localhost:3000/api/jobs
curl http://localhost:3000/api/publish-attempts
```

## Reliability

**Approval gate:** only `approved` variants can be scheduled; otherwise the API returns 409.

**Idempotency:** every job gets `variant:<variantId>:slot:<scheduledFor>`. SQLite also enforces unique `(variant_id, scheduled_for)`, so the duplicate guarantee is backed by the database rather than process memory.

**Durable scheduling:** scheduled jobs live in SQLite. A worker restart does not erase them.

**Retries:** transient worker failures return jobs to `pending` until the bounded retry count is exhausted.

**History:** every publish attempt is recorded with adapter, idempotency key, result/error and timestamp.

## Telegram

The brief permits one real free target such as Telegram. Configure a user-owned bot/channel only in `.env`:

```env
DEFAULT_ADAPTER=telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

No credential or live-delivery result is claimed in this repository. Without credentials, the mock adapters provide the complete deterministic demo path.

## Required documents

- `README.md` — architecture, setup, API and limitations.
- `EVIDENCE.md` — requirement-to-test/proof map. It deliberately does not fabricate outputs that were not executed.
- `BUILDLOG.md` — AI-assisted development record.
- `.env.example` — safe placeholders.
- `docs/DESIGN.md` — one-page design gate.

## Known limitations

- Telegram requires user-owned runtime credentials.
- SQLite is selected for zero-config evaluation; PostgreSQL can replace the repository layer later.
- The scheduler is intentionally single-worker; distributed locking is outside the core scope.
- Variant generation uses deterministic templates; AI is optional in the brief.

## Submission

The capstone brief says the **public GitHub repository is the submission**. Do not upload a ZIP to the portal; paste the public repository URL into the submission form. Recommended repository name: `flyrank-capstone-social-studio`.
