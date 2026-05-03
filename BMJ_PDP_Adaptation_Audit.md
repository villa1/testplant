# BMJ PDP Adaptation Audit
## Product Detail Page Readiness for `payloadbmj`

**Status:** Adaptation Reference  
**Berlaku untuk:** `/products/[slug]`  
**Scope:** kesiapan source code, codeflow, dan batas adaptasi PDP BMJ di atas Payload Ecommerce plugin  
**Tanggal:** May 2026  

---

## 1. Tujuan Dokumen

Dokumen ini menjawab satu pertanyaan utama:

> Apakah source code dan codeflow `payloadbmj` siap menerima logic PDP BMJ yang baru, dan bagian mana yang aman diadaptasi tanpa merusak fondasi ecommerce plugin?

Dokumen ini bukan field list produk. Fokusnya adalah:

- kesiapan source code
- kesiapan codeflow
- area yang aman ditambah
- area yang berisiko tinggi jika dipaksa
- keputusan adaptasi minimum yang paling selaras dengan project saat ini

---

## 2. Ringkasan Jawaban

Jawaban singkat:

- **Ya, PDP BMJ doable**
- **Tidak, spec PDP tidak bisa dipasang 1:1**
- **Ya, harus diadaptasi ke flow plugin ecommerce yang sekarang**

Secara praktis:

- enrichment content dan trust field: **siap**
- taxonomy PDP: **sudah siap**
- related content/product: **siap**
- SEO enrichment: **siap**
- logic baru seperti `status`, `orderType`, `RFQ`, `MOQ`: **partial ready**
- penggantian core variant/price/inventory system: **tidak siap untuk dipaksa**

---

## 3. Source Code Reality Saat Ini

### 3.1 Route & Data Flow Produk

Flow produk sekarang:

```text
/shop
  -> query products
  -> klik product card
  -> /products/[slug]
  -> pilih variant (jika enableVariants)
  -> Add To Cart
  -> cart
  -> checkout
```

File inti yang mengendalikan flow ini:

- [shop page](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/shop/page.tsx)
- [product page](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/products/[slug]/page.tsx)
- [product description](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/ProductDescription.tsx)
- [variant selector](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/VariantSelector.tsx)
- [stock indicator](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/StockIndicator.tsx)
- [add to cart](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/Cart/AddToCart.tsx)
- [checkout page](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/checkout/CheckoutPage.tsx)

### 3.2 Produk Masih Mengikuti Fondasi Plugin

Collection `products` saat ini masih berdiri di atas override plugin ecommerce, bukan schema custom penuh dari nol:

- [products override](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/collections/Products/index.ts)
- [plugins config](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/plugins/index.ts)

Artinya:

- variant system bawaan plugin masih aktif
- inventory system bawaan plugin masih aktif
- cart dan checkout masih membaca struktur data plugin
- PDP sekarang juga masih mengikuti struktur data plugin

---

## 4. Readiness Matrix

| Area | Status | Catatan |
|---|---|---|
| Primary category | Ready | Sudah ada dan sudah dipakai di shop |
| Attributes | Ready | Sudah ada di schema dan query `/shop` |
| Use cases | Ready | Sudah ada di schema dan query `/shop` |
| Additional botanical fields | Ready | Aman ditambahkan ke `products` |
| Supply & trust fields | Ready | Aman ditambahkan ke `products` |
| Related articles | Ready | Tinggal tambah relationship ke `posts` |
| Related products | Ready | Sudah ada |
| Product gallery kontekstual | Ready | Aman sebagai field tambahan |
| Video URL | Ready | Aman sebagai field tambahan |
| PDP structured data enrichment | Ready | Perlu update komponen PDP |
| `status` field produk | Partial Ready | Perlu ubah logic tombol dan stock display |
| `orderType` field produk | Partial Ready | Perlu cabang CTA baru di PDP |
| MOQ per variant | Partial Ready | Perlu extend variant data dan validasi UI/cart |
| RFQ flow dari PDP | Partial Ready | Perlu CTA ke `/kontak`, tapi tidak perlu ubah checkout |
| Ganti `title` ke `name` | Not Recommended | Akan memutus banyak asumsi code existing |
| Ganti `gallery` ke `images` | Not Recommended | `gallery` sudah dipakai listing dan PDP |
| Ganti variant plugin menjadi array custom | High Risk | Ini menyentuh core flow plugin ecommerce |
| Ganti pricing base dari `priceInUSD` ke field custom | High Risk | Menyentuh PDP, listing, cart, checkout, schema |

