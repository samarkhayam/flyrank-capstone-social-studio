# BUILDLOG

AI assistance was used for project scaffolding, documentation, test design and code review. Human engineering decisions were to use Node/Express, SQLite for zero-config evaluation, deterministic templates, a SocialPublisher interface, database-backed idempotency, durable jobs, and Telegram plus two mock adapters.

## Important review points

1. Idempotency is enforced by a deterministic key **and** a database uniqueness constraint.
2. Scheduled work is persisted, not stored in an in-memory timer.
3. Generated text is treated as untrusted and validated against platform constraints.
4. Credentials are environment-only and `.env` is git-ignored.
5. No live Telegram delivery is falsely claimed without user-owned credentials.

I am responsible for understanding and explaining the implementation during review.
