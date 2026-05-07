# BMJ Layout Remediation Plan

Date: 2026-05-05  
Project: `payloadbmj`  
Source documents:

- `C:\Users\bulder\Downloads\Layout_Build_Order_Master_Guide.md`
- [BMJ_Layout_Audit_2026-05-05.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Layout_Audit_2026-05-05.md)

## Purpose

Dokumen ini menerjemahkan `Layout_Build_Order_Master_Guide.md` menjadi rencana remediasi yang spesifik untuk codebase BMJ saat ini.

Tujuannya bukan memperbaiki visual secara langsung.  
Tujuannya adalah membekukan ulang urutan pembangunan layout agar codebase kembali tunduk pada satu sistem yang bisa dirawat.

---

## Non-Negotiable Rule

Mulai dari titik ini:

**tidak ada tweak visual, transition tuning, section polish, atau refactor block individual sebelum phase fondasi yang relevan dibekukan.**

Dengan kata lain:

- jangan patch seam dulu,
- jangan tambah spacing lokal dulu,
- jangan adjust hero dulu,
- jangan tambah background experiment dulu,
- jangan tune typography per block dulu.

Semua perubahan harus mengikuti urutan phase di bawah.

---

## Reading of Current Repo Against the Master Guide

## Current state summary

Codebase BMJ saat ini tidak “kosong”.  
Ia sudah memiliki bagian-bagian dari phase bawah, tetapi phase atasnya belum dibekukan dengan benar.

Artinya kita **bukan** mulai dari nol, tetapi kita juga **tidak boleh** menganggap phase yang lebih bawah valid hanya karena komponennya sudah ada.

## Mapping to guide phases

### Phase 0: Design Decisions

Status: `missing / never frozen`

Yang belum benar-benar dibekukan:

- layout model final untuk family `marketing` vs `homepage`
- page families yang final
- canvas ownership
- spacing economics
- typography constitution
- panel/surface constitution
- override policy

### Phase 1: Token Foundation

Status: `partial, mixed with downstream logic`

Yang sudah ada:

- beberapa color tokens
- beberapa transition tokens
- beberapa section transition tokens
- breakpoints

Yang belum sehat:

- token container belum dibekukan sebagai layout constitution yang lengkap
- page rhythm tokens belum dipecah cukup jelas
- type scale belum lengkap sebagai satu system
- panel/surface tokens belum canonical
- `globals.css` bercampur antara token dan route/component behavior

### Phase 2: Root HTML/Body/Canvas

Status: `partial`

Yang sudah ada:

- `body` baseline
- heading reset
- `.container`

Yang belum sehat:

- heading reset belum diikuti typography system yang lengkap
- app-shell law belum dibakukan di level semantic layout
- canvas law masih bercabang antara page-level dan section-level experiment

### Phase 3: Application Shell

Status: `basic but shallow`

Yang sudah ada:

- `RootLayout` dengan `Header`, `main`, `Footer`

Yang belum sehat:

- belum ada deklarasi app-shell law yang eksplisit
- header height belum menjadi contract utama yang dipakai lintas hero/layout

### Phase 4: Page Frame Layer

Status: `exists but under-specified`

Yang sudah ada:

- `PageFrame`
- `pageFrameFamilyClasses`
- page family metadata

Yang belum sehat:

- `homepage` belum dipisahkan secara formal dari `marketing`
- `marketing` terlalu generik
- route layer masih ikut memperbaiki perilaku page family

### Phase 5: Section Shell Layer

Status: `exists but too permissive`

Yang sudah ada:

- `SectionShell`
- section spacing variants
- section variants
- metadata via `data-section-*`

Yang belum sehat:

- default spacing terlalu mahal
- `default` masih implicit di 16 block
- SectionShell belum cukup ketat untuk mencegah layout bocor ke block

### Phase 6: Typography System

Status: `partial / governance incomplete`

Yang sudah ada:

- reset heading
- `SectionHeader`

Yang belum sehat:

- replacement typography system belum lengkap
- hero heading law belum canonical
- banyak block masih menulis heading rhythm sendiri

### Phase 7: Surface/Panel Law

Status: `missing as shared law`

Yang ada sekarang hanyalah pola berulang manual:

- `p-8 md:p-10`
- rounded panel
- border
- shadow

