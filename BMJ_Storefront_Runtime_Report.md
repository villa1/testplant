# BMJ Storefront Runtime Report
## PT Bumi Mekarsari Jaya - Shop & PDP QA

**Status:** Ready to Forward  
**Project:** `payloadbmj`  
**Scope:** `/shop` and `/products/[slug]`  
**Tanggal:** 2026-05-02  
**Author:** Codex technical audit

---

## 1. Ringkasan Eksekutif

Selama QA storefront BMJ, ditemukan beberapa masalah nyata di layer runtime dan presentation:

1. query `/shop` sempat tidak sesuai kontrak `populate` Payload
2. PDP memunculkan error browser terkait image `src=""` / missing `src`
3. ada `console.*` aktif di source app yang tidak layak dibawa ke runtime production/dev
4. dev runtime sempat tidak stabil untuk PDP, tetapi production build dan production runtime tetap sehat

Masalah yang bersifat **core bug** sudah diperbaiki.  
Masalah yang tersisa sekarang lebih banyak ke **polish / warning non-blocking**, bukan fondasi logic ecommerce.

---

## 2. Konteks Audit

Audit dilakukan setelah implementasi:

- taxonomy BMJ untuk ecommerce
- category / attribute / use case filtering di `/shop`
- adaptasi PDP BMJ pada fondasi Payload Ecommerce plugin
- CTA branching `Beli Sekarang` vs `Request Quotation`

Dokumen terkait:

- [BMJ_Ecommerce_Categorization.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Ecommerce_Categorization.md)
- [BMJ_PDP_Adaptation_Audit.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_PDP_Adaptation_Audit.md)

---

## 3. Temuan Teknis

### Issue 1 - `populate` `/shop` tidak sesuai kontrak Payload

**Gejala**

- TypeScript error saat validasi:
  - field `attributes` tidak dikenal pada object `populate`
- risiko query storefront gagal atau typing drift

**Akar masalah**

Pada `payload.find(...)`, object `populate` harus memakai **collection slug relasi**, bukan nama field relasi di `products`.

Contoh salah:

```ts
populate: {
  attributes: { title: true },
  useCases: { title: true },
}
```

Contoh benar:

```ts
populate: {
  productAttributes: { title: true },
  productUseCases: { title: true },
}
```

**File terdampak**

- [src/app/(app)/shop/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/shop/page.tsx)

**Status**

- `Fixed`

**Catatan**

Ini bug nyata di query layer, bukan sekadar style issue.

---

### Issue 2 - PDP memunculkan error image `src=""` dan `missing src`

**Gejala**

Di browser console muncul error seperti:

```text
An empty string ("") was passed to the src attribute.
Image is missing required "src" property: <img>
```

Di screenshot QA, area gallery PDP juga terlihat kosong di sisi kiri.

**Akar masalah**

Komponen media image mengirim `src=""` ke `next/image` ketika resource media tidak punya URL valid.

Potongan logic lama secara efektif:

```ts
let src = srcFromProps || ''
...
src = url?.startsWith('http') ? url : url || ''
```

Akibatnya:

- `next/image` menerima string kosong
- browser console memunculkan error runtime
- gallery/PDP bisa terlihat blank

**File terdampak**

- [src/components/Media/Image/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/Media/Image/index.tsx)
- surface yang memakai komponen ini:
  - [src/components/product/Gallery.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/Gallery.tsx)
  - [src/components/ProductGridItem/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/ProductGridItem/index.tsx)
  - [src/app/(app)/products/[slug]/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/products/[slug]/page.tsx)

**Perbaikan**

Hardening dilakukan di dua layer:

1. **Media guard**

Komponen image sekarang tidak pernah meneruskan `src=""` ke `next/image`.

2. **Server-side normalization + intentional fallback**

- gallery produk dinormalisasi di loader PDP
- `productGallery` juga dinormalisasi
- PDP dan product card sekarang memakai fallback visual resmi jika media utama belum valid

Implementasi utama:

- [src/utilities/productMedia.ts](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/utilities/productMedia.ts)
- [src/components/product/ProductImageFallback.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/ProductImageFallback.tsx)
- [public/media/bmj-product-placeholder.svg](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/public/media/bmj-product-placeholder.svg)

Invariant yang sekarang dipakai:

> PDP harus punya visual utama yang valid, atau fallback visual yang intentional.

**Status**

- `Fixed`

**Catatan**

Ini adalah akar utama error console yang terlihat saat membuka PDP sample seperti `Wedelia`.

---

### Issue 3 - `console.*` aktif di runtime app

**Gejala**

Beberapa file app masih mengandung `console.log`, `console.warn`, atau `console.error` aktif.

Ini bertentangan dengan standard clean runtime untuk storefront/app production.

**Akar masalah**

Logging debugging tertinggal di layer app, bukan di script utilitas/admin saja.

**File yang dibersihkan**

- [src/app/(app)/(account)/orders/[id]/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/(account)/orders/[id]/page.tsx)
- [src/blocks/Form/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/Form/Component.tsx)
- [src/components/forms/CheckoutForm/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/forms/CheckoutForm/index.tsx)
- [src/components/forms/FindOrderForm/sendOrderAccessEmail.ts](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/forms/FindOrderForm/sendOrderAccessEmail.ts)

