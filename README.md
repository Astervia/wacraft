# 📘 wacraft Documentation

This repository contains the **official documentation** for the [wacraft](https://github.com/Astervia/wacraft) platform — an open-source UI and API wrapper for the WhatsApp Cloud API, developed and maintained by **Astervia**.

> 🧭 Live site: [https://wacraft.astervia.tech](https://wacraft.astervia.tech)

---

## 📚 What’s inside

- **Getting started**: Local setup, environment, production options
- **Deployment**: Docker, binaries, Vercel, and cloud guides
- **UI walkthrough**: Learn how to chat, send campaigns, and automate
- **Node-RED**: Native support with custom flow nodes
- **API reference**: Auto-generated docs from OpenAPI (`/docs`)
- **Plans & consulting**: Donation model, supporter perks, expert help
- **Much more!**

---

## 🚀 Run (this documentation) locally

If you want to run the project instead, check the live docs at [https://wacraft.astervia.tech](https://wacraft.astervia.tech).

```bash
# Install dependencies
pip install mkdocs-material

# Serve the docs locally
mkdocs serve

# Open: http://127.0.0.1:8000
```

---

## Publish to GitHub Pages

You need to have `ghp-import` installed to publish the documentation to GitHub Pages. Do it with `pip install ghp-import`.

```bash
mkdocs build
ghp-import -n -p -f site -c wacraft.astervia.tech
```

---

## 🎨 Philosophy

**wacraft** is open-core. Software is art — we don’t sell code.
Instead, you can support development via donation tiers that unlock:

- Premium server features
- Node-RED modules
- Docker images
- Consulting hours

More info: [support/plans.md](docs/support/plans.md)

---

## 🧭 Hosted at

> 📍 [https://wacraft.astervia.tech](https://wacraft.astervia.tech)

Hosted using [MkDocs Material](https://squidfunk.github.io/mkdocs-material/), built automatically via CI.

---

## 📨 Support & contact

Questions? Custom deployments? Payment stuck in Meta?
→ Email us: **[wacraft@astervia.tech](mailto:wacraft@astervia.tech)**