Ini bukan shared surface law, melainkan copy-pasted surface behavior.

### Phase 8: Transition & Adjacency Law

Status: `implemented too early`

Yang sudah ada:

- transition tokens
- adjacency CSS selectors
- divider/wash behavior

Masalah:

- phase ini aktif ketika baseline spacing, typography, dan surface governance belum sehat
- akibatnya transition layer berdiri di atas fondasi yang belum siap

### Phase 9: Hero System

Status: `split into two grammars`

Yang ada sekarang:

- hero route generik di `src/heros/*`
- hero block homepage di `src/blocks/HomeHero`

Masalah:

- route hero tidak memakai grammar yang sama dengan `SectionShell`
- page opening law bercabang

### Phase 10+: Block Layer and Beyond

Status: `already built on unstable upper layers`

Inilah sumber utama chaos saat ini.

---

## Mandatory Work Order for BMJ

Urutan berikut wajib dipatuhi.  
Satu phase tidak boleh dilewati hanya karena component di phase bawahnya sudah ada.

## Phase A: Freeze the Constitution

Goal:

- menciptakan **frozen contract moment** yang selama ini belum pernah terjadi

Deliverable:

- satu dokumen keputusan layout final untuk BMJ

Isi minimum:

1. page family list final
2. authority map final
3. spacing economics final
4. typography governance final
5. surface governance final
6. override policy final

Output BMJ yang dibutuhkan:

- `BMJ_Layout_Constitution.md`

Phase ini harus selesai sebelum menyentuh runtime CSS lagi.

---

## Phase B: Rebuild Token Foundation

Guide reference:

- Phase 1 dari master guide

Goal:

- memisahkan token dari downstream behavior
- memastikan `globals.css` kembali menjadi sumber bahasa dasar, bukan tempat eksperimen route

Work items:

1. inventaris token yang sekarang sudah ada
2. pisahkan token berdasarkan domain:
   - container
   - page rhythm
   - section rhythm
   - panel/surface
   - typography
   - color
   - header
   - transition
3. hilangkan angka yang belum punya token owner
4. pastikan token tidak bercampur dengan selector route khusus

BMJ-specific notes:

- token transition yang sudah ada belum otomatis salah, tetapi belum boleh dianggap final sebelum phase spacing selesai
- token container harus dibekukan ulang berdasarkan kebutuhan nyata BMJ, bukan dibiarkan implicit lewat `.container` saja

No-go:

- jangan menambah selector UI baru di phase ini
- jangan tune visual berdasarkan screenshot di phase ini

---

## Phase C: Repair Root Canvas and Global Type Law

Guide reference:

- Phase 2

Goal:

- menyelesaikan reset/replacement typography
- menormalkan root canvas behavior

Work items:

1. audit `globals.css` heading reset
2. tulis typography replacement yang lengkap
3. putuskan:
   - body text law
   - intro law
   - heading scale law
   - line-height law
   - tracking law
4. tentukan app-shell and body law yang final
5. pastikan route-specific canvas logic tidak hidup di baseline global layer

BMJ-specific notes:

- saat ini `h1-h6` sudah di-reset, jadi phase ini prioritas tinggi
- typography system tidak boleh lagi hidup setengah di `SectionHeader` dan setengah di block

Blocker rule:

- tidak boleh refactor block heading satu per satu sebelum typography law dibekukan

---

## Phase D: Re-freeze Application Shell and Header Contract

Guide reference:

- Phase 3

Goal:

- memastikan app shell hanya mengurus shell, bukan page rhythm
- menjadikan header height sebagai contract resmi

Work items:

1. audit `RootLayout`
2. tokenisasi penuh header height
3. pastikan header interactions terhadap hero tidak lagi memakai magic numbers di luar contract
4. putuskan app-shell class/structure final

BMJ-specific notes:

- hero offset dan page opening tidak boleh lagi bergantung pada improvisasi route hero

---

## Phase E: Re-spec PageFrame and Page Family Laws

Guide reference:

- Phase 4

Goal:

- menjadikan `PageFrame` sebagai page-law owner yang benar-benar presisi

Mandatory BMJ decision:

- `homepage` harus dievaluasi sebagai family tersendiri atau `marketing-home` equivalent

Karena:

