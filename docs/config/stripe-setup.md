# 💳 Stripe / Billing Setup

This guide walks you through configuring Stripe for wacraft's billing system. Billing is **optional** — the server runs fine without it.

## Overview

wacraft's billing system lets you:

- Create **throughput plans** (request limits per time window)
- Sell subscriptions via **Stripe Checkout** (one‑time or recurring)
- Allow users to manage plans at `/billing`
- Let admins manage plans, manual subscriptions, and endpoint weights at `/billing-admin`

See [Billing Guide](../guide/billing.md) for UI screenshots and a user‑facing walkthrough.

## Prerequisites

- A [Stripe account](https://stripe.com)
- wacraft‑server deployed or running locally

## 1 — Get Your Stripe API Keys

1. Log in to the [Stripe Dashboard](https://dashboard.stripe.com).
2. Make sure you're in **Test mode** while setting up.
3. Go to **Developers > API keys**.
4. Copy your **Secret key** (starts with `sk_test_` in test mode, `sk_live_` in production).

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

> **Never expose your secret key in client‑side code or commit it to version control.**

## 2 — Create a Webhook Endpoint in Stripe

The server listens for Stripe events at `POST /billing/webhook/stripe`.

1. Go to **Developers > Webhooks** in Stripe Dashboard.
2. Click **Add endpoint**.
3. Enter your endpoint URL:
    - Production: `https://api.example.com/billing/webhook/stripe`
    - Local: use the [Stripe CLI](#5-local-development) to forward events
4. Select the following events:
    - `checkout.session.completed` — activates subscriptions after payment
    - `invoice.paid` — handles recurring subscription renewals
    - `customer.subscription.deleted` — marks subscriptions as cancelled
    - `customer.subscription.updated` — logged for observability
5. Click **Add endpoint** and copy the **Signing secret** (`whsec_...`).

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here
```

## 3 — Configure Environment Variables

```env
# Enable billing enforcement
BILLING_ENABLED=true

# Stripe credentials
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here

# Default free plan (optional – these are the defaults)
DEFAULT_FREE_PLAN_THROUGHPUT=100
DEFAULT_FREE_PLAN_WINDOW=60
```

### Variable Reference

| Variable                       | Required | Default | Description                                            |
| ------------------------------ | -------- | ------- | ------------------------------------------------------ |
| `BILLING_ENABLED`              | No       | `false` | Set to `true` to enforce throughput limits             |
| `STRIPE_SECRET_KEY`            | No       | —       | Stripe API secret key. Required for checkout.          |
| `STRIPE_WEBHOOK_SECRET`        | No       | —       | Stripe webhook signing secret.                         |
| `DEFAULT_FREE_PLAN_THROUGHPUT` | No       | `100`   | Default free plan requests per window                  |
| `DEFAULT_FREE_PLAN_WINDOW`     | No       | `60`    | Default free plan window duration in seconds           |

> If `STRIPE_SECRET_KEY` is not set, checkout endpoints return `503`. Billing API routes (plans, subscriptions, usage) still work so admins can create plans before enabling payments.

## 4 — Create Plans via Admin UI

After starting the server with billing enabled, log in as an admin and navigate to `/billing-admin`.

Use the **Plan Management** section to create plans with:
- Name and slug
- Price (with currency)
- Throughput limit (requests per window)
- Duration in days

See [Billing Admin Guide](../guide/billing.md) for details.

## 5 — Local Development

Stripe can't send webhooks to `localhost`. Use the Stripe CLI to forward events.

### Install the Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux (Debian/Ubuntu)
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe
```

### Forward webhooks

```bash
stripe login
stripe listen --forward-to localhost:6900/billing/webhook/stripe
```

The CLI prints a webhook signing secret — use it as `STRIPE_WEBHOOK_SECRET` for local development.

## 6 — Test Cards

On the Stripe Checkout page, use these test card numbers:

| Scenario           | Card Number           | Expiry          | CVC          |
| ------------------ | --------------------- | --------------- | ------------ |
| Successful payment | `4242 4242 4242 4242` | Any future date | Any 3 digits |
| Declined           | `4000 0000 0000 0002` | Any future date | Any 3 digits |
| Requires 3DS auth  | `4000 0025 0000 3155` | Any future date | Any 3 digits |

## 7 — Production Checklist

- [ ] Switch from test keys to live keys (`sk_live_`, `whsec_` from production endpoint).
- [ ] Create a new Stripe webhook endpoint pointing to your production URL.
- [ ] Select all required events in Stripe webhook settings.
- [ ] Update environment variables with production values.
- [ ] Set `BILLING_ENABLED=true`.
- [ ] Create your production plans via the admin UI.
- [ ] Store `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in a secrets manager.

## Troubleshooting

| Problem | Cause / Solution |
| ------- | ---------------- |
| Checkout returns `503` | `STRIPE_SECRET_KEY` is not set. Restart the server after setting it. |
| Webhook returns `400` | `STRIPE_WEBHOOK_SECRET` is wrong. Dashboard and CLI secrets are different. |
| Subscription not activated | Check Stripe Dashboard > Webhooks for failed delivery. Check server logs. |
| Subscription renews but `expires_at` not updated | Ensure `invoice.paid` is selected in your Stripe webhook events. |
