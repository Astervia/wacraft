# 🚀 Production Deploy (Docker backend + Vercel frontend)

This guide ships **wacraft‑server** (Go API + webhooks) inside Docker and hosts the Angular UI on **Vercel**.
Result: a fully HTTPS‑secured stack reachable at `https://app.example.com` with the API on `https://api.example.com`.

## 🧰 Prerequisites

| What           | Minimum                              | Notes                                                                  |
| -------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| Domain names   | `api.example.com`, `app.example.com` | One sub‑domain for the API, one for the UI.                            |
| TLS cert       | Let's Encrypt or managed LB          | Terminate HTTPS before traffic reaches the container.                  |
| PostgreSQL     | 14 +                                 | Cloud‑managed (RDS, Cloud SQL, Azure DB) **or** self‑hosted container. |
| Meta creds     | App Secret, Access Token, etc.       | Entered in the UI after deploy — see [meta‑setup.md](../config/meta-setup.md). |

## 1 — Provision PostgreSQL

Choose **one**:

- **Managed** – RDS, GCP Cloud SQL, Supabase, etc. → copy host/user/password into `.env`.
- **Self‑hosted** – run `postgres:16-alpine` in the same Docker host:

```bash
docker run -d \
  --name wacraft-db \
  -e POSTGRES_PASSWORD=supersecret \
  -e POSTGRES_DB=postgres \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  --restart unless-stopped \
  postgres:16-alpine
```

## 2 — Create the server `.env`

```env
############################
# Runtime
############################
ENV=production
HOST=https://api.example.com
PORT=6900
SU_PASSWORD=super-admin-pwd

############################
# PostgreSQL
############################
DATABASE_URL=postgresql://postgres:supersecret@db.example.com:5432/postgres
DATABASE_MAX_OPEN_CONNS=40
DATABASE_MAX_IDLE_CONNS=20
DATABASE_CONN_MAX_LIFETIME_MINUTES=30

############################
# Auth
############################
JWT_SECRET=$(openssl rand -hex 32)
AUTH_TOKEN=                    # optional machine-to-machine token

############################
# Registration
############################
ALLOW_REGISTRATION=false       # disable after your team accounts are created
REQUIRE_EMAIL_VERIFICATION=true

############################
# Email (SMTP)
############################
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@example.com
APP_BASE_URL=https://app.example.com

############################
# Firewall (optional)
############################
# IP_DENYLIST=198.51.100.0/24
RATE_LIMIT_ENABLED=true

############################
# Sync
############################
MESSAGE_STATUS_SYNC_TIMEOUT_SECONDS=20

############################
# Billing (optional)
############################
# BILLING_ENABLED=true
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

> **WhatsApp credentials** (`WABA_ID`, `WABA_ACCESS_TOKEN`, etc.) are configured through the UI after deploy — not in `.env`. See the [Phone Config Guide](../config/phone-config.md).

See [Env Vars Reference](../config/env-vars.md) for the full table.

## 3 — Run **wacraft‑server** behind a reverse proxy

```bash
docker run -d --name wacraft-server \
  --env-file .env \
  -p 6900:6900 \
  --restart unless-stopped \
  astervia/wacraft-server:latest
```

## 4 — Deploy the Angular UI to Vercel

1. **Fork** or **import** [https://github.com/Astervia/wacraft-client](https://github.com/Astervia/wacraft-client) in Vercel.
2. In **Project Settings → Environment Variables** add:

| Key                            | Value                     |
| ------------------------------ | ------------------------- |
| `MAIN_SERVER_URL`              | `api.example.com`         |
| `MAIN_SERVER_SECURITY`         | `true`                    |
| `GOOGLE_MAPS_API_KEY`          | _(optional)_              |
| `WEBSOCKET_BASE_PING_INTERVAL` | _(optional)_              |

3. **Build and other configurations** already in repo.
4. Deploy — Vercel assigns `https://app.example.com` when using a custom domain.

## 5 — First login & workspace setup

1. Open `https://app.example.com` and sign in with `su@sudo` / `SU_PASSWORD`.
2. Create your first **workspace**.
3. Navigate to **Phone Configs → New** and enter your Meta credentials. See [Phone Config Guide](../config/phone-config.md).
4. Register the Meta webhook. See [Webhook Setup](../config/webhook-setup.md).

## 6 — Checklist

- [ ] TLS certificates in place (Let's Encrypt or LB).
- [ ] DNS records for `api.example.com` and `app.example.com`.
- [ ] Secrets stored in a vault or CI/CD secret store.
- [ ] Phone config created in UI with correct Meta credentials.
- [ ] Webhook URL in Meta set to `https://api.example.com/webhook-in`.
- [ ] Firewall restricts inbound 6900 except via proxy.

**Done!** Your production wacraft stack is live 🚀

## 7 — Next steps

- Check the [UI Walkthrough](../guide/ui.md) to get familiar with the UI.
- Learn about [Workspaces & Permissions](../guide/workspaces.md).
- Set up [Billing](../guide/billing.md) if you want throughput plans.
