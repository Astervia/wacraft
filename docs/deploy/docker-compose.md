# 🐳 Docker Compose — Production Stack

Ship **wacraft‑server**, PostgreSQL, and the Angular UI on a single VM with
`docker compose up -d`. Perfect for **side projects, PoCs, SMEs**, or anyone who
wants HTTPS and persistence without managing Kubernetes.

> **Footprint:** <300 MB RAM when idle, <200 MB compressed image pull.

## 🧰 Prerequisites

| What           | Minimum                                   | Notes                                                        |
| -------------- | ----------------------------------------- | ------------------------------------------------------------ |
| Docker Engine  | 24 +                                      | Linux, macOS, _or_ Windows Server 2022 / WSL2.               |
| Docker Compose | v2 (built‑in)                             | Use the **native** `docker compose` CLI.                     |
| DNS records    | `api.example.com`, `app.example.com`      | Point **A/CNAME** to the VM or LB.                           |
| TLS cert       | Let's Encrypt or managed LB               | Terminate HTTPS before traffic reaches the container.        |
| CPU + RAM      | 2 vCPUs / 2 GB **min** (4 GB sweet‑spot)  | UI builds at first boot; RAM spikes to ≈1.2 GB for 2‑3 min. |

## 1 — Bootstrap **`.env`**

```bash
cp compose.env .env            # template ships in the repo
nano .env                       # or your favourite editor
```

Fill **only these placeholders** — the compose file injects the rest.

```env
# ─────────── Runtime ───────────
SU_PASSWORD=change_me_safely
JWT_SECRET=$(openssl rand -hex 32)
AUTH_TOKEN=                        # optional service-to-service token

# ─────────── Registration ───────────
ALLOW_REGISTRATION=false           # disable after your team accounts are created
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

# ─────────── Frontend (Angular UI) ───────────
APP_TITLE="wacraft"
MAIN_SERVER_URL=api.example.com
MAIN_SERVER_SECURITY=true           # true = HTTPS, false = plain HTTP
GOOGLE_MAPS_API_KEY=
WEBSOCKET_BASE_PING_INTERVAL=

# ─────────── Billing (optional) ───────────
# BILLING_ENABLED=true
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

> 📝 **Reference docs:**
> • [Environment Variables](../config/env-vars.md)
> • [Firewall & Rate Limiting](../config/firewall.md)
> • [Stripe / Billing Setup](../config/stripe-setup.md)

> **WhatsApp credentials** are configured through the UI after first login — not in `.env`. See [Phone Config Guide](../config/phone-config.md).

## 2 — Clone & Launch

```bash
git clone https://github.com/Astervia/wacraft.git && cd wacraft
docker compose up -d
```

### What's inside `docker-compose.yml`?

| Service    | Notes                                                       |
| ---------- | ----------------------------------------------------------- |
| **server** | Go static binary, port 6900.                                |
| **client** | Angular UI served by Nginx (compiled on first boot).        |
| **db**     | `postgres:16‑alpine` with a named volume `wacraft_db_data`. |

## 3 — First sign‑in & setup

```text
URL   : https://app.example.com
Login : su@sudo
Pass  : <value_of_SU_PASSWORD>
```

After login:

1. Create a **workspace**.
2. Navigate to **Phone Configs → New** and enter your Meta credentials.
3. Register the Meta webhook — see [Webhook Setup](../config/webhook-setup.md).

## 4 — Operational commands

| Action                           | Command                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| Tail everything                  | `docker compose logs -f`                                           |
| Follow only **server** logs      | `docker compose logs -f server`                                    |
| **Live reload** after env change | `docker compose up -d --force-recreate`                            |
| Enter **psql** shell             | `docker compose exec db psql -U postgres`                          |
| Dump DB                          | `docker compose exec db pg_dump -U postgres postgres > backup.sql` |
| Stop stack (persist volumes)     | `docker compose down`                                              |
| Nuke all data (⚠️ prod!)         | `docker compose down -v`                                           |

## 5 — Upgrades

1. `git pull` to fetch the latest tags.
2. `docker compose pull && docker compose up -d`

Optionally add [containrrr/watchtower](https://github.com/containrrr/watchtower) to auto‑update images weekly.

## 6 — Hardening checklist

- [ ] VM firewalls allow **80/443** from the internet and **80/443/6900** from the VPC.
- [ ] Set `ALLOW_REGISTRATION=false` once all accounts are created.
- [ ] Configure SMTP so users can verify email and reset passwords.
- [ ] Review [Firewall & Rate Limiting](../config/firewall.md) — set `IP_DENYLIST` if needed.
- [ ] Rotate `JWT_SECRET` annually.
- [ ] Point `DATABASE_URL` to managed RDS if you need multi-AZ HA.
- [ ] Snapshot `wacraft_db_data` nightly (cron or provider snapshot).
- [ ] Configure an **uptime monitor** on `/healthz` (server) and `/` (client).
- [ ] Verify Meta webhook URL is `https://api.example.com/webhook-in`.
- [ ] If billing enabled: Stripe keys are live keys and webhook is registered.

## 7 — Next steps

- Check the [UI Walkthrough](../guide/ui.md) to get familiar with the UI.
- Learn about [Workspaces & Permissions](../guide/workspaces.md).
- Set up [Billing](../guide/billing.md) if you want throughput plans.

Happy shipping 🚀
