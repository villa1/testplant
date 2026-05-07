# BMJ Phase 1 Token Foundation Spec

Date: 2026-05-06  
Project: `payloadbmj`  
Scope: **Phase 1 only** from `Layout_Build_Order_Master_Guide.md`

## Scope Boundary

Dokumen ini hanya mendefinisikan **token foundation** yang harus ada sebelum masuk ke:

- root canvas refactor
- `PageFrame` refactor
- `SectionShell` refactor
- typography implementation
- surface implementation
- transition implementation
- hero unification
- block cleanup

Dokumen ini **tidak** mengubah runtime behavior.  
Ia hanya membekukan:

1. token names
2. token domains
3. token values yang sudah cukup grounded
4. token mapping dari state repo saat ini

---

## Source of Truth

Dokumen ini diturunkan dari:

- [BMJ_Layout_Constitution.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Layout_Constitution.md:1)
- [BMJ_Layout_Audit_2026-05-05.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Layout_Audit_2026-05-05.md:1)
- `C:\Users\bulder\Downloads\Layout_Build_Order_Master_Guide.md`
- token dan literal yang **sudah hidup** di repo saat ini

---

## 1. Phase 1 Objective For BMJ

Phase 1 untuk BMJ bukan “menambah token sebanyak mungkin”.

Phase 1 tujuannya:

1. memisahkan keputusan desain dari component classes
2. memberi satu vocabulary yang nanti dikonsumsi phase berikutnya
3. menghentikan penambahan angka literal baru di layer bawah
4. menyiapkan fondasi supaya `PageFrame`, `SectionShell`, typography, dan surface law bisa di-refactor tanpa menebak angka baru

---

## 2. Current Token State In Repo

## 2.1 Tokens already present

Di [globals.css](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/globals.css:41) repo saat ini sudah punya:

- breakpoints
- `--font-sans`
- `--font-mono`
- base color roles:
  - `--background`
  - `--foreground`
  - `--card`
  - `--muted-foreground`
  - `--border`
- radius base:
  - `--radius`
- transition-like section gap tokens:
  - `--section-transition-gap-*`

## 2.2 Problems with current token state

Token state sekarang belum cukup sehat untuk jadi foundation final karena:

1. sebagian domain belum ada:
   - page rhythm
   - section rhythm
   - panel padding
   - type role mapping
   - header contract

2. sebagian warna BMJ masih hidup sebagai literal:
   - `#354E33`
   - `#203223`
   - `#f7f8f1`
   - `#f4f6ef`
   - `#eef3e8`

3. `globals.css` sekarang mencampur:
   - token foundation
   - global baseline
   - route experiment
   - transition implementation

Jadi Phase 1 tidak boleh dianggap selesai hanya karena beberapa token sudah ada.

---

## 3. Token Domains To Freeze

BMJ membekukan domain token berikut sebagai Phase 1 foundation:

1. breakpoints
2. font families
3. container
4. page rhythm
5. section rhythm
6. spacing gaps
7. surface
8. type scale
9. type role mapping
10. line-height
11. tracking
12. color roles
13. header contract
14. generic motion/z-index

Yang **bukan** bagian freeze Phase 1:

- section adjacency gap tokens yang sifatnya phase 8
- divider/wash implementation tokens
- route-specific canvas experiment tokens

---

## 4. Canonical Breakpoint Tokens

BMJ mempertahankan breakpoint yang sudah ada di repo:

```css
--breakpoint-sm: 40rem;
--breakpoint-md: 48rem;
--breakpoint-lg: 64rem;
--breakpoint-xl: 80rem;
--breakpoint-2xl: 86rem;
```

Status:

- **keep**
- tidak perlu diubah di Phase 1

---

## 5. Canonical Font Family Tokens

## 5.1 Global families

Grounded by current repo:

- `Geist Sans`
- `Geist Mono`

Canonical tokens:

```css
--font-body: var(--font-geist-sans);
--font-display: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

## 5.2 Why `--font-display` is still Geist Sans

Saat ini repo belum punya global display font terpisah yang stabil.  
Karena scope Phase 1 harus grounded, BMJ **tidak mengarang display serif baru**.

Jadi untuk foundation:

- `display` dan `body` sementara dibekukan ke keluarga yang sama
- pemisahan display font hanya boleh dilakukan nanti jika diputuskan di constitution baru

## 5.3 Non-global exception fonts

Font yang saat ini hidup di:

- [wordpressSectionFonts.ts](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/fonts/wordpressSectionFonts.ts:1)

tidak masuk foundation global.  
Ia tetap diperlakukan sebagai scoped exception, bukan global law.

---

## 6. Canonical Container Tokens

Grounded by:

- `.container` current max width yang berakhir di `86rem`
- constitution decision

Canonical tokens:

```css
--container-max: 86rem;
--container-px: 1rem;
--container-px-md: 2rem;
```

Optional future aliases:

```css
--container-max-narrow: 48rem;
--container-max-reading: 65ch;
```

Status:

- `--container-max`, `--container-px`, `--container-px-md` = **freeze now**
- narrow/reading aliases = **allowed but not required in first runtime pass**

---

## 7. Canonical Page Rhythm Tokens

Grounded by:

- constitution
- current family split
- existing `PageFrame` concept

Canonical tokens:

```css
--page-pt-homepage: 0rem;
--page-pb-homepage: 6rem;

