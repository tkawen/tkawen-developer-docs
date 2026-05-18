---
title: Go SDK
description: SDK رسميّ لـ TKAWEN بـ Go 1.21+، idiomatic، context-first.
---

## التثبيت

```bash
go get github.com/liqaa-cloud/tkawen-go
```

يتطلّب:
- **Go 1.21+** (يستخدم `slog`, generics, structured errors)
- لا dependencies خارجيّة في الـ core (standard library فقط)

## التهيئة

```go
package main

import (
    "context"
    "log"
    "os"

    "github.com/liqaa-cloud/tkawen-go"
)

func main() {
    tk := tkawen.New(
        os.Getenv("TKAWEN_KEY"),
        // اختياريّ:
        tkawen.WithBaseURL("https://api.tkawen.com"),
        tkawen.WithTimeout(30 * time.Second),
        tkawen.WithRetries(3),
    )

    ctx := context.Background()

    room, err := tk.Connect.Rooms.Create(ctx, &tkawen.CreateRoomRequest{
        Name:            "demo",
        MaxParticipants: 4,
    })
    if err != nil {
        log.Fatal(err)
    }

    log.Println(room.JoinURL)
}
```

## التغطية

كلّ الطبقات السبع:

```go
tk.Identity.Verify(ctx, ...)        // 01
tk.Connect.Rooms.Create(ctx, ...)   // 02
tk.Pay.Checkouts.Create(ctx, ...)   // 03
tk.Commerce.Stores.Create(ctx, ...) // 04
tk.Knowledge.Certificates.Issue(ctx, ...) // 05
tk.Logistics.Shipments.Create(ctx, ...) // 06
tk.Usage.Current(ctx)               // 07
```

## معالجة الأخطاء

```go
import "errors"

room, err := tk.Connect.Rooms.Create(ctx, req)
if err != nil {
    var tkErr *tkawen.Error
    if errors.As(err, &tkErr) {
        switch tkErr.Code {
        case tkawen.ErrCodeInvalidParam:
            log.Printf("حقل غير صحيح: %s", tkErr.Field)
        case tkawen.ErrCodeQuotaExceeded:
            log.Printf("تجاوزت الحدّ: %d/%d", tkErr.Used, tkErr.Limit)
        case tkawen.ErrCodeAuth:
            log.Println("مفتاح API غير صحيح")
        default:
            log.Printf("خطأ TKAWEN: %s", tkErr)
        }
    }
    return err
}
```

## Webhooks (net/http)

```go
package main

import (
    "io"
    "net/http"

    "github.com/liqaa-cloud/tkawen-go"
)

var webhookSecret = os.Getenv("TKAWEN_WEBHOOK_SECRET")

func tkawenWebhook(w http.ResponseWriter, r *http.Request) {
    payload, _ := io.ReadAll(r.Body)
    signature := r.Header.Get("X-TKAWEN-Signature")

    if !tkawen.VerifyWebhook(payload, signature, webhookSecret) {
        http.Error(w, "invalid signature", 401)
        return
    }

    event, err := tkawen.ParseEvent(payload)
    if err != nil {
        http.Error(w, "invalid payload", 400)
        return
    }

    switch e := event.(type) {
    case *tkawen.RoomEndedEvent:
        go processRecording(e.RoomID)
    case *tkawen.CheckoutCompletedEvent:
        go processOrder(e.CheckoutID)
    case *tkawen.ShipmentDeliveredEvent:
        go notifyCustomer(e.ShipmentID)
    }

    w.WriteHeader(200)
}

func main() {
    http.HandleFunc("/tkawen-webhook", tkawenWebhook)
    http.ListenAndServe(":8080", nil)
}
```

## Streaming (للـ AI Tutor + TTS)

```go
stream, err := tk.Knowledge.AITutor.Stream(ctx, &tkawen.AIQuery{
    CourseID: "crs_abc",
    Question: "اشرح TVA بالعربية",
})
if err != nil {
    log.Fatal(err)
}
defer stream.Close()

for {
    chunk, err := stream.Next()
    if errors.Is(err, io.EOF) {
        break
    }
    if err != nil {
        log.Fatal(err)
    }
    fmt.Print(chunk.Text)
}
```

## Concurrent calls (idiomatic)

```go
import "golang.org/x/sync/errgroup"

g, ctx := errgroup.WithContext(context.Background())

var room *tkawen.Room
var sms *tkawen.Message

g.Go(func() error {
    var err error
    room, err = tk.Connect.Rooms.Create(ctx, &tkawen.CreateRoomRequest{Name: "demo"})
    return err
})

g.Go(func() error {
    var err error
    sms, err = tk.Connect.SMS.Send(ctx, &tkawen.SMSRequest{
        To: "+213555000000",
        Body: "مرحباً",
    })
    return err
})

if err := g.Wait(); err != nil {
    log.Fatal(err)
}
```

## Pagination (auto-iterator)

```go
iter := tk.Commerce.Orders.List(ctx, &tkawen.ListOrdersRequest{
    StoreID: "st_8xk2",
    Status:  tkawen.OrderStatusDelivered,
})

for iter.Next() {
    order := iter.Current()
    fmt.Println(order.ID, order.Total)
}
if err := iter.Err(); err != nil {
    log.Fatal(err)
}
```

## CLI (مدمج)

```bash
# تثبيت
go install github.com/liqaa-cloud/tkawen-go/cmd/tkawen@latest

# استخدام
tkawen --help
tkawen usage
tkawen connect rooms create --name=demo --max=4
tkawen --output=json keys list
```

## أمثلة كاملة

مستودع `tkawen-go-examples`:

- `examples/gin-checkout` — Gin web framework
- `examples/echo-identity-sso` — Echo + OIDC
- `examples/fiber-webhook-handler` — Fiber + concurrent processing
- `examples/grpc-bridge` — gRPC service يربط TKAWEN بـ internal services

```bash
git clone https://github.com/liqaa-cloud/tkawen-go-examples
cd tkawen-go-examples/examples/gin-checkout
go run .
```

## النسخة + التغيير

- **آخر إصدار:** v1.0.x
- **Go minimum:** 1.21
- **Changelog:** [github.com/liqaa-cloud/tkawen-go/releases](https://github.com/liqaa-cloud)

## المساهمة

[github.com/liqaa-cloud/tkawen-go](https://github.com/liqaa-cloud) — MIT.

## الدعم

- Discord: [discord.gg/tkawen](https://discord.gg/tkawen) #go-sdk
- البريد: DIRECTION@takawen.dz
