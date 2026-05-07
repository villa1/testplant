# BMJ Thread Handoff - 2026-05-06 (Recovered)

## Purpose

File ini adalah **delta handoff** yang dipulihkan dari thread Codex:

- session id: `019df79a-ca73-7b92-b950-996e4e227065`
- local transcript: `C:\Users\bulder\.codex\sessions\2026\05\05\rollout-2026-05-05T17-06-52-019df79a-ca73-7b92-b950-996e4e227065.jsonl`

Thread lama berakhir karena berulang kali kena `413 Payload Too Large` setelah audit runtime memakai banyak screenshot. Jadi file ini dipakai untuk menjaga konteks agar tidak hilang di sesi baru.

## Read Order

Sebelum lanjut kerja, baca urutan ini:

1. [BMJ_Section_Shell_Architecture.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Section_Shell_Architecture.md)
2. [BMJ_Thread_Handoff_2026-05-05.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Thread_Handoff_2026-05-05.md)
3. [BMJ_Layout_Audit_2026-05-05.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Layout_Audit_2026-05-05.md)
4. [BMJ_Layout_Remediation_Plan_2026-05-05.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Layout_Remediation_Plan_2026-05-05.md)
5. [BMJ_Layout_Constitution.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Layout_Constitution.md)
6. [BMJ_Phase1_Token_Foundation_Spec.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Phase1_Token_Foundation_Spec.md)
7. File handoff recovery ini

## Current Truth

- Handoff `2026-05-05` tetap berlaku untuk status primitive canon.
- Thread recovery ini menambahkan konteks **setelah** handoff lama: dokumentasi top-down, phase 8-12, runtime audit, dan polish lanjutan.
- Eksperimen transisi lokal yang pernah dicoba di `TrustSignals` **sudah direvert**. Jangan menghidupkan lagi logic seam per section.
- Perubahan awal `ProofGallery` yang menjadikan background sebagai full section shell tetap sejalan dengan arah yang sekarang.

## Non-Negotiables

- Jangan tambah abstraction core baru tanpa alasan kuat.
- Jangan mengembalikan ownership spacing ke block atau patch lokal.
- Transition/seam tetap milik composition/page layer, bukan milik `ProofGallery`, `TrustSignals`, atau pasangan block spesifik.
- Jangan membongkar card internals kecuali memang diperlukan oleh phase polish terakhir.
- Pertahankan hasil yang sudah dianggap benar:
  - `ProofGallery` sebagai patterned/full-shell chapter.
  - `TrustSignals` sebagai image-band/lane-based section.
  - `ProcessSteps` card conversion.

## Recovered Milestones

### 1. Documentation Reset

Setelah user mengoreksi pendekatan per-section, thread beralih ke jalur top-down dan menghasilkan dokumen ini:

- [BMJ_Layout_Audit_2026-05-05.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Layout_Audit_2026-05-05.md)
- [BMJ_Layout_Remediation_Plan_2026-05-05.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Layout_Remediation_Plan_2026-05-05.md)
- [BMJ_Layout_Constitution.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Layout_Constitution.md)
- [BMJ_Phase1_Token_Foundation_Spec.md](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/BMJ_Phase1_Token_Foundation_Spec.md)

Ini adalah source of truth untuk urutan kerja. Jangan kembali ke mode patch visual tanpa mematuhi urutan phase.

### 2. Phase 1 Runtime Foundation

Token foundation runtime dibekukan di:

- [src/app/(app)/globals.css](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/globals.css)

Scope-nya hanya token/foundation:

- typography
- container
- page rhythm
- section rhythm
- gap scale
- semantic colors
- surface tokens
- motion/z-index

Token transisi lama ditandai sebagai provisional dan tidak lagi dianggap final foundation.

### 3. Phase 8 Adjacency Law

Phase 8 menertibkan transition ownership di:

- [src/app/(app)/globals.css](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/globals.css)

State canonical-nya:

