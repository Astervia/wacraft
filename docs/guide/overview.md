# 📖 Product Overview (Usage Guide)

Welcome to **wacraft** – an open‑source WhatsApp Cloud Platform that bundles a
battle‑ready API, modern Angular UI, automation nodes for Node‑RED and optional
cloud tooling. This page gives you the **big‑picture** before you dive into the
feature‑specific guides.

## What’s in the box?

| Layer           | Component                                | Purpose                                                                                                                            |
| --------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **API Server**  | `wacraft‑server` / `wacraft‑server‑lite` | Go REST service that proxies the WhatsApp Cloud API, stores state in PostgreSQL and exposes webhooks, RBAC, campaigns & analytics. |
| **Web UI**      | `wacraft‑client`                         | Angular 17 SPA for operators: chats, templates, campaigns, users, settings. Tailwind + Angular Material, fully keyboard‑driven.    |
| **Automations** | `wacraft‑nodered`                        | Pre‑built Node‑RED with custom nodes to orchestrate flows – trigger on inbound messages, call 3rd‑party APIs, send replies.        |
| **Docs**        | (this site)                              | Developer & operator handbook. Hosting‑agnostic deployment recipes, usage walkthroughs and API reference.                          |

> **Open‑core**: All core functionality is MIT‑licensed. “Supporter” tiers unlock
> extra features (analytics dashboards, premium nodes, advanced campaigns).

## API Reference

Interactive REST docs live under **`/docs`** of any running server instance.

_Example:_ `https://api.example.com/docs`

- Built with **Swagger UI** / OpenAPI 3.1 – try calls right from the browser.
- Endpoints are versioned; breaking changes bump the API major (e.g. `/v1`).
- Models reuse the server’s Go structs, so the JSON is always up‑to‑date.
- Use the auth endpoints do copy your `token` and make requests from the browser. If you are using the Swagger UI, remember to put `Bearer` before the token.

## Internationalisation (i18n)

The UI ships with two maintained locales:

| Path     | Language                          |
| -------- | --------------------------------- |
| `/en`    | **English** 🇺🇸 – default fallback |
| `/pt-BR` | **Português (Brasil)** 🇧🇷         |

Just append the locale to the base URL:

```text
https://app.example.com/en        # English UI
https://app.example.com/pt-BR     # Portuguese UI
```

> **Contribute translations!** PRs for additional locales are welcome!

## Where to next?

| Task                     | Guide                                         |
| ------------------------ | --------------------------------------------- |
| Check UI features        | [UI Walkthrough](./ui.md)                     |
| Local / single‑VM deploy | [Docker Compose](../deploy/docker-compose.md) |
| Minimal VM + Vercel CDN  | [Binary + Vercel](../deploy/binary-vercel.md) |
| Node‑RED automations     | [Node‑RED integration](../deploy/node-red.md) |
| All deployment options   | [Deployment overview](../deploy/overview.md)  |

Need bespoke hosting or feature forks? **Astervia** provides consultancy –
email [wacraft@astervia.tech](mailto:wacraft@astervia.tech) to scope a custom deployment.

Happy building 🚀
