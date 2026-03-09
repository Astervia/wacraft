# ⚡ Quick Start (Local, 5 min)

This guide spins up **wacraft** for local development: the Go API, PostgreSQL, and the Angular UI in Docker—plus an HTTPS tunnel so Meta's webhooks reach your machine.

## 1 — Prepare a minimal `.env`

1. Duplicate `compose.env` ➜ `.env`.
2. Fill **only the placeholders** below; everything else is auto‑wired by `docker‑compose.yml`.

```env
# ─────────── Runtime ───────────
ENV=development
SU_PASSWORD=change_me_safely
JWT_SECRET=32_random_chars_min

# ─────────── Registration ───────────
ALLOW_REGISTRATION=true
REQUIRE_EMAIL_VERIFICATION=true    # set to false if you have no SMTP configured locally

# ─────────── Frontend ───────────
APP_TITLE="[LOCAL] wacraft"
MAIN_SERVER_URL=127.0.0.1:6900
MAIN_SERVER_SECURITY=false
WEBSOCKET_BASE_PING_INTERVAL=3000
```

> **WhatsApp credentials are no longer in `.env`.** In v0.2.x you configure phone numbers directly in the UI after first login. See [Phone Config Guide](../config/phone-config.md).
>
> Set `REQUIRE_EMAIL_VERIFICATION=false` for local dev if you haven't configured SMTP — the bootstrap `su@sudo` account bypasses verification regardless.

_Need a refresher on each key?_ See [Environment Variables Reference](../config/env-vars.md).

## 2 — Launch the stack

```bash
git clone https://github.com/Astervia/wacraft.git
cd wacraft
cp compose.env .env        # step 1 if you haven't done it

docker compose up -d
```

Open **[http://localhost](http://localhost)** and sign in with:

| User      | Password               |
| --------- | ---------------------- |
| `su@sudo` | value of `SU_PASSWORD` |

> **Tip:** Need to reset the DB?
> `docker compose down -v` drops the volume.

## 3 — Create a workspace and configure a phone number

After login you will be prompted to create or join a **workspace**. Create one, then:

1. In the sidebar, navigate to **Phone Configs** (the phone icon).
2. Click **New Phone Config** or navigate to `/phone-configs/new`.
3. Fill in your Meta credentials (see [Getting Meta Credentials](../config/meta-setup.md)):
    - **Configuration Name** – a friendly label (e.g. "Main Support Line")
    - **Display Phone Number** – in international format
    - **WABA ID** – Phone Number ID from Meta
    - **WABA Account ID** – WhatsApp Business Account ID
    - **Meta App Secret** – from your Meta app settings
    - **Access Token** – long‑lived system user token
    - **Webhook Verify Token** – any string you choose (you'll use it in Meta)
4. Save and set the config to **Active**.

See the [Phone Config Guide](../config/phone-config.md) for full details and screenshots.

## 4 — Expose an HTTPS webhook

Meta won't send events to plain HTTP, so run **one** of the tunnels below:

| Tool        | Command                                              | Callback URL to paste into Meta               |
| ----------- | ---------------------------------------------------- | --------------------------------------------- |
| ngrok       | `ngrok http 6900`                                    | `https://<id>.ngrok.io/webhook-in`            |
| cloudflared | `npx cloudflared tunnel --url http://localhost:6900` | `https://<rand>.trycloudflare.com/webhook-in` |
| localtunnel | `npx localtunnel --port 6900`                        | `https://<sub>.loca.lt/webhook-in`            |

### Register & test

This is a brief walkthrough of the steps to register your webhook with Meta and test it. See the full [Webhook Setup Guide](../config/webhook-setup.md) for details.

1. **App Dashboard → WhatsApp → Configuration → Edit**
    - Callback URL = HTTPS tunnel + `/webhook-in`
    - Verify Token = the **Webhook Verify Token** you set in the Phone Config UI

2. Click **Verify and Save** ✔️
3. **Manage** fields → check **messages** → **Done**
4. Send a message to the WhatsApp number; watch wacraft UI for any received messages.

> **Important:** If you restart the tunnel, its hostname changes—update the Callback URL accordingly.

## 5 — Next steps

- Check the [UI Walkthrough](../guide/ui.md) to get familiar with the interface.
- Learn about [Workspaces & Permissions](../guide/workspaces.md).
- When you're ready for production, see the [Fast Production Deploy](production.md) or [Deployment Guides](../deploy/docker-compose.md).
- Configure [Billing](../guide/billing.md) if you want to add throughput plans.