**Penyesuaian**

- logging yang memang perlu di server diganti ke `payload.logger.error(...)`
- logging debug yang tidak perlu dihapus

**Status**

- `Fixed`

**Verifikasi**

Scan `src/**/*.ts(x)` tidak lagi menemukan `console.log/warn/error/info/debug` aktif.  
Yang tersisa hanya komentar.

---

### Issue 4 - PDP dev runtime sempat timeout, tetapi production runtime sehat

**Gejala**

- pada dev server `:3000`, PDP sempat timeout/hang
- `/shop` bisa hidup, tetapi beberapa request PDP tidak konsisten

**Investigasi**

Hal berikut sudah diverifikasi:

- query produk Payload untuk sample BMJ cepat
- `pnpm exec tsc --noEmit` lulus
- `pnpm build` lulus
- route `/products/[slug]` terbuild normal
- production runtime memberi `200 OK` untuk:
  - `/shop`
  - `/products/wedelia`

**Kesimpulan**

Masalah ini lebih dekat ke:

- state dev server yang kotor / stale
- dev runtime Turbopack
- bukan bug core pada query produk atau schema BMJ

**Status**

- `Not a blocking product-code issue`
- `Monitor only`

**Rekomendasi**

Jika PDP dev kembali aneh:

1. stop semua instance `next dev`
2. hapus `.next`
3. start dev server bersih
4. ulangi cek PDP

---

### Issue 5 - Warning non-blocking yang masih mungkin muncul

#### 5a. LCP image warning

**Gejala**

```text
Image was detected as the Largest Contentful Paint (LCP).
Please add loading="eager" if this image is above the fold.
```

**Makna**

- bukan error logic
- warning performa/optimasi

**Status**

- `Deferred / optimization`

#### 5b. Stripe over HTTP warning

**Gejala**

```text
You may test your Stripe.js integration over HTTP.
However, live Stripe.js integrations must use HTTPS.
```

**Makna**

- normal untuk local development
- bukan bug code

**Status**

- `Expected in local dev`

---

## 4. Perubahan Teknis yang Dilakukan

### Shop

- perbaikan `populate` query shop
- localization metadata dan hasil filter
- product card memakai purchase state BMJ untuk:
  - status badge
  - RFQ vs direct purchase copy
  - secondary chips
  - fallback visual terkontrol saat image utama tidak valid

File utama:

- [src/app/(app)/shop/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/shop/page.tsx)
- [src/components/ProductGridItem/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/ProductGridItem/index.tsx)

### PDP

- query produk diringankan ke `depth: 1`
- `populate` diarahkan secara lebih sempit
- logic BMJ purchase state dipakai di PDP
- gallery dinormalisasi di server layer sebelum dipakai frontend
- fallback visual muncul jika visual utama belum tersedia

File utama:

- [src/app/(app)/products/[slug]/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/products/[slug]/page.tsx)
- [src/components/product/ProductDescription.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/ProductDescription.tsx)
- [src/utilities/getProductPurchaseState.ts](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/utilities/getProductPurchaseState.ts)

### Media

- guard `src` invalid pada image component
- placeholder visual resmi untuk missing product media

File utama:

- [src/components/Media/Image/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/Media/Image/index.tsx)

---

## 5. Verifikasi yang Sudah Dilakukan

### Type Safety

```bash
pnpm exec tsc --noEmit
```

Status:

- `Pass`

### Production Build

```bash
pnpm build
```

Status:

- `Pass`

### Runtime Production Smoke Check

Checked:

- `/shop`
- `/products/wedelia`

Status:

- `200 OK`

---

## 6. Status Akhir

### Fixed

- `/shop` populate mismatch
- PDP image `src=""` / missing `src`
- console noise dari source app

### Non-blocking / Expected

- LCP image warning
- Stripe local HTTP warning

### Deferred

Masih tetap di luar scope compatible-now:

- MOQ enforcement
- deep cart quantity validation
- checkout/RFQ flow redesign
- variant system refactor

---

## 7. Rekomendasi ke Dev

1. Treat issue `src=""` sebagai regression class yang harus dijaga di semua surface media.
2. Jangan tambahkan `console.*` ke layer app/runtime; gunakan logger server hanya bila memang perlu.
3. Jika PDP dev terasa tidak stabil, validasi lewat:
   - `pnpm exec tsc --noEmit`
   - `pnpm build`
   - production smoke test
4. Untuk fase berikutnya, fokus ke:
   - visual polish PDP/shop
   - performance tuning media/LCP
   - MOQ hanya setelah quantity flow disepakati

---

## 8. Forward Note

Jika report ini diforward ke dev, poin yang paling penting adalah:

- core bug storefront yang nyata **sudah ditemukan dan ditutup**
- tidak semua console issue berasal dari logic ecommerce BMJ
- production build/routing saat ini **aman**
- sisa pekerjaan sekarang lebih banyak di **visual polish dan optimization**, bukan fondasi schema/filtering
