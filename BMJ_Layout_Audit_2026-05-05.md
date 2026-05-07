# BMJ Layout Audit

Date: 2026-05-05  
Project: `payloadbmj`  
Scope: shared layout/page layer, `PageFrame`, `SectionShell`, shared CSS, homepage marketing composition

## Purpose

Dokumen ini mencatat masalah layout sistemik yang saat ini membuat halaman terasa acak, terlalu longgar, dan tidak tunduk pada satu aturan template yang konsisten.

Tujuan dokumen ini bukan mengusulkan patch visual per section, tetapi menjelaskan:

1. sumber kerusakan layout di arsitektur yang sekarang,
2. bukti konkretnya di codebase,
3. kenapa block baru saat ini tidak otomatis mengikuti aturan umum,
4. arah perbaikan yang sesuai dengan arsitektur project dan best practice stack.

---

## Executive Summary

Layout system project ini belum benar-benar bekerja sebagai template system.

Secara teknis, project sudah memiliki primitive canonical:

- `PageFrame`
- `SectionShell`
- page families
- section variants
- shared `globals.css`

Tetapi secara perilaku, hukum layout masih tersebar di terlalu banyak tempat:

- route layer
- `PageFrame`
- `SectionShell`
- `globals.css`
- homepage special-case
- per-block spacing
- per-block typography
- per-block panel padding
- route hero yang bypass `SectionShell`

Akibatnya:

- vertical rhythm tidak punya satu owner yang tegas,
- empty space menumpuk dari banyak layer,
- section adjacency terasa incidental,
- typography scale belum benar-benar global,
- block baru tidak bisa otomatis “aman” hanya dengan memilih variant,
- homepage marketing belum punya page law yang cukup spesifik,
- sistem saat ini masih sangat rentan menjadi patchwork.

Masalah utama bukan “section A jelek” atau “section B perlu divider”, melainkan:

**layout authority belum dibekukan dari atas.**

---

## What A Healthy Template System Should Do

Dalam sistem yang sehat, penambahan block baru seharusnya otomatis tunduk pada hukum berikut:

1. page family menentukan page rhythm,
2. section shell menentukan wrapper behavior,
3. typography mengikuti shared scale,
4. panel mengikuti shared surface law,
5. adjacency mengikuti shared transition law,
6. block hanya mengisi content shape, bukan membuat aturan layout baru.

Saat ini hal itu belum terjadi.

---

## Current Layout Authority Map

### 1. `RootLayout` bukan master layout law

File: `src/app/(app)/layout.tsx`

`RootLayout` hanya mengatur struktur global halaman:

- `Header`
- `main`
- `Footer`

Ia tidak menetapkan page rhythm marketing secara nyata.  
Artinya master layout behavior saat ini sebenarnya turun ke layer yang lebih bawah.

### 2. `PageFrame` adalah carrier hukum halaman

File: `src/components/layout/PageFrame.tsx`  
File: `src/components/layout/layoutPrimitives.config.ts`

`PageFrame` sudah mengeluarkan metadata layout yang benar:

- `data-page-frame="true"`
- `data-page-family`
- `data-page-tone`
- `data-page-expressive`

Ini bagus sebagai fondasi.  
Masalahnya, definisi family rules masih terlalu kasar untuk kebutuhan nyata project.

### 3. `SectionShell` adalah carrier hukum section

File: `src/components/layout/SectionShell.tsx`

`SectionShell` juga sudah canonical dan mengeluarkan metadata penting:

- `data-section-shell="true"`
- `data-section-spacing`
- `data-section-variant`
- `data-section-role`
- `data-section-decorative`
- `data-section-surface-shift`

Ini juga fondasi yang benar.

Masalahnya, block-level layout behavior masih belum cukup dipaksa oleh contract ini.

### 4. `globals.css` ikut menjadi owner layout

File: `src/app/(app)/globals.css`

Saat ini `globals.css` tidak hanya menyimpan tokens, tetapi juga:

- transition grammar marketing,
- divider/wash behavior,
- homepage single-canvas experiment,
- h1-h6 reset.

Ini membuat CSS global ikut mengambil peran layout authority yang besar.

