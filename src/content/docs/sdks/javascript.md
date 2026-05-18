---
title: JavaScript / TypeScript SDK
description: SDK رسميّ لـ TKAWEN بـ TypeScript — يعمل في Node.js، Bun، Deno، المتصفّح، edge runtimes.
---

## التثبيت

```bash
npm install @tkawen/sdk
# أو
pnpm add @tkawen/sdk
# أو
bun add @tkawen/sdk
```

يتطلّب Node 18+ (يستخدم native `fetch`). يعمل أيضاً في:
- ✅ Bun 1.0+
- ✅ Deno 1.30+
- ✅ المتصفّحات الحديثة
- ✅ Cloudflare Workers / Vercel Edge

## التهيئة

```typescript
import { Tkawen } from '@tkawen/sdk';

const tk = new Tkawen({
  key: process.env.TKAWEN_KEY!,
  // اختياري:
  baseUrl: 'https://api.tkawen.com',  // افتراضي
  timeout: 30000,                       // ms
  retries: 3,                           // exponential backoff
});
```

::: تنبيه
**لا تكشف `sk_live_*` على المتصفّح أبداً.** استخدم `pk_live_*` للجوانب العامّة، و `sk_live_*` فقط على الخادم.
:::

## الاستدعاء الأوّل

```typescript
// أنشئ غرفة فيديو
const room = await tk.connect.rooms.create({
  name: 'demo',
  maxParticipants: 4,
});

console.log(room.joinUrl);
// → https://meet.liqaa.io/rm_8x2k9d
```

## التغطية

كلّ الطبقات السبع متاحة:

```typescript
tk.identity.verify({ ... });        // 01
tk.connect.rooms.create({ ... });   // 02
tk.pay.checkouts.create({ ... });   // 03
tk.commerce.stores.create({ ... }); // 04
tk.knowledge.certificates.issue({}); // 05
tk.logistics.shipments.create({}); // 06
tk.usage.current();                 // 07
```

كلّ method:
- typed كاملاً (TypeScript strict)
- يرجع `Promise<T>`
- يرمي `TkawenError` عند الفشل مع `code`, `httpStatus`, `details`

## معالجة الأخطاء

```typescript
import { Tkawen, TkawenError } from '@tkawen/sdk';

try {
  const room = await tk.connect.rooms.create({ name: 'x' });
} catch (err) {
  if (err instanceof TkawenError) {
    console.error(err.code);       // 'INVALID_PARAM' | 'QUOTA_EXCEEDED' | ...
    console.error(err.httpStatus); // 400, 429, ...
    console.error(err.details);    // { field: 'maxParticipants', expected: 'number' }
  }
}
```

## Webhooks (التحقّق من التوقيع)

```typescript
import { Tkawen, verifyWebhook } from '@tkawen/sdk';

app.post('/tkawen-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-tkawen-signature'] as string;
  const verified = verifyWebhook(req.body, signature, process.env.TKAWEN_WEBHOOK_SECRET!);

  if (!verified) return res.status(401).end();

  const event = JSON.parse(req.body.toString());
  switch (event.type) {
    case 'room.ended':       /* ... */ break;
    case 'checkout.completed': /* ... */ break;
  }
  res.status(200).end();
});
```

## Streaming (للـ AI Tutor + TTS)

```typescript
const stream = await tk.knowledge.aiTutor.stream({
  courseId: 'crs_abc',
  question: 'اشرح TVA بالعربية',
});

for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

## React/Next.js hook

```typescript
import { useTkawenCurrentUser } from '@tkawen/react';

function Profile() {
  const { user, loading } = useTkawenCurrentUser();
  if (loading) return 'يحمّل...';
  return <h1>مرحباً {user.firstName}</h1>;
}
```

## أمثلة كاملة

repo `tkawen-js-examples` يحوي:

- `examples/checkout-flow` — Next.js كامل
- `examples/whatsapp-bot` — Webhook + bot
- `examples/identity-sso` — OIDC integration
- `examples/video-room-react` — UI لـ LIQAA Cloud

```bash
git clone https://github.com/liqaa-cloud/tkawen-js-examples
cd tkawen-js-examples/examples/checkout-flow
npm install && npm run dev
```

## النسخة + التغيير

- **آخر إصدار:** 1.0.x
- **Stability:** stable (API frozen)
- **Changelog:** [github.com/liqaa-cloud/tkawen-js/releases](https://github.com/liqaa-cloud)
- **Migration guides:** سيُضاف عند أيّ breaking change

## المساهمة

المستودع مفتوح: [github.com/liqaa-cloud/tkawen-js](https://github.com/liqaa-cloud)
- Issues: نقبل bug reports + feature requests
- PRs: نراجع خلال 48 ساعة (Builder/Enterprise يحصلون على أولويّة)
- License: **MIT**

## الدعم

- Discord: [discord.gg/tkawen](https://discord.gg/tkawen) #js-sdk
- البريد: DIRECTION@takawen.dz
- Status: [status.tkawen.com](https://status.tkawen.com)
