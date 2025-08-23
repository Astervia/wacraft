# 🐳 Docker Compose — Small‑Production Stack

Ship **wacraft‑server**, PostgreSQL, and the Angular UI on a single VM with
`docker compose up ‑d`. Perfect for **side projects, PoCs, SMEs**, or anyone who
wants HTTPS and persistence without managing Kubernetes.

> **Footprint:** <300 MB RAM when idle, <200 MB compressed image pull.

## 🧰 Prerequisites

| What             | Minimum                                  | Notes                                                       |
| ---------------- | ---------------------------------------- | ----------------------------------------------------------- |
| Docker Engine    | 24 +                                     | Linux, macOS, _or_ Windows Server 2022 / WSL2.              |
| Docker Compose   | v2 (built‑in)                            | Use the **native** `docker compose` CLI.                    |
| DNS records      | `api.example.com`, `app.example.com`     | Point **A/CNAME** to the VM or LB.                          |
| TLS cert         | Let’s Encrypt or managed LB              | Terminate HTTPS before traffic reaches the container.       |
| CPU + RAM        | 2 vCPUs / 2 GB **min** (4 GB sweet‑spot) | UI builds at first boot; RAM spikes to ≈1.2 GB for 2‑3 min. |
| Meta credentials | `WABA_ID`, `WABA_ACCESS_TOKEN`, …        | See [Getting Meta Credentials](../config/meta-setup.md).    |

## 1 — Bootstrap **`.env`**

```bash
cp compose.env .env            # template ships in the repo
nano .env                       # or your favourite editor
```

Fill **only these placeholders** — the compose file injects the rest.

```env
# ─────────── Core secrets ───────────
SU_PASSWORD=change_me_safely
JWT_SECRET=$(openssl rand -hex 32)
AUTH_TOKEN=                        # optional service‑to‑service token

# ─────────── WhatsApp Cloud API ───────────
WABA_ID=your_phone_number_id
WABA_ACCOUNT_ID=your_waba_account_id
WABA_ACCESS_TOKEN=your_permanent_token
META_APP_SECRET=your_app_secret
WEBHOOK_VERIFY_TOKEN=verify_token_any_string  # must match Meta dashboard

# ─────────── Frontend (Angular UI) ───────────
APP_TITLE="wacraft"
IS_LITE=true                        # supporters: false
MAIN_SERVER_URL=api.example.com
MAIN_SERVER_SECURITY=true           # true = HTTPS, false = plain HTTP
GOOGLE_MAPS_API_KEY=
WEBSOCKET_BASE_PING_INTERVAL=
# NODE_RED_SERVER_URL=nodered.example.com
# NODE_RED_SERVER_SECURITY=true
```

> 📝 **Reference docs:**
> • [Environment Variables](../config/env-vars.md)
> • [Meta Credentials Guide](../config/meta-setup.md)

## 2 — Clone & Launch

```bash
git clone https://github.com/Astervia/wacraft.git && cd wacraft

# Production‑grade compose file
#   • docker-compose.yml
#   • docker-compose.lite.yml

docker compose -f docker-compose.lite.yml up -d   # supporters: remove the `.lite` suffix
```

### What’s inside `docker-compose.yml`?

| Service    | Notes                                                       |
| ---------- | ----------------------------------------------------------- |
| **server** | Go static binary, port 6900.                                |
| **client** | Angular UI served by Nginx (compiled on first boot).        |
| **db**     | `postgres:16‑alpine` with a named volume `wacraft_db_data`. |

## 3 — First sign‑in

```text
URL   : https://app.example.com
Login : su@sudo
Pass  : <value_of_SU_PASSWORD>
```

_The UI auto‑detects HTTPS and target host via `MAIN_SERVER_URL`._

## 4 — Operational commands

| Action                           | Command                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| Tail everything                  | `docker compose logs -f`                                           |
| Follow only **server** logs      | `docker compose logs -f server`                                    |
| **Live reload** after env change | `docker compose up -d --force-recreate`                            |
| Enter **psql** shell             | `docker compose exec db psql -U postgres`                          |
| Dump DB                          | `docker compose exec db pg_dump -U postgres postgres > backup.sql` |
| Stop stack (persist volumes)     | `docker compose down`                                              |
| Nuke all data (⚠️ prod!)         | `docker compose down -v`                                           |

## 5 — Upgrades

1. `git pull` to fetch the latest tags.
2. `docker compose pull && docker compose up -d`

Optionally add [containrrr/watchtower](https://github.com/containrrr/watchtower) to auto‑update images weekly.

## 6 — Hardening checklist

- [ ] VM firewalls allow **80/443** from the internet and **80/443/6900** from the VPC.
- [ ] Rotate `JWT_SECRET` annually; recycle access tokens.
- [ ] Point `DATABASE_URL` to managed RDS if you need multi‑AZ HA.
- [ ] Snapshot `wacraft_db_data` nightly (cron or provider snapshot).
- [ ] Configure an **uptime monitor** on `/healthz` (server) and `/` (client).
- [ ] Verify Meta webhook uses `https://api.example.com/webhook-in` + the same verify token.

## 7 — Next steps

- Check the [UI Walkthrough](../guide/ui.md) to get familiar with the UI and resources.
- Take a quick tour of everything you’ve just unlocked in the [Product Overview](../guide/overview.md).
- Need Node‑RED flows? Enable the node‑red service & env vars, then restart.
- Want premium features? [Become a supporter](../support/plans.md) and switch to `docker-compose.yml`.

Happy shipping 🚀
