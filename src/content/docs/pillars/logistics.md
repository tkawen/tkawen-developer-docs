---
title: 06 · Logistics
description: TKAWEN Logistics — fleet GPS + multi-carrier shipping in one unified API.
---

## Overview

**TKAWEN Logistics** combines two related but distinct layers:

1. **Fleet tracking** — GPS for vehicle fleets (Traccar 6 based)
2. **Last-mile shipping** — integration with major global and regional carriers

Powers [track.tkawen.com](https://track.tkawen.com) and the shipping layer in [mystoq.com](https://mystoq.com).

Replaces **Onfleet, Bringg, ShipBob, Shippo**.

## Quick start

```bash
# Register a new GPS device
curl -X POST https://api.tkawen.com/v1/logistics/devices \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Van Bay Area #3",
    "imei": "352656102345678",
    "region": "US-CA",
    "vehicle_type": "van",
    "driver_id": "usr_8xk2"
  }'
```

Response:

```json
{
  "device_id": "dev_8xk2",
  "tkw_id": "tkw-3dc6f4d",
  "connection_url": "tcp://gateway.tkawen.com:5023",
  "protocol": "OsmAnd",
  "share_url": "https://track.tkawen.com/dev_8xk2"
}
```

Drop the IMEI into the device, it connects automatically, tracking starts.

## Endpoints

### Fleet tracking
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/logistics/devices` | Register a device |
| `GET` | `/v1/logistics/devices` | List devices |
| `GET` | `/v1/logistics/devices/{id}/position` | Current position |
| `GET` | `/v1/logistics/devices/{id}/history` | Historical path |
| `POST` | `/v1/logistics/geofences` | Create geofence |
| `POST` | `/v1/logistics/alerts` | Alerts (overspeed, geofence exit, etc.) |

### Shipments (last-mile)
| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/logistics/carriers` | Available integrated carriers |
| `POST` | `/v1/logistics/quote` | Get rate quotes from all carriers |
| `POST` | `/v1/logistics/shipments` | Create a shipment |
| `GET` | `/v1/logistics/shipments/{id}/track` | Track shipment status |
| `POST` | `/v1/logistics/shipments/{id}/cancel` | Cancel |

## Integrated carriers

| Carrier | Coverage | API |
|---------|----------|-----|
| **DHL Express** | Global | Direct |
| **FedEx** | Global | Direct |
| **UPS** | Global | Direct |
| **Aramex** | Global + MENA | Direct |
| **CTM** | Regional | Direct |
| **Yalidine** | Regional | Direct |
| **PostaTN** | Regional | Direct |
| **+97 regional carriers** | Per-market | Aggregated partnership |

## Pricing

| Item | Price |
|------|-------|
| GPS device / month | **$3.99** (Builder) |
| Geofence | Free (up to 100 / account) |
| Alert | Free |
| Shipment creation | **$0.50** + carrier fee |
| Shipment tracking | Free |
| Quote API | Free (we want you to comparison-shop) |

Sandbox: 2 mock GPS devices, 10 shipments / month.

## SDK examples

```javascript
// Compare shipping rates across carriers
const quotes = await tk.logistics.quote({
  from: { country: 'US', region: 'CA', city: 'San Francisco' },
  to:   { country: 'US', region: 'NY', city: 'New York' },
  weight_kg: 2.5,
  declared_value: 5000,
});
// → [{ carrier: 'UPS', cost: 18 }, { carrier: 'FedEx', cost: 22 }, ...]

// Create a shipment with the cheapest carrier
const shipment = await tk.logistics.shipments.create({
  carrier: quotes[0].carrier,
  from: { country: 'US', region: 'CA', city: 'San Francisco', name: 'Store', phone: '+15551234567' },
  to: { country: 'US', region: 'NY', city: 'New York', name: 'Jane Doe', phone: '+15557654321', address: '...' },
  package: { weight_kg: 2.5, declared_value: 5000 },
  cod_amount: 5000,
});
```

```php
$quotes = $tk->logistics->quote([
    'from'    => ['country' => 'US', 'city' => 'San Francisco'],
    'to'      => ['country' => 'US', 'city' => 'New York'],
    'weight_kg' => 2.5,
]);
```

## Geofencing

```bash
curl -X POST https://api.tkawen.com/v1/logistics/geofences \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "name": "Downtown delivery zone",
    "type": "polygon",
    "coordinates": [[37.78, -122.41], [37.79, -122.42], [37.77, -122.43]],
    "alert_on": "exit"
  }'
```

Every entry / exit triggers a webhook + optional SMS.

## Webhooks

```
device.connected        device.disconnected
device.position_update  (every 30 seconds by default)
geofence.entered        geofence.exited
alert.triggered          (overspeed, idle, etc.)
shipment.created        shipment.picked_up
shipment.in_transit     shipment.out_for_delivery
shipment.delivered      shipment.failed
```

## Related

- Consumer product: [track.tkawen.com](https://track.tkawen.com)
- Admin dashboard: [app.tkawen.com](https://app.tkawen.com)
- Next: [07 · Developer](/pillars/developer/)