- transition layer **bukan owner spacing**
- `margin-block-start` dihapus dari adjacency system
- jarak antar section kembali murni dimiliki `PageFrame` + `SectionShell`
- transition tinggal seam visual tipis untuk pair yang memang sah

Pair yang dipertahankan:

- `patterned -> image-band` = divider halus
- `image-band -> panel` = wash ringan
- `tinted -> patterned` = wash ringan
- `hero -> next` tidak dipaksa seam

### 4. Phase 9 Hero Law

Hero system sudah disatukan ke grammar layout:

- [src/heros/HeroShell.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/heros/HeroShell.tsx)
- [src/components/layout/PageFrame.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/layout/PageFrame.tsx)
- [src/app/(app)/[slug]/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/[slug]/page.tsx)
- [src/blocks/HomeHero/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/HomeHero/Component.tsx)
- [tests/int/hero-shell.int.spec.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/tests/int/hero-shell.int.spec.tsx)

State penting:

- route hero tidak lagi hidup di luar grammar shell
- `PageFrame` punya contract `hasHero`
- magic offset `-mt-[10.4rem]` sudah dihapus
- homepage hero block ikut membaca contract hero yang sama

### 5. Phase 10 Governance and Shared Surface Cleanup

Phase 10 menutup pelanggaran block layer:

- semua usage `SectionShell` sekarang harus eksplisit soal `spacing`
- panel berulang ditarik ke `Surface`
- heading custom yang jelas ditarik ke `SectionHeader`
- governance test ditambah supaya pelanggaran serupa tidak kembali

File kunci:

- [src/components/layout/Surface.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/layout/Surface.tsx)
- [tests/int/block-governance.int.spec.ts](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/tests/int/block-governance.int.spec.ts)

### 6. Phase 11 Composition Proof Page

Phase 11 membuat halaman uji komposisi deterministik:

- [src/components/layout/LayoutCompositionTestPage.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/layout/LayoutCompositionTestPage.tsx)
- [src/app/(app)/layout-composition-test/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/layout-composition-test/page.tsx)
- [tests/int/layout-composition-page.int.spec.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/tests/int/layout-composition-page.int.spec.tsx)

Catatan penting:

- route awal sempat dibuat sebagai `__layout-composition`
- itu salah untuk App Router karena folder underscore dianggap private
- route canonical sekarang adalah `/layout-composition-test`

Halaman ini dipakai untuk membuktikan kombinasi canonical:

- `hero`
- `plain`
- `panel`
- `tinted`
- `patterned`
- `image-band`
- closing CTA

### 7. Phase 12 Runtime Polish

Phase 12 hanya menyentuh estetika di atas hukum layout yang sudah beku.

Polish shared/foundation:

- [src/app/(app)/globals.css](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/globals.css)

Polish homepage/proof page:

- [src/blocks/HomeHero/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/HomeHero/Component.tsx)
- [src/blocks/ClosingCTA/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/ClosingCTA/Component.tsx)
- [src/blocks/SupplyCategories/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/SupplyCategories/Component.tsx)
- [src/blocks/ProofGallery/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/ProofGallery/Component.tsx)
- [src/blocks/ProcessSteps/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/ProcessSteps/Component.tsx)
- [src/components/layout/LayoutCompositionTestPage.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/layout/LayoutCompositionTestPage.tsx)

Polish list pages:

- [src/components/ArticleArchive/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/ArticleArchive/index.tsx)
- [src/components/ArticleCard/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/ArticleCard/index.tsx)
- [src/app/(app)/shop/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/shop/page.tsx)
- [src/app/(app)/shop/loading.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/shop/loading.tsx)
- [src/components/ProductGridItem/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/ProductGridItem/index.tsx)

What changed in practice:

- hero contrast, atmospheric overlays, trust strip, CTA feel
- shared `surface` depth and action polish
- supply category orphan-card fix on smaller breakpoints
- `ProofGallery` mobile gallery density improved
- `ProcessSteps` tablet 3-card layout balanced
- article list orphan card no longer jatuh sendiri di kiri
- shop trailing row composition dibuat lebih sengaja

## Verified State

