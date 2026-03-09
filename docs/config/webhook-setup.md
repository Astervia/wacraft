# Webhook Setup

`wacraft-server` listens for WhatsApp Cloud API events at the path `/webhook-in/{waba_id}`, where `waba_id` is the **WABA ID** of the phone config (the Phone Number ID from Meta).
Because Meta **only** posts to HTTPS URLs, the setup differs between local development and production.

## Finding your webhook URL

After creating a phone config in the UI, the exact webhook URL is shown on the phone config detail page. It follows the format:

```
{backend_url}/webhook-in/{waba_id}
```

**Examples:**

| Environment | Webhook URL |
| ----------- | ----------- |
| Production  | `https://api.example.com/webhook-in/123456789012345` |
| Local (ngrok) | `https://xyz.ngrok.io/webhook-in/123456789012345` |

> Open **Phone Configs** in the sidebar, click a config, and copy the webhook URL shown there. Use it as the **Callback URL** in Meta.

## 1 — Local Development

### 1.1 — Start the stack and expose port 6900

Meta can't reach `localhost`, so use a tunnel to get a public HTTPS URL:

| Tool | Command | Public URL format |
| ---- | ------- | ----------------- |
| **ngrok** | `ngrok http 6900` | `https://<id>.ngrok.io` |
| **cloudflared** | `npx cloudflared tunnel --url http://localhost:6900` | `https://<rand>.trycloudflare.com` |
| **localtunnel** | `npx localtunnel --port 6900` | `https://<sub>.loca.lt` |

### 1.2 — Update the webhook URL in the phone config

1. In wacraft, go to **Phone Configs** and open your config.
2. The page shows the **Webhook URL** — it already contains the correct path and WABA ID.
3. If your backend URL has changed (e.g. a new tunnel hostname), update the **Backend URL** field in the config and save. The displayed webhook URL will update automatically.

### 1.3 — Register the callback in Meta

1. Go to **Meta App Dashboard → WhatsApp → Configuration → Edit**.
2. Set **Callback URL** to the webhook URL from the phone config page.
3. Set **Verify Token** to the **Webhook Verify Token** you chose when creating the phone config.
4. Click **Verify and Save** ✔️
5. Click **Manage** → check **messages** → **Done**.

### 1.4 — Test

Send a WhatsApp message to the phone number. It should appear in the wacraft UI within seconds.

> **Tip:** Each tunnel restart changes the public hostname. Update the Callback URL in Meta and the Backend URL in the phone config whenever you restart the tunnel.

## 2 — Production Deployment

### 2.1 — Serve wacraft-server behind TLS

Deploy behind a reverse proxy that terminates HTTPS and forwards to port `6900`. Example Nginx snippet:

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

Any proxy (Caddy, Traefik, AWS ALB…) works — just forward all traffic to `localhost:6900`.

### 2.2 — Verify the phone config webhook URL

1. In wacraft, go to **Phone Configs** and open your config.
2. Confirm the **Webhook URL** shown matches `https://api.example.com/webhook-in/{waba_id}`.
3. If the backend URL is wrong, update it in the phone config and save.

### 2.3 — Register the permanent callback in Meta

1. Go to **Meta App Dashboard → WhatsApp → Configuration → Edit**.
2. Set **Callback URL** to the webhook URL from the phone config.
3. Set **Verify Token** to the **Webhook Verify Token** from the phone config.
4. Click **Verify and Save** ✔️
5. Click **Manage** → check **messages** → **Done**.

### 2.4 — Lock down access (optional but recommended)

Allow inbound POSTs to `/webhook-in` only from [Meta's published IP ranges](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks). Use your cloud provider's firewall or the server-level `IP_ALLOWLIST` — see [Firewall & Rate Limiting](./firewall.md).

### 2.5 — Monitor

Set up logging and alerting on `4xx`/`5xx` responses from `/webhook-in`. Meta pauses webhook delivery after repeated failures.

## Reference

| Item | Location |
| ---- | -------- |
| **Webhook URL** | Shown on the phone config detail page in the UI. Format: `{backend_url}/webhook-in/{waba_id}` |
| **Webhook Verify Token** | Set per phone config in the UI. |
| **Meta App Secret** | Set per phone config in the UI; used to verify `X-Hub-Signature-256` on incoming webhooks. |
| **Port** | `6900` — internal listener; always proxy to HTTPS before exposing to Meta. |