--page-pt-marketing: 3rem;
--page-pb-marketing: 5rem;

--page-pt-editorial: 3rem;
--page-pb-editorial: 5rem;

--page-pt-commerce: 2.5rem;
--page-pb-commerce: 4rem;

--page-pt-utility: 2.5rem;
--page-pb-utility: 4rem;
```

Status:

- **freeze now**

Reason:

Phase 4 nantinya tidak boleh memilih angka sendiri.  
Ia hanya boleh membaca token ini.

---

## 8. Canonical Section Rhythm Tokens

Grounded by:

- constitution
- existing repo scale
- master guide phase 1 examples

Canonical tokens:

```css
--section-py-none: 0rem;

--section-py-compact: 3rem;
--section-py-default: 4rem;
--section-py-relaxed: 5rem;

--section-py-compact-md: 4rem;
--section-py-default-md: 5rem;
--section-py-relaxed-md: 6rem;
```

Status:

- **freeze now**

Important note:

Token ini adalah foundation.  
Ia **tidak otomatis** melegitimasi `SECTION_SHELL_DEFAULT_SPACING = 'default'`.  
Masalah implicit default tetap dibahas di phase `SectionShell`.

---

## 9. Canonical Spacing Gap Tokens

Grounded by:

- constitution
- master guide spacing ladder

Canonical tokens:

```css
--gap-xs: 0.5rem;
--gap-sm: 1rem;
--gap-md: 1.5rem;
--gap-lg: 2rem;
--gap-xl: 2.5rem;
--gap-2xl: 3rem;
```

Status:

- **freeze now**

Rule:

Setelah token ini dibekukan, penambahan gap baru di block harus memakai vocabulary ini, bukan angka ad hoc baru.

---

## 10. Canonical Surface Tokens

Grounded by:

- repeated `p-8 md:p-10`
- repeated panel patterns in repo
- constitution

Canonical tokens:

```css
--surface-px: 2rem;
--surface-py: 2rem;
--surface-px-md: 2.5rem;
--surface-py-md: 2.5rem;

--surface-radius-sm: 0.75rem;
--surface-radius-md: 1rem;
--surface-radius-lg: 1.5rem;

--surface-border-width: 1px;
```

Shadow token:

```css
--surface-shadow-soft: 0 1px 3px rgba(0, 0, 0, 0.08),
  0 4px 16px rgba(0, 0, 0, 0.04);
```

Status:

- **freeze now**

Why these are grounded:

- `2rem / 2.5rem` datang langsung dari pola `p-8 md:p-10`
- `0.75rem / 1rem / 1.5rem` diambil dari radius yang memang hidup di repo sekarang, tanpa memaksa satu default premature di phase 1

---

## 11. Canonical Type Scale Tokens

Grounded by:

- master guide base scale
- values yang sudah konsisten dengan heading di repo

Canonical scale:

```css
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
--text-5xl: 3rem;
--text-6xl: 3.75rem;
```

Status:

- **freeze now**

---

## 12. Canonical Type Role Tokens

Scale tokens di atas tidak cukup sendiri.  
BMJ juga membekukan role mapping supaya phase 6 nanti tidak menebak ulang.

Canonical role mapping:

```css
--type-hero-title-mobile: var(--text-4xl);
--type-hero-title-md: var(--text-5xl);
--type-hero-title-lg: var(--text-6xl);

--type-page-title-mobile: var(--text-4xl);
--type-page-title-md: var(--text-5xl);
--type-page-title-lg: var(--text-5xl);

--type-section-title-mobile: var(--text-3xl);
--type-section-title-md: var(--text-4xl);
--type-section-title-lg: var(--text-4xl);

--type-subsection-title-mobile: var(--text-2xl);
--type-subsection-title-md: var(--text-3xl);
--type-subsection-title-lg: var(--text-3xl);

--type-card-title-mobile: var(--text-lg);
--type-card-title-md: var(--text-xl);