Repeatedly verified during recovered thread:

- `pnpm exec tsc --noEmit --pretty false`
- `pnpm exec vitest run --config ./vitest.config.mts tests/int`

After Phase 11/12, test suite yang beberapa kali dilaporkan lulus adalah:

- `7` test file
- `20` test
- semua pass

Ada satu catatan verifikasi:

- `tests/int/api.int.spec.ts` sempat timeout sekali saat DB lambat
- rerun pass
- perubahan layout di thread ini tidak menyentuh layer API

## Tooling Notes

- `rg` sempat tidak bisa dipakai dari environment ini, jadi thread lama beberapa kali fallback ke pembacaan file biasa.
- Browser plugin tidak bisa dipakai di thread lama karena issue runtime/Node, sehingga audit visual dilakukan lewat dev server + Playwright screenshot lokal.
- Penyebab thread mati bukan bug repo, tetapi payload session yang membengkak karena jejak screenshot/view-image, lalu upstream websocket menolak response di atas batas `15 MB`.

## Exact Stop Point

Status terakhir sebelum thread mati:

- homepage sudah dipolish lintas desktop/tablet/mobile
- composition test page sudah hidup
- article list dan shop list sudah dirapikan
- next target adalah **detail pages**

Task yang sedang aktif saat session crash:

- audit visual `article detail`
- audit visual `product detail`
- belum ada ringkasan hasil audit yang sempat dikirim
- belum ada patch detail-page yang sempat dikonfirmasi sebagai langkah berikutnya

Jadi detail-page audit adalah **unfinished work**, bukan pekerjaan yang sudah selesai.

Screenshot runtime yang sempat diambil tepat sebelum crash:

- `C:\Users\bulder\lobable\freshboiler\payloadcms\payloadbmj\.tmp-article-detail-desktop-real.png`
- `C:\Users\bulder\lobable\freshboiler\payloadcms\payloadbmj\.tmp-article-detail-mobile-real.png`
- `C:\Users\bulder\lobable\freshboiler\payloadcms\payloadbmj\.tmp-product-detail-desktop-real.png`
- `C:\Users\bulder\lobable\freshboiler\payloadcms\payloadbmj\.tmp-product-detail-mobile-real.png`

Kalau melanjutkan dari titik terakhir, mulai dari screenshot itu dulu dan tetap audit di layer composition/page-shell sebelum menyentuh internals komponen.

## Practical Resume Point

Resume paling aman untuk thread baru:

1. Anggap primitive canon, phase 8-11 law, dan phase 12 homepage/list-page polish sebagai baseline aktif.
2. Jangan buka ulang diskusi transition law dari nol; itu sudah dipindah ke ownership composition dan spacing-nya sudah dicabut dari adjacency.
3. Lanjutkan Phase 12 hanya pada `article detail` dan `product detail`, karena itu memang titik kerja terakhir sebelum session lama tumbang.
4. Kalau menemukan flaw, periksa dulu apakah masalahnya page-shell/composition, bukan langsung mengubah card internals atau menambah law baru.

## 2026-05-06 Continuation Delta

Thread baru ini sudah melanjutkan titik crash tersebut dan menyelesaikan satu pass detail-page polish.

Area yang disentuh:

- [src/app/(app)/artikel/[slug]/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/artikel/[slug]/page.tsx)
- [src/app/(app)/products/[slug]/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/products/[slug]/page.tsx)
- [src/components/product/ProductDescription.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/ProductDescription.tsx)
- [src/components/product/Gallery.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/product/Gallery.tsx)
- [src/app/(app)/globals.css](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/globals.css)

Ringkasan hasil:

- `article detail` sekarang memakai komposisi editorial yang lebih sengaja: intro lebih kuat, body dibaca sebagai reading surface, dan duplicate heading pertama di rich text dihapus bila isinya sama dengan title page.
- `product detail` sekarang memakai main detail surface yang lebih canonical, hierarchy price/status/action lebih rapi, related sections dibawa ke grammar section yang sama, dan gallery utama memakai aspect yang lebih disiplin agar hero area tidak terlalu menjulang.

