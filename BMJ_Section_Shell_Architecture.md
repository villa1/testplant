# BMJ Section Shell Architecture

## Purpose

Dokumen ini menjadi acuan arsitektur wrapper section untuk seluruh frontend BMJ, bukan hanya homepage.

Tujuannya:

- menjaga konsistensi struktural lintas app
- menghindari perbaikan visual per halaman yang saling bertabrakan
- memberi grammar yang jelas untuk transisi antar block dan antar page family
- memisahkan concern antara route composition, block composition, shell, dan content

Dokumen ini lahir dari investigasi gabungan terhadap:

- source code project `payloadbmj`
- pola section pada WordPress theme `gardyn`
- hasil eksperimen visual pada `SupplyCategories`, `ProcessSteps`, `TrustSignals`, dan `ProofGallery`

## Executive Summary

Masalah transisi visual di project ini bukan terutama ada di card, heading, atau font. Masalah utamanya ada di **wrapper-level architecture**.

Saat ini, setiap block pada jalur CMS page dibungkus oleh spacing global yang buta konteks di `src/blocks/RenderBlocks.tsx`, sementara tiap block juga mengelola shell dan padding sendiri-sendiri. Hasilnya:

- section dengan shell berbeda tetap terpotong ruang putih generik
- transisi antar block terasa patah
- setiap perbaikan wrapper berisiko menjadi tambal sulam
- homepage mudah drift dari shop, article, dan product pages jika tidak ada grammar lintas-app

Kesimpulan arsitektural:

- kita memerlukan **global shell primitive**
- tetapi **bukan global visual treatment tunggal**
- shell system harus berlaku lintas-app, lalu diadopsi per page family

## Alignment With Official Documentation

Penting untuk ditegaskan:

- istilah seperti `PageFrame`, `SectionShell`, `core layer`, `composition layer`, dan `feature layer` adalah **nomenklatur arsitektur internal kita**
- istilah tersebut **bukan nama resmi** dari React, Next.js, Tailwind, atau Payload

Namun, prinsip yang mendasarinya sejalan dengan dokumentasi resmi stack repo ini.

### React

React secara resmi mendorong pemecahan UI menjadi komponen dan hierarki yang jelas.

Rujukan:

