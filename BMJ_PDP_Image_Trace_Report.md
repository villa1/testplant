# BMJ PDP Image Trace Report
## PT Bumi Mekarsari Jaya - Product Detail Page Media Contract

**Status:** Ready to Forward  
**Project:** `payloadbmj`  
**Scope:** `/products/[slug]` and supporting media flow  
**Primary Case:** `/products/wedelia`  
**Tanggal:** 2026-05-02  
**Author:** Codex technical trace

---

## 1. Executive Summary

Masalah image pada PDP bukan sekadar warning UI. Akar masalahnya ada pada **data contract antara Payload CMS dan frontend PDP**.

Gejala yang terlihat:

- card produk di `/shop` untuk beberapa produk menampilkan placeholder BMJ
- PDP `/products/wedelia` sempat menampilkan placeholder BMJ padahal produk memiliki media nyata
- browser sebelumnya juga memunculkan error runtime terkait image `src=""`

Kesimpulan trace:

1. **Placeholder di shop card tidak selalu bug**
   - jika produk memang tidak punya media utama valid, fallback BMJ adalah perilaku yang benar
2. **Placeholder di PDP `Wedelia` adalah bug**
   - penyebabnya bukan file media hilang
   - penyebabnya adalah query PDP yang melakukan `populate.media` terlalu sempit
3. **Fix final**
   - `populate.media` pada loader PDP harus menyertakan `filename`
   - gallery dan contextual gallery harus dinormalisasi sebelum dirender
   - komponen image tidak boleh pernah meneruskan `src=""` ke `next/image`

---

## 2. Affected Surface

### URL yang diamati

- `http://localhost:3000/shop`
- `http://localhost:3000/products/wedelia`

### Komponen/loader yang relevan

- `src/app/(app)/products/[slug]/page.tsx`
- `src/utilities/productMedia.ts`
- `src/components/product/Gallery.tsx`
- `src/components/ProductGridItem/index.tsx`
- `src/components/Grid/tile.tsx`
- `src/components/Media/Image/index.tsx`
- `src/components/product/ProductImageFallback.tsx`

---

## 3. Symptoms Observed

### 3.1 Shop page

Di `/shop`, perilaku berikut terlihat:

- `Teh-Tehan` card menampilkan placeholder BMJ
- `Wedelia` card menampilkan foto nyata

Interpretasi:

- ini menunjukkan fallback di card layer sudah bekerja
- placeholder pada card belum tentu bug, selama data produk memang tidak punya media utama valid

### 3.2 Product detail page

Di `/products/wedelia`, yang terlihat:

- panel image kiri menampilkan placeholder BMJ
- seharusnya produk ini menampilkan foto nyata

Interpretasi:

- bug bukan pada fallback component
- bug ada di data yang diterima PDP saat render

### 3.3 Runtime issue sebelumnya

Sebelum hardening, browser sempat memunculkan:

```text
An empty string ("") was passed to the src attribute.
Image is missing required "src" property
```

Issue ini sudah ditutup di layer komponen image, tetapi trace PDP `Wedelia` menunjukkan masih ada masalah level lebih dalam: **media URL tidak selalu sampai ke PDP walaupun media file ada**.

---

## 4. Root Cause

### 4.1 Immediate root cause

PDP loader melakukan `populate.media` dengan field select yang terlalu sempit.

Ketika `filename` tidak ikut dipilih, field `url` media dari Payload tidak termaterialisasi secara konsisten pada response yang dipakai PDP.

Akibatnya:

- `product.gallery` terlihat kosong atau tidak valid di loader PDP
- helper normalisasi menganggap tidak ada media yang layak dipakai
- fallback placeholder dirender

### 4.2 Why this is architectural, not cosmetic

Masalah ini menyentuh tiga layer sekaligus:

1. **CMS data contract**
   - media relation ada, tetapi response frontend tidak lengkap
2. **server-side loader**
   - data tidak dinormalisasi cukup ketat sebelum dirender
3. **rendering policy**
   - frontend harus punya fallback intentional, bukan empty string fallback

Jadi ini bukan sekadar "gambar belum ada". Ini adalah mismatch antara **apa yang ada di CMS** dan **apa yang diambil loader PDP**.

---

## 5. Investigation Path

Trace dilakukan melalui beberapa tahap:

### Step 1 - Validasi symptom visual

Dari QA visual:

- `/shop` menampilkan mix antara real image dan fallback
- `/products/wedelia` menampilkan fallback walaupun sample product seharusnya punya image

### Step 2 - Validasi data product langsung dari Payload

Product `Wedelia` diperiksa langsung dari Payload untuk memastikan:

- document produk memang ada
- gallery media memang terhubung
- masalah bukan pada data authoring semata

Hasil:

- media memang tersedia di source data

### Step 3 - Trace output HTML server

HTML hasil render server untuk `/products/wedelia` diperiksa.

Sebelum fix, jejak yang muncul:

- PDP sudah memilih placeholder
- data terembed pada page menunjukkan `gallery` efektif kosong/tidak usable
- `meta.image.url` juga tidak stabil

### Step 4 - Narrowing query contract

Query PDP dibandingkan dalam dua kondisi:

1. `populate.media` tanpa `filename`
2. `populate.media` dengan `filename`

Hasil:

- tanpa `filename` -> `url` media bisa `null`
- dengan `filename` -> `url` media muncul dengan benar

Ini mengonfirmasi bahwa bug utamanya ada pada **shape response media** yang dibentuk oleh query PDP.

---

## 6. Technical Evidence

### 6.1 Loader PDP

Loader PDP ada di:

