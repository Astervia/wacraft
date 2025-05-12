# ❓ Frequently Asked Questions

A curated list of common questions about **wacraft** – from licensing to
troubleshooting the WhatsApp Cloud account. Don’t see your question? Email us
at **[wacraft@astervia.tech](mailto:wacraft@astervia.tech)** and we’ll update this page.

---

## 📦 General

### What is _wacraft_?

An open‑source platform that wraps the WhatsApp Cloud API with a Go backend,
Angular operator UI, and automation platforms support. You self‑host it and keep
full control of data.

### Is it really free?

Yes – the core code is MIT‑licensed. Donating unlocks supporter‑only images
(`wacraft-server`, Node‑RED nodes, premium analytics), but the Lite stack is
free forever.

### How do I become a supporter?

Donate **X‑Y satoshis** (see [plans](../support/plans.md)). You’ll receive
Docker credentials + repo access within 24 h.

---

## 🚀 Deployment

### Fastest way to try it?

Use the **Docker Compose Lite** stack: `docker compose -f docker-compose.lite.yml up -d`.

### I already use Vercel – can I keep it?

Yes. Follow the [Binary + Vercel](../binary-vercel.md) guide: server on your VM,
UI on Vercel CDN.

### Need help with multi‑region, Kubernetes, or on‑prem?

Astervia offers paid consultancy. Reach out via
[wacraft@astervia.tech](mailto:wacraft@astervia.tech) with your requirements.

---

## 🔐 Accounts & Permissions

### Default admin credentials?

`su@sudo` / value of `SU_PASSWORD` in your `.env`.

### Can I create agent roles?

RBAC scaffolding is present; detailed roles land in **v0.2**, but when you create a user you already specify a set of roles. For now, create separate JWT tokens for integrations.

---

## 🗄️ Data & Backups

### Where is data stored?

All persistent data lives in PostgreSQL (container `db` or your managed
instance). Media is proxied; original files stay in Meta’s CDN.

### How do I back up?

`docker compose exec db pg_dump -U postgres postgres > backup.sql` or schedule
managed snapshots in RDS.

---

## 🌐 WhatsApp / Meta Issues

### WhatsApp “Pending Payment Method” / card declined / 2FA issues

Those are **Meta Business account problems** – we can’t fix them via the API.
Check the Meta Business Manager > Payments page. If it still blocks you,
collect screenshots and email **[wacraft@astervia.tech](mailto:wacraft@astervia.tech)**; our team can escalate
through partner support.

### Webhook verify token fails

Ensure the callback URL is reachable (`https://api.example.com/webhook-in`) and
`WEBHOOK_VERIFY_TOKEN` matches exactly – no extra whitespace.

### Messages stuck in _pending_

1. Verify your WABA is in the **Business Verified** state.
2. Check **Message Status Sync Timeout** in `.env` (default 20 s).
3. Inspect server logs (`docker compose logs server`).

---

## 🌍 Localisation

### Is the UI available in languages other than English and Portuguese?

Currently **/en** and **/pt‑BR** are maintained. Community translations welcome
– see `client/src/assets/i18n/`.

---

## 🛠️ Contributing & Support

### Found a bug?

Open an issue in [https://github.com/Astervia/wacraft/issues](https://github.com/Astervia/wacraft/issues) with steps and
logs.

### Feature requests?

Same issue tracker – label it **enhancement**. Supporters get priority triage.

### Commercial SLA / custom forks?

[Plan _Supernova_](../support/plans.md) includes SLA and bespoke development. Email **Astervia** to discuss.

---

_Last updated: 2025‑05‑11_
