---
title: استدعاؤك الأوّل
description: مثال واحد بسيط — أنشئ غرفة فيديو حقيقيّة في 3 سطور.
---

## أنشئ غرفة فيديو (LIQAA Cloud)

```bash
curl -X POST https://api.tkawen.com/v1/connect/rooms \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "reunion-strategique",
    "max_participants": 12,
    "duration_minutes": 60
  }'
```

ردّ:

```json
{
  "room_id": "rm_8x2k9...",
  "name": "reunion-strategique",
  "sdk_token": "eyJhbGciOiJIUzI1NiIs...",
  "join_url": "https://meet.liqaa.io/rm_8x2k9...",
  "expires_at": "2026-05-18T18:30:00Z"
}
```

أحضر صفحة `join_url` في أيّ متصفّح وأنت في الغرفة فوراً.

## أو أرسل SMS (DZ telco)

```bash
curl -X POST https://api.tkawen.com/v1/connect/sms \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+213555000000",
    "body": "رمز التحقّق: 123456"
  }'
```

التكلفة: **3-5 DZD** لكلّ SMS، بدون اشتراك شهري.

## أو حقّق هوية (TKAWEN ID + KYC)

```bash
curl -X POST https://api.tkawen.com/v1/identity/verify \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "national_id": "1234567890123456",
    "first_name": "محمد",
    "last_name": "بن أحمد",
    "date_of_birth": "1995-03-12"
  }'
```

ردّ في حدود **<800ms** — مطابقة فوريّة مع قاعدة بيانات الهوية الوطنيّة.

## ماذا تعلّمت

- المفتاح `Bearer $TKAWEN_KEY` يصلح لكلّ الطبقات
- كلّ النقاط تحت `api.tkawen.com/v1/<pillar>/<resource>`
- الردود JSON قياسيّة
- التسعير في كلّ ردّ ضمن header `X-TKAWEN-Cost: 5.00 DZD`

اقرأ الآن **[وثائق الطبقات السبع](/pillars/identity/)** للتعمّق.