Verifikasi yang dilalui di continuation ini:

- `pnpm exec tsc --noEmit --pretty false`
- `pnpm exec vitest run --config ./vitest.config.mts tests/int/layout-primitives.int.spec.tsx tests/int/section-header.int.spec.tsx tests/int/surface.int.spec.tsx tests/int/hero-shell.int.spec.tsx tests/int/layout-composition-page.int.spec.tsx tests/int/block-governance.int.spec.ts`

Runtime audit yang dilakukan:

- article detail desktop/mobile screenshot ulang
- product detail desktop/mobile screenshot ulang

Kalau melanjutkan lagi setelah thread ini:

- anggap homepage, list pages, dan detail-page pass pertama sudah tertutup
- lanjut hanya jika masih ada residual polish pada page family lain, bukan dengan membuka ulang fondasi layout law

## 2026-05-06 Utility, Checkout, and Account Delta

Thread ini kemudian ditutup dengan residual polish untuk utility/auth pages, checkout empty/confirm states, dan account family.

Area yang disentuh:

- [src/app/(app)/login/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/login/page.tsx)
- [src/app/(app)/create-account/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/create-account/page.tsx)
- [src/app/(app)/forgot-password/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/forgot-password/page.tsx)
- [src/app/(app)/find-order/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/find-order/page.tsx)
- [src/app/(app)/checkout/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/checkout/page.tsx)
- [src/app/(app)/checkout/confirm-order/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/checkout/confirm-order/page.tsx)
- [src/components/checkout/CheckoutPage.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/checkout/CheckoutPage.tsx)
- [src/components/checkout/ConfirmOrder.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/checkout/ConfirmOrder.tsx)
- [src/app/(app)/(account)/layout.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/(account)/layout.tsx)
- [src/app/(app)/(account)/account/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/(account)/account/page.tsx)
- [src/app/(app)/(account)/orders/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/(account)/orders/page.tsx)
- [src/app/(app)/(account)/account/addresses/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/(account)/account/addresses/page.tsx)
- [src/app/(app)/(account)/orders/[id]/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/(account)/orders/[id]/page.tsx)
- [src/components/AccountNav/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/AccountNav/index.tsx)

Ringkasan hasil:

- utility/auth pages sekarang memakai shell `PageFrame` + `SectionShell` + `Surface` yang konsisten, dengan intro copy/hierarchy yang tidak lagi terasa seperti raw scaffold template.
- checkout empty state dan confirm-order state sekarang tampil sebagai utility surface yang lebih intentional, bukan placeholder dump.
- account family sekarang memakai sticky surface nav di desktop, nav tetap terlihat di mobile, dan panel settings/orders/addresses dibawa ke grammar surface yang sama dengan page family lainnya.

Verifikasi yang dilalui:

- `pnpm exec tsc --noEmit --pretty false`
- `pnpm exec vitest run --config ./vitest.config.mts tests/int/layout-primitives.int.spec.tsx tests/int/section-header.int.spec.tsx tests/int/surface.int.spec.tsx tests/int/hero-shell.int.spec.tsx tests/int/layout-composition-page.int.spec.tsx tests/int/block-governance.int.spec.ts`

Runtime audit yang dilakukan:

- screenshot desktop/mobile untuk `login`
- screenshot desktop/mobile untuk `checkout`
- screenshot desktop untuk `create-account`, `forgot-password`, `find-order`, dan `checkout/confirm-order`
- screenshot desktop/mobile untuk account family (`/account`) dan desktop untuk `/orders` serta `/account/addresses`
- interaktif `create-account` dan `login` diverifikasi sukses terhadap `http://localhost:3000`

Catatan verifikasi penting:

- submit `create-account` sempat terlihat gagal bila automation diarahkan ke `http://127.0.0.1:3000`; itu ternyata artefak dev-server host/HMR pada environment ini, bukan bug aplikasi.
- pada host canonical `http://localhost:3000`, `create-account` benar-benar menembak `POST /api/users` lalu `POST /api/users/login`, dan `login` juga berhasil menembak `POST /api/users/login` lalu redirect ke `/account`.

