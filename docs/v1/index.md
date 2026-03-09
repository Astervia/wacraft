# **wacraft** v0.1.x <small>Build WhatsApp Cloud apps in minutes</small>

> **You are reading the v0.1.x (Legacy) documentation.** For the latest features including workspaces, multi-tenant support, and billing, see the [v0.2.x docs](../index.md).

[![Get Started](https://img.shields.io/badge/-Get%20Started-3b82f6?style=for-the-badge&logo=whatsapp)](quickstart/local.md)
[![GitHub Repo](https://img.shields.io/badge/-GitHub-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Astervia/wacraft)
[![Docker Images](https://img.shields.io/badge/-Docker-0d63a5?style=for-the-badge&logo=docker&logoColor=white)](#deployment)
[![Deploy Overview](https://img.shields.io/badge/-Deployment%20Options-6b7280?style=for-the-badge&logo=rocket)](deploy/overview.md)

> The **fastest way** to give your team an **UI & API** for the official **WhatsApp Cloud API**—powered by Go, Angular and Docker.

## Why wacraft? 🚀

| 🚀 **Feature**            | 💡 **Why it matters**                                                             |
| ------------------------- | --------------------------------------------------------------------------------- |
| 🖥️ **Familiar UI**        | Angular front‑end that feels just like WhatsApp Web—users need **zero** training. |
| ⚙️ **Go‑powered backend** | High‑performance REST + Webhook server engineered for massive scale.              |
| 🔌 **Automation‑ready**   | One‑line integrations with workflow engines like **Node‑RED** or **n8n**.         |
| 🛠️ **Open & extensible**  | MIT‑licensed—fork it, extend it, embed it.                                        |
| ❤️ **Community‑driven**   | Extra features & priority support available via donation plans.                   |

## ✨ Feature Highlights

### 1 — Angular UI

Manage conversations, templates, contacts, webhooks and users in a clean interface. Check the [UI Walkthrough](guide/ui.md) to see how it works!
![Chats UI overview](../assets/images/chats-ui-overview.png)

### 2 — Go API

<https://github.com/Astervia/wacraft-server>
REST & WebSocket endpoints for everything the UI does—perfect for CI/CD and custom integrations. Also includes OpenAPI specs for easy client generation.

### 3 — Real‑time Webhooks

Receive and react to WhatsApp events the **moment** they happen.

### 4 — Automation Tools

Drag‑and‑drop flows for Node‑RED or n8n let non‑devs build chatbots in minutes.

### 5 - And more

Check [Product Overview](guide/overview.md) and [UI Walkthrough](guide/ui.md) for a list of features and how they work.

## 🏁 Getting Started <a id="quick-start"></a>

1. [**Grab your Meta credentials**](config/meta-setup.md)
2. [**Create/fill your `.env`**](quickstart/local.md#1-prepare-a-minimal-env) (copy the _Minimal Dev_ block)
3. [**Run the local stack**](quickstart/local.md#2-launch-the-stack)
4. [**Setup the WhatsApp Webhooks**](quickstart/local.md#3-expose-an-https-webhook)

> Already have prod infra? Jump directly to the [Fast Production Deploy](quickstart/production.md).

## ☸ Deployment Options <a id="deployment"></a>

| Scenario                        | Guide                                                |
| ------------------------------- | ---------------------------------------------------- |
| **Local Dev**                   | [quickstart/local.md](quickstart/local.md)           |
| **Fast Production Deploy**      | [quickstart/production.md](quickstart/production.md) |
| **Production (Docker Compose)** | [deploy/docker-compose.md](deploy/docker-compose.md) |
| **Binary + Vercel Front‑end**   | [deploy/binary-vercel.md](deploy/binary-vercel.md)   |
| **Node‑RED Integration**        | [deploy/node-red.md](deploy/node-red.md)             |

You can also hit [Deploy Overview](deploy/overview.md) to see a full list of deployment options and choose what works best for you.

## 🔑 Configuration Overview

All config happens via **environment variables**. Check [Getting Meta Credentials](config/meta-setup.md) to setup your Meta application and see the [Environment Variables Reference](config/env-vars.md) for the full table.

## 💬 Need help?

- **GitHub Issues** – bug reports & feature requests
- **Unlock new features / Consulting** – [wacraft@astervia.tech](mailto:wacraft@astervia.tech)

---

σΔγ
