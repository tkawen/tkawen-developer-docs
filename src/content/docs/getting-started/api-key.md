---
title: Get an API key
description: Create an account and get a free sandbox API key in 60 seconds — no credit card required.
---

## In 60 seconds

1. Go to **[id.tkawen.com/signup](https://id.tkawen.com/signup)**
2. Sign up with email + phone (SMS verification, free)
3. Confirm your email, then sign in to the developer dashboard
4. Click **"Create API key"** — you get two keys back:
   - `pk_sandbox_...` (publishable, safe for client-side use)
   - `sk_sandbox_...` (secret, never expose publicly)

## Store it safely

```bash
# ~/.bashrc or your project's environment
export TKAWEN_KEY="sk_sandbox_xxxxxxxxxxxxxxxxxxxxxxxx"
```

## Verify it works

```bash
curl -H "Authorization: Bearer $TKAWEN_KEY" \
     https://api.tkawen.com/v1/identity/me
```

Expected response:

```json
{
  "key_id": "ak_xxx",
  "mode": "sandbox",
  "owner": "your-email@example.com",
  "quota": { "calls_this_month": 0, "limit": 1000 }
}
```

## What next?

- **[Make your first call](/getting-started/first-call/)** — create a video room, send an SMS, verify an identity
- **[Browse the seven pillars](/pillars/identity/)** — each pillar has dedicated reference docs
