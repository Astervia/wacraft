# 🚀 Production Deploy (Docker backend + Vercel frontend)

> **v0.1.x (Legacy)** — [Switch to v0.2.x docs](../../quickstart/production.md)

This guide ships **one wacraft‑server** (Go API + webhooks) inside Docker and hosts the Angular UI on **Vercel**.
Result: a fully HTTPS‑secured stack reachable at `https://app.example.com` with the API on `https://api.example.com`.

## 🧰 Prerequisites

| What                | Minimum                              | Notes                                                                  |
| ------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| Domain names        | `api.example.com`, `app.example.com` | One sub‑domain for the API, one for the UI.                            |
| TLS cert            | Let's Encrypt or managed LB          | Terminate HTTPS before traffic reaches the container.                  |
| PostgreSQL          | 14 +                                 | Cloud‑managed (RDS, Cloud SQL, Azure DB) **or** self‑hosted container. |
| WhatsApp Meta creds | WABA_ID, WABA_ACCOUNT_ID, etc.       | From [meta‑setup.md](../config/meta-setup.md).                         |

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

Update the `DATABASE_*` keys accordingly.

## 2 — Create the server `.env`

`wacraft-server` **will not start** if any required var is blank.

```env
############################
# Runtime
############################
ENV=production

############################
# PostgreSQL
############################
DATABASE_URL=postgresql://postgres:supersecret@db.example.com:5432/postgres
DATABASE_MAX_OPEN_CONNS=40
DATABASE_MAX_IDLE_CONNS=20
DATABASE_CONN_MAX_LIFETIME_MINUTES=30

############################
# HTTP (behind proxy)
############################
HOST=https://api.example.com   # purely cosmetic logs
PORT=6900                      # container listens here
SU_PASSWORD=super‑admin‑pwd

############################
# Auth
############################
JWT_SECRET=$(openssl rand -hex 32)
AUTH_TOKEN=                    # optional machine‑to‑machine token

############################
# WhatsApp Cloud API
############################
WABA_ID=
WABA_ACCOUNT_ID=
WABA_ACCESS_TOKEN=
META_APP_SECRET=
WEBHOOK_VERIFY_TOKEN=

MESSAGE_STATUS_SYNC_TIMEOUT_SECONDS=20
```

Save as `.env`.

## 3 — Run **wacraft‑server** behind a reverse proxy

### Single `docker run` (quick)

```bash
docker run -d --name wacraft-server \
  --env-file .env \
  -p 6900:6900 \
  --restart unless-stopped \
  astervia/wacraft-server-lite:latest     # supporters use wacraft-server instead of wacraft-server-lite
```

## 4 — Deploy the Angular UI to Vercel

1. **Fork** or **import** [https://github.com/Astervia/wacraft-client](https://github.com/Astervia/wacraft-client) in Vercel.
2. In **Project Settings → Environment Variables** add:

| Key                            | Value                        |
| ------------------------------ | ---------------------------- |
| `IS_LITE`                      | `true` *(supporters: false)* |
| `MAIN_SERVER_URL`              | `api.example.com`            |
| `MAIN_SERVER_SECURITY`         | `true`                       |
| `NODE_RED_SERVER_URL`          | _(optional)_                 |
| `NODE_RED_SERVER_SECURITY`     | _(optional)_                 |
| `GOOGLE_MAPS_API_KEY`          | _(optional)_                 |
| `WEBSOCKET_BASE_PING_INTERVAL` | _(optional)_                 |

3. **Build and other configurations** already in repo.
4. Deploy—Vercel assigns `https://app.example.com` when using custom domain.

## 5 — Create Meta Webhook

Follow the [Webhook Setup Guide](../config/webhook-setup.md) to register the callback URL in Meta.

## 6 — Checklist

- [ ] TLS certificates in place (Let's Encrypt or LB).
- [ ] DNS records for `api.example.com` and `app.example.com`.
- [ ] Secrets stored in a vault or CI/CD secret store.
- [ ] Webhook URL in Meta set to `https://api.example.com/webhook-in` + matching `WEBHOOK_VERIFY_TOKEN`.
- [ ] Firewall restricts inbound 6900 except via proxy.

**Done!** Your production wacraft stack is live. Time to onboard users 🚀

## 7 — Next steps

- Check the [UI Walkthrough](../guide/ui.md) to get familiar with the UI and resources.
- Take a quick tour of everything you've just unlocked in the [Product Overview](../guide/overview.md).
- [Unlock more features](../../support/plans.md) and test new resources.
