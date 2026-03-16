# Environment Variables Reference

This page documents **every server-side and client-side variable that wacraft reads at runtime** in v0.2.x, their default values, and tips for secure production usage.

> **What changed from v0.1.x?** Per-workspace WhatsApp credentials (`WABA_ID`, `WABA_ACCESS_TOKEN`, `META_APP_SECRET`, `WEBHOOK_VERIFY_TOKEN`) are no longer required environment variables — they are managed through the **Phone Config** UI per workspace. The global vars below act only as server-wide fallbacks. See [Phone Config Guide](./phone-config.md).

## Server Variables

### Runtime

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `ENV` | ✓ | `local` | Runtime mode: `local`, `development`, or `production`. `local` disables jobs that require a public webhook URL. |
| `HOST` | ✕ | `http://127.0.0.1` | Cosmetic field used for pretty logs only. |
| `PORT` | ✓ | `6900` | REST & WebSocket port exposed to clients. |
| `SU_PASSWORD` | ✓ | `sudo` | Password for the bootstrap `su@sudo` admin account. **Change immediately after first login.** |

### Database

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `DATABASE_URL` | ✓ | _(none)_ | PostgreSQL connection string. |
| `DATABASE_MAX_OPEN_CONNS` | ✕ | `40` | Upper bound for open connections in the pool. |
| `DATABASE_MAX_IDLE_CONNS` | ✕ | `20` | Idle pool size before connections are closed. |
| `DATABASE_CONN_MAX_LIFETIME_MINUTES` | ✕ | `30` | Recycle connections to avoid DB-side idle timeouts. |
| `DATABASE_QUERY_TIMEOUT_MINUTES` | ✕ | `5` | Maximum time a single query may run before it is cancelled. |

### Auth

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `JWT_SECRET` | ✓ | `secret` | HMAC key that signs JWTs. Use at least 32 random characters in production. |
| `AUTH_TOKEN` | ✕ | _(empty)_ | Optional API key for machine-to-machine requests and internal webhooks. |

### Registration

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `ALLOW_REGISTRATION` | ✕ | `true` | Set to `false` to disable self-service sign-up. Useful once you've created all accounts manually. |
| `REQUIRE_EMAIL_VERIFICATION` | ✕ | `true` | Require users to verify their email before they can log in. Requires SMTP to be configured. |

### Email (SMTP)

Required when `REQUIRE_EMAIL_VERIFICATION=true` or when password-reset emails are needed.

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `SMTP_HOST` | ✕ | _(empty)_ | SMTP server hostname (e.g. `smtp.sendgrid.net`). |
| `SMTP_PORT` | ✕ | `587` | SMTP port. Use `587` for STARTTLS or `465` for SSL. |
| `SMTP_USER` | ✕ | _(empty)_ | SMTP username / API key. |
| `SMTP_PASSWORD` | ✕ | _(empty)_ | SMTP password. |
| `SMTP_FROM` | ✕ | _(empty)_ | Sender address shown in outgoing emails (e.g. `noreply@example.com`). |
| `APP_BASE_URL` | ✕ | `http://localhost:3000` | Base URL of the frontend app. Used to build verification and password-reset links in emails. |

### Firewall & Rate Limiting

See [Firewall & Rate Limiting](./firewall.md) for a detailed guide. All limiters are no-ops when their window or count is unset.

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `IP_ALLOWLIST` | ✕ | _(empty)_ | Comma-separated CIDRs. **When non-empty, every IP that does not match at least one CIDR is rejected with `403`** — acts as a strict whitelist. Leave empty to allow all IPs. |
| `IP_DENYLIST` | ✕ | _(empty)_ | Comma-separated CIDRs. Any matched IP is rejected with `403`. All other IPs are allowed. |
| `RATE_LIMIT_ENABLED` | ✕ | `true` | Set to `false` to disable all rate limiting. |
| `RATE_LIMIT_REGISTRATION` | ✕ | `5` | Max registration attempts per window per IP. |
| `RATE_LIMIT_REGISTRATION_WINDOW` | ✕ | `1h` | Window duration (Go duration string: `30s`, `15m`, `1h`). |
| `RATE_LIMIT_LOGIN` | ✕ | `10` | Max login attempts per window per IP + email. |
| `RATE_LIMIT_LOGIN_WINDOW` | ✕ | `15m` | Window duration for login. |
| `RATE_LIMIT_PASSWORD_RESET` | ✕ | `5` | Max forgot-password requests per window per IP. |
| `RATE_LIMIT_PASSWORD_RESET_WINDOW` | ✕ | `1h` | Window duration for forgot-password. |
| `RATE_LIMIT_EMAIL_VERIFICATION` | ✕ | `5` | Max resend-verification requests per window per IP. |
| `RATE_LIMIT_EMAIL_VERIFICATION_WINDOW` | ✕ | `1h` | Window duration for email verification. |
| `RATE_LIMIT_RESET_PASSWORD` | ✕ | `10` | Max password-reset submissions per window per IP. |
| `RATE_LIMIT_RESET_PASSWORD_WINDOW` | ✕ | `1h` | Window duration for password reset. |

