---
title: 03 · Pay
description: TKAWEN Pay — cards, wallets, transfers, and recurring billing in 13 currencies.
---

## Overview

**TKAWEN Pay** handles the full payment stack:

- **Cards** — major networks via global processor partners
- **Wallets** — Apple Pay, Google Pay, regional wallets
- **Bank transfers** — SEPA, ACH, local rails per market
- **Recurring billing** — subscriptions, trials, retries
- **Multi-currency** — 13 currencies, automatic FX conversion
- **Invoicing** — tax-compliant PDF generation per region
- **Settlements** — daily payout to your bank in your chosen currency

Replaces **Stripe, Paddle, Recurly**.

## Quick start

```bash
# Create a checkout link
curl -X POST https://api.tkawen.com/v1/pay/checkouts \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2900,
    "currency": "USD",
    "description": "Pro subscription · annual",
    "success_url": "https://your-app.com/success",
    "cancel_url": "https://your-app.com/cancel",
    "methods": ["card", "wallet", "transfer"]
  }'
```

Response:

```json
{
  "checkout_id": "co_8xk29d",
  "checkout_url": "https://pay.tkawen.com/co_8xk29d",
  "expires_at": "2026-05-18T17:30:00Z",
  "amount": 2900,
  "currency": "USD"
}
```

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/pay/checkouts` | Create a hosted checkout |
| `GET` | `/v1/pay/checkouts/{id}` | Checkout state |
| `POST` | `/v1/pay/charges` | Direct charge (no UI) |
| `GET` | `/v1/pay/transactions/{id}` | Transaction details |
| `POST` | `/v1/pay/refunds` | Issue a refund |
| `POST` | `/v1/pay/subscriptions` | Recurring subscription |
| `POST` | `/v1/pay/invoices` | Generate tax-compliant PDF invoice |
| `GET` | `/v1/pay/settlements` | Daily settlement statements |

## Pricing (processing fees)

| Method | Fee |
|--------|-----|
| Card payments | **2.9% + $0.30** (standard) |
| Wallets (Apple Pay, Google Pay) | **2.9% + $0.30** |
| Bank transfer (SEPA / ACH) | **$0.80 flat** |
| Refunds | Free (fees returned proportionally) |
| Invoice generation | Free |
| Daily settlement | Free |

**Volume discount:** above $100k / month settles at 2.4% + $0.20. Contact for Enterprise rates.

## SDK examples

```javascript
const checkout = await tk.pay.checkouts.create({
  amount: 2900,
  currency: 'USD',
  description: 'Annual subscription',
  successUrl: 'https://your-app.com/success',
  methods: ['card', 'wallet'],
});
res.redirect(checkout.checkoutUrl);
```

```php
$checkout = $tk->pay->checkouts->create([
    'amount'      => 2900,
    'currency'    => 'USD',
    'description' => 'Annual subscription',
    'success_url' => 'https://your-app.com/success',
    'methods'     => ['card', 'wallet'],
]);
return redirect($checkout->checkout_url);
```

```python
checkout = tk.pay.checkouts.create(
    amount=2900, currency='USD',
    description='Annual subscription',
    success_url='https://your-app.com/success',
    methods=['card', 'wallet'],
)
return redirect(checkout.checkout_url)
```

## Recurring subscriptions

```bash
curl -X POST https://api.tkawen.com/v1/pay/subscriptions \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "customer_id": "cus_8xk2",
    "plan": "pro_annual",
    "amount": 29900,
    "currency": "USD",
    "interval": "year",
    "trial_days": 14
  }'
```

Automatic renewal, 7-day notice email before charge, self-service cancellation portal.

## Invoicing

Every transaction can generate a region-appropriate PDF invoice:

```bash
curl -X POST https://api.tkawen.com/v1/pay/invoices \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "transaction_id": "tx_8xk2",
    "include_tax": true,
    "tax_region": "EU",
    "language": "en"
  }'
```

Supports US sales tax, EU VAT, UK VAT, regional tax models — PDF returned inline.

## Webhooks

```
checkout.completed   checkout.expired
charge.succeeded     charge.failed
refund.completed     refund.failed
subscription.created subscription.cancelled
subscription.renewed subscription.payment_failed
invoice.generated
```

## Limits + SLA

- **Rate limit:** 100 checkouts/min, 50 charges/sec
- **Latency p99:** under 2s for checkout creation, under 5s for charge processing
- **Reconciliation:** daily at 02:00 UTC, bank payout within 24 hours

## Compliance

- **PCI DSS Level 1** — card data handled by certified processor partners
- **3-D Secure 2** — automatic strong customer authentication where required
- **SCA-compliant** for European cards
- **Regional tax** — automatic invoice formats per market

## Related

- Next: [04 · Commerce](/pillars/commerce/)
