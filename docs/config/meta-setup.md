# Getting Meta Credentials

> Collect the **four** variables wacraft needs to talk to WhatsApp Cloud API:
> `META_APP_SECRET`, `WABA_ACCOUNT_ID`, `WABA_ID` and **`WABA_ACCESS_TOKEN`** (permanent).

## 1 — Create a Business‑type Meta App & copy `META_APP_SECRET`

1. Go to <https://developers.facebook.com>, click **My Apps → Create App**, select **Business** and finish the wizard.
2. In the new app, open **Settings → Basic**. Hit **Show** next to **App Secret**, enter your Facebook password and copy the value.

```env
META_APP_SECRET=PASTE_ME
```

## 2 — Enable WhatsApp & grab `WABA_ACCOUNT_ID`

1. In the left menu choose **WhatsApp → API Setup**. Finish the sandbox step that verifies a personal number. ([Facebook Developers][1])
2. After verification, a blue panel shows your **WhatsApp Business Account ID** — copy this string. ([Facebook Developers][3])

```env
WABA_ACCOUNT_ID=PASTE_ME
```

_(You can always find it again in **Business Settings → Accounts → WhatsApp Accounts**.)_

## 3 — Find the Phone Number ID (`WABA_ID`)

### Option A — Dashboard

Right below your sandbox number on the **API Setup** screen you’ll see **Phone Number ID**. Copy it. ([Facebook Developers][4])

### Option B — Graph API

```bash
curl -H "Authorization: Bearer <TEMP_OR_PERM_TOKEN>" \
  "https://graph.facebook.com/v19.0/<WABA_ACCOUNT_ID>/phone_numbers?fields=id,display_phone_number"
```

The returned `id` is the **Phone Number ID**. ([Facebook Developers][5])

```env
WABA_ID=PASTE_ME
```

## 4 — Generate a Permanent `WABA_ACCESS_TOKEN`

Short‑lived sandbox tokens expire after 24 h; create a never‑expiring one via **System Users**.

1. Open **Business Settings** (nine‑dot launcher → *Business Settings*). ([Facebook Developers][6])
2. Under **Users**, select **System Users** → **Add** → choose **Admin**. ([Facebook Developers][6])
3. With the new system user selected, click **Add Assets** and grant _Full Control_ to **both** your **App** and your **WhatsApp Business Account**. ([Facebook Developers][6])
4. Press **Generate Token**, pick your app, tick scopes **`whatsapp_business_messaging`** and **`whatsapp_business_management`**, then generate. ([Stack Overflow][7])
5. Copy the token shown once and store it safely as `WABA_ACCESS_TOKEN`.

```env
WABA_ACCESS_TOKEN=PASTE_ME   # never expires
```

> **Keep it secret!** Anyone with this token can message from your number. Rotate only via System Users. ([Facebook Developers][6])

## ✅ Checklist

| Variable            | Where you found it                                    |
| ------------------- | ----------------------------------------------------- |
| `META_APP_SECRET`   | **App Dashboard → Settings → Basic → App Secret**     |
| `WABA_ACCOUNT_ID`   | **WhatsApp API Setup banner**                         |
| `WABA_ID`           | **Phone Number ID** line _or_ Graph API call          |
| `WABA_ACCESS_TOKEN` | **Business Settings → System Users → Generate Token** |

> **Next page:** [Env Vars Overview](./env-vars.md) — configure all environment variables.

[1]: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/?utm_source=chatgpt.com "Get Started - Cloud API - Meta for Developers - Facebook"
[3]: https://developers.facebook.com/docs/marketing-api/reference/business/owned_whatsapp_business_accounts/?utm_source=chatgpt.com "Business Owned Whatsapp Business Accounts - Meta for Developers"
[4]: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers/?utm_source=chatgpt.com "Phone Numbers - Cloud API - Meta for Developers"
[5]: https://developers.facebook.com/docs/whatsapp/business-management-api/manage-phone-numbers/?utm_source=chatgpt.com "Retrieve Phone Numbers - WhatsApp Business Management API"
[6]: https://developers.facebook.com/blog/post/2022/12/05/auth-tokens/?utm_source=chatgpt.com "Using Authorization Tokens for the WhatsApp Business Platform"
[7]: https://stackoverflow.com/questions/72685327/how-to-get-permanent-token-for-using-whatsapp-cloud-api?utm_source=chatgpt.com "How to get permanent token for using whatsapp cloud api?"