### 5. Route layer masih melakukan special-case layout

File: `src/app/(app)/[slug]/page.tsx`

Homepage saat ini mendapat perlakuan spesifik:

- `family="marketing"`
- `className={slug === 'home' ? 'homepage-single-canvas-experiment' : undefined}`

Artinya:

- `marketing` family belum cukup presisi untuk menampung kebutuhan homepage,
- route layer harus turun tangan memberi patch class tambahan.

Itu tanda bahwa page law di level family belum matang.

---

## Core Systemic Problems

## Problem 1: Tidak ada satu master layout authority yang dominan

Masalah layout saat ini tersebar di:

- `PageFrame`
- `SectionShell`
- `globals.css`
- route-level class
- feature block internals
- hero system yang terpisah

Ini berarti tidak ada satu sumber kebenaran yang benar-benar menang.

### Dampak

- developer tidak punya tempat tunggal untuk mengubah page rhythm,
- perubahan layout mudah bergeser menjadi patch lokal,
- perilaku halaman sulit diprediksi,
- penambahan block baru tidak otomatis aman.

---

## Problem 2: `marketing` page family terlalu generik

File: `src/components/layout/layoutPrimitives.config.ts:4`

Current rule:

```ts
marketing: 'pt-16 pb-24'
```

Masalahnya:

- homepage memakai rule yang sama dengan marketing pages lain,
- belum ada pembedaan antara opener page vs inner marketing page,
- belum ada per-breakpoint law khusus untuk homepage.

### Dampak

- space atas halaman terasa besar bahkan sebelum content rhythm mulai,
- hero/homepage harus diakali dengan special-case,
- law yang seharusnya hidup di family layer bocor ke route atau feature.

---

## Problem 3: `SectionShell` spacing scale terlalu mahal

File: `src/components/layout/layoutPrimitives.config.ts:65-69`

Current spacing scale:

```ts
compact: 'py-12 md:py-16'
default: 'py-16 md:py-20'
relaxed: 'py-20 md:py-24'
```

Default resmi:

File: `src/components/layout/layoutPrimitives.config.ts:135`

```ts
SECTION_SHELL_DEFAULT_SPACING = 'default'
```

### Diagnosa

Baseline section rhythm sudah besar dari titik awal.

Kalau satu section:

- memakai `default` implisit,
- bertemu page padding,
- lalu bertemu inner surface spacing,

maka halaman akan terasa longgar walaupun setiap class individual tampak “masuk akal”.

### Data distribusi

Jumlah block yang memakai `SectionShell`: 27

Distribusi spacing:

- `default-implicit`: 16
- `compact`: 10
- `none`: 1

Kesimpulan:

- mayoritas block saat ini diam-diam mewarisi spacing paling mahal kedua,
- dan default itu terjadi secara implisit, bukan keputusan yang terlihat jelas saat membaca block.

Ini berbahaya untuk maintainability.

---

## Problem 4: Vertical rhythm dibayar oleh terlalu banyak layer sekaligus

Saat ini vertical rhythm bisa datang dari:

1. `PageFrame` top/bottom padding  
2. `SectionShell` vertical padding  
3. section transition gap  
4. panel/card internal padding  
5. section-specific `space-y`, `pb`, `mt`, dll

### Contoh konkret

- `PageFrame marketing`: `pt-16 pb-24`
- `SectionShell compact`: `py-12 md:py-16`
- transition gap di `globals.css`
- panel internals seperti `p-8 md:p-10`
- local offsets seperti `mt-6`, `pb-8`, `space-y-8`, `space-y-10`

### Dampak

- empty space tidak punya satu owner,
- total spacing menjadi akumulatif,
- banyak area kosong tidak punya fungsi visual yang jelas,
- komposisi terasa tidak natural.

---

## Problem 5: Transition system berdiri di atas baseline spacing yang belum sehat

File: `src/app/(app)/globals.css:127-131`  
File: `src/app/(app)/globals.css:261-391`

Current tokens:

- `--section-transition-gap-space`
- `--section-transition-gap-divider`
- `--section-transition-gap-wash`
- `--section-transition-gap-settle`