Status akhir setelah delta ini:

- residual page family dari thread lama sudah tertutup
- tidak ada carry-over task yang tersisa dari session `019df79a-ca73-7b92-b950-996e4e227065`
- pekerjaan berikutnya, bila ada, sudah termasuk scope baru atau polish tambahan, bukan recovery dari thread crash

## 2026-05-06 Old Project Reassembly Delta

Fokus thread lalu bergeser dari recovery ke reassembly storefront BMJ agar basis tampilannya mendekati project lama `tanaman-hias-master`, tetapi tetap mengikuti best practices layout primitives di repo BMJ.

Area yang disentuh pada pass fondasi:

- [src/components/layout/layoutPrimitives.config.ts](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/components/layout/layoutPrimitives.config.ts)
- [src/app/(app)/globals.css](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/globals.css)
- [src/app/(app)/shop/layout.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/shop/layout.tsx)
- [src/app/(app)/artikel/[slug]/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/artikel/[slug]/page.tsx)
- [src/app/(app)/products/[slug]/page.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/products/[slug]/page.tsx)
- [src/heros/HighImpact/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/heros/HighImpact/index.tsx)
- [src/heros/MediumImpact/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/heros/MediumImpact/index.tsx)
- [src/heros/LowImpact/index.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/heros/LowImpact/index.tsx)
- utility/footer shells seperti `login`, `checkout`, `not-found`, dan footer bottom bar

Ringkasan hasil fondasi:

- `SectionShell` sekarang punya containment canonical `wide`, `narrow`, dan `reading`, jadi ownership width tidak lagi tersebar di `container/max-w-*` manual per page.
- family storefront, editorial detail, utility, dan footer sudah diratakan ke grammar wrapper/width yang sama.
- satu `container` manual yang sengaja tersisa hanya `AdminBar`, di luar scope frontend publik.

Verifikasi fondasi:

- `pnpm exec tsc --noEmit --pretty false`
- `pnpm exec vitest run --config ./vitest.config.mts --pool threads tests/int/layout-primitives.int.spec.tsx tests/int/section-header.int.spec.tsx tests/int/surface.int.spec.tsx tests/int/hero-shell.int.spec.tsx tests/int/layout-composition-page.int.spec.tsx tests/int/block-governance.int.spec.ts tests/int/shop-layout.int.spec.tsx tests/int/not-found-layout.int.spec.tsx`

Lalu thread masuk ke pass visual dasar dan komposisi homepage:

- [src/blocks/HomeHero/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/HomeHero/Component.tsx)
- [src/blocks/HomeIdentity/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/HomeIdentity/Component.tsx)
- [src/app/(app)/globals.css](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/globals.css)

Ringkasan hasil homepage:

- hero homepage tidak lagi boxed/dark-card seperti pass lama, tetapi direassembly menjadi full-bleed image hero dengan kolom copy kiri yang jauh lebih dekat ke project lama.
- tone hero digeser ke overlay terang dan title hijau gelap agar lebih menyerupai storefront lama daripada hero BMJ yang sebelumnya terlalu ornamental.
- trust items di bawah hero diubah menjadi strip panel ringan, bukan grid kartu gelap.
- section identitas pertama di bawah hero diratakan menjadi split band yang lebih tenang dan tidak lagi memakai elevated card berat.

Runtime audit homepage:

- screenshot desktop: `.codex-homepage-desktop-after-hero-pass.png`
- screenshot mobile: `.codex-homepage-mobile-after-hero-pass.png`
- screenshot full page: `.codex-homepage-full-after-hero-pass.png`

Status terbaru setelah delta ini:

- fase fondasi `page width / wrapper / container / utility/footer` sudah tertutup
- visual layer dasar `font / type scale / color direction` sudah ditune ke arah project lama
- pass komposisi homepage sudah dimulai dan hero + first identity section sudah materially lebih dekat ke project lama
- langkah berikutnya yang paling logis adalah meneruskan composition polish ke section-section tengah homepage, lalu menilai apakah shop/PDP masih butuh pass visual lanjutan

