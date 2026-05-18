---
title: 07 · للمطوّرين
description: TKAWEN Developer Cloud — API gateway موحَّدة، 4 SDKs، Sandbox مجاني، docs بالعربية.
---

## نظرة عامّة

**TKAWEN Developer Cloud** هو الطبقة الميتا — الأدوات التي تستخدمها لإدارة استخدامك للطبقات الستّ الأخرى:

- **API Gateway** — `api.tkawen.com` بوّابة موحَّدة (لا 7 endpoints منفصلة)
- **API Keys** — إدارة، تدوير، تقييد scope
- **Usage + Billing** — استهلاكك الحاليّ + التاريخيّ بالدينار
- **Webhooks** — إدارة كلّ المشتركات في حدث واحد
- **SDKs** — JavaScript، PHP، Python، Go (كلّها مفتوحة المصدر MIT)
- **Status + SLA** — [status.tkawen.com](https://status.tkawen.com)
- **Sandbox** — بيئة معزولة مجاناً للتجريب

يحلّ محلّ **AWS console، Vercel dashboard، Cloudflare developer tools**.

## البدء السريع

```bash
# فحص الصحّة
curl https://api.tkawen.com/v1/health
# → {"status":"ok","version":"1.0.42","region":"dz-1"}

# استهلاكك الحاليّ
curl -H "Authorization: Bearer $TKAWEN_KEY" \
     https://api.tkawen.com/v1/usage
```

ردّ:

```json
{
  "period": "2026-05",
  "by_pillar": {
    "identity":  { "calls": 1247, "cost_dzd": 623.50 },
    "connect":   { "calls": 892, "cost_dzd": 1340.00 },
    "pay":       { "calls": 156, "cost_dzd": 0 },
    "commerce":  { "calls": 4521, "cost_dzd": 99.00 },
    "knowledge": { "calls": 88, "cost_dzd": 440.00 },
    "logistics": { "calls": 234, "cost_dzd": 1450.00 }
  },
  "total_dzd": 3952.50,
  "plan": "builder",
  "next_invoice_date": "2026-06-01"
}
```

## النقاط الرئيسيّة

### Health + Usage
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `GET` | `/v1/health` | فحص الصحّة (no auth) |
| `GET` | `/v1/usage` | استهلاكك الحاليّ بالدينار |
| `GET` | `/v1/usage/history` | تاريخ شهريّ (12 شهر) |
| `GET` | `/v1/billing` | فواتيرك القادمة + الحاليّة |

### API Keys
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/keys` | إنشاء key جديد |
| `GET` | `/v1/keys` | كلّ الـ keys |
| `POST` | `/v1/keys/{id}/rotate` | تدوير |
| `DELETE` | `/v1/keys/{id}` | إبطال |
| `PATCH` | `/v1/keys/{id}/scope` | تقييد scope (مثلاً: identity فقط) |

### Webhooks
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/webhooks` | إنشاء webhook |
| `GET` | `/v1/webhooks` | كلّ الـ webhooks |
| `POST` | `/v1/webhooks/{id}/test` | إرسال event وهميّ |
| `GET` | `/v1/webhooks/{id}/deliveries` | تاريخ التسليمات الـ 100 الأخيرة |

## التسعير

**Developer Cloud نفسه مجاناً.** أنت تدفع فقط مقابل استخدام الطبقات الستّ الأخرى.

## SDKs الرسميّة

| اللغة | الحزمة | المستودع |
|------|--------|-----------|
| **JavaScript / TypeScript** | `npm install @tkawen/sdk` | [github.com/liqaa-cloud/tkawen-js](https://github.com/liqaa-cloud) |
| **PHP / Laravel** | `composer require tkawen/sdk` | [github.com/liqaa-cloud/tkawen-php](https://github.com/liqaa-cloud) |
| **Python** | `pip install tkawen` | [github.com/liqaa-cloud/tkawen-python](https://github.com/liqaa-cloud) |
| **Go** | `go get github.com/liqaa-cloud/tkawen-go` | [github.com/liqaa-cloud](https://github.com/liqaa-cloud) |

كلّها MIT، نفس الـ method signatures عبر اللغات الأربع.

## Sandbox vs Production

| البيئة | الـ key prefix | البيانات | الحدود | الفوترة |
|--------|---------------|---------|--------|---------|
| **Sandbox** | `sk_sandbox_...` | وهميّة، تُمسح أسبوعياً | 1,000 call/شهر | مجاناً |
| **Production** | `sk_live_...` | حقيقيّة | حسب الـ plan | بالدينار |

استخدم Sandbox للتطوير، انتقل إلى Production عند الإطلاق.

## OpenAPI Spec

كلّ الطبقات السبع موثَّقة بـ OpenAPI 3.1 على:

```
https://api.tkawen.com/openapi.json
https://api.tkawen.com/openapi.yaml
```

استخدمها لـ:
- توليد SDKs لأيّ لغة (Swagger Codegen)
- استيراد إلى Postman / Insomnia / Bruno
- توليد mock servers (Prism, Mockoon)

## Webhook Signature Verification

كلّ webhook موقَّع بـ HMAC-SHA256:

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

## SLA + Status

- **status.tkawen.com** — صفحة الحالة الحيّة لكلّ الطبقات السبع + التابعين
- **Status API** — `GET https://status.tkawen.com/api` (JSON live)
- **Subscribe** — RSS/Atom feed + SMS/Email للحوادث المعلَنة

## Discord Community

[discord.gg/tkawen](https://discord.gg/tkawen) — مكان السؤال، الإجابة من الفريق + المجتمع. قنوات بالعربية + الفرنسية + الإنجليزية.

## Issues + Feature Requests

كلّ المستودعات تقبل issues:
- [github.com/liqaa-cloud](https://github.com/liqaa-cloud) — للـ SDKs والمواصفات
- [github.com/hartemyaakoub](https://github.com/hartemyaakoub) — للمشاريع الرئيسيّة

## روابط

- الحالة الحيّة: [status.tkawen.com](https://status.tkawen.com)
- المستودعات: [github.com/liqaa-cloud](https://github.com/liqaa-cloud)
- المؤسّس: [hartem.tkawen.com](https://hartem.tkawen.com)
