# 📖 Product Overview

Welcome to **wacraft** – an open‑source WhatsApp Cloud Platform that bundles a battle‑ready API, modern Angular UI, and n8n‑compatible automation webhooks. This page gives you the **big‑picture** before you dive into the feature‑specific guides.

## ☁️ wacraft Console

**[console.wacraft.astervia.tech](https://console.wacraft.astervia.tech)** is the hosted, multi-tenant wacraft platform managed by Astervia. It runs the same open-source stack — no installation required. Sign up, create a workspace, add your WhatsApp phone config through the UI, and you're live.

Use the Console if you want to get started immediately without managing infrastructure. Everything in this documentation applies to both the Console and self-hosted deployments.

## What's in the box?

| Layer          | Component        | Purpose                                                                                                                                          |
| -------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **API Server** | `wacraft‑server` | Go REST service that proxies the WhatsApp Cloud API, stores state in PostgreSQL and exposes webhooks, workspaces, RBAC, campaigns & billing.     |
| **Web UI**     | `wacraft‑client` | Angular SPA for operators: chats, templates, campaigns, phone configs, workspace members, billing. Tailwind + Angular Material, keyboard‑driven. |
| **Docs**       | (this site)      | Developer & operator handbook. Deployment recipes, usage walkthroughs and API reference.                                                         |

> **Fully open**: The full backend (`wacraft-server`) is MIT‑licensed with all features included. No lite/pro split.

## Architecture at a glance

```
┌─────────────────────────────────────────────┐
│                  wacraft                    │
│                                             │
│  ┌──────────────┐     ┌──────────────────┐  │
│  │  Angular UI  │────▶│  Go API Server   │  │
│  │ (wacraft-    │     │ (wacraft-server) │  │
│  │  client)     │     │  port 6900       │  │
│  └──────────────┘     └────────┬─────────┘  │
│                                │            │
│                    ┌───────────▼──────────┐ │
│                    │     PostgreSQL        │ │
│                    └──────────────────────┘ │
└─────────────────────────────────────────────┘
         │                        ▲
         ▼                        │
  WhatsApp Cloud API         Webhook events
```

## Core Concepts

### Workspaces

All resources are scoped to a **workspace**: contacts, messages, campaigns, phone configs, and webhooks. Users can belong to multiple workspaces with independent permission sets. See [Workspaces & Permissions](./workspaces.md).

### Phone Configs

Connect one or more WhatsApp phone numbers to a workspace via the UI — no environment variable restarts needed. See [Phone Config Guide](../config/phone-config.md).

### Policy‑based Permissions

Workspace membership comes with fine‑grained **policies** (e.g. `message.send`, `campaign.run`, `billing.manage`) that control exactly what each member can do. See [Workspaces & Permissions](./workspaces.md).

### Billing

Optional throughput‑based billing powered by Stripe. Users subscribe to plans at `/billing`; admins manage plans and subscriptions at `/billing-admin`. See [Billing Guide](./billing.md).

## API Reference

Interactive REST docs live under **`/docs`** of any running server instance.

_Example:_ `https://api.example.com/docs`

- Built with **Swagger UI** / OpenAPI — try calls right from the browser.
- Use the auth endpoints to copy your `token` and make requests. Put `Bearer` before the token in Swagger UI.

## Internationalisation (i18n)

| Path     | Language                          |
| -------- | --------------------------------- |
| `/en`    | **English** 🇺🇸 – default fallback |
| `/pt-BR` | **Português (Brasil)** 🇧🇷         |

```text
https://app.example.com/en        # English UI
https://app.example.com/pt-BR     # Portuguese UI
```

> **Contribute translations!** PRs for additional locales are welcome!

## Where to next?

| Task                     | Guide                                                    |
| ------------------------ | -------------------------------------------------------- |
| Use hosted platform      | [wacraft Console](https://console.wacraft.astervia.tech) |
| Automate with n8n        | [n8n Integration](./n8n.md)                              |
| Tour the UI              | [UI Walkthrough](./ui.md)                                |
| Configure a phone number | [Phone Config](../config/phone-config.md)                |
| Manage team access       | [Workspaces & Permissions](./workspaces.md)              |
| Set up billing           | [Billing](./billing.md)                                  |
| Local / single‑VM deploy | [Docker Compose](../deploy/docker-compose.md)            |
| Minimal VM + Vercel CDN  | [Binary + Vercel](../deploy/binary-vercel.md)            |
| All deployment options   | [Deployment overview](../deploy/overview.md)             |

Need bespoke hosting or feature forks? **Astervia** provides consultancy –
email [wacraft@astervia.tech](mailto:wacraft@astervia.tech) to scope a custom deployment.

Happy building 🚀