- `src/app/(app)/products/[slug]/page.tsx`

Bagian penting:

- gallery dinormalisasi di loader
- fallback hanya boleh dipakai jika hasil normalisasi memang tidak punya media valid

### 6.2 Media normalization layer

Helper normalization ada di:

- `src/utilities/productMedia.ts`

Tanggung jawab helper ini:

- memfilter entry gallery yang tidak punya media URL valid
- menentukan primary media produk
- menyediakan satu contract yang lebih deterministic ke frontend

### 6.3 Image guard layer

Guard komponen image ada di:

- `src/components/Media/Image/index.tsx`

Hardening yang sudah diterapkan:

- `next/image` tidak lagi menerima `src=""`
- jika URL tidak valid, komponen tidak memaksa render image kosong

### 6.4 Intentional fallback layer

Fallback resmi sekarang ada di:

- `src/components/product/ProductImageFallback.tsx`
- `public/media/bmj-product-placeholder.svg`

Ini penting karena:

- fallback sekarang intentional
- bukan hasil samping dari string kosong atau broken media object

---

## 7. Fix Implemented

### 7.1 Query contract fix

Loader PDP sekarang menyertakan:

```ts
populate: {
  media: {
    alt: true,
    filename: true,
    height: true,
    url: true,
    width: true,
  },
}
```

Kenapa ini penting:

- `filename` membuat response media cukup lengkap agar `url` ter-resolve konsisten

### 7.2 Server-side normalization

Response produk dari loader sekarang dinormalisasi sebelum dikirim ke komponen:

- `gallery`
- `productGallery`

Artinya frontend tidak lagi bekerja dengan shape gallery mentah yang longgar.

### 7.3 Frontend rendering policy

Render policy sekarang:

- jika gallery valid ada -> render gallery asli
- jika tidak ada -> render fallback BMJ

Itu berlaku untuk:

- PDP main gallery
- grid/product cards
- image tile yang relevan

### 7.4 Empty string image bug hardening

Layer image komponen sudah dihardening agar:

- tidak lagi meneruskan `src=""`
- tidak memicu error `missing src` dari `next/image`

---

## 8. Expected Behavior After Fix

### `/shop`

- produk dengan media valid menampilkan image nyata
- produk tanpa media valid menampilkan placeholder BMJ

### `/products/wedelia`

- harus menampilkan image nyata, bukan placeholder

### Runtime

- tidak ada lagi error `src=""`
- tidak ada lagi `missing required "src"` dari flow ini

---

## 9. Residual Risk and Notes

### 9.1 Remaining valid fallback cases

Jika sebuah produk memang belum memiliki media valid, placeholder tetap akan muncul. Itu bukan bug.

Webdev perlu membedakan dua kondisi:

1. **Expected fallback**
   - data produk belum punya media valid
2. **Unexpected fallback**
   - data produk punya media, tetapi loader/query gagal mematerialisasikan URL

### 9.2 Media contract dependency

Karena Payload media response di project ini sensitif terhadap field yang dipilih, webdev harus berhati-hati setiap kali:

- mempersempit `populate.media`
- menambah optimization select baru
- memindahkan query ke layer lain

Jika `filename` atau field pendukung lain dihilangkan lagi, bug yang sama bisa muncul ulang.

### 9.3 SEO impact

Kalau PDP fallback muncul padahal media nyata ada, dampaknya:

- perceived trust turun
- rich preview/social preview bisa ikut salah
- image relevance pada halaman produk melemah

---

## 10. Recommendations for Webdev

### Immediate

1. Pertahankan `filename: true` pada `populate.media` untuk PDP
2. Pertahankan normalization layer di `productMedia.ts`
3. Jangan gunakan fallback `|| ""` untuk image source
4. Pertahankan placeholder hanya sebagai intentional fallback

### Short-term hardening

1. Audit query lain yang memakai media select sempit
   - product listing
   - related products
   - article cards jika pakai pola serupa
2. Pastikan invariant ini berlaku:
   - "produk dengan media valid harus merender visual utama nyata"
3. Tambahkan regression check saat QA:
   - satu produk dengan media nyata
   - satu produk tanpa media

### Medium-term

1. Pertimbangkan utility bersama untuk semua query produk yang butuh media
2. Hindari duplikasi contract `populate.media` di banyak tempat
3. Dokumentasikan media select minimum yang aman untuk frontend

---

## 11. QA Checklist for Verification

Webdev dapat memakai checklist ini:

- [ ] `/shop` menampilkan image nyata untuk produk yang memang punya media
- [ ] `/shop` menampilkan placeholder BMJ hanya untuk produk tanpa media valid
- [ ] `/products/wedelia` menampilkan image nyata
- [ ] console browser tidak lagi memunculkan `src=""`
- [ ] console browser tidak lagi memunculkan `missing required "src"`
- [ ] hard refresh tidak mengembalikan placeholder salah pada produk yang punya media
- [ ] social/meta image tetap valid untuk produk dengan media

---

## 12. Final Verdict

Masalah utama PDP image sudah berhasil ditrace sampai akar arsitekturalnya:

- **bukan** file media hilang
- **bukan** fallback component yang salah
- **bukan** sekadar browser warning

Masalah sebenarnya adalah:

> **query PDP membentuk media contract yang terlalu sempit, sehingga URL image tidak selalu sampai ke frontend walaupun media ada di CMS**

Fix yang benar sudah diterapkan:

- query contract diperluas secara minimal dengan `filename: true`
- gallery dinormalisasi di server layer
- image rendering dihardening
- fallback dibuat intentional

Ini adalah fix yang layak untuk production hardening, bukan patch kosmetik.