--type-body: var(--text-base);
--type-intro-mobile: var(--text-base);
--type-intro-md: var(--text-lg);
--type-small: var(--text-sm);
--type-caption: var(--text-xs);
--type-eyebrow: var(--text-xs);
```

Status:

- **freeze now**

Why this is grounded:

- `HomeHero` currently maps to `text-4xl md:text-6xl`
- `SectionHeader` currently maps to `text-3xl md:text-4xl`
- section intros frequently map to `text-base` and sometimes `md:text-lg`

---

## 13. Canonical Line Height and Tracking Tokens

Grounded by:

- master guide
- current use of `leading-7`, `tracking-tight`

Canonical tokens:

```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

--tracking-tight: -0.025em;
--tracking-normal: 0em;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
```

Status:

- **freeze now**

---

## 14. Canonical Header Contract Tokens

Grounded by:

- master guide warning against hero magic numbers
- current repo problem in route hero

Canonical tokens:

```css
--header-height: 4rem;
--header-height-md: 5rem;
```

Status:

- **freeze now**

Important note:

Token ini dibekukan sekarang supaya phase hero dan app shell nanti punya contract yang sama.  
Ia belum berarti hero/runtime langsung diubah hari ini.

---

## 15. Canonical Generic Motion and Z Tokens

BMJ membekukan token generik berikut:

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms ease;

--z-base: 0;
--z-raised: 10;
--z-dropdown: 100;
--z-sticky: 200;
--z-modal: 300;
--z-toast: 400;
--z-header: 500;
```

Status:

- **freeze now**

Note:

Ini berbeda dari transition/adjacency law.  
Ini hanya motion/z-index foundation generik.

---

## 16. Canonical Color Role Tokens

## 16.1 Tokens to preserve from current repo

Current base tokens that stay valid:

```css
--background
--foreground
--card
--muted-foreground
--border
```

## 16.2 Semantic aliases to freeze

Canonical BMJ role aliases:

```css
--color-bg-page: var(--background);
--color-text-primary: var(--foreground);
--color-bg-panel: var(--card);
--color-text-secondary: var(--muted-foreground);
--color-border-default: var(--border);
```

Status:

- **freeze now**

## 16.3 BMJ-specific green family to promote

Grounded by repeated literals in repo:

- `#354E33`
- `#203223`
- `#f7f8f1`
- `#f4f6ef`
- `#eef3e8`

Canonical BMJ additions:

```css
--color-brand-green: #354e33;
--color-brand-green-deep: #203223;
--color-decorative-soft: #f7f8f1;
--color-decorative-pattern: #f4f6ef;
--color-decorative-canvas: #eef3e8;
```

Status:

- **freeze now**

Why this is allowed:

Ini bukan warna baru hasil tebak.  
Ini adalah literal yang paling dominan dan berulang di homepage BMJ saat ini.

## 16.4 Deferred color decisions

Yang belum dibekukan di phase ini:

- full dark theme decorative hierarchy
- alt-section palette beyond current BMJ homepage family
- accent interaction palette yang belum hidup stabil di repo

---

## 17. Tokens Explicitly Out Of Scope In Phase 1

Token berikut **tidak ikut freeze foundation** walaupun sudah ada di repo:

- `--section-transition-gap-none`
- `--section-transition-gap-space`
- `--section-transition-gap-divider`
- `--section-transition-gap-wash`
- `--section-transition-gap-settle`
- divider/wash colors and heights

Reason:

Token itu milik phase adjacency/transition.  
Sementara phase ini hanya mengerjakan foundation yang harus stabil lebih dulu.

Token itu boleh tetap ada sementara di repo, tetapi **statusnya provisional**.

---

## 18. Runtime Implementation Boundary

Kalau phase ini diimplementasikan ke code, implementasinya harus dibatasi menjadi:

1. update `:root` token definitions
2. tambah semantic aliases yang belum ada
3. jangan sentuh section selectors
4. jangan sentuh route selectors
5. jangan tune visuals
6. jangan refactor block

Artinya Phase 1 implementation masih murni pekerjaan vocabulary.

---

## 19. Acceptance Criteria

Phase 1 dianggap selesai jika:

1. semua domain token di dokumen ini sudah punya nama final
2. value token yang frozen sudah hidup di foundation layer
3. tidak ada kebutuhan angka baru untuk masuk ke phase 2–7
4. dev bisa membangun `PageFrame`, `SectionShell`, typography law, dan surface law berikutnya tanpa menebak angka dasar lagi

Phase 1 **belum** dianggap selesai hanya karena:

- `globals.css` sudah punya beberapa token lama
- section transition tokens sudah ada
- warna global lama sudah ada

---

## 20. Immediate Next Step

Setelah dokumen ini disetujui, langkah berikutnya yang masih sesuai guide adalah:

- **Phase 1 runtime implementation only**

yakni:

1. merapikan token foundation di `globals.css`
2. tanpa menyentuh selector layout/runtime behavior lain

