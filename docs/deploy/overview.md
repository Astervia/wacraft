# 🚀 Deployment Overview

Choose the flavour that fits **your scale, budget, and ops skillset**. Every
method ships the same codebase – only the packaging differs.

| Scenario                                           | Footprint           | Stack file / Guide                              | Ideal for                          |
| -------------------------------------------------- | ------------------- | ----------------------------------------------- | ---------------------------------- |
| **Quick demo / Small production / single VM prod** | 2 vCPU / 2 GB       | [Compose Stack Deployment](./docker-compose.md) | Solo founders, staging, hack‑days  |
| **No Docker, cheap VM**                            | 512 MB RAM (server) | [Binary + Vercel](../binary-vercel.md)          | Serverless believers, minimalists  |
| **Bring‑your‑own Kubernetes**                      | any                 | _Helm chart (alpha)_                            | Teams with existing K8s CI/CD      |
| **Air‑gapped / on‑prem**                           | custom              | \*Manual \*.deb / .rpm                          | Enterprises with strict compliance |

> All images are multi‑arch (x86‑64, arm64). Choose AMD 64 droplet, Apple M1 or
> Raspberry Pi ‑ the tags remain identical (e.g. `v0.1.0`).

---

## 1 — Docker Compose (recommended for most)

**Pros**: one‑liner setup, batteries included (Postgres, UI).
**Cons**: single‑host; horizontal scaling requires external DB & LB.

```bash
git clone https://github.com/Astervia/wacraft.git
cp compose.env .env
# pick lite OR prod file
docker compose -f docker-compose.yml up -d
```

Read the full guide → [Compose Stack Deployment](./docker-compose.md).

---

## 2 — Binary Server + Vercel UI

Compile (or download) the **static Go binary**, run under systemd, and host the
Angular build on Vercel’s CDN.

Guide → [Binary + Vercel](../binary-vercel.md).

---

## 3 — Helm Chart (alpha)

For teams already on **EKS, GKE, AKS**. Operator pattern, HPA examples and
private registry support are on the roadmap. Contact us if you’d like to pilot
this.

---

## 4 — Custom & Enterprise deployments

Need multi‑region HA, private VPCs, Terraform pipelines, or on‑prem
installation? **Astervia** offers hands‑on consultancy:

| Plan                                                     | What you get                                               |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| **[Plan _Supernova_ – Enterprise](../support/plans.md)** | Architecture review, infra‑as‑code, CI/CD, tailored forks. |

📩 Email **[wacraft@astervia.tech](mailto:wacraft@astervia.tech)** with your requirements and preferred cloud
( AWS / GCP / Azure / Bare‑metal ). We’ll scope and quote – remember, we **do
not sell licences**; donations unlock the service tier and source‑access.

---

## Decision tree

1. **Need it live in 10 min?** → Docker Compose Lite.
2. **Already have Vercel + VM?** → Binary + Vercel.
3. **You’re a DevOps team on K8s?** → Helm.
4. **Compliance or exotic scale?** → Contact us.

Happy shipping 🔧