- current `marketing` terlalu generik
- homepage sudah terbukti memerlukan behavior yang berbeda

Work items:

1. redefinisi page family list final
2. tulis law masing-masing family:
   - opening
   - closing
   - tone
   - canvas
   - top/bottom rhythm
3. hapus kebutuhan route-level class yang berfungsi sebagai family patch

Critical note:

- selama route layer masih perlu special-case untuk layout identity, phase ini belum lulus

---

## Phase F: Rebuild SectionShell Contract

Guide reference:

- Phase 5

Goal:

- menjadikan `SectionShell` satu-satunya owner section wrapper law

Work items:

1. bekukan spacing scale final
2. evaluasi ulang semantic tier:
   - `none`
   - `compact`
   - `default`
   - `relaxed`
3. hilangkan implicitness berbahaya
4. tetapkan rule eksplisit:
   - block baru wajib menulis `spacing`
   - block baru wajib menulis `variant`
5. putuskan apakah `SECTION_SHELL_DEFAULT_SPACING` tetap ada, dan jika ada, apa nilainya serta kapan boleh dipakai

BMJ-specific recommendation:

- jangan pertahankan `default` implisit sebagai status quo
- explicitness harus diprioritaskan daripada convenience

Current risk snapshot:

- 16 dari 27 block masih `default-implicit`

Exit criteria:

- setiap block baru dan lama punya deklarasi spacing/variant yang eksplisit

---

## Phase G: Complete Typography Governance

Guide reference:

- Phase 6

Goal:

- menghentikan block-level heading law yang liar

Work items:

1. tetapkan bahwa semua section heading harus lewat `SectionHeader` atau successor canonical-nya
2. perluas API `SectionHeader` bila belum cukup
3. bedakan:
   - hero heading law
   - section heading law
   - card title law
   - body copy law
4. larang literal heading rhythm di block kecuali ada exception policy yang dibekukan

BMJ-specific notes:

- `ProcessSteps`, `ProofGallery`, `HomeHero`, `TrustSignals`, dan banyak block lain masih menulis heading rhythm sendiri
- ini tidak boleh dirapikan case by case dulu; governance-nya harus final dulu

---

## Phase H: Canonicalize Surface/Panel Law

Guide reference:

- Phase 7

Goal:

- menarik panel/card behavior keluar dari block individual

Work items:

1. buat surface law canonical
2. putuskan apakah implementasi berupa:
   - `.surface` classes
   - `<Surface />` component
   - atau keduanya
3. tokenisasi:
   - panel padding
   - panel radius
   - panel border
   - panel shadow
   - panel background
4. refactor semua block panel agar mengonsumsi surface law

Current repeated pattern to eliminate:

- `p-8 md:p-10`

Known repeated files:

- `AboutStatement`
- `DeliveryCoverage`
- `SupplyCapacity`
- `ValueStatement`
- `VisitNote`
- `HomeIdentity`
- `ClosingCTA`

Rule after phase complete:

- block tidak boleh lagi menulis panel skeleton manual

---

## Phase I: Freeze Decorative and Canvas Ownership

Guide reference:

- bridge between Phase 4, 5, 8, and 9

Goal:

- memilih satu owner yang sah untuk canvas behavior

Decision that must be frozen:

1. apakah homepage memakai page-level canvas, section-level canvas, atau hybrid
2. apakah decorative variants memiliki background mereka sendiri, atau hanya semantik untuk styling shared
3. kapan route layer boleh ikut campur

BMJ-specific rule:

- eksperimen seperti `homepage-single-canvas-experiment` tidak boleh menjadi solusi final tanpa masuk ke family law yang resmi

---

## Phase J: Delay Transition Law Until Baseline Health Is Proven

Guide reference:

- Phase 8

Goal:

- memastikan adjacency bukan patch

Current interpretation:

Transition grammar yang sekarang ada harus diperlakukan sebagai **provisional**, bukan final law.

Kenapa:

- ia dibangun sebelum page/section/type/surface law final
- maka belum bisa dijadikan patokan visual akhir

Work items when phase begins:

1. verifikasi baseline page tanpa divider/wash sudah sehat
2. baru evaluasi apakah transition layer masih dibutuhkan
3. jika ya, rebuild dari pair-of-variants yang sah