---

## 5. Mapping Spec PDP ke Struktur Project

### 5.1 Yang Harus Dipertahankan dari Project

Field / flow berikut **harus dipertahankan**:

- `title`
- `slug`
- `description`
- `gallery`
- `enableVariants`
- `variants`
- `priceInUSD`
- `inventory`
- `meta`
- `/products/[slug]`

Kenapa:

- semuanya sudah dipakai live di flow plugin
- sudah dibaca oleh PDP, product card, cart, dan checkout
- mengganti ini berarti refactor fondasi ecommerce, bukan adaptasi

### 5.2 Yang Aman Ditambahkan

Field berikut aman ditambahkan ke `products`:

- `nameLatin`
- `sunRequirement`
- `waterRequirement`
- `growthRate`
- `plantCondition`
- `family`
- `nativeRegion`
- `plantHeight`
- `plantSpread`
- `idealSoil`
- `specialFeature`
- `status`
- `orderType`
- `productNote`
- `originLocation`
- `supplyNote`
- `qualityNote`
- `productGallery`
- `videoUrl`
- `relatedArticles`
- `canonicalUrl`

Kenapa:

- tidak merusak plugin schema
- tidak memaksa perubahan cart
- bisa dirender bertahap di PDP
- lebih banyak menambah context daripada mengubah kontrak core

### 5.3 Yang Harus Diadaptasi, Bukan Diikuti Mentah

#### `name`

Spec awal memakai `name`, tetapi project memakai `title`.

Keputusan:

- **tetap pakai `title`**
- jangan rename ke `name`

#### `images`

Spec awal memakai `images`, tetapi project memakai `gallery`.

Keputusan:

- **tetap pakai `gallery`**
- jika butuh galeri kontekstual, tambahkan field baru `productGallery`

#### `categories`

Spec awal mengusulkan `hasMany: false`.

Keputusan:

- tetap gunakan relationship existing
- pertahankan validasi bahwa BMJ hanya boleh memilih 1 effective primary category

#### `status`

Spec awal memakai field `status`, tetapi pada `payloadbmj` ini bertabrakan dengan enum status internal Payload pada collection `products`.

Keputusan:

- **gunakan `availabilityStatus` sebagai nama field teknis**
- label admin dan label frontend tetap boleh dibaca sebagai `Status Produk`

Ini adalah adaptasi wajib agar migration schema tetap aman.

#### `variants`

Spec awal mengusulkan array custom variant sendiri.

Keputusan:

- **jangan ganti variant system plugin**
- extend seminimal mungkin di atas variant plugin jika memang perlu MOQ / note

---

## 6. Codeflow Impact Analysis

### 6.1 PDP Rendering

Saat ini PDP merender:

- metadata dari `product.meta`
- galeri dari `product.gallery`
- deskripsi dari `product.description`
- variant selector jika `enableVariants = true`
- stock dari inventory existing
- add to cart langsung

Sumber:

- [product page](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/products/[slug]/page.tsx)
- [product description](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/ProductDescription.tsx)

Implikasi:

- field display tambahan aman ditambahkan
- logic tombol tidak bisa diubah sembarangan karena saat ini `AddToCart` diasumsikan selalu jalur utama

### 6.2 Variant Selection

