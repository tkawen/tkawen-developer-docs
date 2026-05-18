---
title: 02 · الاتصال
description: TKAWEN Connect — فيديو، صوت، SMS، WhatsApp، TTS بالعربية الجزائرية، API واحدة.
---

## نظرة عامّة

**TKAWEN Connect** يجمع كلّ قنوات التواصل في API واحدة:

- **فيديو** عبر LIQAA Cloud (مبنيّ على LiveKit) — sub-100ms latency
- **صوت** — مكالمات WebRTC + recording + transcript (Whisper)
- **SMS** — تكامل مع المشغّلَين الجزائريَّين (Mobilis + Djezzy)
- **WhatsApp** — Cloud API مع per-tenant onboarding
- **TTS** — صوت سياديّ بالعربية الجزائريّة (Piper VITS مدرَّب على Darija)

يحلّ محلّ **Twilio، Zoom، SendGrid، Daily.co**.

## البدء السريع

```bash
# أنشئ غرفة فيديو
curl -X POST https://api.tkawen.com/v1/connect/rooms \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "reunion-strategique",
    "max_participants": 12,
    "duration_minutes": 60,
    "record": true
  }'
```

ردّ:

```json
{
  "room_id": "rm_8x2k9d",
  "join_url": "https://meet.liqaa.io/rm_8x2k9d",
  "sdk_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2026-05-18T18:30:00Z"
}
```

## النقاط الرئيسيّة

### الفيديو + الصوت
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/connect/rooms` | إنشاء غرفة |
| `GET` | `/v1/connect/rooms/{id}` | حالة الغرفة + المشاركون |
| `DELETE` | `/v1/connect/rooms/{id}` | إنهاء فوريّ |
| `GET` | `/v1/connect/rooms/{id}/recording` | تنزيل التسجيل (MP4) |
| `GET` | `/v1/connect/rooms/{id}/transcript` | نسخة نصّيّة (Whisper) |

### SMS + WhatsApp
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/connect/sms` | إرسال SMS |
| `POST` | `/v1/connect/whatsapp` | إرسال WhatsApp |
| `POST` | `/v1/connect/whatsapp/templates` | تسجيل قالب |
| `GET` | `/v1/connect/messages/{id}` | حالة الرسالة |

### TTS
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/connect/voice/tts` | نصّ → صوت (Amina/Ismael) |

## التسعير (بالدينار)

| العمليّة | السعر |
|----------|------|
| فيديو — مشارك/دقيقة | **5 DZD** (HD) / **8 DZD** (4K) |
| تسجيل غرفة — دقيقة | **2 DZD** إضافيّة |
| Transcript Whisper — دقيقة | **3 DZD** |
| SMS DZ | **4 DZD** |
| WhatsApp message | **1.5 DZD** |
| WhatsApp template (24h) | **0.5 DZD** |
| TTS — 100 حرف | **0.30 DZD** |

في Sandbox: **1,000 دقيقة فيديو/شهر**، **100 SMS**، **100 WA**.

## أمثلة بـ SDK

```javascript
// أنشئ غرفة وأرسل رابطها بـ SMS
const room = await tk.connect.rooms.create({
  name: 'demo-vente',
  maxParticipants: 4,
});

await tk.connect.sms.send({
  to: '+213555000000',
  body: `انضمّ للاجتماع: ${room.joinUrl}`,
});
```

```php
$room = $tk->connect->rooms->create([
    'name' => 'demo-vente',
    'max_participants' => 4,
]);

$tk->connect->sms->send([
    'to'   => '+213555000000',
    'body' => "انضمّ للاجتماع: {$room->join_url}",
]);
```

```python
room = tk.connect.rooms.create(name='demo-vente', max_participants=4)
tk.connect.sms.send(to='+213555000000', body=f'انضمّ: {room.join_url}')
```

## Webhooks

اشترك في الأحداث الحقيقيّة:

```
room.started     room.ended      room.participant_joined
sms.delivered    sms.failed       whatsapp.read
recording.ready  transcript.ready tts.ready
```

تكوين:

```bash
curl -X POST https://api.tkawen.com/v1/connect/webhooks \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "url": "https://your-app.com/tkawen-webhook",
    "events": ["room.ended", "sms.delivered"],
    "secret": "whsec_..."
  }'
```

موقَّع HMAC-SHA256 — تحقّق من `X-TKAWEN-Signature`.

## الحدود + SLA

- **Rate limit:** 500 SMS/min، 100 غرفة متزامنة (Builder)
- **Latency فيديو p50:** <50ms داخل DZ، <100ms داخل MENA
- **SLA:** 99.9% (Builder)، 99.99% (Enterprise)

## روابط

- LIQAA Meet (OSS): [meet.liqaa.io](https://meet.liqaa.io)
- المستودع: [github.com/liqaa-cloud](https://github.com/liqaa-cloud)
- التالي: [03 · الدفع](/pillars/pay/)
