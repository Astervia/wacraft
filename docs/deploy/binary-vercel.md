# 🚀 Binary Deploy (Go API) + Vercel Frontend

Spin up **wacraft‑server** as a standalone Go executable (no Docker) on your favourite VM or
bare‑metal box, then host the Angular UI on **Vercel**.
Result: `https://app.example.com` + `https://api.example.com` with full HTTPS and **zero container runtime** on the server.

---

## 🧰 Prerequisites

| What                | Minimum                              | Notes                                                                  |
| ------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| Domain names        | `api.example.com`, `app.example.com` | One sub‑domain for the API, one for the UI.                            |
| TLS cert            | Let’s Encrypt or managed LB          | Terminate HTTPS before traffic reaches the binary.                     |
| PostgreSQL          | 14 +                                 | Cloud‑managed (RDS, Cloud SQL, Supabase) **or** self‑hosted container. |
| WhatsApp Meta creds | `WABA_ID`, `WABA_ACCOUNT_ID`, etc.   | [Getting Meta Credentials](../config/meta-setup.md).                   |
| Go tool‑chain       | 1.22 +                               | Needed **only** if you compile from source.                            |

---

## 1 — Provision PostgreSQL

Choose **one**:

- **Managed** – RDS, GCP Cloud SQL, Supabase, … Copy host/user/password into `.env`.
- **Self‑hosted** – quickest is a disposable container on the same machine:

```bash
docker run -d --name wacraft-db \
  -e POSTGRES_PASSWORD=supersecret \
  -e POSTGRES_DB=postgres \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  --restart unless-stopped \
  postgres:16-alpine
```

Update the `DATABASE_*` section later.

---

## 2 — Grab the binary

### 2.1 Build from source

```bash
git clone https://github.com/Astervia/wacraft-server-lite.git
cd wacraft-server-lite
go build -o ./bin/wacraft-server

# Supporters: replace 'wacraft-server-lite' with 'wacraft-server'
```

> `wacraft-server` is a **static binary** – no shared libs required.

## 3 — Create `.env` — Create `.env`

The server **won’t start** if any required var is empty.
Copy the snippet, adjust values, then place it in the root of the project (e.g. `/etc/wacraft/.env`).

```env
# ─────────── Runtime ───────────
ENV=production

# ─────────── PostgreSQL ────────
DATABASE_URL=postgresql://postgres:supersecret@db.example.com:5432/postgres
DATABASE_MAX_OPEN_CONNS=40
DATABASE_MAX_IDLE_CONNS=20
DATABASE_CONN_MAX_LIFETIME_MINUTES=30

# ─────────── HTTP (behind proxy) ───────────
HOST=https://api.example.com    # cosmetic logs only
PORT=6900                       # binary listens here
SU_PASSWORD=super‑admin‑pwd

# ─────────── Auth ───────────
JWT_SECRET=$(openssl rand -hex 32)
AUTH_TOKEN=                     # optional, machine‑to‑machine

# ─────────── WhatsApp Cloud API ───────────
WABA_ID=
WABA_ACCOUNT_ID=
WABA_ACCESS_TOKEN=
META_APP_SECRET=
WEBHOOK_VERIFY_TOKEN=

MESSAGE_STATUS_SYNC_TIMEOUT_SECONDS=20
```

Need the full table? See [Environment Variables Reference](../config/env-vars.md).

---

## 4 — Run **wacraft‑server** behind TLS

### 4.1 Systemd unit (recommended)

```ini
# /etc/systemd/system/wacraft.service
[Unit]
Description=wacraft WhatsApp Cloud API server
After=network.target

[Service]
Type=simple
WorkingDirectory=/etc/wacraft
EnvironmentFile=/etc/wacraft/.env
ExecStart=/etc/wacraft/bin/wacraft-server
Restart=always
RestartSec=3

# Allow many concurrent conns; tweak per load
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable --now wacraft
journalctl -fu wacraft
```

### 4.2 Reverse‑proxy snippet (Nginx)

```nginx
server {
  listen 443 ssl http2;
  server_name api.example.com;

  ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

  location / {
    proxy_pass         http://127.0.0.1:6900;
    proxy_set_header   Host $host;
    proxy_set_header   X-Forwarded-Proto https;
    proxy_set_header   X-Real-IP $remote_addr;
  }
}
```

Any HTTP server (Caddy, Traefik, AWS ALB…) works – just pass traffic to `localhost:6900`.

---

## 5 — Deploy the Angular UI to Vercel

1. **Import** [https://github.com/Astervia/wacraft-client](https://github.com/Astervia/wacraft-client) in Vercel.
2. **Project Settings → Environment Variables**:

| Key                            | Value                        |
| ------------------------------ | ---------------------------- |
| `IS_LITE`                      | `true` *(supporters: false)* |
| `MAIN_SERVER_URL`              | `api.example.com`            |
| `MAIN_SERVER_SECURITY`         | `true`                       |
| `NODE_RED_SERVER_URL`          | _(optional)_                 |
| `NODE_RED_SERVER_SECURITY`     | _(optional)_                 |
| `GOOGLE_MAPS_API_KEY`          | _(optional)_                 |
| `WEBSOCKET_BASE_PING_INTERVAL` | _(optional)_                 |

3. Default **build command** and **output dir** (`dist/`) are already in the repo.
4. Add a **custom domain** `app.example.com` in Vercel → point the CNAME to Vercel.

---

## 6 — Register the Meta Webhook

Follow [Webhook Setup](../config/webhook-setup.md) and set the **Callback URL** to
`https://api.example.com/webhook-in` with the same `WEBHOOK_VERIFY_TOKEN`.

---

## 7 — Production Checklist

- [ ] TLS certs valid for both subdomains.
- [ ] A‑records/CNAMEs in DNS.
- [ ] Secrets stored in a vault or CI/CD secret store.
- [ ] Firewall blocks inbound `6900` except from localhost / LB.
- [ ] Webhook URL + verify token registered in Meta.
- [ ] systemd service set to auto‑restart.

---

## 8 — Next steps

- Check the [UI Walkthrough](../guide/ui.md) to get familiar with the UI and resources.
- Take a quick tour of everything you’ve just unlocked in the [Product Overview](../guide/overview.md).
- [Support the project](../support/plans.md) to unlock advanced features 💎.