Saat ini varian dibaca dari:

- `product.enableVariants`
- `product.variantTypes`
- `product.variants`

Pilihan variant mengubah query param di URL dan menentukan:

- variant aktif
- stock variant
- add to cart payload

Sumber:

- [variant selector](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/VariantSelector.tsx)
- [add to cart](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/Cart/AddToCart.tsx)
- [stock indicator](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/StockIndicator.tsx)

Implikasi:

- schema variant custom baru akan bentrok langsung
- MOQ lebih aman ditambahkan sebagai layer tambahan di variant plugin, bukan membuat variant system tandingan

### 6.3 Cart & Checkout

Cart dan checkout saat ini masih sepenuhnya price/inventory-driven:

- add to cart menambah `product` + `variant`
- checkout menghitung subtotal dari `priceInUSD`
- stock dihitung dari inventory produk atau inventory variant

Sumber:

- [add to cart](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/Cart/AddToCart.tsx)
- [checkout](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/checkout/CheckoutPage.tsx)
- [price component](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/Price.tsx)

Implikasi:

- logic `rfq` bisa ditambahkan di PDP tanpa merusak checkout
- tetapi logic pricing dan variant tidak boleh diganti mendadak

---

## 7. Logic Baru: Mana yang Aman Sekarang

### 7.1 Aman Masuk Sekarang

- botanical detail
- expertise detail
- supply & trust section
- related articles
- related products
- contextual gallery
- video URL
- better JSON-LD
- breadcrumb JSON-LD

### 7.2 Aman, Tapi Butuh UI Logic Tambahan

- `status`
- `orderType`
- RFQ button ke `/kontak`
- hide/show add-to-cart berdasarkan kombinasi `status` + `orderType`

Ini aman karena:

- tidak mengubah cart schema
- hanya menambah cabang perilaku di PDP

### 7.3 Bisa Masuk, Tapi Harus Hati-Hati

- `MOQ`
- `moqNote`

Kenapa:

- harus sinkron dengan selected variant
- harus memblokir add-to-cart saat qty belum memenuhi minimum
- saat ini quantity handling terjadi di cart, bukan di PDP

Artinya:

- doable
- tapi tidak bisa dianggap hanya field tambahan

### 7.4 Jangan Dipaksa di Fase Ini

- migrasi penuh ke IDR-only custom price field
- custom variant array baru
- penggantian total inventory flow
- penghapusan `enableVariants` / `variantTypes` / `variants` plugin

---

## 8. Adaptation Decision

### 8.1 Keputusan Teknis yang Direkomendasikan

Untuk menjaga source code tetap stabil, PDP BMJ harus dibangun dengan aturan ini:

1. **Pertahankan product core existing**
2. **Tambahkan field enrichment di atasnya**
3. **Tambahkan logic `status` dan `orderType` di layer UI PDP**
4. **Tunda perubahan berat di variant/pricing flow**

### 8.2 Bentuk Adaptasi yang Benar

#### Group yang memakai field existing

- `title`
- `slug`
- `description`
- `gallery`
- `meta`
- `categories`
- `attributes`
- `useCases`
- `relatedProducts`

#### Group yang ditambahkan sebagai enrichment

- karakteristik fisik
- botanical & expertise
- supply & trust
- product gallery kontekstual
- video
- related articles
- canonical URL

#### Group yang harus diadaptasi ke plugin flow

- status
- orderType
- MOQ
- variant note

---

## 9. Final Readiness Verdict

### Verdict

`payloadbmj` **siap** untuk:

- PDP BMJ yang lebih kaya konten
- PDP BMJ yang lebih kuat secara E-E-A-T
- PDP BMJ yang lebih siap secara SEO
- PDP BMJ dengan cabang CTA `Beli` vs `RFQ`

`payloadbmj` **belum siap untuk dipaksa** menjadi:

- schema produk baru dari nol
- variant system baru dari nol
- pricing system baru dari nol

