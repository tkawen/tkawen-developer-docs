---
title: احصل على مفتاح API
description: كيف تنشئ حساب TKAWEN وتحصل على مفتاح Sandbox مجاني خلال 60 ثانية.
---

## في 60 ثانية

1. اذهب إلى **[id.tkawen.com/signup](https://id.tkawen.com/signup)**
2. سجّل بريداً جزائرياً + رقم هاتف للتحقّق (SMS مجاني)
3. أكّد عبر البريد، ثمّ ادخل لوحة Developer
4. اضغط **«Create API key»** — تحصل على مفتاحَين:
   - `pk_sandbox_...` (مفتاح عام، آمن للجوّال)
   - `sk_sandbox_...` (مفتاح خاص، لا تكشفه أبداً)

## احفظه بأمان

```bash
# ~/.bashrc أو متغيّرات بيئة المشروع
export TKAWEN_KEY="sk_sandbox_xxxxxxxxxxxxxxxxxxxxxxxx"
```

## تحقّق

```bash
curl -H "Authorization: Bearer $TKAWEN_KEY" \
     https://api.tkawen.com/v1/identity/me
```

ردّ متوقَّع:

```json
{
  "key_id": "ak_xxx",
  "mode": "sandbox",
  "owner": "your-email@example.dz",
  "quota": { "calls_this_month": 0, "limit": 1000 }
}
```

## ماذا بعد؟

- **[استدعاؤك الأوّل](/getting-started/first-call/)** — أنشئ غرفة فيديو، أرسل SMS، أو حقّق هوية
- **[تصفّح الطبقات السبع](/pillars/identity/)** — كلّ طبقة لها وثائقها الخاصّة