Current behavior:

- adjacency antar sibling `SectionShell` di family `marketing`
- margin antar section
- wash pseudo-element
- divider pseudo-element

### Diagnosa

Transition grammar sendiri bukan konsep yang salah.

Yang salah adalah transition grammar ini dipasang ketika:

- page spacing masih besar,
- shell spacing masih besar,
- panel padding masih besar,
- typography rhythm belum global.

Akibatnya transition lane menambah biaya di sistem yang baseline spacing-nya sudah over-inflated.

### Dampak

- seam antar section bisa tampak sebagai “blok kosong”,
- divider/wash tidak menyelesaikan akar masalah,
- transition system tampak seperti patch tambahan, bukan part of a complete layout law.

---

## Problem 6: Homepage memakai route-level experiment karena family law belum cukup

File: `src/app/(app)/[slug]/page.tsx:65-71`  
File: `src/app/(app)/globals.css:221-259`

Homepage sekarang memakai:

- `homepage-single-canvas-experiment`

dan CSS global lalu:

- menggambar page-level background,
- menyembunyikan background lokal `patterned`,
- menyembunyikan background lokal `image-band`.

### Diagnosa

Kalau sebuah family rule sehat, homepage tidak perlu special-case route-level untuk canvas behavior dasar.

Keberadaan experiment ini menunjukkan:

- page canvas law belum diputuskan di level family,
- decorative ownership belum dibekukan,
- route sedang ikut menangani urusan layout global.

### Dampak

- authority makin terpecah,
- homepage menjadi case khusus,
- pattern page-level vs section-level canvas belum final.

---

## Problem 7: Hero system terpisah dari `SectionShell`

File: `src/heros/RenderHero.tsx`  
Files:

- `src/heros/HighImpact/index.tsx`
- `src/heros/MediumImpact/index.tsx`
- `src/heros/LowImpact/index.tsx`

Route hero generik tidak memakai `SectionShell`.

Contoh:

- `HighImpactHero` memakai `-mt-[10.4rem]`, `container`, `mb-8`, `min-h-[80vh]`
- `MediumImpactHero` memakai `container mb-8`
- `LowImpactHero` memakai `container mt-16`

### Diagnosa

Ini berarti hero route-level hidup di sistem layout yang berbeda dari block-based homepage sections.

Akibatnya:

- hero adjacency tidak tunduk pada grammar `SectionShell + SectionShell`,
- hero spacing tidak tunduk pada scale yang sama,
- page opening law menjadi bercabang dua.

### Dampak

- marketing page law tidak utuh,
- route hero dan block hero tidak berada di satu bahasa layout yang sama.

---

## Problem 8: Typography di-reset global, tapi replacement system belum lengkap

File: `src/app/(app)/globals.css:14-21`

Semua heading di-reset:

```css
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: unset;
  font-size: unset;
}
```

### Diagnosa

Reset ini valid jika sesudahnya ada typography law yang benar-benar global.

Masalahnya, saat ini replacement-nya belum lengkap.

Yang sudah ada:

- `SectionHeader` untuk sebagian `h2 + intro`

Yang belum ada:

- page-family-specific heading scale,
- hero heading law,
- intro/body defaults lintas section,
- rule mana yang wajib pakai helper dan mana yang boleh custom.

### Dampak

block bebas menulis:

- `text-3xl md:text-4xl`
- `text-4xl md:text-6xl`
- `tracking-tight`
- `leading-7`
- `leading-8`
- `space-y-3`
- `space-y-4`

tanpa tunduk pada satu type system utuh.

---

## Problem 9: `SectionHeader` hanya menyelesaikan sebagian kecil typography contract

File: `src/components/SectionHeader.tsx`

Current helper:

- `space-y-3`
- `h2 text-3xl md:text-4xl`
- `intro text-base leading-7`

### Diagnosa

`SectionHeader` adalah langkah ke arah yang benar, tapi belum cukup kuat menjadi shared type law, karena:

- tidak mengatur hero,
- tidak mengatur body blocks panel,
- tidak mengatur chapter spacing,
- tidak mengatur section-to-surface rhythm,
- banyak block masih bypass helper ini.

