# Environment Variables Reference

This page documents **every variable that wacraft reads at runtime**, their default values, and tips for secure production usage. Copy & modify the provided `example.env`; Docker Compose will load it automatically on `docker compose up`.

Before setting up the environment variables, make sure you get Meta credentials just like instructed at [**Getting Meta Credentials**](config/meta-setup.md) page.

| Group                  | Variable                              | Required? | Default            | Description                                                                                                                                   |
| ---------------------- | ------------------------------------- | --------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Runtime**            | `ENV`                                 | ✓         | `local`            | Selects code paths that should only run in _local_, _development_, or _production_ mode (`local` disables jobs that require public webhooks). |
| **Database**           | `DATABASE_HOST`                       | ✓         | `127.0.0.1`        | PostgreSQL host. Overridden to `db` by the official docker‑compose file.                                                                      |
|                        | `DATABASE_PORT`                       | ✓         | `5432`             | PostgreSQL port (standard).                                                                                                                   |
|                        | `DATABASE_NAME`                       | ✓         | `postgres`         | Database name created by the compose stack.                                                                                                   |
|                        | `DATABASE_USERNAME`                   | ✓         | `postgres`         | DB super‑user; use a dedicated user in prod.                                                                                                  |
|                        | `DATABASE_PASSWORD`                   | ✓         | `postgres`         | Change in prod; do **not** commit real secrets.                                                                                               |
|                        | `DATABASE_MAX_OPEN_CONNS`             | ✕         | `40`               | Upper bound for open connections in the pool. Tune per load & DB limits.                                                                      |
|                        | `DATABASE_MAX_IDLE_CONNS`             | ✕         | `20`               | Idle pool size before connections are closed.                                                                                                 |
|                        | `DATABASE_CONN_MAX_LIFETIME_MINUTES`  | ✕         | `30`               | Recycle connections to avoid DB‑side idle timeouts.                                                                                           |
| **Server**             | `HOST`                                | ✕         | `http://127.0.0.1` | Log‑only; leave untouched.                                                                                                                    |
|                        | `PORT`                                | ✓         | `6900`             | REST & WebSocket port exposed to the client.                                                                                                  |
|                        | `SU_PASSWORD`                         | ✓         | `sudo`             | Password for bootstrap `su@sudo` admin account. Change immediately after first login.                                                         |
| **Auth**               | `JWT_SECRET`                          | ✓         | `secret`           | HMAC key that signs JWTs. Minimum 32 random chars in production.                                                                              |
|                        | `AUTH_TOKEN`                          | ✕         | _(empty)_          | Optional “API key” for machine‑to‑machine requests.                                                                                           |
| **WhatsApp Cloud API** | `WABA_ID`                             | ✓         | _(none)_           | **Phone Number ID** returned by Graph API. See [**Getting Meta Credentials**](config/meta-setup.md).                                          |
|                        | `WABA_ACCOUNT_ID`                     | ✓         | _(none)_           | **WhatsApp Business Account ID** visible in the API setup banner.                                                                             |
|                        | `WABA_ACCESS_TOKEN`                   | ✓         | _(none)_           | **Permanent System‑User token** with scopes `whatsapp_business_management` + `whatsapp_business_messaging`.                                   |
|                        | `META_APP_SECRET`                     | ✓         | _(none)_           | App Secret used to verify the `X‑Hub‑Signature‑256` on incoming webhooks.                                                                     |
|                        | `WEBHOOK_VERIFY_TOKEN`                | ✓ (prod)  | _(none)_           | Arbitrary string required when Meta validates your webhook URL.                                                                               |
| **Sync**               | `MESSAGE_STATUS_SYNC_TIMEOUT_SECONDS` | ✕         | `20`               | How long the server waits for WhatsApp delivery receipts before flagging a send failure.                                                      |
| **Client (Angular)**   | `IS_LITE`                             | ✕         | `true`             | `true` → routes target **wacraft‑server‑lite**.                                                                                               |
|                        | `MAIN_SERVER_URL`                     | ✓         | `localhost:6900`   | Host & port where the Go API is reachable.                                                                                                    |
|                        | `MAIN_SERVER_SECURITY`                | ✕         | `false`            | `true` forces **https/wss**; set when behind TLS.                                                                                             |
|                        | `NODE_RED_SERVER_URL`                 | ✕         | `localhost:1880`   | Address of a Node‑RED instance used for automations.                                                                                          |
|                        | `NODE_RED_SERVER_SECURITY`            | ✕         | `false`            | Same semantics as `MAIN_SERVER_SECURITY`.                                                                                                     |
|                        | `GOOGLE_MAPS_API_KEY`                 | ✕         | _(none)_           | Needed only for location messages; you can omit otherwise.                                                                                    |

---

## Production Hardening Tips

- **Keep `.env` out of VCS** – add it to `.gitignore` or store secrets in your CI/CD vault.
- **Rotate secrets** regularly; replace `JWT_SECRET`, `WABA_ACCESS_TOKEN`, and DB credentials via environment‑specific pipelines.
- **Override via Docker Compose** – the stack’s `docker‑compose.yml` can supply `env_file` and `environment` entries that shadow values in `.env`. Order matters: later files or inline `environment:` keys win.

---

> **Next page:** [Webhook Setup](config/webhook-setup.md) — configure an HTTPS tunnel & register your callback URL.
