# Webhook Setup

`wacraft-server` listens for WhatsApp Cloud API events on  
`http://localhost:6900/webhook‑in`.  
Because Meta **only** posts to HTTPS URLs, the setup differs between local
development and production.

---

## 1 — Local Development

| Step                                         | What to do                                                                                                                                                                    |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1.1 Run the stack**                        | `bash docker compose up -d`                                                                                                                                                   |
| **1.2 Expose port 6900 via an HTTPS tunnel** | pick one:<br/>• **ngrok**  `ngrok http 6900`<br/>• **cloudflared**  `npx cloudflared tunnel --url http://localhost:6900`<br/>• **localtunnel**  `npx localtunnel --port 6900` |
| **1.3 Copy the public URL**                  | The tunnel prints something like `https://xyz.ngrok.io`. Append `/webhook-in`.                                                                                                |
| **1.4 Register the callback in Meta**        | App Dashboard → **WhatsApp → Configuration → Edit** →<br/>**Callback URL** = tunnel URL from 1.3<br/>**Verify Token** = value of `WEBHOOK_VERIFY_TOKEN` in your `.env`        |
| **1.5 Subscribe to fields**                  | Click **Manage** → check **messages** → **Done**.                                                                                                                             |
| **1.6 Test**                                 | Send a message to the WhatsApp number; watch wacraft UI for any received messages.                                                                                            |

> **Tip** Each new tunnel run changes the public hostname, so you’ll need to
> update the callback URL whenever you restart your tunnel.

---

## 2 — Production Deployment

| Step                                    | What to do                                                                                                                                                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **2.1 Serve wacraft behind TLS**        | Deploy behind a reverse‑proxy (Nginx, Caddy, Traefik, AWS ALB, etc.)<br/>Example Nginx snippet: <br/>`nginx server {  listen 443 ssl;  server_name api.example.com;  location /webhook-in {    proxy_pass http://wacraft:6900;  } }` |
| **2.2 Point DNS**                       | `api.example.com → your load balancer / proxy IP`.                                                                                                                                                                                   |
| **2.3 Register the permanent callback** | In the Meta app, set **Callback URL** to `https://api.example.com/webhook-in` and reuse the same `WEBHOOK_VERIFY_TOKEN`.                                                                                                             |
| **2.4 Lock down access**                | _Optional but recommended_—allow inbound POSTs to `/webhook-in` only from Meta’s IP ranges.                                                                                                                                          |
| **2.5 Rotate secrets**                  | Store `WABA_ACCESS_TOKEN`, `META_APP_SECRET`, and `WEBHOOK_VERIFY_TOKEN` in a vault or your CI/CD secret store; reload the service whenever you rotate them.                                                                         |
| **2.6 Monitor**                         | Set up logging/alerting on 4xx/5xx responses; Meta will pause delivery after repeated failures.                                                                                                                                      |

---

### Variable Recap

| Variable               | Used in                                                                          |
| ---------------------- | -------------------------------------------------------------------------------- |
| `WEBHOOK_VERIFY_TOKEN` | Echoed during Meta’s challenge; must match exactly in Meta dashboard and `.env`. |
| `META_APP_SECRET`      | wacraft verifies `X‑Hub‑Signature‑256` on every webhook.                         |
| `PORT` (`6900`)        | Internal listener; expose or proxy to HTTPS.                                     |

Your webhooks are now live for both local hacking and hardened production. Happy automating!
