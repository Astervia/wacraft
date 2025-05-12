# ⚡ Quick Start (Local, 5 min)

This guide spins up **wacraft** for local hacking: the Go API, PostgreSQL, and the Angular UI (lite) in Docker—plus an HTTPS tunnel so Meta’s webhooks reach your machine.

---

## 1 — Prepare a minimal `.env`

1. Duplicate `compose.env` ➜ `.env`.
2. Fill **only the placeholders** below; everything else is auto‑wired by `docker‑compose.lite.yml`.

```env
# ─────────── Core secrets ───────────
ENV=development
SU_PASSWORD=change_me_safely
JWT_SECRET=32_random_chars_min
AUTH_TOKEN=64_random_chars_optional

# ─────────── WhatsApp Cloud API ───────────
WABA_ID=your_phone_number_id
WABA_ACCOUNT_ID=your_waba_account_id
WABA_ACCESS_TOKEN=your_permanent_token
META_APP_SECRET=your_app_secret
WEBHOOK_VERIFY_TOKEN=any_string_you_like  # must match Meta dashboard

# ─────────── Front‑end tweaks ───────────
APP_TITLE="[LOCAL] wacraft"
GOOGLE_MAPS_API_KEY=optional_for_location_messages
MAIN_SERVER_URL=127.0.0.1:6900
MAIN_SERVER_SECURITY=false
# NODE_RED_SERVER_URL=127.0.0.1:1880      # supporters: uncomment if needed
# NODE_RED_SERVER_SECURITY=false
```

_Need a refresher on each key?_ See

- [Getting Meta Credentials](../config/meta-setup.md) – obtain Meta creds
- [Environment Variables Reference](../config/env-vars.md) – full variable table

---

## 2 — Launch the stack

```bash
git clone https://github.com/Astervia/wacraft.git
cd wacraft
cp compose.env .env        # step 1 if you haven’t done it

docker compose -f docker-compose.lite.yml up -d   # supporters: use docker-compose.yml
```

Open **[http://localhost](http://localhost)** and sign in with:

| User      | Password               |
| --------- | ---------------------- |
| `su@sudo` | value of `SU_PASSWORD` |

> **Tip:** Need to reset the DB?
> `docker compose -f docker-compose.lite.yml down -v` drops the volume.

---

## 3 — Expose an HTTPS webhook

Meta won’t send events to plain HTTP, so run **one** of the tunnels below:

| Tool        | Command                                              | Callback URL to paste into Meta               |
| ----------- | ---------------------------------------------------- | --------------------------------------------- |
| ngrok       | `ngrok http 6900`                                    | `https://<id>.ngrok.io/webhook-in`            |
| cloudflared | `npx cloudflared tunnel --url http://localhost:6900` | `https://<rand>.trycloudflare.com/webhook-in` |
| localtunnel | `npx localtunnel --port 6900`                        | `https://<sub>.loca.lt/webhook-in`            |

### Register & test

This is a brief walkthrough of the steps to register your webhook with Meta and test it. If you don't have experience with setting up webhooks, please see the [Webhook Setup Guide](../config/webhook-setup.md).

1. **App Dashboard → WhatsApp → Configuration → Edit**

   - Callback URL = HTTPS tunnel + `/webhook-in`
   - Verify Token = the same `WEBHOOK_VERIFY_TOKEN`

2. Click **Verify and Save** ✔️
3. **Manage** fields → check **messages** → **Done**
4. Send a message to the WhatsApp number; watch wacraft UI for any received messages.

> **Important:** If you restart the tunnel, its hostname changes—update the Callback URL accordingly.

---

## 4 — Next steps

- Check the [UI Walkthrough](../guide/ui.md) to get familiar with the UI and resources.
- Take a quick tour of everything you’ve just unlocked in the [Product Overview](../guide/overview.md).
- [Unlock more features](../support/plans.md) and test new resources.
- When you’re ready for production, check our [Fast Production Deploy](production.md) or check the [Deployment Guides](../deploy/docker-compose.md) for many deployment options.
- Consider using [a production Webhook Setup](../config/webhook-setup.md) when you switch to produciton.
