---
title: 04 · التجارة
description: TKAWEN Commerce — بنية متاجر إلكترونية بـ 13 عملة، 4 ناقلين، 4 مزوّدي دفع.
---

## نظرة عامّة

**TKAWEN Commerce** هو الـ backend الذي يشغّل [mystoq.com](https://mystoq.com) (+200 تاجر LIVE). جاهز كـ API لمن يريد بناء storefront مخصَّص:

- **13 عملة** — DZD + 10 عملات MENA + USD + EUR
- **4 مزوّدي دفع** — Tabby، Tamara، Mada، Fawry (إضافة لـ TKAWEN Pay)
- **4 ناقلين** — Aramex، DHL، CTM، Yalidine
- **WhatsApp Commerce** — كاتالوغ مزامن مع Meta Catalog
- **Templates** — 10 verticals جاهزة (Beauty, Pharma, Electronics، إلخ)
- **Multi-tenant** — كلّ متجر معزول كاملاً

يحلّ محلّ **Shopify، Square، BigCommerce**.

## البدء السريع

```bash
# أنشئ متجراً جديداً
curl -X POST https://api.tkawen.com/v1/commerce/stores \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "متجر فاطمة للجمال",
    "subdomain": "fatima-beauty",
    "currency": "DZD",
    "language": "ar",
    "template": "beauty-pink-elegant"
  }'
```

ردّ:

```json
{
  "store_id": "st_8xk2",
  "subdomain": "fatima-beauty.mystoq.com",
  "admin_url": "https://fatima-beauty.mystoq.com/admin",
  "template_applied": "beauty-pink-elegant",
  "products_seeded": 8,
  "categories_seeded": 3,
  "sections_seeded": 6
}
```

المتجر **جاهز للبيع** خلال 5 ثوانٍ.

## النقاط الرئيسيّة

### Stores
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/commerce/stores` | إنشاء متجر |
| `GET` | `/v1/commerce/stores/{id}` | تفاصيل |
| `PATCH` | `/v1/commerce/stores/{id}` | تحديث |
| `DELETE` | `/v1/commerce/stores/{id}` | حذف (soft، 15 يوم) |

### Products
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/commerce/products` | إضافة منتج |
| `GET` | `/v1/commerce/products?store={id}` | كاتالوغ |
| `POST` | `/v1/commerce/products/bulk` | استيراد CSV/XLSX |
| `PATCH` | `/v1/commerce/products/{id}/stock` | تحديث المخزون |

### Orders
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/commerce/orders` | إنشاء طلب |
| `GET` | `/v1/commerce/orders?store={id}` | الطلبات |
| `POST` | `/v1/commerce/orders/{id}/ship` | شحن (يُنشئ shipment في Logistics) |
| `POST` | `/v1/commerce/orders/{id}/refund` | استرجاع |

### Templates
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `GET` | `/v1/commerce/templates` | الـ 10 templates |
| `POST` | `/v1/commerce/stores/{id}/apply-template` | تطبيق template |

## التسعير

| البند | السعر |
|-------|------|
| متجر — base/شهر | **99 DZD** (حتّى 100 منتج) |
| منتج إضافيّ فوق الـ 100 | **0.50 DZD/شهر** |
| Commission per order | **0.5%** (Builder) / 0% (Enterprise) |
| WhatsApp Commerce | مجاناً (تكاليف الرسائل في [Connect](/pillars/connect/)) |
| Bulk import | مجاناً |

في Sandbox: متجر واحد، 100 منتج، 500 طلب/شهر.

## أمثلة بـ SDK

```javascript
const product = await tk.commerce.products.create({
  storeId: 'st_8xk2',
  name: 'كريم مرطّب SPF50',
  price: 2500,
  currency: 'DZD',
  stock: 50,
  images: ['https://...'],
  category: 'skincare',
});

const order = await tk.commerce.orders.create({
  storeId: 'st_8xk2',
  customer: { phone: '+213555000000', name: 'سعيدة' },
  items: [{ productId: product.id, quantity: 1 }],
  shipping: { wilaya: 'Annaba', commune: 'Annaba', address: '...' },
  paymentMethod: 'cod',
});
```

```php
$product = $tk->commerce->products->create([
    'store_id' => 'st_8xk2',
    'name'     => 'كريم مرطّب SPF50',
    'price'    => 2500,
    'currency' => 'DZD',
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
    "auto_reply_languages": ["ar-DZ", "fr"]
  }'
```

الـ bot يدير التصفّح، السلّة، التحقّق، التتبّع — كلّه عبر WhatsApp.

## Webhooks

```
store.created           store.deleted
product.created         product.stock_low
order.created           order.paid
order.shipped           order.delivered
order.cancelled         order.refunded
template.applied
```

## الحدود

- 10,000 منتج/متجر (Builder)
- 100,000 منتج/متجر (Enterprise)
- 1,000 طلب/يوم/متجر (Builder)

## روابط

- المنتج الاستهلاكيّ: [mystoq.com](https://mystoq.com)
- التالي: [05 · المعرفة](/pillars/knowledge/)
