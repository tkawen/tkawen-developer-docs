---
title: 06 · اللوجستيك
description: TKAWEN Logistics — تتبّع أساطيل + تكامل مع ناقلي DZ (Yalidine، CTM، Aramex، EcoTrack carriers).
---

## نظرة عامّة

**TKAWEN Logistics** يدمج طبقتَين منفصلتَين لكنّهما مترابطتان:

1. **Fleet tracking** — تتبّع GPS لأساطيل المركبات (مبنيّ على Traccar 6)
2. **Last-mile delivery** — تكامل مع كلّ ناقلي الشحن الجزائريّين

تشغّل بالفعل [track.tkawen.com](https://track.tkawen.com) ودمج Yalidine في [mystoq.com](https://mystoq.com).

يحلّ محلّ **Onfleet، Bringg** + يدمج معايير DZ المحليّة.

## البدء السريع

```bash
# سجّل جهاز GPS جديد
curl -X POST https://api.tkawen.com/v1/logistics/devices \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Van Annaba #3",
    "imei": "352656102345678",
    "wilaya": "Annaba",
    "vehicle_type": "van",
    "driver_id": "usr_8xk2"
  }'
```

ردّ:

```json
{
  "device_id": "dev_8xk2",
  "tkw_id": "tkw-3dc6f4d",
  "connection_url": "tcp://gateway.tkawen.com:5023",
  "protocol": "OsmAnd",
  "share_url": "https://track.tkawen.com/dev_8xk2"
}
```

ضع الـ IMEI في الجهاز، يتّصل تلقائياً، يبدأ التتبّع.

## النقاط الرئيسيّة

### Fleet Tracking
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/logistics/devices` | تسجيل جهاز |
| `GET` | `/v1/logistics/devices` | كلّ الأجهزة |
| `GET` | `/v1/logistics/devices/{id}/position` | الموقع الحاليّ |
| `GET` | `/v1/logistics/devices/{id}/history` | المسار التاريخيّ |
| `POST` | `/v1/logistics/geofences` | إنشاء geofence |
| `POST` | `/v1/logistics/alerts` | تنبيهات (overspeed، خروج geofence، إلخ) |

### Shipments (Last-mile)
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `GET` | `/v1/logistics/carriers` | قائمة الناقلين المدمَجين |
| `POST` | `/v1/logistics/quote` | عرض أسعار من كلّ الناقلين |
| `POST` | `/v1/logistics/shipments` | إنشاء shipment |
| `GET` | `/v1/logistics/shipments/{id}/track` | حالة الشحنة |
| `POST` | `/v1/logistics/shipments/{id}/cancel` | إلغاء |

## الناقلون المدمَجون

| الناقل | التغطية | API status |
|--------|---------|-----------|
| **Yalidine** | 58 wilaya، 1708 commune | ✅ مباشر |
| **CTM** | 48 wilaya | ✅ مباشر |
| **Aramex** | دوليّ + DZ | ✅ مباشر |
| **DHL Express** | دوليّ | ✅ مباشر |
| **PostaTN** (تونس) | تونس | ✅ مباشر |
| **EcoTrack carriers (×97)** | شراكة استراتيجيّة | 🟡 قريباً |

## التسعير

| البند | السعر |
|-------|------|
| جهاز GPS — شهر | **500 DZD** (Builder) |
| Geofence | مجاناً (حتّى 100/حساب) |
| Alert | مجاناً |
| Shipment إنشاء | **50 DZD** + رسوم الناقل |
| Shipment tracking | مجاناً |
| Quote API | مجاناً (يساعد على تحفيز المقارنة) |

في Sandbox: جهازان GPS وهميَّان، 10 shipments/شهر.

## أمثلة بـ SDK

```javascript
// قارن أسعار الشحن بين الناقلين
const quotes = await tk.logistics.quote({
  from: { wilaya: 'Annaba' },
  to: { wilaya: 'Algiers', commune: 'Bab Ezzouar' },
  weight_kg: 2.5,
  declared_value: 5000,
});
// → [{ carrier: 'Yalidine', cost: 450 }, { carrier: 'CTM', cost: 550 }, ...]

// أنشئ shipment مع الناقل الأرخص
const shipment = await tk.logistics.shipments.create({
  carrier: quotes[0].carrier,
  from: { wilaya: 'Annaba', name: 'متجر فاطمة', phone: '+213555000000' },
  to: { wilaya: 'Algiers', commune: 'Bab Ezzouar', name: 'سعيدة', phone: '+213556111111', address: '...' },
  package: { weight_kg: 2.5, declared_value: 5000 },
  cod_amount: 5000,
});
```

```php
$quotes = $tk->logistics->quote([
    'from'    => ['wilaya' => 'Annaba'],
    'to'      => ['wilaya' => 'Algiers'],
    'weight_kg' => 2.5,
]);

$shipment = $tk->logistics->shipments->create([
    'carrier' => $quotes[0]['carrier'],
    // ...
]);
```

## Geofencing

```bash
curl -X POST https://api.tkawen.com/v1/logistics/geofences \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "name": "منطقة عمّال عنّابة",
    "type": "polygon",
    "coordinates": [[36.9, 7.76], [36.92, 7.78], [36.91, 7.79]],
    "alert_on": "exit"
  }'
```

كلّ خروج/دخول يُولّد webhook + SMS اختياريّ.

## Webhooks

```
device.connected        device.disconnected
device.position_update  (كلّ 30 ثانية افتراضياً)
geofence.entered        geofence.exited
alert.triggered          (overspeed، idle، إلخ)
shipment.created        shipment.picked_up
shipment.in_transit     shipment.out_for_delivery
shipment.delivered      shipment.failed
```

## روابط

- المنتج الاستهلاكيّ: [track.tkawen.com](https://track.tkawen.com)
- لوحة الإدارة: [app.tkawen.com](https://app.tkawen.com)
- التالي: [07 · للمطوّرين](/pillars/developer/)