## 2026-05-07 Homepage Mid-Section Delta

Thread berikutnya melanjutkan composition pass pada section tengah homepage yang masih terasa terlalu berat dibanding project lama.

Area yang disentuh:

- [src/blocks/ProcessSteps/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/ProcessSteps/Component.tsx)
- [src/blocks/TrustSignals/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/TrustSignals/Component.tsx)
- [src/blocks/HomeIdentity/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/HomeIdentity/Component.tsx)
- [src/app/(app)/globals.css](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/globals.css)

Ringkasan hasil:

- `HomeIdentity` / section `Siapa Kami` tidak lagi memakai containment `wide`; block itu kembali ke `contained` dan panelnya dibatasi agar tidak terasa full width.
- `ProcessSteps` tidak lagi memakai dark-green heavy cards dengan font/ornamen yang terlalu jauh dari storefront lama; section ini sekarang memakai kartu terang, radius lembut, icon kecil, dan ritme copy yang lebih tenang.
- `TrustSignals` tidak lagi memakai image cards gelap dengan overlay berat; sekarang kartunya lebih dekat ke editorial/storefront card yang terang dengan image top dan content bawah.

Verifikasi yang dilalui:

- `pnpm exec tsc --noEmit --pretty false`
- `pnpm exec vitest run --config ./vitest.config.mts --pool threads tests/int/layout-primitives.int.spec.tsx tests/int/section-header.int.spec.tsx tests/int/surface.int.spec.tsx tests/int/hero-shell.int.spec.tsx tests/int/layout-composition-page.int.spec.tsx tests/int/block-governance.int.spec.ts tests/int/shop-layout.int.spec.tsx tests/int/not-found-layout.int.spec.tsx`

Runtime audit:

- screenshot homepage full page: `.codex-homepage-midpass-full.png`

Status terbaru setelah delta ini:

- hero homepage, identity band, process steps, dan trust section sudah materially lebih dekat ke project lama
- gap yang masih tersisa di homepage terutama ada pada `Apa yang Kami Supply`, `Visual Kebun dan Tanaman`, dan CTA penutup jika ingin didorong lebih dekat lagi ke pola `Explore` / `Contact` dari project lama
- di luar homepage, `shop` mobile filter interaction masih bisa ditutup lagi bila ingin drawer/sheet yang lebih proper

## 2026-05-07 Hero Reframe Delta

Delta ini memulihkan konteks dari thread Codex:

- session id: `019dfba1-23fd-78a0-b352-8ba4d6456ab0`
- local transcript: `C:\Users\bulder\.codex\sessions\2026\05\06\rollout-2026-05-06T11-52-16-019dfba1-23fd-78a0-b352-8ba4d6456ab0.jsonl`

Thread ini dimulai dengan memulihkan konteks `019df79a-ca73-7b92-b950-996e4e227065`, lalu melanjutkan pass visual homepage. Bagian yang paling penting untuk dibawa ke sesi baru adalah perubahan arah pada `hero`, karena di titik itu user mengubah constraint dan thread mati sebelum ada jawaban akhir.

### Arah yang Dibekukan di Thread Ini

- user meminta **visual parity / adjustment** dimulai dari hero, karena hero terasa terlalu besar
- pass awal sempat menurunkan tinggi hero lewat CSS saja
- setelah itu user menghentikan patch berantai dan meminta hero **dibedah satu per satu**
- user lalu menegaskan bahwa `trust bar` memang **bagian dari hero**
- user juga menilai `full width` memberi efek massa yang terlalu besar
- setelah referensi desain baru diberikan (`Imagbe.png`), arah hero berubah:
  - hero **bukan full-bleed lagi**
  - hero menjadi **frame lebar** yang tetap besar, rounded, dan berisi beberapa komposisi internal
  - `trust strip`, `title`, supporting copy, dan CTA tetap hidup **di dalam hero yang sama**

