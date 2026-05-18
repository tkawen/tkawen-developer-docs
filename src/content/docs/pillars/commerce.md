---
title: 04 · Commerce
description: TKAWEN Commerce — multi-tenant e-commerce in 13 currencies with global carrier integration.
---

## Overview

**TKAWEN Commerce** is the backend powering [mystoq.com](https://mystoq.com) (200+ live merchants). Available as an API if you want to build a custom storefront on top:

- **13 currencies** — USD, EUR, GBP, plus 10 regional currencies
- **Payment methods** — extends TKAWEN Pay + integrates Tabby, Tamara, Mada, Fawry, regional rails
- **Carriers** — Aramex, DHL, FedEx, UPS, plus regional carriers (CTM, Yalidine, PostaTN, more)
- **WhatsApp Commerce** — catalog synced to Meta Catalog with auto-reply bot
- **Templates** — 10 vertical templates (Beauty, Pharma, Electronics, Food, more)
- **Multi-tenant** — each store fully isolated

Replaces **Shopify, Square, BigCommerce**.

## Quick start

```bash
# Create a new store
curl -X POST https://api.tkawen.com/v1/commerce/stores \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beauty by Sarah",
    "subdomain": "sarah-beauty",
    "currency": "USD",
    "language": "en",
    "template": "beauty-pink-elegant"
  }'
```

Response:

```json
{
  "store_id": "st_8xk2",
  "subdomain": "sarah-beauty.mystoq.com",
  "admin_url": "https://sarah-beauty.mystoq.com/admin",
  "template_applied": "beauty-pink-elegant",
  "products_seeded": 8,
  "categories_seeded": 3,
  "sections_seeded": 6
}
```

Store is **ready to sell** in 5 seconds.

## Endpoints

### Stores
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/commerce/stores` | Create store |
| `GET` | `/v1/commerce/stores/{id}` | Store details |
| `PATCH` | `/v1/commerce/stores/{id}` | Update |
| `DELETE` | `/v1/commerce/stores/{id}` | Soft delete (15-day recovery window) |

### Products
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/commerce/products` | Add a product |
| `GET` | `/v1/commerce/products?store={id}` | List catalog |
| `POST` | `/v1/commerce/products/bulk` | CSV / XLSX import |
| `PATCH` | `/v1/commerce/products/{id}/stock` | Update stock level |

### Orders
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/commerce/orders` | Create order |
| `GET` | `/v1/commerce/orders?store={id}` | List orders |
| `POST` | `/v1/commerce/orders/{id}/ship` | Ship (creates shipment via Logistics) |
| `POST` | `/v1/commerce/orders/{id}/refund` | Refund (full or partial) |

### Templates
| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/commerce/templates` | List 10 verticals |
| `POST` | `/v1/commerce/stores/{id}/apply-template` | Apply a template |

## Pricing

| Item | Price |
|------|-------|
| Store base / month | **$0.99** (up to 100 products) |
| Additional product / month | **$0.005** |
| Commission per order | **0.5%** (Builder) / 0% (Enterprise) |
| WhatsApp Commerce setup | Free |
| Bulk import | Free |

Sandbox: 1 store, 100 products, 500 orders/month.

## SDK examples

```javascript
const product = await tk.commerce.products.create({
  storeId: 'st_8xk2',
  name: 'Hydrating face cream SPF50',
  price: 2500,
  currency: 'USD',
  stock: 50,
  images: ['https://...'],
  category: 'skincare',
});

const order = await tk.commerce.orders.create({
  storeId: 'st_8xk2',
  customer: { phone: '+15551234567', name: 'Jane Doe' },
  items: [{ productId: product.id, quantity: 1 }],
  shipping: { country: 'US', region: 'CA', city: 'San Francisco', address: '...' },
  paymentMethod: 'card',
});
```

```php
$product = $tk->commerce->products->create([
    'store_id' => 'st_8xk2',
    'name'     => 'Hydrating face cream SPF50',
    'price'    => 2500,
    'currency' => 'USD',
    'stock'    => 50,
]);
```

## WhatsApp Commerce

```bash
curl -X POST https://api.tkawen.com/v1/commerce/stores/{id}/whatsapp \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "phone_number_id": "...",
    "access_token": "...",
    "auto_reply_languages": ["en", "es", "fr"]
  }'
```

The bot handles browsing, cart, checkout, and order tracking — entirely inside WhatsApp.

## Webhooks

```
store.created           store.deleted
product.created         product.stock_low
order.created           order.paid
order.shipped           order.delivered
order.cancelled         order.refunded
template.applied
```

## Limits

- 10,000 products / store (Builder)
- 100,000 products / store (Enterprise)
- 1,000 orders / day / store (Builder)

## Related

- Consumer product: [mystoq.com](https://mystoq.com)
- Next: [05 · Knowledge](/pillars/knowledge/)