Important rule:

- tidak boleh tuning divider/wash saat foundation phases belum lulus

---

## Phase K: Unify Hero Grammar

Guide reference:

- Phase 9

Goal:

- menyatukan hero route-level dan block-level ke bahasa layout yang sama

Work items:

1. audit `RenderHero`
2. audit `HighImpactHero`, `MediumImpactHero`, `LowImpactHero`
3. putuskan contract hero final:
   - apakah hero masuk `SectionShell`
   - bagaimana offset terhadap header
   - bagaimana page family berinteraksi dengan hero
4. hapus magic numbers yang berasal dari contract yang belum tokenized

BMJ-specific rule:

- hero tidak boleh lagi menjadi grammar kedua yang berdiri sendiri

---

## Phase L: Refactor All Blocks Under the New Law

Guide reference:

- Phase 10

Goal:

- menjadikan 27 block patuh terhadap hukum baru

Work items:

1. refactor blocks dengan `default-implicit` menjadi explicit
2. ganti heading custom dengan system heading
3. ganti panel manual dengan surface law
4. hilangkan compensatory local spacing
5. audit containment usage
6. pastikan block baru bisa ditulis dengan contract yang sama

Important rule:

- phase ini baru boleh dimulai setelah constitutional phases selesai

---

## Phase M: Composition Test Page and Regression Checks

Guide reference:

- Phase 11

Goal:

- membuktikan sistem bekerja sebelum polish

BMJ requirement:

buat halaman komposisi test yang sengaja memuat kombinasi:

- hero
- plain
- panel
- tinted
- patterned
- image-band
- CTA close

Checklist:

1. no dead space
2. no double gap
3. typography consistent
4. panel behavior consistent
5. desktop/tablet/mobile healthy

---

## Phase N: Polish at the End Only

Guide reference:

- Phase 12

Goal:

- visual refinement setelah law sehat

Allowed only here:

- decorative tuning
- transition refinement
- special gradients
- motion polish
- micro-interaction refinement

Not allowed before this phase:

- aesthetic patch yang mencoba mengompensasi structural law yang belum benar

---

## Enforcement Rules for Dev Team

Aturan ini harus berlaku setelah constitution dibekukan.

### Rule 1

Tidak boleh ada block baru tanpa:

- `PageFrame` context yang jelas
- `SectionShell` `spacing` eksplisit
- `SectionShell` `variant` eksplisit

### Rule 2

Tidak boleh ada heading section baru tanpa shared heading component/canonical API.

### Rule 3

Tidak boleh ada panel/card baru yang skeleton-nya ditulis manual jika sudah ada surface law canonical.

### Rule 4

Tidak boleh ada route-level class untuk memperbaiki family law.  
Kalau route butuh class layout khusus, berarti page family law harus direvisi.

### Rule 5

Tidak boleh ada transition tuning sebelum baseline spacing, typography, dan surface health lulus.

### Rule 6

Tidak boleh ada angka spacing atau typography literal jika sudah ada token equivalent.

### Rule 7

Setiap perubahan layout besar harus menjawab:

1. ini phase berapa?
2. owner layer-nya siapa?
3. apakah ini law atau patch?

Kalau tidak bisa dijawab, perubahan tidak boleh masuk.

---

## Immediate Next Action

Berdasarkan guide dan audit, langkah berikutnya yang benar untuk BMJ adalah:

1. tulis `BMJ_Layout_Constitution.md`
2. freeze authority map
3. freeze page family laws
4. freeze section spacing laws
5. freeze typography laws
6. freeze surface laws

Baru setelah itu runtime refactor boleh dimulai.

---

## Final Reading

Guide yang diberikan bukan sekadar panduan ideal.  
Untuk BMJ, guide itu menjelaskan dengan tepat **urutan yang sebelumnya dilanggar**.

Karena itu, “mengikuti instruksi tersebut” untuk repo ini berarti:

- berhenti memperbaiki gejala di layer bawah,
- kembali ke phase konstitusi,
- membekukan hukum dari atas,
- lalu memaksa seluruh block mengikuti hukum itu.

Inilah satu-satunya jalur yang realistis kalau targetnya adalah:

- layout konsisten,
- block baru otomatis aman,
- dan sistem tidak terus membesar sebagai patchwork.