### Dampak

Helper ada, tetapi belum menjadi governance.

---

## Problem 10: Surface/panel law bocor ke feature layer

Pola berulang:

- `p-8 md:p-10`
- rounded card
- border
- card background
- shadow

Contoh konkret:

- `src/blocks/AboutStatement/Component.tsx:15`
- `src/blocks/DeliveryCoverage/Component.tsx:15`
- `src/blocks/SupplyCapacity/Component.tsx:15`
- `src/blocks/ValueStatement/Component.tsx:15`
- `src/blocks/VisitNote/Component.tsx:15`
- `src/blocks/HomeIdentity/Component.tsx:26`
- `src/blocks/ClosingCTA/Component.tsx:33`

### Diagnosa

Ini menunjukkan panel sections belum benar-benar mengonsumsi satu surface law bersama.

Yang terjadi sekarang:

- block memilih `variant="panel"`
- tetapi masih membawa card geometry dan spacing sendiri

Jadi `variant="panel"` belum cukup kuat untuk memberi perilaku panel yang konsisten.

### Dampak

- panel rhythm tersebar di banyak file,
- perubahan panel law akan mahal,
- outer section spacing dan inner panel padding mudah bertumpuk.

---

## Problem 11: Banyak block masih menentukan rhythm sendiri

Contoh:

- `HomeIdentity`: `mt-6`, `p-8 md:p-10`
- `ProcessSteps`: `space-y-10`
- `ProofGallery`: `pb-8 md:pb-10`
- `TrustSignals`: `space-y-8 md:space-y-10`
- `HomeHero`: `px-6 py-12 md:px-10 md:py-16`

### Diagnosa

Beberapa dari nilai ini memang bisa dibenarkan untuk content internals.

Masalahnya, jumlah override seperti ini terlalu banyak dan belum dibatasi oleh policy yang jelas.

Akibatnya feature blocks ikut menentukan:

- section rhythm,
- chapter spacing,
- type rhythm,
- surface density.

### Dampak

layout law menjadi tidak terpusat.

---

## Problem 12: Decorative behavior belum dibekukan sebagai global rule

Variant dekoratif saat ini:

- `hero`
- `patterned`
- `image-band`
- `tinted` juga membawa mood visual tertentu

Masalahnya:

- decorative sections punya background law sendiri,
- page-level canvas experiment ikut campur,
- transition system mencoba mengatur seam,
- tetapi belum ada keputusan final tentang ownership canvas.

### Dampak

- seam antarsection jadi sulit diprediksi,
- decorative surfaces bisa saling tabrak,
- atau sebaliknya menyisakan dead space besar.

---

## Problem 13: Penambahan block baru belum otomatis aman

Ini adalah masalah produk/arsitektur paling penting.

Jika developer menambahkan block baru hari ini, block itu akan:

1. kemungkinan mewarisi `SectionShell` default spacing yang mahal,
2. harus memilih sendiri apakah pakai `SectionHeader` atau heading custom,
3. berpotensi menambah `space-y`, `mt`, `pb`, `p-8`, dst,
4. belum punya surface law yang ketat jika ingin tampil sebagai panel,
5. belum jelas bagaimana dia harus bertransisi dengan section sebelum/sesudahnya.

Artinya:

**block baru belum otomatis terdefinisi dengan aman oleh system.**

Padahal itu justru tujuan utama template architecture.

---

## Project-Specific Quantitative Snapshot

### `SectionShell` usage

Jumlah block yang memakai `SectionShell`: 27

Distribusi spacing:

- `default-implicit`: 16
- `compact`: 10
- `none`: 1

Distribusi variant:

- `plain`: 15
- `panel`: 8
- `hero`: 1
- `tinted`: 1
- `patterned`: 1
- `image-band`: 1

### Interpretasi

- mayoritas sistem masih bergantung pada implicit default,
- panel dan plain sudah cukup banyak sehingga layout law harus benar-benar stabil,
- decorative variants masih sedikit, jadi sekarang adalah waktu yang tepat untuk membekukan law sebelum polanya menyebar lebih jauh.

