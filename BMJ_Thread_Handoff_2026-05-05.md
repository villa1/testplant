# BMJ Thread Handoff - 2026-05-05

## Read First

Sebelum melanjutkan di thread baru, baca:

- [BMJ_Section_Shell_Architecture.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Section_Shell_Architecture.md)
- [BMJ_Thread_Handoff_2026-05-05.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Thread_Handoff_2026-05-05.md)

Dokumen arsitektur adalah source of truth utama. File handoff ini hanya ringkasan eksekusi dan status terbaru.

## Current Goal

Kita **sudah selesai fase core/composition primitives** untuk wrapper system dan sekarang **siap masuk ke polished design**, tetapi harus tetap memakai grammar yang sudah dikunci, bukan kembali ke tambal-sulam per section.

## Non-Negotiable Architecture

- `Skeleton` = **core primitive**
- `PageFrame` dan `SectionShell` = **composition primitives**
- block seperti `SupplyCategories`, `ProcessSteps`, `TrustSignals`, `ProofGallery` = **feature layer**

Jangan kembalikan ownership spacing ke:

- `RenderBlocks`
- margin generik seperti `my-16`
- random `py-*` per block tanpa shell grammar

## Primitive Canonical State

### 1. `SectionShell`

Canonical files:

- [SectionShell.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/layout/SectionShell.tsx)
- [layoutPrimitives.config.ts](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/layout/layoutPrimitives.config.ts)

Canonical API:

- `variant`
- `spacing`
- `background`
- `containment`
- `innerClassName`
- `className`
- `id`

Important facts:

- `contained` boolean **sudah dihapus**
- kontrak sekarang: `containment="contained" | "full-bleed"`
- implementation **tidak lagi memakai `cva`**
- `SectionShell` membaca token canonical langsung dari `layoutPrimitives.config.ts`

Current `data-*` contract:

- `data-section-shell`
- `data-section-variant`
- `data-section-spacing`
- `data-section-containment`
- `data-section-role`
- `data-section-decorative`
- `data-section-surface-shift`

### 2. `PageFrame`

Canonical files:

- [PageFrame.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/layout/PageFrame.tsx)
- [layoutPrimitives.config.ts](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/layout/layoutPrimitives.config.ts)

Canonical API:

- `family`
- `as`
- `className`

Important facts:

- implementation **tidak lagi memakai `cva`**
- `PageFrame` membaca token canonical langsung dari `layoutPrimitives.config.ts`

Current `data-*` contract:

- `data-page-frame`
- `data-page-family`
- `data-page-tone`
- `data-page-expressive`

### 3. `Skeleton`

Canonical file:

- [skeleton.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/ui/skeleton.tsx)

Important facts:

- `Skeleton` sudah resmi ada sebagai primitive inti
- sudah membawa `data-skeleton`
- adopsinya sudah dimulai, tetapi belum perlu dijadikan pekerjaan utama berikutnya

## Canonical Token/Metadata Config

File:

- [layoutPrimitives.config.ts](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/layout/layoutPrimitives.config.ts)

Yang sekarang sudah dikunci di file itu:

- class map canonical
- default canonical
- daftar token valid
- resolver canonical
- metadata canonical
- helper invariant canonical

Helper yang sekarang sudah ada:

- `resolvePageFrameFamily`
- `resolvePageFrameFamilyMeta`
- `resolveSectionShellContainment`
- `resolveSectionShellSpacing`
- `resolveSectionShellVariant`
- `resolveSectionShellVariantMeta`
- `isExpressivePageFrameFamily`
- `isMinimalPageFrameFamily`
- `isProsePageFrameFamily`
- `isDecorativeSectionShellVariant`
- `isSurfaceShiftingSectionShellVariant`
- `isBaseSectionShellVariant`

## Composition/Route Status

### `RenderBlocks`

File:

- [RenderBlocks.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/RenderBlocks.tsx)

Status:

- sudah kembali menjadi **registry/composer murni**
- tidak lagi memberi spacing generik atau fallback wrapper

### `PageFrame` family adoption

Sudah dipakai di:

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

### `SectionShell` adoption

Semua block yang ada di registry `RenderBlocks` saat ini sudah own `SectionShell` masing-masing.

## Core Test Coverage

New targeted primitive test:

- [layout-primitives.int.spec.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/tests/int/layout-primitives.int.spec.tsx)

What it covers:

- resolver canonical
- metadata canonical
- `data-*` contract untuk `PageFrame`
- `data-*` contract untuk `SectionShell`

Vitest harness update:

- [vitest.config.mts](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/vitest.config.mts) sekarang include:
  - `tests/int/**/*.int.spec.ts`
  - `tests/int/**/*.int.spec.tsx`

Verified commands:

- `pnpm exec vitest run --config ./vitest.config.mts tests/int/layout-primitives.int.spec.tsx`
- `pnpm exec tsc --noEmit --pretty false`

Important note:

- sebelumnya test sempat gagal karena dev server masih hidup
- setelah dev server dimatikan, command default di atas **lolos normal**

## Homepage Visual State Worth Preserving

Section yang sudah dianggap berhasil / mendekati:

### `ProofGallery`

- wrapper patterned shell dari WordPress
- background `public/bg4-scaled.jpg`
- panel putih terangkat
- user menyatakan hasilnya bagus

### `TrustSignals`

- card anatomy image-first editorial
- collision icon/title sudah beres
- eksperimen wrapper `bg11.jpg` disukai user, tetapi flaw transisi antar section mengungkap problem sistemik wrapper yang sekarang sudah dibenahi di primitive layer

### `ProcessSteps`

- card visual sudah cukup dekat ke WordPress `pxl_box_grid layout 1`
- section-scoped fonts:
  - `Plus Jakarta Sans`
  - `Heebo`
- icon context sudah diatur
- next step untuk block ini seharusnya bukan membongkar lagi card internals, tetapi polishing memakai grammar shell yang sekarang sudah matang

## What Not To Do In New Thread

Jangan:

- kembali menganalisis dari nol masalah wrapper
- kembali menambah primitive/abstraction baru di core tanpa alasan kuat
- kembali mengubah card internals acak per block
- memperlakukan homepage sebagai sistem yang terpisah dari shop/article/product
- memindahkan concern core ke feature

## Correct Next Step

Thread baru seharusnya mulai dari:

1. baca dua dokumen ini
2. anggap **core/composition primitive sudah cukup matang**
3. mulai fase **polished design** memakai grammar yang sudah ada
4. fokus ke shell grammar dan section adjacency, bukan lagi membangun primitive baru

## Recommended First Task In New Thread

Mulai dari homepage, tetapi dengan grammar yang sudah dikunci:

- audit urutan shell antar section
- tetapkan adjacency yang paling masuk akal
- polish wrapper visual section demi section
- jangan sentuh lintas app dulu kecuali polish itu menabrak invariant primitive