### Artinya

Kalau target kita adalah:

- memperkaya PDP
- memperkuat sinyal trust
- menambah logic bisnis BMJ di level produk

maka source code sekarang **cukup siap**.

Kalau targetnya adalah:

- menimpa arsitektur plugin ecommerce
- mengganti flow variant dan checkout mendasar

maka itu sudah masuk refactor besar dan sebaiknya tidak dicampur dengan fase PDP V1 ini.

---

## 10. Next Step yang Paling Benar

Urutan implementasi yang paling sehat:

1. adaptasi field spec PDP ke schema existing `products`
2. tambahkan field enrichment yang aman
3. implementasikan `status` + `orderType` di PDP UI
4. tambahkan related articles + productGallery + trust sections
5. upgrade JSON-LD dan breadcrumb
6. baru evaluasi MOQ

Jangan dibalik.

MOQ, pricing adaptation, dan RFQ behavior yang lebih dalam sebaiknya datang setelah PDP enrichment dan CTA branching stabil.

---

## 11. Evaluasi MOQ

### 11.1 Temuan Teknis

Setelah memeriksa flow plugin ecommerce yang aktif di `payloadbmj`, MOQ ternyata **lebih feasible daripada dugaan awal**, tetapi tetap bukan perubahan trivial.

Temuan penting:

- `useCart.addItem` dari plugin ecommerce mendukung parameter `quantity` awal
- cart juga sudah punya `incrementItem` dan `decrementItem`
- quantity item dikelola di cart modal, bukan di PDP

Sumber flow:

- [AddToCart](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/Cart/AddToCart.tsx)
- [CartModal](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/Cart/CartModal.tsx)
- [EditItemQuantityButton](/C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/Cart/EditItemQuantityButton.tsx)

### 11.2 Kesimpulan MOQ

MOQ **doable**, tetapi butuh 3 perubahan terkoordinasi:

1. field MOQ harus menempel ke layer variant yang benar
2. PDP harus punya quantity input atau pilihan kuantitas awal
3. cart increment/decrement harus tahu kapan quantity minimum belum terpenuhi

### 11.3 Risiko Jika Dipasang Tergesa

Kalau MOQ dipasang tanpa quantity-aware PDP:

- tombol `Add To Cart` hanya menambahkan 1 item
- produk dengan MOQ 10 akan langsung masuk cart dalam kondisi invalid
- validasi baru terjadi terlambat atau malah tidak terjadi sama sekali

Ini buruk untuk UX dan membingungkan buyer.

### 11.4 Keputusan Fase Ini

Untuk fase saat ini:

- **PDP enrichment dan `availabilityStatus/orderType` boleh jalan sekarang**
- **MOQ belum saya implementasikan dulu**
- MOQ sebaiknya masuk sebagai fase berikutnya setelah diputuskan:
  - field MOQ akan ditempel ke collection/variant layer mana
  - quantity selector di PDP akan didesain seperti apa
  - validasi minimum dilakukan di PDP saja, cart saja, atau keduanya

### 11.5 Verdict MOQ

- **Secara arsitektur: feasible**
- **Secara effort: menengah**
- **Secara prioritas: setelah PDP enrichment stabil**

---

## 12. Compatible Now vs Deferred

Bagian ini adalah keputusan operasional final untuk tim dev.

Prinsipnya:

- **Compatible Now** = aman dikerjakan sekarang di atas codeflow existing
- **Partial / Phase Next** = bisa dilakukan, tetapi butuh cabang logic tambahan dan sebaiknya masuk fase berikutnya
- **Deferred** = jangan dipaksakan sekarang karena menyentuh fondasi plugin/cart/checkout terlalu dalam

### 12.1 Compatible Now