---

## Why The Current System Feels “Acak-Acakan”

Secara ringkas, desain terasa acak bukan karena semua komponen jelek.

Desain terasa acak karena:

1. aturan layout belum dimulai dari master law,
2. authority tersebar ke banyak layer,
3. spacing default terlalu mahal,
4. typography belum benar-benar global,
5. panel law belum dibakukan,
6. hero law bercabang,
7. route-level special-case muncul karena family law belum cukup.

Jadi “acak-acakan” di sini bukan sekadar visual.  
Ia sudah menjadi **masalah governance di layout architecture**.

---

## Best-Practice Interpretation For This Project

Berdasarkan best practice React, Next.js, Tailwind, dan Payload:

- hierarchy/ownership harus hidup di parent/composition layer,
- shared layout harus menentukan aturan lintas halaman,
- design decisions seperti spacing/type harus menjadi tokens/global rules,
- block system dinamis seperti Payload justru menuntut layout grammar yang lebih ketat.

Untuk project BMJ ini, artinya:

### 1. `PageFrame` harus menjadi owner resmi page law

`PageFrame` harus memegang:

- page family behavior,
- page opening rhythm,
- page closing rhythm,
- canvas ownership,
- breakpoint-level page density.

### 2. `SectionShell` harus menjadi owner resmi section law

`SectionShell` harus memegang:

- wrapper spacing semantics,
- containment,
- section variant behavior,
- decorative semantics,
- adjacency metadata

Tetapi tidak boleh dibiarkan punya scale yang terlalu gemuk sebagai baseline.

### 3. `globals.css` harus turun peran

`globals.css` sebaiknya menjadi tempat:

- tokens,
- shared selectors,
- shared type classes,
- canonical layout helpers

Bukan tempat route-specific experiments yang ikut mendefinisikan page identity.

### 4. Typography harus menjadi system, bukan helper setengah jadi

Project ini butuh:

- page-family type law,
- hero type law,
- section heading law,
- body/intro law,
- measure/leading law,
- override policy.

### 5. Surface/panel law harus ditarik keluar dari block individual

Kalau panel adalah pattern yang berulang, maka:

- padding,
- radius,
- border,
- shadow,
- card-to-shell relationship

harus menjadi canonical surface law, bukan ditulis ulang di banyak block.

### 6. Hero system harus disatukan dengan grammar layout

Route hero dan block hero tidak boleh hidup dalam dua sistem layout yang terpisah selamanya.

---

## What Should Be Avoided Going Forward

Hal-hal berikut sebaiknya dihentikan:

1. menambah spacing lokal untuk menyelesaikan satu seam,
2. route-level class khusus untuk menyelesaikan kelemahan family law,
3. panel block yang menyalin `p-8 md:p-10` satu per satu,
4. heading scale per block tanpa canonical type law,
5. decorative fixes yang hidup di feature layer,
6. menambah variant baru sebelum page law dan section law dibekukan.

---

## Required Follow-Up Work

Urutan kerja yang direkomendasikan:

1. definisikan ulang **layout authority map**,
2. bekukan **page family laws**, terutama `marketing` dan `homepage`,
3. bekukan **section spacing scale**,
4. bekukan **typography system**,
5. bekukan **surface/panel law**,
6. putuskan **canvas/decorative ownership**,
7. satukan hero grammar,
8. baru audit dan refactor feature blocks yang melanggar.

Selama ini urutan sering terbalik: block dulu, law belakangan.  
Itu sumber utama kekacauan.

---

## Final Assessment

Codebase ini belum rusak karena primitive-nya tidak ada.  
Primitive utamanya justru sudah cukup baik.

Yang rusak adalah:

- distribution of authority,
- baseline spacing economics,
- typography governance,
- surface governance,
- page-family specificity.

Karena itu solusi yang benar bukan patch visual section demi section, melainkan:

**menyelesaikan layout law dari atas agar seluruh block otomatis tunduk pada aturan yang sama.**

Jika hal ini tidak dibenahi, setiap block baru akan terus menambah aturan lokal baru dan sistem akan makin mahal untuk dirawat.

