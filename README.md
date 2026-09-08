# Jasur Kalonov — Bepul videodars (Landing 1)

Next.js 14 (App Router) + TypeScript. Vercel uchun tayyor.

**Voronkadagi o'rni:**

```
ADS → [BU SAYT] → Telegram bot → YouTube (videodars) → Landing 2 → CRM → Call → Sotuv
```

Saytning yagona vazifasi — kontakt olish va odamni botga o'tkazish. Hech narsa sotmaydi.

---

## Fayllar

```
app/
  layout.tsx          shrift, Meta Pixel, Yandex Metrika
  page.tsx            asosiy sahifa + modal forma
  bot/page.tsx        2-qadam: "To'xtang! Botga /start bosing"
  api/lead/route.ts   server: Telegram gruppa + Bitrix24
  globals.css         butun dizayn
public/
  cover.jpg           hero cover rasmi
  jasur.jpg           "Jasur Kalonov" blokidagi rasm
```

---

## 1. Ishga tushirish

```bash
npm install
cp .env.example .env.local     # qiymatlarni to'ldiring
npm run dev
```

## 2. Vercel

1. Kodni GitHub'ga yuklang
2. vercel.com → **Add New → Project** → repozitoriyni tanlang
3. **Environment Variables** ga `.env.example` dagi qiymatlarni kiriting
4. **Deploy**

Framework avtomatik aniqlanadi.

## 3. Environment Variables

| Nomi | Majburiy | Izoh |
|---|---|---|
| `TG_TOKEN` | ✅ | Bot tokeni. **Faqat serverda**, saytda ko'rinmaydi |
| `TG_CHAT_ID` | ✅ | Lidlar tushadigan gruppa ID (minus bilan) |
| `NEXT_PUBLIC_BOT_URL` | ✅ | Videodars beradigan bot: `https://t.me/xxx?start=dars` |
| `B24_WEBHOOK` | ❌ | Bitrix kiruvchi webhook. Bo'sh bo'lsa ishlatilmaydi |
| `NEXT_PUBLIC_FB_PIXEL` | ❌ | Meta Pixel ID |
| `NEXT_PUBLIC_YM_ID` | ❌ | Yandex Metrika ID |

> ⚠️ `NEXT_PUBLIC_` prefiksi bor o'zgaruvchilar brauzerga chiqadi. Tokenlarni **hech qachon** shunday nomlamang.

## 4. Domen

`jasurkalanov.uz` Tildada. Subdomen eng oson yo'l:

```
dars.jasurkalanov.uz  →  Vercel
```

Vercel → Settings → Domains → subdomen qo'shing → CNAME yozuvini domen panelga kiriting.

---

## 5. Ishlash sxemasi

```
Reklama (UTM bilan)
      ↓
/ — UTM sessionStorage'ga saqlanadi, 24 soatlik taymer boshlanadi
      ↓
Tugma yoki cover bosiladi → modal forma (ism + telefon)
      ↓
POST /api/lead   (server)
      ├──> Bitrix24  crm.lead.add
      └──> Telegram gruppa
      ↓
/bot  →  3 soniya  →  Telegram bot
```

## 6. Matnni o'zgartirish

`app/page.tsx` faylining boshidagi **`const T = { ... }`** blokida barcha matnlar turibdi:
sarlavha, cover matni, kartochkalar, "kimlar uchun", 3 qadam, Jasur haqida.
Boshqa joyga tegish shart emas.

Taymer muddati: o'sha faylda `const HOURS = 24`.

## 7. Rasmni almashtirish

`public/cover.jpg` va `public/jasur.jpg` — shu fayllarni almashtiring, kodga tegmang.
Tavsiya: cover 900×1390 yoki undan katta, JPEG, 150 KB atrofida.

Cover kompozitsiyasi: yuz **yuqori yarmida** bo'lsin — play tugmasi va sarlavha pastda turadi.

---

## 8. Tekshirish ro'yxati

- [ ] Environment Variables to'ldirildi
- [ ] Test lid yuborildi → Telegram gruppaga tushdi
- [ ] Bitrixga ham tushdi (agar ulangan bo'lsa)
- [ ] `/bot` sahifasi ochildi va botga o'tkazdi
- [ ] UTM li havola bilan kirilganda gruppadagi "Kelgan joy" to'ldi
- [ ] iPhone Safari + Android Chrome da tekshirildi
- [ ] Taymer ishlayapti va sahifa yangilanganda nolga qaytmayapti

## 9. UTM havolalari

```
?utm_source=instagram&utm_medium=stories&utm_campaign=vsl3&utm_content=story
?utm_source=instagram&utm_medium=bio&utm_campaign=vsl3&utm_content=bio
?utm_source=telegram&utm_medium=channel&utm_campaign=vsl3&utm_content=asosiy_kanal
?utm_source=youtube&utm_medium=vsl&utm_campaign=vsl3&utm_content=vsl_1
```

Meta Ads → Ad → **URL parameters**:

```
utm_source=facebook&utm_medium=paid&utm_campaign=vsl3&utm_content={{ad.name}}
```