- [Thinking in React](https://react.dev/learn/thinking-in-react)

Poin yang mendukung arsitektur ini:

- UI dipecah menjadi component hierarchy
- data mengalir dari parent ke child lewat props
- visual state dan composition dipikirkan sebagai struktur komponen, bukan template monolitik

Implikasinya untuk repo ini:

- pemisahan `SectionShell` dan `SectionContent` selaras dengan cara React menyusun hierarchy
- pembedaan core/composition/feature adalah interpretasi arsitektural yang kompatibel dengan React

### React Suspense

React mendokumentasikan `Suspense` sebagai boundary untuk menampilkan fallback saat children belum siap.

Rujukan:

- [React `<Suspense>` reference](https://react.dev/reference/react/Suspense)

Poin yang mendukung arsitektur ini:

- fallback adalah concern loading boundary
- fallback tidak sama dengan wrapper visual permanen

Implikasinya untuk repo ini:

- `Skeleton` memang harus dipisahkan dari `SectionShell`
- loading placeholder tidak boleh mengambil alih tanggung jawab wrapper section

### Next.js App Router

Next.js secara resmi memisahkan `page` dan `layout`, serta mendukung colocation dan nested layouts.

Rujukan:

- [Next.js Project Structure / Colocation](https://nextjs.org/docs/app/getting-started/project-structure#colocation)
- [Next.js Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

Poin yang mendukung arsitektur ini:

- file dapat dicolocate dengan aman
- `layout` adalah UI yang dibagi di beberapa halaman
- nested layouts membentuk hierarchy struktur

Implikasinya untuk repo ini:

- `RootLayout` dan `PageFrame` adalah lapisan yang sah secara arsitektural
- composer block dan shell section boleh hidup sebagai abstraction terpisah
- tidak ada kewajiban bahwa semua struktur harus digantung di route file secara datar

### Tailwind CSS v4

Tailwind v4 secara resmi menekankan CSS-first configuration dan theme variables.

Rujukan:

- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind theme variables](https://tailwindcss.com/docs/theme)

Poin yang mendukung arsitektur ini:

- design tokens dapat didefinisikan di CSS
- theme variables dapat dipakai kembali lintas project
- custom CSS dapat mengonsumsi token yang sama

Implikasinya untuk repo ini:

- shell system harus berdiri di atas token `globals.css`
- primitive seperti `SectionShell` dan `Skeleton` sebaiknya memakai token yang sama, bukan membuat sistem warna/spacing tandingan

### Payload CMS

Payload secara resmi mendukung blocks sebagai array konten campuran yang dirender oleh frontend.

Rujukan:

- [Payload Blocks Field](https://payloadcms.com/docs/fields/blocks)
- [Payload rich text blocks rendering](https://payloadcms.com/docs/rich-text/blocks)
- [Payload custom components overview](https://payloadcms.com/docs/custom-components/overview)

Poin yang mendukung arsitektur ini:

- blocks dirancang untuk pengalaman dynamic, mix-and-match
- frontend memiliki kontrol penuh atas render block
- Payload sendiri menekankan mengikuti best practice React dan Next.js

Implikasinya untuk repo ini:

- block registry seperti `RenderBlocks` adalah pattern yang valid
- tetapi Payload tidak memaksa spacing global `my-16`
- wrapper shell dan grammar section adalah tanggung jawab frontend architecture kita

### Conclusion

Jadi, dokumentasi resmi stack ini **tidak** akan memberi istilah seperti:

- `SectionShell`
- `PageFrame`
- `core vs composition layer`

Tetapi dokumentasi resmi **mendukung prinsip-prinsip** yang kita pakai untuk sampai ke abstraksi tersebut:

- component hierarchy
- layout hierarchy
- safe colocation
- Suspense boundaries
- token-driven styling
- frontend-controlled block rendering

## Current Repository Findings

### 1. CMS block pages already use a composer layer

File: `src/blocks/RenderBlocks.tsx`

`RenderBlocks` sudah benar sebagai block registry/composer, tetapi sebelumnya ia memaksakan rhythm visual melalui wrapper generik:

```tsx
<div className="my-16" key={index}>
  <Block ... />
</div>
```

Implementasi saat ini sudah melewati fase transisi awal:

- seluruh block yang ada di registry `RenderBlocks` sudah own shell secara eksplisit
- `RenderBlocks` sudah kembali ke peran registry/composer murni
- ownership spacing sudah berpindah ke `SectionShell` di level feature

Konsekuensi yang dulu muncul dari `my-16` murni adalah:

- tiap block mendapat `margin-top: 4rem`
- tiap block mendapat `margin-bottom: 4rem`
- dua block berturut-turut menghasilkan sekitar `8rem` ruang luar yang tidak tahu konteks
- semua shell section dipotong oleh ruang putih generik

Konsekuensi yang masih tersisa sekarang:

- beberapa feature masih memakai varian `plain` default dan belum mendapat tuning family-aware
- grammar shell sudah ada, tetapi subset per page family masih perlu dirapikan
- primitive `Skeleton` resmi sudah ada, tetapi adopsinya masih bertahap lintas family

### 2. Page-level frame already exists

File: `src/app/(app)/[slug]/page.tsx`

CMS pages saat ini memakai:

```tsx
<article className="pt-16 pb-24">
  <RenderHero {...hero} />
  <RenderBlocks blocks={layout} />
</article>
```

Artinya ada tiga lapis spacing yang dapat bertumpuk:

- route/page spacing
- global block spacing dari `RenderBlocks`
- internal padding per block

### 3. Wrapper patterns are mixed

Contoh block yang langsung memakai `section.container`:

- `src/blocks/HomeHero/Component.tsx`
- `src/blocks/HomeIdentity/Component.tsx`
- `src/blocks/SupplyCategories/Component.tsx`
- `src/blocks/ProcessSteps/Component.tsx`

Contoh block yang sudah memakai full-width shell lalu `container` di dalam:

- `src/blocks/ProofGallery/Component.tsx`
- `src/blocks/TrustSignals/Component.tsx`

Kedua pola ini valid, tetapi tetap harus dijaga lewat grammar shell yang sama agar tidak drift saat app berkembang.

### 4. SectionHeader is intentionally thin

File: `src/components/SectionHeader.tsx`

`SectionHeader` saat ini hanya menangani:

- title
- intro
- heading spacing kecil

Ia tidak mengatur:

- shell rhythm
- shell tone
- eyebrow
- full section entry/exit

Ini bukan bug, tetapi penting supaya `SectionHeader` tidak dibebani tugas yang salah.

### 5. The repo already has a global app shell

File: `src/app/(app)/layout.tsx`

Frontend app shell saat ini sudah benar secara tanggung jawab:

- font global app
- `Providers`
- header
- footer
- `main`

Artinya problem struktural yang sedang kita bahas **bukan** ada di root app shell, melainkan di lapisan page frame dan section composition.

### 6. Tailwind 4 token discipline already exists

File: `src/app/(app)/globals.css`

Repo ini sudah punya fondasi utility dan token yang jelas:

- token warna dan radius
- utility `container`
- font variables global
- Tailwind 4 custom variants

Kesimpulannya:

- sistem shell baru harus dibangun **di atas** grammar token ini
- jangan membuat sistem wrapper yang melawan `container`, token warna, atau CSS variable repo

### 7. Loading skeleton is still being systematized

Repo ini sekarang sudah punya komponen `Skeleton` bersama di `src/components/ui`, tetapi adopsinya belum merata ke seluruh app.

Yang ada saat ini:

- primitive `Skeleton` inti yang netral
- beberapa komposisi skeleton yang sudah mulai seragam di shop, PDP, dan utility/header
- beberapa `Suspense fallback={null}` yang memang masih sengaja dibiarkan karena boundary-nya terlalu kecil atau tidak layak diberi placeholder
- beberapa fallback kosong yang masih perlu diaudit lebih lanjut

Contoh:

- `src/components/ui/skeleton.tsx`
- `src/components/layout/search/FilterGroupSkeleton.tsx`
- `src/components/product/ProductSkeletons.tsx`
- `src/components/checkout/CheckoutPaymentSkeleton.tsx`
- `src/app/(app)/products/[slug]/page.tsx`

Ini penting karena wrapper architecture dan loading architecture harus dipikirkan bersama, tetapi **tidak boleh dicampur**.

## WordPress Lessons Worth Keeping

Tema WordPress `gardyn` tidak memisahkan section hanya dengan margin. Ia memakai **alternating shells**.

Pola yang teridentifikasi pada `home-2`:

- dark surface
- neutral split-layout
- pale green surface
- neutral split-layout
- patterned/parallax band
- neutral numbered-card surface
- pale green works surface

Pelajaran yang relevan:

- section identity datang dari wrapper shell
- transisi yang terasa baik biasanya terjadi karena pergantian canvas, surface, atau mood
- margin sendiri tidak cukup

Pelajaran yang **tidak** perlu dibawa mentah:

- bloat Elementor
- `background-attachment: fixed`
- Jarallax
- wrapper HTML builder yang dalam

## Architectural Principle

Frontend BMJ harus dianggap memiliki tiga lapisan berbeda:

1. **Page family**
2. **Section shell**
3. **Section content**

Jika ketiganya dicampur, maka perubahan visual di satu tempat akan merusak area lain.

Tambahan penting:

4. **Loading shell**

Loading shell adalah kerangka saat data atau client boundary belum siap. Ia bukan bagian dari visual wrapper biasa, tetapi harus mengikuti grammar struktural yang sama.

## Core Layer vs Composition Layer

Ini pembedaan yang wajib dijaga supaya kita tidak mencampur primitive inti dengan primitive layout.

### Core layer

Core layer adalah lapisan yang paling fundamental dan tidak boleh bergantung pada:

- page family
- block CMS tertentu
- section variant tertentu
- urutan layout halaman

Core layer berisi primitive yang dipakai lintas app dan lintas konteks.

Contoh untuk repo ini:

- `cn`
- token warna/radius/font di `src/app/(app)/globals.css`
- utility `container`
- komponen UI umum seperti button, input, card
- primitive loading seperti `Skeleton`

Karakter core layer:

- reusable global
- netral terhadap business feature
- netral terhadap route family
- tidak tahu apa itu homepage, shop, article, atau trust section

### Composition layer

Composition layer adalah lapisan yang mulai tahu konteks struktur halaman dan hubungan antar bagian.

Contoh:

- `PageFrame`
- `RenderBlocks`
- `SectionShell`
- shell variant seperti `panel`, `patterned`, `hero`

Karakter composition layer:

- tahu ritme halaman
- tahu family page
- tahu urutan section
- tahu bagaimana content harus duduk di dalam shell

### Feature layer

Feature layer adalah komponen bisnis/section yang menggunakan composition layer dan core layer sekaligus.

Contoh:

- `SupplyCategories`
- `ProcessSteps`
- `TrustSignals`
- `ProofGallery`

Karakter feature layer:

- tahu data contract Payload
- tahu kebutuhan visual section tertentu
- tidak boleh mendefinisikan ulang primitive inti

### Kenapa pembedaan ini penting

Kalau `Skeleton` diperlakukan seperti section primitive, maka:

- ia akan terlalu dekat ke page-specific styling
- susah dipakai ulang lintas family
- setiap page bisa menciptakan skeleton behavior sendiri

Kalau `SectionShell` diperlakukan seperti core primitive murni, maka:

- ia akan dipaksa terlalu netral
- padahal ia memang harus tahu struktur halaman dan shell grammar

Jadi:

- `Skeleton` = **core primitive**
- `SectionShell` = **composition primitive**
- block seperti `TrustSignals` = **feature component**

## Wrapper Skeleton vs Loading Skeleton

Ini adalah dua konsep yang harus dibedakan secara tegas.

### Wrapper skeleton

Wrapper skeleton adalah kerangka permanen struktur frontend.

Lapisan wrapper skeleton yang benar untuk repo ini:

1. `Root layout`
2. `Page frame`
3. `Block composer`
4. `Section shell`
5. `Section content`

#### Root layout

Contoh: `src/app/(app)/layout.tsx`

Tugas:

- app chrome
- header/footer
- providers
- font global app

#### Page frame

Contoh:

- `src/app/(app)/[slug]/page.tsx`
- `src/app/(app)/artikel/[slug]/page.tsx`
- `src/app/(app)/products/[slug]/page.tsx`

Tugas:

- top/bottom spacing halaman
- page-family canvas
- route-level rhythm

#### Block composer

Contoh: `src/blocks/RenderBlocks.tsx`

Tugas yang benar:

- registry
- block dispatch
- composition order

Tugas yang salah:

- spacing visual generik antar block

#### Section shell

Belum resmi ada sebagai primitive.

Tugas:

- shell variant
- full-width vs contained behavior (`containment`)
- top/bottom section inset
- background/surface/pattern

#### Section content

Tugas:

- heading
- intro
- grid
- cards
- media
- CTA

### Loading skeleton

Loading skeleton adalah placeholder saat boundary belum siap dirender.

Tugasnya:

- menjaga layout shift tetap rendah
- memberi hint shape yang konsisten
- tetap tunduk pada page family dan shell grammar

Ia **bukan** alat untuk:

- menambal wrapper architecture
- menggantikan section shell
- menyembunyikan spacing yang salah

Tambahan penting:

- secara arsitektural, `Skeleton` harus hidup di **core layer**
- secara visual, shape skeleton tetap boleh mengikuti feature/page family
- tetapi primitive dasarnya harus global dan netral

## Page Families

Sistem shell harus dipikirkan untuk seluruh app. Minimal page family yang ada sekarang:

### 1. Marketing / CMS Pages

Contoh:

- `src/app/(app)/[slug]/page.tsx`

Karakter:

- section-by-section
- block-driven
- paling membutuhkan shell grammar yang kaya

### 2. Commerce Pages

Contoh:

- `src/app/(app)/shop/layout.tsx`
- `src/app/(app)/shop/page.tsx`
- `src/app/(app)/products/[slug]/page.tsx`

Karakter:

- panel, filters, product modules
- butuh struktur yang kuat, tetapi tidak perlu alternasi atmosfer seagresif homepage

### 3. Editorial Pages

Contoh:

- `src/app/(app)/artikel/[slug]/page.tsx`

Karakter:

- prose-led
- ritme lebih tenang
- butuh container discipline dan media framing, bukan shell dekoratif berlebihan

### 4. Utility / Account Pages

Contoh:

- login
- checkout
- account routes

Karakter:

- form-heavy
- dashboard/panel oriented
- shell harus sederhana dan stabil

## Recommended Global Primitive

Rekomendasi utama adalah membuat **global primitive** bernama `SectionShell`.

Makna "global" di sini:

- tersedia untuk seluruh app
- menjadi bahasa desain sistem
- bukan berarti semua halaman tampil sama

Makna yang **bukan**:

- bukan global override
- bukan satu treatment untuk semua route
- bukan homepage-only hack

Primitive pendamping yang juga disarankan:

- `PageFrame`
- `Skeleton`

Maknanya:

- `PageFrame` menangani keluarga halaman
- `SectionShell` menangani wrapper section
- `Skeleton` menangani loading placeholder

Perbedaannya:

- `Skeleton` adalah **core primitive**
- `PageFrame` dan `SectionShell` adalah **composition primitives**

## Shell Variant Grammar

Daftar varian global yang realistis untuk app ini:

### `plain`

Untuk section netral yang hidup di canvas utama.

Gunakan ketika:

- section butuh napas
- isi sudah cukup sibuk
- tidak ingin menambah surface baru

### `panel`

Section isi berada di panel/card besar yang terangkat dari canvas.

Gunakan ketika:

- ingin membedakan phase baru
- section informasional perlu rasa terstruktur
- pattern ini sudah berhasil di `HomeIdentity`

### `tinted`

Section memakai background warna lembut penuh.

Gunakan ketika:

- butuh tone shift
- tidak perlu image shell
- ingin memisahkan block tanpa noise tinggi

### `patterned`

Section memakai background motif atau texture lembut.

Gunakan ketika:

- butuh identity kuat
- section bersifat editorial/proof/testimonial
- contoh eksperimen berhasil ada pada `ProofGallery`

### `image-band`

Section memakai image-backed shell atau atmospheric band.

Gunakan ketika:

- section perlu rasa visual yang kuat
- konten di atasnya relatif sedikit
- tidak cocok untuk block informasi padat

### `hero`

Surface pembuka dengan media besar dan trust strip atau CTA berat.

Gunakan ketika:

- page opener
- landing section

## Stack-Specific Best Practices

Bagian ini merumuskan best practice bukan dari teori umum, tetapi dari stack nyata repo ini: Next App Router, Payload CMS, Tailwind 4, server-first blocks, dan tokenized CSS variables.

### 1. Keep the app shell global, but keep section shells local

Yang global:

- app layout
- providers
- header/footer
- base fonts

Yang lokal:

- shell variant per page family
- shell variant per section

### 2. Keep block composition server-first

Untuk route CMS dan block yang data-heavy, default tetap server component.

Client component dipakai hanya saat perlu:

- browser API
- cart/account interactivity
- variant selector
- checkout logic

### 3. Do not let composer own visual rhythm

Ini aturan paling penting.

`RenderBlocks` harus netral sebagai composition engine.

Ia tidak boleh lagi menjadi sumber:

- `my-*`
- wrapper warna
- shell tone
- section spacing universal

### 4. Build shell primitives with repo utilities, not one-off class strings

Gunakan:

- `cn`
- token warna di `globals.css`
- utility `container`
- CSS variables

Hindari:

- inline styling liar
- duplikasi utility wrapper per block
- shell logic yang tersebar tanpa abstraction

### 4a. Keep core primitives below shell primitives

Primitive inti seperti:

- `Skeleton`
- `Button`
- `Input`
- `Card`
- `cn`
- token CSS

harus berada satu lapis di bawah primitive seperti:

- `PageFrame`
- `SectionShell`

Artinya:

- shell system boleh memakai core primitives
- core primitives tidak boleh bergantung pada shell system

Ini penting untuk mencegah coupling terbalik.

### 5. Keep `SectionHeader` small

`SectionHeader` sebaiknya tetap menjadi komponen tipis untuk:

- title
- intro
- heading rhythm dasar

Jangan jadikan `SectionHeader` sebagai tempat:

- shell variant
- page rhythm
- transisi antar section

### 6. Separate typography scope from shell scope

Kasus `ProcessSteps` sudah menunjukkan bahwa font khusus block kadang dibutuhkan.

Aturannya:

- typography scoped override boleh ada per block
- tetapi jangan dipakai untuk menambal wrapper problem
- shell system dan typography system harus tetap dipisah

### 7. Treat commerce, editorial, and marketing as one family tree, not one template

Homepage, shop, PDP, dan article tidak perlu identik.

Yang harus seragam:

- grammar shell
- ownership spacing
- surface hierarchy
- container discipline

Yang boleh berbeda:

- mood
- intensitas shell
- density of information

## Skeleton System Recommendation

Karena repo ini belum punya primitive `Skeleton`, rekomendasi jangka menengah adalah membuat satu sistem placeholder resmi.

Posisinya harus jelas:

- `Skeleton` adalah bagian dari **core UI system**
- bukan bagian dari shell grammar
- bukan turunan dari block CMS tertentu

### What should be global

- animation language
- radius language
- tone language
- usage via `cn`

Tambahan:

- API primitive yang netral
- tidak mengandung asumsi page family
- tidak mengandung asumsi block order

### What should remain family-specific

- search/filter skeleton shape
- PDP gallery skeleton shape
- article hero/media skeleton shape
- CMS block heading/grid skeleton shape

### Immediate rule before implementation

Sebelum ada primitive `Skeleton`, fallback baru jangan dibuat serampangan.

Prioritas:

1. fallback menjaga shape layout
2. fallback tidak mengubah page rhythm
3. fallback tidak mengambil alih tanggung jawab `SectionShell`
4. fallback dibangun di atas primitive inti, bukan ad hoc utility di setiap feature

## Page Family Mapping

### Marketing / CMS Pages

Varian yang relevan:

- `hero`
- `plain`
- `panel`
- `tinted`
- `patterned`
- `image-band`

Ini family paling kaya.

### Commerce Pages

Varian yang relevan:

- `plain`
- `panel`
- `tinted`

Catatan:

- `patterned` dan `image-band` dipakai sangat selektif, jangan menjadi default shop grammar

### Editorial Pages

Varian yang relevan:

- `plain`
- `panel`

Opsional:

- `patterned` hanya bila ada section khusus seperti related content band

### Utility / Account Pages

Varian yang relevan:

- `plain`
- `panel`

Catatan:

- hindari shell dekoratif kuat

## Spacing Ownership Rules

Ini bagian paling penting.

### Route owns page frame

Route/page bertanggung jawab atas:

- top spacing awal halaman
- bottom spacing akhir halaman
- high-level page canvas

Contoh: `src/app/(app)/[slug]/page.tsx`

### Composer should not own blind section spacing

Composer seperti `RenderBlocks` **tidak boleh lagi** menjadi sumber spacing generik antar section.

`RenderBlocks` seharusnya hanya:

- memilih block yang benar
- merender block dengan props yang benar
- menangani registry logic

Bukan:

- memberi `my-16` ke semua block

### Shell owns section entry and exit rhythm

Setiap `SectionShell` bertanggung jawab atas:

- top inset section
- bottom inset section
- background / surface / pattern
- container relationship

Artinya, jarak antar section harus lahir dari **shell contract**, bukan margin luar generik.

### Content owns internal layout only

Block content bertanggung jawab atas:

- grid gap
- card spacing
- title to intro spacing
- item rhythm

Bukan:

- transisi antar block
- page canvas

## Proposed Layering Model

### Layer 1: PageFrame

Dipakai oleh route/page family.

Tugas:

- outer page rhythm
- page-level top and bottom spacing
- page family identity

### Layer 2: SectionShell

Dipakai oleh block atau section module.

Tugas:

- section wrapper
- background tone or surface
- section spacing
- full-width versus contained behavior (`containment`)

### Layer 3: SectionContent

Dipakai oleh isi block.

Tugas:

- heading
- cards
- gallery
- prose
- CTA

## Why Homepage-Only Fixes Are Dangerous

Jika kita hanya memperbaiki homepage tanpa grammar global:

- homepage akan terasa "designed"
- shop akan terasa "template biasa"
- article akan terasa seperti aplikasi lain
- product page akan punya ritme sendiri

Hasil akhirnya bukan sistem, tetapi kumpulan halaman yang kebetulan hidup dalam repo yang sama.

## Current Homepage Mapping Recommendation

Ini bukan final design mandate, tetapi baseline yang masuk akal dari hasil eksperimen sekarang.

### HomeHero

Shell: `hero`

Status:

- cukup kuat
- sudah punya image, overlay, dan trust strip

### HomeIdentity

Shell: `panel`

Status:

- cukup berhasil
- sudah membedakan diri dari hero

### SupplyCategories

Shell: `plain`

Status:

- cocok sebagai base section
- isi sudah cukup ramai secara internal

### ProcessSteps

Shell: `panel` atau `tinted`

Status:

- card anatomy sudah membaik
- wrapper-level identity masih dapat ditingkatkan

### TrustSignals

Shell: kandidat `image-band` ringan atau `tinted/patterned` yang sangat terkendali

Status:

- wrapper experiment dengan `bg11.jpg` menjanjikan
- tetapi sistemik issue menunjukkan wrapper harus dinilai bersama section sekitarnya

### ProofGallery

Shell: `patterned`

Status:

- eksperimen `bg4-scaled.jpg` berhasil
- ini menjadi contoh nyata bahwa shell identity yang kuat bisa memperbaiki pemisahan section

## Current Non-Homepage Mapping Recommendation

### Shop

Gunakan grammar sederhana:

- page frame untuk search/filter context
- `panel` untuk search modules atau filter cluster
- `plain` untuk product results region

Hindari:

- terlalu banyak shell atmosferik

### Product Detail

Gunakan grammar:

- `plain` untuk page frame
- `panel` untuk PDP hero/product information shell
- `plain` atau `panel` untuk related sections

### Article Detail

Gunakan grammar:

- `plain` page frame
- `panel` hanya untuk media or related content if needed

Fokus:

- readability
- prose rhythm

### Utility / Account

Gunakan grammar:

- `plain` page frame
- `panel` untuk forms, auth boxes, dan dashboard modules

Hindari:

- patterned shell
- atmosferik shell yang berat

## Anti-Patterns To Avoid

### 1. Global `my-*` for every block

Ini sumber problem terbesar saat ini.

### 2. Per-page ad hoc wrappers with no shared grammar

Ini akan membuat homepage, shop, dan article drift secara struktural.

### 3. Putting shell responsibilities into `SectionHeader`

`SectionHeader` bukan tempat yang tepat untuk mengatasi wrapper-level transitions.

### 4. Copying Elementor markup or motion directly

Kita mengambil hasil visual, bukan noise implementasinya.

### 5. Treating every section as `container` on white canvas

Ini menyebabkan block berbeda terbaca sebagai satu permukaan panjang.

### 6. Using loading skeletons to hide structural flaws

Placeholder tidak boleh dipakai untuk menyamarkan shell architecture yang salah.

### 7. Solving homepage in isolation

Ini akan menyebabkan drift yang sangat terasa saat user berpindah ke shop, article, atau PDP.

## Migration Strategy

### Phase 1. Freeze the architecture rules

Sepakati:

- shell variant list
- spacing ownership rules
- page families

Tanpa ini, implementasi akan kembali menjadi patch per section.

### Phase 2. Refactor block composer

Target:

- hapus `my-16` generik dari `src/blocks/RenderBlocks.tsx`
- pindahkan ownership spacing ke shell

Catatan:

- ini adalah perubahan arsitektural paling penting

### Phase 3. Introduce `SectionShell`

Buat primitive yang cukup kecil, misalnya props seperti:

- `variant`
- `container`
- `innerClassName`
- `outerClassName`

Tujuan:

- menyatukan grammar wrapper
- tanpa membuat semua block identik

### Phase 4. Introduce `PageFrame` and `Skeleton` primitives

Setelah shell grammar cukup jelas:

- rapikan page-family frames
- buat primitive `Skeleton` resmi

Catatan:

- `Skeleton` bukan prioritas pertama
- `SectionShell` dan composer fix tetap lebih mendesak

### Phase 5. Pilot on homepage blocks

Urutan yang paling aman:

1. `SupplyCategories`
2. `ProcessSteps`
3. `TrustSignals`
4. `ProofGallery`

Alasan:

- area ini sekarang paling jelas menunjukkan wrapper-level weakness

### Phase 6. Roll the same grammar into page families

Setelah homepage stabil:

- shop family
- product detail
- article detail

## Decision Record

### Decision 1

Section-shell system harus dirancang untuk **seluruh app**, bukan homepage saja.

### Decision 2

`SectionShell` harus menjadi **global primitive**, tetapi bukan global single treatment.

### Decision 3

`RenderBlocks` harus berhenti menjadi sumber spacing generik antar block.

### Decision 4

Page families harus memakai grammar yang sama, tetapi subset variant yang berbeda.

### Decision 5

Wrapper skeleton dan loading skeleton adalah dua sistem berbeda dan tidak boleh dicampur.

### Decision 6

Repo ini perlu primitive `Skeleton` resmi, tetapi prioritas tetap dimulai dari `SectionShell` dan composer spacing.

### Decision 7

Primitive inti seperti `Skeleton` harus diposisikan di core layer, terpisah dari composition primitives seperti `PageFrame` dan `SectionShell`.

## Immediate Next Steps

1. Audit varian shell yang sudah dipakai oleh block marketing/CMS, lalu rapikan mana yang harus `plain`, `panel`, `tinted`, atau `patterned`.
2. Audit route families yang sudah memakai `PageFrame`, terutama commerce dan editorial.
3. Pastikan grammar shell yang dipakai homepage dapat diterapkan tanpa drift ke shop, product, dan article.
4. Definisikan primitive `Skeleton` resmi di core layer setelah composition layer stabil.
5. Setelah shell variants stabil, dokumentasikan mapping final per page family.

## Current Tuning Notes

### Homepage

- urutan shell homepage sekarang sudah mulai terbaca sebagai grammar yang disengaja:
  - `hero`
  - `panel`
  - `plain`
  - `tinted`
  - `patterned`
  - `image-band`
  - `panel`
- eksperimen background WordPress yang tetap dipertahankan karena berhasil:
  - `ProofGallery` memakai `bg4-scaled.jpg`
  - `TrustSignals` memakai `bg11.jpg`
- fase berikutnya untuk homepage bukan refactor composer lagi, tetapi tuning ringan antar variant dan adjacency antar shell

### Commerce family

- `PageFrame` family `commerce` sudah diturunkan top/bottom spacing-nya agar tidak menghasilkan dead space besar di `shop` dan PDP
- `src/app/(app)/shop/layout.tsx` juga sudah dirapikan:
  - gap vertical utama dikurangi
  - `Search` margin bawah dikurangi
  - gap antara filter rail dan product grid dibuat lebih rasional
- observasi saat ini:
  - shop dan PDP sudah lebih dekat dengan grammar homepage tanpa menjadi terlalu dekoratif
  - isu commerce berikutnya bukan lagi wrapper global, tetapi empty states dan content density

### Editorial family

- `PageFrame` family `editorial` juga sudah diturunkan top spacing-nya
- tujuan tuning ini adalah mengurangi rasa "halaman kosong sebelum konten dimulai"
- editorial tetap harus lebih tenang daripada marketing, jadi tuning berikutnya sebaiknya fokus pada prose/header rhythm, bukan patterned shell

### Utility family

- `PageFrame` family `utility` ikut diringankan supaya login, account, dan checkout tidak terasa terlalu jauh dari header
- utility tetap harus sederhana; family ini tidak memerlukan shell ekspresif seperti homepage

### Core loading primitives

- `Skeleton` sekarang sudah ada sebagai core primitive di `src/components/ui/skeleton.tsx`
- batch adopsi pertama sudah dilakukan di shop family:
  - `src/app/(app)/shop/loading.tsx`
  - `src/components/layout/search/FilterGroupSkeleton.tsx`
  - `src/components/layout/search/Categories.tsx`
  - `src/components/layout/search/Attributes.tsx`
  - `src/components/layout/search/UseCases.tsx`
  - `src/components/CategoryTabs/index.tsx`
- batch adopsi kedua sudah masuk ke PDP/commerce detail:
  - `src/components/product/ProductSkeletons.tsx`
  - `src/app/(app)/products/[slug]/page.tsx`
  - `src/components/product/ProductDescription.tsx`
- batch adopsi ketiga sudah menyentuh utility/header surfaces:
  - `src/components/checkout/CheckoutPaymentSkeleton.tsx`
  - `src/components/checkout/CheckoutPage.tsx`
  - `src/components/Header/index.client.tsx`
  - `src/components/CategoryTabs/index.tsx`
- ini menegaskan bahwa `Skeleton` memang hidup di core layer, lalu boleh dikomposisikan lagi di feature/composition layer sesuai kebutuhan

### Remaining utility note

- route checkout kosong masih terasa sangat hampa, tetapi itu sekarang terlihat sebagai masalah empty-state content, bukan lagi masalah `PageFrame`, `SectionShell`, atau `Skeleton` architecture

### Canonical primitive API

- source of truth `SectionShell` sekarang hanya ada di `src/components/layout/SectionShell.tsx`
- source of truth `PageFrame` sekarang ada di `src/components/layout/PageFrame.tsx`
- source of truth `Skeleton` sekarang ada di `src/components/ui/skeleton.tsx`
- token map canonical untuk `SectionShell` dan `PageFrame` sekarang dipusatkan di `src/components/layout/layoutPrimitives.config.ts`
- file config itu sekarang tidak hanya menyimpan class map, tetapi juga default value, daftar token yang valid, dan resolver canonical seperti `resolvePageFrameFamily`, `resolveSectionShellVariant`, `resolveSectionShellSpacing`, dan `resolveSectionShellContainment`
- implementation primitive sekarang tidak lagi memakai indirection `cva`; `SectionShell` dan `PageFrame` membaca token canonical secara langsung dari config dan resolver
- file config itu sekarang juga menyimpan metadata contract ringan:
  - `pageFrameFamilyMeta` untuk tone dan expressiveness family
  - `sectionShellVariantMeta` untuk role, decorative state, dan surface-shift state pada variant
- file config itu juga sekarang menyediakan helper invariant ringan untuk klasifikasi canonical, misalnya:
  - `isExpressivePageFrameFamily`
  - `isMinimalPageFrameFamily`
  - `isProsePageFrameFamily`
  - `isDecorativeSectionShellVariant`
  - `isSurfaceShiftingSectionShellVariant`
  - `isBaseSectionShellVariant`
- minimal API yang sekarang dianggap canonical:
  - `SectionShell`: `variant`, `spacing`, `background`, `containment`, `innerClassName`, `className`, `id`
  - `PageFrame`: `family`, `as`, `className`
  - `Skeleton`: `className` plus native `div` props
- primitive ini sekarang juga membawa data attributes untuk inspeksi dan styling sistemik:
  - `SectionShell`: `data-section-shell`, `data-section-variant`, `data-section-spacing`, `data-section-containment`
- `SectionShell` tidak lagi memakai boolean `contained`; kontrak canonical sekarang adalah `containment="contained" | "full-bleed"` supaya niat wrapper bisa dibaca eksplisit
- kelas variant, spacing, containment, dan page family tidak lagi disimpan tersebar di implementation file; semuanya sekarang mengalir dari config token yang sama
- `SectionShell` dan `PageFrame` juga tidak lagi melakukan fallback default secara inline; keduanya mengambil nilai canonical dari resolver yang sama
  - `PageFrame`: `data-page-frame`, `data-page-family`, `data-page-tone`, `data-page-expressive`
  - `SectionShell`: `data-section-shell`, `data-section-variant`, `data-section-spacing`, `data-section-containment`, `data-section-role`, `data-section-decorative`, `data-section-surface-shift`
- `Skeleton`: `data-skeleton`
- implementasi lama `src/components/SectionShell.tsx` sudah dihapus agar tidak ada dua sumber kebenaran
- primitive ini sekarang juga sudah punya coverage integration terarah di `tests/int/layout-primitives.int.spec.ts`, khusus untuk:
  - resolver canonical
  - metadata canonical
  - `data-*` attributes pada `PageFrame` dan `SectionShell`

## Status

Dokumen ini adalah acuan arsitektural aktif.

Ia belum berarti seluruh sistem sudah final. Namun, fondasi implementasi sudah dimulai.

Primitive yang sudah ada:

- `src/components/layout/SectionShell.tsx`
- `src/components/layout/PageFrame.tsx`
- `src/components/layout/layoutPrimitives.config.ts`
- `src/components/ui/skeleton.tsx`

Status composer saat ini:

- `src/blocks/RenderBlocks.tsx` sudah kembali menjadi registry/composer murni
- `RenderBlocks` tidak lagi memberi spacing generik atau fallback wrapper ke block
- seluruh block yang ada di registry saat ini sudah own `SectionShell` masing-masing

Feature blocks yang sudah memakai `SectionShell` secara eksplisit:

- `src/blocks/AboutStatement/Component.tsx`
- `src/blocks/ArticleArchive/Component.tsx`
- `src/blocks/ArchiveBlock/Component.tsx`
- `src/blocks/Banner/Component.tsx`
- `src/blocks/BusinessAdvantages/Component.tsx`
- `src/blocks/Carousel/Component.tsx`
- `src/blocks/CallToAction/Component.tsx`
- `src/blocks/ClosingCTA/Component.tsx`
- `src/blocks/ContactDetails/Component.tsx`
- `src/blocks/Content/Component.tsx`
- `src/blocks/DeliveryCoverage/Component.tsx`
- `src/blocks/Form/Component.tsx`
- `src/blocks/HomeHero/Component.tsx`
- `src/blocks/HomeIdentity/Component.tsx`
- `src/blocks/LegalFacts/Component.tsx`
- `src/blocks/LegalIndex/Component.tsx`
- `src/blocks/MapEmbed/Component.tsx`
- `src/blocks/MediaBlock/Component.tsx`
- `src/blocks/PreparationChecklist/Component.tsx`
- `src/blocks/SupplyCapacity/Component.tsx`
- `src/blocks/SupplyCategories/Component.tsx`
- `src/blocks/ThreeItemGrid/Component.tsx`
- `src/blocks/ProcessSteps/Component.tsx`
- `src/blocks/ProofGallery/Component.tsx`
- `src/blocks/TrustSignals/Component.tsx`
- `src/blocks/ValueStatement/Component.tsx`
- `src/blocks/VisitNote/Component.tsx`

Route/page families yang sudah mulai memakai `PageFrame`:

- `src/app/(app)/[slug]/page.tsx`
- `src/app/(app)/shop/layout.tsx`
- `src/app/(app)/artikel/[slug]/page.tsx`
- `src/app/(app)/products/[slug]/page.tsx`
- `src/app/(app)/(account)/layout.tsx`
- `src/app/(app)/login/page.tsx`
- `src/app/(app)/create-account/page.tsx`
- `src/app/(app)/find-order/page.tsx`
- `src/app/(app)/forgot-password/page.tsx`
- `src/app/(app)/checkout/page.tsx`
- `src/app/(app)/checkout/confirm-order/page.tsx`

Namun implementasi global shell system masih perlu dilanjutkan secara terencana di level tuning varian dan page family mapping. Primitive `Skeleton` inti sudah dimulai, tetapi adopsinya masih perlu diperluas ke family lain secara bertahap.