### Billing (Stripe)

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `BILLING_ENABLED` | ✕ | `false` | Set to `true` to enforce throughput limits on API requests. |
| `STRIPE_SECRET_KEY` | ✕ | _(none)_ | Stripe API secret key. Required for checkout flows. |
| `STRIPE_WEBHOOK_SECRET` | ✕ | _(none)_ | Stripe webhook signing secret. Required for payment callbacks. |
| `DEFAULT_FREE_PLAN_THROUGHPUT` | ✕ | `100` | Default free plan throughput limit (requests per window). |
| `DEFAULT_FREE_PLAN_WINDOW` | ✕ | `60` | Default free plan window duration in seconds. |

See [Stripe / Billing Setup](./stripe-setup.md) for a full walkthrough.

### Sync

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `MESSAGE_STATUS_SYNC_TIMEOUT_SECONDS` | ✕ | `20` | How long the server waits for WhatsApp delivery receipts before flagging a send failure. |

### Horizontal Scaling (Redis)

Required only when running multiple server replicas. Set `SYNC_BACKEND=redis` and configure the variables below to replace in-memory primitives with distributed Redis equivalents. See [Horizontal Scaling](../deploy/horizontal-scaling.md) for a full guide.

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `SYNC_BACKEND` | ✕ | `memory` | `memory` (default, single-instance) or `redis` (distributed, multi-instance). |
| `REDIS_URL` | ✕ | `redis://localhost:6379` | Redis connection URL. Only read when `SYNC_BACKEND=redis`. |
| `REDIS_PASSWORD` | ✕ | _(empty)_ | Redis password. Leave empty if Redis has no auth. |
| `REDIS_DB` | ✕ | `0` | Redis logical database number. |
| `REDIS_KEY_PREFIX` | ✕ | `wacraft:` | Prefix applied to all Redis keys — useful for isolating environments on a shared Redis instance. |
| `REDIS_LOCK_TTL` | ✕ | `30s` | Default TTL for distributed locks (Go duration string, e.g. `30s`, `1m`). |
| `REDIS_CACHE_TTL` | ✕ | `5m` | Default TTL for distributed cache entries. |

### Global WhatsApp defaults (optional)

In v0.2.x, WhatsApp credentials are configured **per workspace** in the Phone Config UI. These variables act as **server-wide fallbacks** used for global webhook validation. They are not required for a working deployment.

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `WABA_ID` | ✕ | _(empty)_ | Global Phone Number ID fallback. |
| `WABA_ACCOUNT_ID` | ✕ | _(empty)_ | Global WhatsApp Business Account ID fallback. |
| `WABA_ACCESS_TOKEN` | ✕ | _(empty)_ | Global access token fallback. |
| `DISPLAY_PHONE` | ✕ | _(empty)_ | Global display phone number fallback. |
| `META_APP_SECRET` | ✕ | _(empty)_ | Global Meta App Secret for webhook signature validation. |
| `META_VERIFY_TOKEN` | ✕ | _(empty)_ | Global webhook verify token fallback. |

## Client Variables (Angular UI)

These are injected at **container startup** via Docker Compose environment or Vercel project settings.

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `MAIN_SERVER_URL` | ✓ | `localhost:6900` | Host & port where the Go API is reachable — **no protocol prefix**. |
| `MAIN_SERVER_SECURITY` | ✕ | `false` | `true` forces **https/wss**; set this when the API is behind TLS. |
| `IS_LITE` | ✕ | `false` | Legacy flag. Keep `false` for v0.2.x — the full backend is always used. |
| `AUTOMATION_SERVER_URL` | ✕ | _(none)_ | URL of an automation server (e.g. n8n). Enables the Automations section in the sidebar. |
| `AUTOMATION_SERVER_SECURITY` | ✕ | `false` | `true` forces **https/wss** for the automation server. |
| `GOOGLE_MAPS_API_KEY` | ✕ | _(none)_ | Needed only for location messages. |
| `WEBSOCKET_BASE_PING_INTERVAL` | ✕ | `30000` | Base ping interval in milliseconds for WebSocket connections. |
| `APP_TITLE` | ✕ | `wacraft` | Browser tab title override. |

## Production Hardening Tips

- **Keep `.env` out of VCS** — add it to `.gitignore` or store secrets in your CI/CD vault.
- **Set `ALLOW_REGISTRATION=false`** once your team accounts are created to prevent unauthorized sign-ups.
- **Configure SMTP** so users can verify email addresses and reset passwords.
- **Rotate secrets** regularly; replace `JWT_SECRET` and DB credentials via environment-specific pipelines.
- **Stripe keys** — use `sk_test_` during development, switch to `sk_live_` in production. Store in a secrets manager.
- **Firewall** — use `IP_ALLOWLIST` or `IP_DENYLIST` to restrict access by network. See [Firewall & Rate Limiting](./firewall.md).

> **Next:** [Firewall & Rate Limiting](./firewall.md) — IP access control and brute-force protection.