| Item | Status | Catatan |
|---|---|---|
| `title`, `slug`, `description`, `gallery` existing | Compatible Now | Dipertahankan sebagai fondasi PDP |
| `categories`, `attributes`, `useCases` | Compatible Now | Sudah selaras dengan shop BMJ |
| `nameLatin` | Compatible Now | Enrichment aman |
| Karakteristik fisik | Compatible Now | Enrichment aman |
| Botanical & expertise fields | Compatible Now | Enrichment aman |
| Supply & trust fields | Compatible Now | Enrichment aman |
| `productGallery` | Compatible Now | Tidak bentrok dengan `gallery` existing |
| `videoUrl` | Compatible Now | Aman sebagai field tambahan |
| `relatedArticles` | Compatible Now | Aman sebagai relationship ke `posts` |
| `relatedProducts` | Compatible Now | Sudah ada dan tetap kompatibel |
| `meta.canonicalUrl` | Compatible Now | Aman sebagai field SEO tambahan |
| `availabilityStatus` | Compatible Now | Pengganti adaptif dari `status` |
| `orderType` | Compatible Now | Aman untuk CTA branching PDP |
| JSON-LD product + breadcrumb yang lebih kaya | Compatible Now | Tidak mengganggu cart/checkout |
| CTA branching `Beli` vs `RFQ` di PDP | Compatible Now | Selama hanya mengatur tombol PDP |

### 12.2 Partial / Phase Next

| Item | Status | Kenapa Belum Didorong Sekarang |
|---|---|---|
| MOQ | Partial / Phase Next | Butuh quantity-aware PDP dan validasi cart |
| `moqNote` | Partial / Phase Next | Bergantung pada implementasi MOQ |
| Quantity selector di PDP | Partial / Phase Next | Menyentuh add-to-cart behavior |
| RFQ flow yang lebih dalam dari sekadar CTA ke `/kontak` | Partial / Phase Next | Butuh keputusan integrasi dengan order flow |
| Listing/shop awareness untuk `availabilityStatus` | Partial / Phase Next | PDP sudah siap, tapi listing belum disesuaikan penuh |
| Product card awareness untuk `RFQ-only` atau `konsultasikan` | Partial / Phase Next | Butuh keputusan merchandising di grid |

### 12.3 Deferred

| Item | Status | Alasan |
|---|---|---|
| Custom variant array baru | Deferred | Bentrok dengan variant system plugin ecommerce |
| Penggantian total `variants` bawaan plugin | Deferred | Refactor besar pada PDP, cart, checkout |
| Ganti `gallery` menjadi `images` sebagai fondasi baru | Deferred | `gallery` sudah dipakai listing dan PDP |
| Ganti `title` menjadi `name` sebagai field utama | Deferred | Terlalu banyak asumsi code existing akan ikut pecah |
| Ganti pricing core dari `priceInUSD` ke model custom penuh | Deferred | Menyentuh listing, PDP, cart, checkout, subtotal |
| Penggantian inventory flow bawaan plugin | Deferred | Menyentuh varian, stock, dan cart behavior |
| Pengubahan checkout flow sebagai bagian dari pekerjaan PDP | Deferred | Scope terpisah, tidak perlu dicampur sekarang |

### 12.4 Final Lock

Untuk fase PDP BMJ saat ini, keputusan teknis yang terkunci adalah:

1. **Kerjakan yang compatible sekarang**
2. **Simpan MOQ dan quantity-aware behavior ke fase berikutnya**
3. **Jangan sentuh fondasi variant/cart/checkout plugin dalam fase PDP enrichment**

Ini adalah garis batas yang harus dijaga agar project tetap stabil sambil tetap bergerak ke arah PDP BMJ yang lebih matang.

---

*Dokumen ini menjadi acuan adaptasi PDP BMJ di atas codebase `payloadbmj`. Jika ada keputusan baru, revisi harus selalu memeriksa dua hal sekaligus: kebutuhan bisnis BMJ dan kestabilan codeflow plugin ecommerce yang sudah aktif.*
