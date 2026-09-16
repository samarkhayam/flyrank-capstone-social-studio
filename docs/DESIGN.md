# One-Page Design

## Problem
Turn one stored blog post into platform-specific social variants, require human approval, schedule approved variants, and publish through one adapter interface without duplicate posts.

## Data model
`posts`, `variants`, `jobs`, `publish_attempts`.

## API
`POST /api/posts`, `POST /api/posts/:id/generate`, `GET /api/variants`, `POST /api/variants/:id/approve`, `POST /api/variants/:id/reject`, `PUT /api/variants/:id`, `POST /api/variants/:id/schedule`, `GET /api/jobs`, `GET /api/publish-attempts`, `GET /api/stats`.

## Non-goal
Real Instagram, X or LinkedIn accounts are not used in the core build; mock adapters prove the seam and Telegram is the permitted real target.