### Implementasi yang Sudah Terjadi

Area yang disentuh pada pass ini:

- [src/blocks/HomeHero/Component.tsx](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/blocks/HomeHero/Component.tsx)
- [src/app/(app)/globals.css](C:/Users/bulder/lobable/freshboiler/payloadcms/payloadbmj/src/app/(app)/globals.css)

State kode penting yang berlaku sekarang:

- `HomeHeroBlock` tetap memakai satu `HeroShell` dengan `containment="wide"`
- seluruh komposisi hero hidup di dalam `.home-hero__frame`
- `trust bar` masih berada **di dalam frame hero**, bukan section terpisah
- hero sekarang sudah berupa frame rounded gelap dengan image background dan overlay internal
- frame hero aktif saat ini masih memakai `min-height: clamp(34rem, 68vh, 44rem)`
- title hero aktif saat ini masih memakai `font-size: clamp(3rem, 5.2vw, 4.8rem)`
- padding utama content aktif saat ini masih `2rem 2rem 1.5rem`, dan di `md` menjadi `2.3rem 2.25rem 1.5rem`
- trust bar aktif saat ini masih punya padding bawah internal `1.25rem`, dan di `md` menjadi `1.5rem`

### Diagnosis Terakhir yang Berlaku

Constraint terakhir dari user sebelum thread mati:

- konsep hero **sudah mendekati** yang diinginkan
- tetapi hero harus memenuhi **above the fold optimization**
- semua informasi utama harus bisa dikonsumsi **tanpa user scroll**
- masalah utama sekarang adalah hero masih terlalu besar dan punya terlalu banyak ruang kosong
- user meminta untuk **dissect dulu why**, bukan langsung patch buta

Interpretasi yang paling aman dari thread ini:

- masalah hero **bukan lagi** soal schema CMS atau apakah trust bar perlu dipisah
- masalah hero juga **bukan lagi** sekadar `full width` vs `contained`
- masalah utamanya adalah **perceived vertical mass**:
  - frame hero terlalu tinggi
  - copy stack masih terlalu rendah/lega di dalam frame
  - title masih menyita tinggi yang besar
  - trust strip masih menambah tinggi total hero secara signifikan
  - jarak antar layer di dalam hero masih terlalu longgar untuk target above-the-fold

### Exact Stop Point

Pesan user terakhir yang belum sempat dijawab substansinya:

- hero sudah mendekati arah mockup
- tetapi seluruh komposisi belum `above the fold`
- user ingin membedah penyebab ruang kosong / massa vertikal hero sebelum lanjut patch lagi

Jadi titik resume yang benar **bukan** langsung redesain ulang hero dari nol, tetapi:

1. audit kenapa hero framed yang sekarang tetap gagal masuk viewport pertama
2. ukur kontribusi tinggi dari `frame`, `content padding`, `title scale`, `copy gap`, dan `trust strip`
3. baru setelah diagnosis itu lakukan pass kompresi vertikal yang terarah

### Artefak Runtime dari Thread Ini

Screenshot yang sempat diambil dalam thread ini:

- `C:\Users\bulder\lobable\freshboiler\payloadcms\payloadbmj\.codex-hero-before-adjust.png`
- `C:\Users\bulder\lobable\freshboiler\payloadcms\payloadbmj\.codex-hero-after-adjust-desktop.png`
- `C:\Users\bulder\lobable\freshboiler\payloadcms\payloadbmj\.codex-hero-after-adjust-mobile.png`
- `C:\Users\bulder\lobable\freshboiler\payloadcms\payloadbmj\.codex-hero-concept-desktop.png`
- `C:\Users\bulder\lobable\freshboiler\payloadcms\payloadbmj\.codex-hero-concept-mobile.png`

Kalau melanjutkan dari thread ini, mulai dari screenshot `concept` dan state CSS aktif sekarang, lalu jawab dulu pertanyaan user: **kenapa hero framed saat ini masih gagal above-the-fold?**
