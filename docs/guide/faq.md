# ❓ Frequently Asked Questions

A curated list of common questions about **wacraft v0.2.x**. Don't see your question? Email us at **[wacraft@astervia.tech](mailto:wacraft@astervia.tech)** and we'll update this page.

## 📦 General

### What is _wacraft_?

An open‑source platform that wraps the WhatsApp Cloud API with a Go backend and Angular operator UI. Features include multi‑tenant workspaces, multiple phone number support, policy‑based permissions, and optional Stripe billing. You self‑host it and keep full control of your data.

### Is it really free?

Yes – the full backend (`wacraft-server`) is MIT‑licensed with all features included. There is no lite/pro split in v0.2.x.

### Where do I configure WhatsApp credentials?

In v0.2.x, phone number credentials are configured in the UI at `/phone-configs/new` — not in environment variables. See [Phone Config Guide](../config/phone-config.md).

## 🚀 Deployment

### Fastest way to try it?

```bash
git clone https://github.com/Astervia/wacraft.git
cp compose.env .env
docker compose up -d
```

### I already use Vercel – can I keep it?

Yes. Follow the [Binary + Vercel](../deploy/binary-vercel.md) guide: server on your VM, UI on Vercel CDN.

### Need help with multi‑region, Kubernetes, or on‑prem?

Astervia offers paid consultancy. Reach out via [wacraft@astervia.tech](mailto:wacraft@astervia.tech).

## 🔐 Accounts & Permissions

### Default admin credentials?

`su@sudo` / value of `SU_PASSWORD` in your `.env`.

### What's the difference between global roles and workspace policies?

- **Global role `admin`** – grants access to app‑wide pages like `/billing-admin` and user management.
- **Global role `user`** – regular account, no special app‑level privileges.
- **Workspace policies** – fine‑grained permissions within a workspace (e.g. `message.send`, `campaign.run`). Assigned per member per workspace.

See [Workspaces & Permissions](../guide/workspaces.md) for the full policy list.

### Can I invite users to a workspace without giving them admin access?

Yes. Assign only the policies they need (e.g. `message.read`, `message.send`) when inviting them.

## 💳 Billing

### Is billing required?

No. Billing is optional. The server works without `BILLING_ENABLED=true` or Stripe credentials.

### How do I set up Stripe?

See the [Stripe Setup Guide](../config/stripe-setup.md).

### Where do users subscribe to plans?

Users go to `/billing`. Admins manage plans at `/billing-admin`.

## 🗄️ Data & Backups

### Where is data stored?

All persistent data lives in PostgreSQL. Media is proxied; original files stay in Meta's CDN.

### How do I back up?

```bash
docker compose exec db pg_dump -U postgres postgres > backup.sql
```

Or schedule managed snapshots in RDS / Cloud SQL.

## 🌐 WhatsApp / Meta Issues

### WhatsApp "Pending Payment Method" / card declined / 2FA issues

Those are **Meta Business account problems** — we can't fix them via the API. Check Meta Business Manager > Payments. If it still blocks you, collect screenshots and email **[wacraft@astervia.tech](mailto:wacraft@astervia.tech)**.

### Webhook verify token fails

Ensure the **Callback URL** is reachable (`https://api.example.com/webhook-in`) and the **Verify Token** in Meta exactly matches the **Webhook Verify Token** you entered in the Phone Config UI — no extra whitespace.

### Messages stuck in _pending_

1. Verify your WABA is in the **Business Verified** state.
2. Check the **Access Token** in Phone Config is a long‑lived system user token.
3. Check `MESSAGE_STATUS_SYNC_TIMEOUT_SECONDS` in `.env` (default 20 s).
4. Inspect server logs: `docker compose logs server`.

## 🌍 Localisation

### Is the UI available in languages other than English and Portuguese?

Currently **/en** and **/pt‑BR** are maintained. Community translations welcome — see `client/src/assets/i18n/`.

## 🛠️ Contributing & Support

### Found a bug?

Open an issue at [https://github.com/Astervia/wacraft/issues](https://github.com/Astervia/wacraft/issues) with steps and logs.

### Feature requests?

Same issue tracker — label it **enhancement**.

### Commercial SLA / custom forks?

Email **[wacraft@astervia.tech](mailto:wacraft@astervia.tech)** to discuss a custom engagement.

---

_Last updated: 2026‑03_
