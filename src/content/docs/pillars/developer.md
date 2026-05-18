---
title: 07 · Developer
description: TKAWEN Developer Cloud — unified gateway, 4 SDKs, OpenAPI 3.1, free sandbox, public status.
---

## Overview

**TKAWEN Developer Cloud** is the meta-layer — the tools you use to manage your usage of the other six pillars:

- **API Gateway** — `api.tkawen.com`, one unified entry (no 7 disjoint endpoints)
- **API Keys** — issue, rotate, scope per pillar
- **Usage + Billing** — current consumption in your billing currency
- **Webhooks** — one place to manage event subscriptions
- **SDKs** — JavaScript, PHP, Python, Go (all MIT, open source)
- **Status + SLA** — [status.tkawen.com](https://status.tkawen.com)
- **Sandbox** — free, isolated, identical to production

Replaces **AWS console, Vercel dashboard, Cloudflare developer tools**.

## Quick start

```bash
# Health check (no auth)
curl https://api.tkawen.com/v1/health
# → {"status":"ok","version":"1.0.42","region":"global"}

# Your current usage
curl -H "Authorization: Bearer $TKAWEN_KEY" \
     https://api.tkawen.com/v1/usage
```

Response:

```json
{
  "period": "2026-05",
  "by_pillar": {
    "identity":  { "calls": 1247, "cost": 6.24 },
    "connect":   { "calls": 892,  "cost": 13.40 },
    "pay":       { "calls": 156,  "cost": 0 },
    "commerce":  { "calls": 4521, "cost": 0.99 },
    "knowledge": { "calls": 88,   "cost": 4.40 },
    "logistics": { "calls": 234,  "cost": 14.50 }
  },
  "total": 39.53,
  "currency": "USD",
  "plan": "builder",
  "next_invoice_date": "2026-06-01"
}
```

## Endpoints

### Health + usage
| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/health` | Health check (no auth) |
| `GET` | `/v1/usage` | Current month usage + cost |
| `GET` | `/v1/usage/history` | Monthly history (12 months) |
| `GET` | `/v1/billing` | Upcoming + past invoices |

### API keys
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/keys` | Create a new key |
| `GET` | `/v1/keys` | List your keys |
| `POST` | `/v1/keys/{id}/rotate` | Rotate |
| `DELETE` | `/v1/keys/{id}` | Revoke |
| `PATCH` | `/v1/keys/{id}/scope` | Scope (e.g., identity-only) |

### Webhooks
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/webhooks` | Create webhook |
| `GET` | `/v1/webhooks` | List webhooks |
| `POST` | `/v1/webhooks/{id}/test` | Send a test event |
| `GET` | `/v1/webhooks/{id}/deliveries` | Last 100 delivery attempts |

## Pricing

**Developer Cloud is free.** You only pay for usage of the other six pillars.

## Official SDKs

| Language | Install | Repository |
|----------|---------|------------|
| **JavaScript / TypeScript** | `npm install @tkawen/sdk` | [github.com/liqaa-cloud](https://github.com/liqaa-cloud) |
| **PHP / Laravel** | `composer require tkawen/sdk` | [github.com/liqaa-cloud](https://github.com/liqaa-cloud) |
| **Python** | `pip install tkawen` | [github.com/liqaa-cloud](https://github.com/liqaa-cloud) |
| **Go** | `go get github.com/liqaa-cloud/tkawen-go` | [github.com/liqaa-cloud](https://github.com/liqaa-cloud) |

All under MIT, identical method signatures across languages.

## Sandbox vs production

| Environment | Key prefix | Data | Limits | Billing |
|-------------|------------|------|--------|---------|
| **Sandbox** | `sk_sandbox_...` | Mock, wiped weekly | 1,000 calls / month | Free |
| **Production** | `sk_live_...` | Real | Per your plan | In your currency |

Use Sandbox for development, switch to Production at launch.

## OpenAPI spec

All seven pillars are documented in OpenAPI 3.1:

```
https://api.tkawen.com/openapi.json
https://api.tkawen.com/openapi.yaml
```

Use it to:

- Generate SDKs for any language (Swagger Codegen)
- Import into Postman / Insomnia / Bruno
- Generate mock servers (Prism, Mockoon)

## Webhook signature verification

Every webhook is signed with HMAC-SHA256:

```javascript
import crypto from 'crypto';

function verify(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(`sha256=${expected}`),
    Buffer.from(signature)
  );
}
```

```php
function verify($payload, $signature, $secret) {
    $expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    return hash_equals($expected, $signature);
}
```

## SLA + status

- **status.tkawen.com** — live status for every pillar + upstream dependencies
- **Status API** — `GET https://status.tkawen.com/api` (JSON, live)
- **Subscribe** — RSS / Atom feed + SMS / email for declared incidents

## Discord community

[discord.gg/tkawen](https://discord.gg/tkawen) — ask, answer, get help from the team and community. Channels in English, French, and Arabic.

## Issues + feature requests

Every repository accepts issues:

- [github.com/liqaa-cloud](https://github.com/liqaa-cloud) — SDKs and specs
- [github.com/hartemyaakoub](https://github.com/hartemyaakoub) — flagship projects

## Related

- Live status: [status.tkawen.com](https://status.tkawen.com)
- Repositories: [github.com/liqaa-cloud](https://github.com/liqaa-cloud)
- Founder: [hartem.tkawen.com](https://hartem.tkawen.com)
