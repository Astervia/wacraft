# **wacraft** <small>Build WhatsApp Cloud apps in minutes</small>

[![Try the Console](https://img.shields.io/badge/-Try%20the%20Console-25d366?style=for-the-badge&logo=whatsapp)](https://console.wacraft.astervia.tech)
[![Get Started](https://img.shields.io/badge/-Self%20Host-3b82f6?style=for-the-badge&logo=docker)](quickstart/local.md)
[![GitHub Repo](https://img.shields.io/badge/-GitHub-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Astervia/wacraft)
[![Deploy Overview](https://img.shields.io/badge/-Deployment%20Options-6b7280?style=for-the-badge&logo=rocket)](deploy/overview.md)

> The **fastest way** to give your team an **UI & API** for the official **WhatsApp Cloud API**—powered by Go, Angular and Docker.

## ☁️ Try wacraft Console — no setup required

**[console.wacraft.astervia.tech](https://console.wacraft.astervia.tech)** is the hosted, multi-tenant wacraft platform managed by Astervia. Sign up, create a workspace, and connect your WhatsApp number in minutes — no servers, no Docker.

> **Self-hosting?** Keep reading for local and production deployment guides.

## Why wacraft? 🚀

| 🚀 **Feature**               | 💡 **Why it matters**                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| 🖥️ **Familiar UI**           | Angular front‑end that feels just like WhatsApp Web—users need **zero** training.                 |
| ⚙️ **Go‑powered backend**    | High‑performance REST + Webhook server engineered for massive scale.                              |
| 🏢 **Multi‑tenant workspaces** | Fully isolated workspaces with per‑member policy permissions for team collaboration.            |
| 📱 **Multi‑phone support**   | Attach multiple WhatsApp phone numbers to a single workspace, configured entirely through the UI. |
| 🔌 **Automation‑ready**      | Built‑in webhooks + n8n integrations. Build chatbots without writing a line of code.              |
| 💳 **Built‑in billing**      | Stripe‑powered subscription plans and per‑workspace throughput management.                        |
| 🛠️ **Open & extensible**     | MIT‑licensed—fork it, extend it, embed it.                                                        |

## ✨ Feature Highlights

### 1 — Angular UI

Manage conversations, templates, campaigns, contacts, webhooks, phone configs and workspace members in a clean interface. Check the [UI Walkthrough](guide/ui.md) to see how it works!
![Chats UI overview](assets/images/chats-ui-overview.png)

### 2 — Go API

<https://github.com/Astervia/wacraft-server>
REST & WebSocket endpoints for everything the UI does—perfect for CI/CD and custom integrations. Also includes OpenAPI specs for easy client generation.

Interactive docs available at **`/docs`** on any running server instance.

### 3 — Multi‑Tenant Workspaces

Every resource (contacts, messages, campaigns, phone numbers) is scoped to a **workspace**. Invite team members and assign granular permissions using the [policy system](guide/workspaces.md).

### 4 — Phone Config via UI

No more managing `WABA_ID` and access tokens in environment variables. Add and manage your WhatsApp phone numbers directly in the UI at `/phone-configs`. See the [Phone Config Guide](config/phone-config.md).

### 5 — Real‑time Webhooks

Receive and react to WhatsApp events the **moment** they happen. Wire them to **n8n** or any HTTP endpoint.

### 6 — Billing

Workspace owners can subscribe to throughput plans. Admins manage plans, manual subscriptions, and endpoint weights through the [Billing Admin](guide/billing.md) panel.

### 7 — And more

Check [Product Overview](guide/overview.md) and [UI Walkthrough](guide/ui.md) for a full feature tour.

## 🏁 Getting Started <a id="quick-start"></a>

### Option A — wacraft Console (hosted, zero setup)

1. Go to **[console.wacraft.astervia.tech](https://console.wacraft.astervia.tech)** and sign up.
2. Create a workspace.
3. [**Grab your Meta credentials**](config/meta-setup.md) from the Meta Developer Portal.
4. Add a phone config at **Phone Configs → New** and enter your WABA credentials.
5. [**Set up the WhatsApp webhook**](config/webhook-setup.md) to point to your Console instance.

### Option B — Self-host

1. [**Grab your Meta credentials**](config/meta-setup.md)
2. [**Create/fill your `.env`**](quickstart/local.md#1-prepare-a-minimal-env)
3. [**Run the local stack**](quickstart/local.md#2-launch-the-stack)
4. [**Configure your first phone number**](config/phone-config.md) via the UI
5. [**Setup the WhatsApp Webhooks**](quickstart/local.md)

> Already have prod infra? Jump directly to the [Fast Production Deploy](quickstart/production.md).

## ☸ Deployment Options <a id="deployment"></a>

| Scenario                        | Guide                                                |
| ------------------------------- | ---------------------------------------------------- |
| **wacraft Console (hosted)**    | [console.wacraft.astervia.tech](https://console.wacraft.astervia.tech) |
| **Local Dev**                   | [quickstart/local.md](quickstart/local.md)           |
| **Fast Production Deploy**      | [quickstart/production.md](quickstart/production.md) |
| **Production (Docker Compose)** | [deploy/docker-compose.md](deploy/docker-compose.md) |
| **Binary + Vercel Front‑end**   | [deploy/binary-vercel.md](deploy/binary-vercel.md)   |

## 🔑 Configuration Overview

| Topic                         | Guide                                      |
| ----------------------------- | ------------------------------------------ |
| Meta credentials (for phone config) | [Getting Meta Credentials](config/meta-setup.md) |
| Phone number setup (UI)       | [Phone Config](config/phone-config.md)     |
| Environment variables         | [Env Vars Reference](config/env-vars.md)   |
| Webhook setup                 | [Webhook Setup](config/webhook-setup.md)   |
| Stripe / Billing              | [Stripe Setup](config/stripe-setup.md)     |

## 💬 Need help?

- **GitHub Issues** – bug reports & feature requests
- **Consulting** – [wacraft@astervia.tech](mailto:wacraft@astervia.tech)

> Looking for v0.1.x docs? See the **v0.1.x (Legacy)** tab above.

---

σΔγ
