---
title: 03 · الدفع
description: TKAWEN Pay — تحصيل بالدينار، تسوية بالدينار، التزام بـ DGI و CCP.
---

## نظرة عامّة

**TKAWEN Pay** يحلّ مشكلة الدفع الجزائريّ بالكامل:

- **بطاقات** عبر شراكة Chargily (EDAHABIA + CIB)
- **CCP** — تكامل مع البريد الجزائريّ
- **Cash on Delivery** — تنسيق مع TKAWEN Logistics
- **فاتورة DGI** — توليد PDF متوافق مع جبائة + e-facture
- **اشتراكات متكرّرة** — recurring billing
- **تسوية** — يومياً إلى حسابك البنكيّ الجزائريّ

يحلّ محلّ **Stripe، Paddle، Recurly** للسوق الجزائريّ.

:::caution
المعالجة بالدينار **حصراً**. لـ MENA متعدّد العملات، استخدم [TKAWEN Commerce](/pillars/commerce/) الذي يدعم 13 عملة.
:::

## البدء السريع

```bash
# أنشئ checkout link
curl -X POST https://api.tkawen.com/v1/pay/checkouts \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25000,
    "currency": "DZD",
    "description": "اشتراك PharmaPro سنوي",
    "success_url": "https://your-app.com/success",
    "cancel_url": "https://your-app.com/cancel",
    "methods": ["card", "ccp"]
  }'
```

ردّ:

```json
{
  "checkout_id": "co_8xk29d",
  "checkout_url": "https://pay.tkawen.com/co_8xk29d",
  "expires_at": "2026-05-18T17:30:00Z",
  "amount": 25000,
  "currency": "DZD"
}
```

## النقاط الرئيسيّة

| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/pay/checkouts` | إنشاء رابط دفع |
| `GET` | `/v1/pay/checkouts/{id}` | حالة الـ checkout |
| `POST` | `/v1/pay/charges` | تحصيل مباشر (بدون UI) |
| `GET` | `/v1/pay/transactions/{id}` | تفاصيل عمليّة |
| `POST` | `/v1/pay/refunds` | استرجاع مبلغ |
| `POST` | `/v1/pay/subscriptions` | اشتراك متكرّر |
| `POST` | `/v1/pay/invoices` | توليد فاتورة DGI PDF |
| `GET` | `/v1/pay/settlements` | كشف التسويات اليوميّة |

## التسعير (الرسوم)

| العمليّة | الرسم |
|----------|------|
| بطاقة EDAHABIA / CIB | **1.8%** + 50 DZD |
| CCP transfer | **70 DZD** ثابت |
| Cash on Delivery (مع Track) | **2%** |
| Refund | مجاناً (يُسترَدّ الرسم) |
| فاتورة DGI PDF | مجاناً |
| تسوية يوميّة | مجاناً (>50k DZD/يوم) |

**خصم الحجم:** فوق 10M DZD/شهر = 1.2%. تواصل لـ Enterprise rate.

## أمثلة بـ SDK

```javascript
const checkout = await tk.pay.checkouts.create({
  amount: 25000,
  currency: 'DZD',
  description: 'اشتراك سنوي',
  successUrl: 'https://your-app.com/success',
  methods: ['card', 'ccp'],
});
res.redirect(checkout.checkoutUrl);
```

```php
$checkout = $tk->pay->checkouts->create([
    'amount'      => 25000,
    'currency'    => 'DZD',
    'description' => 'اشتراك سنوي',
    'success_url' => 'https://your-app.com/success',
    'methods'     => ['card', 'ccp'],
]);
return redirect($checkout->checkout_url);
```

```python
checkout = tk.pay.checkouts.create(
    amount=25000, currency='DZD',
    description='اشتراك سنوي',
    success_url='https://your-app.com/success',
    methods=['card', 'ccp'],
)
return redirect(checkout.checkout_url)
```

## اشتراكات متكرّرة

```bash
curl -X POST https://api.tkawen.com/v1/pay/subscriptions \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "customer_id": "cus_8xk2",
    "plan": "pharmapro_standard",
    "amount": 60000,
    "interval": "year",
    "trial_days": 15
  }'
```

تجديد تلقائيّ، إشعار قبل 7 أيّام، إلغاء self-service.

## فاتورة DGI

```bash
curl -X POST https://api.tkawen.com/v1/pay/invoices \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "transaction_id": "tx_8xk2",
    "include_tva": true,
    "language": "ar"
  }'
```

PDF متوافق مع جبائة، صالح للإيداع لدى مفتّش الضرائب.

## Webhooks

```
checkout.completed   checkout.expired
charge.succeeded     charge.failed
refund.completed     refund.failed
subscription.created subscription.cancelled
subscription.renewed subscription.payment_failed
invoice.generated
```

## الحدود + SLA

- **Rate limit:** 100 checkout/min، 50 charge/sec
- **Latency p99:** <2s للـ checkout، <5s للـ charge
- **Reconciliation:** يوميّاً 02:00 جزائر، إيداع البنك خلال 24 ساعة

## امتثال + قانون

- **DGI** — كلّ فاتورة قابلة للتدقيق
- **Banque d'Algérie** — تسويات بالدينار حصراً
- **ASEP** — مزوّد دفع إلكترونيّ معتمَد
- **PCI DSS** — البطاقات عبر Chargily (PCI-Level 1)

## روابط

- شريك الدفع: [Chargily.com](https://chargily.com)
- التالي: [04 · التجارة](/pillars/commerce/)
