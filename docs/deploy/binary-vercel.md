# 🚀 Binary Deploy (Go API) + Vercel Frontend

Spin up **wacraft-server** as a standalone Go executable (no Docker) on your favourite VM or bare-metal box, then host the Angular UI on **Vercel**.
Result: `https://app.example.com` + `https://api.example.com` with full HTTPS and **zero container runtime** on the server.

## 🧰 Prerequisites

| What          | Minimum                              | Notes                                                                  |
| ------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| Domain names  | `api.example.com`, `app.example.com` | One sub-domain for the API, one for the UI.                            |
| TLS cert      | Let's Encrypt or managed LB          | Terminate HTTPS before traffic reaches the binary.                     |
| PostgreSQL    | 14 +                                 | Cloud-managed (RDS, Cloud SQL, Supabase) **or** self-hosted container. |
| Go tool-chain | 1.22 +                               | Needed to compile the binary.                                          |

## 1 — Provision PostgreSQL

Choose **one**:

- **Managed** — RDS, GCP Cloud SQL, Supabase, … Copy host/user/password into `.env`.
- **Self-hosted** — run a container on the same machine:

```bash
docker run -d --name wacraft-db \
  -e POSTGRES_PASSWORD=supersecret \
  -e POSTGRES_DB=postgres \
  -e POSTGRES_USER=postgres \
  -p 127.0.0.1:5432:5432 \
  --restart unless-stopped \
  postgres:17-alpine
```

> Binding to `127.0.0.1` keeps Postgres off the public internet.

## 2 — Build the binary

Clone and compile on the **target machine** (or cross-compile locally and copy the binary over):

### Build on the target server

```bash
git clone https://github.com/Astervia/wacraft-server.git
cd wacraft-server
go build -o ./bin/wacraft-server
```

### Cross-compile from your dev machine

If your development machine is macOS or Windows and your server runs Linux:

```bash
git clone https://github.com/Astervia/wacraft-server.git
cd wacraft-server

# Linux x86-64 (most VMs and cloud instances)
GOOS=linux GOARCH=amd64 go build -o ./bin/wacraft-server-linux-amd64

# Linux ARM64 (Raspberry Pi 4, Ampere, AWS Graviton)
GOOS=linux GOARCH=arm64 go build -o ./bin/wacraft-server-linux-arm64
```

Then copy the binary to the server:

```bash
scp ./bin/wacraft-server-linux-amd64 user@api.example.com:/etc/wacraft/bin/wacraft-server
```

> `wacraft-server` is a **static binary** — no shared libraries, no runtime dependencies.

## 3 — Create `.env`

On the server, create `/etc/wacraft/.env`:

```env
# ─────────── Runtime ───────────
ENV=production
HOST=https://api.example.com
PORT=6900
SU_PASSWORD=super-admin-pwd

# ─────────── PostgreSQL ────────
DATABASE_URL=postgresql://postgres:supersecret@localhost:5432/postgres
DATABASE_MAX_OPEN_CONNS=40
DATABASE_MAX_IDLE_CONNS=20
DATABASE_CONN_MAX_LIFETIME_MINUTES=30

# ─────────── Auth ───────────
JWT_SECRET=$(openssl rand -hex 32)
AUTH_TOKEN=                     # optional, machine-to-machine

# ─────────── Registration ───────────
ALLOW_REGISTRATION=false        # disable after your team accounts are created
REQUIRE_EMAIL_VERIFICATION=true

# ─────────── Email (SMTP) ───────────
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@example.com
APP_BASE_URL=https://app.example.com

# ─────────── Firewall (optional) ───────────
# IP_DENYLIST=198.51.100.0/24
RATE_LIMIT_ENABLED=true

# ─────────── Sync ───────────
MESSAGE_STATUS_SYNC_TIMEOUT_SECONDS=20

# ─────────── Billing (optional) ───────────
# BILLING_ENABLED=true
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

> WhatsApp credentials are configured in the UI after first login — see [Phone Config Guide](../config/phone-config.md).

Full variable reference: [Environment Variables](../config/env-vars.md) · [Firewall & Rate Limiting](../config/firewall.md) · [Stripe / Billing Setup](../config/stripe-setup.md)

## 4 — Run wacraft-server behind TLS

### 4.1 Systemd unit (recommended)

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
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable --now wacraft
journalctl -fu wacraft
```

### 4.2 Reverse-proxy snippet (Nginx)

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
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
  }
}
```

> The `Upgrade` / `Connection` headers are required for **WebSocket** support. Any HTTP server (Caddy, Traefik, AWS ALB…) works — just forward to `localhost:6900`.

## 5 — Deploy the Angular UI to Vercel

1. **Import** [https://github.com/Astervia/wacraft-client](https://github.com/Astervia/wacraft-client) in Vercel.
2. **Project Settings → Environment Variables** — add:

| Key | Value | Notes |
| --- | ----- | ----- |
| `MAIN_SERVER_URL` | `api.example.com` | No protocol prefix |
| `MAIN_SERVER_SECURITY` | `true` | Enables https/wss |
| `APP_TITLE` | `wacraft` | Browser tab title |
| `GOOGLE_MAPS_API_KEY` | _(your key)_ | Optional — needed for location messages |
| `WEBSOCKET_BASE_PING_INTERVAL` | `30000` | Optional — ms between WS pings |
| `AUTOMATION_SERVER_URL` | _(your n8n URL)_ | Optional — enables Automations sidebar |
| `AUTOMATION_SERVER_SECURITY` | `true` | Optional — set if n8n is on HTTPS |

3. The **build command** and **output directory** (`dist/`) are pre-configured in the repo — no changes needed.
4. Add a **custom domain** `app.example.com` in Vercel and point the CNAME to Vercel's edge.

## 6 — First login & setup

1. Open `https://app.example.com` and sign in with `su@sudo` / `SU_PASSWORD`.
2. Create your first **workspace**.
3. Navigate to **Phone Configs → New** and enter your Meta credentials — see [Phone Config Guide](../config/phone-config.md).
4. Register the Meta webhook — see [Webhook Setup](../config/webhook-setup.md).

## 7 — Upgrades

1. Pull the latest source and rebuild:

```bash
cd wacraft-server
git pull
go build -o ./bin/wacraft-server   # or cross-compile and scp
sudo systemctl restart wacraft
```

2. For the frontend, redeploy on Vercel (push to main or trigger manually).

## 8 — Production Checklist

- [ ] TLS certs valid for both subdomains.
- [ ] A-records/CNAMEs in DNS.
- [ ] Secrets stored in a vault or CI/CD secret store.
- [ ] OS/cloud firewall blocks inbound `6900` except from localhost / LB.
- [ ] WebSocket `Upgrade` headers forwarded by the reverse proxy.
- [ ] Set `ALLOW_REGISTRATION=false` once all accounts are created.
- [ ] Configure SMTP for email verification and password reset.
- [ ] Review [Firewall & Rate Limiting](../config/firewall.md) — set `IP_DENYLIST` if needed.
- [ ] Phone config created in UI.
- [ ] Meta webhook URL registered at `https://api.example.com/webhook-in`.
- [ ] systemd service enabled and set to auto-restart.

## 9 — Next steps

- Check the [UI Walkthrough](../guide/ui.md) to get familiar with the UI.
- Learn about [Workspaces & Permissions](../guide/workspaces.md).
- Set up [n8n Integration](../guide/n8n.md) for workflow automation.
- Set up [Billing](../guide/billing.md) if you want throughput plans.
