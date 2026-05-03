# BMJ Ecommerce Categorization
## PT Bumi Mekarsari Jaya - Shop Category Reference

**Status:** Final Reference + Minimal-Change Implementation Notes  
**Berlaku untuk:** kategori shop BMJ di `payloadbmj`  
**Scope:** category utama, attribute, use case, filtering minimal, dan implikasi implementasi pada shop system  
**Tanggal:** May 2026  

---

## 1. Tujuan Dokumen

Dokumen ini menjadi acuan tetap untuk penyusunan kategori shop BMJ agar:

- struktur kategori tetap rapi saat SKU bertambah
- taxonomy tidak cepat overlap
- category page tetap relevan untuk organic search
- wording category enak dibaca user
- naming realistis untuk ecommerce tanaman
- pengembangan berikutnya tidak merusak shop system yang sudah berjalan
- blueprint taxonomy sinkron dengan batas kemampuan Payload Ecommerce plugin dan codebase `payloadbmj`
- implementasi V1 tetap konservatif dan tidak memodifikasi shop system lebih dari yang diperlukan

Dokumen ini tidak dimaksudkan untuk mengubah fondasi route atau kontrak internal ecommerce template yang sudah aktif.
Dokumen ini juga tidak mengasumsikan bahwa seluruh taxonomy dan filter yang dibahas sudah ada di codebase saat ini. Sebagian adalah target struktur yang perlu ditambahkan bertahap.

---

## 2. Prinsip Dasar

### 2.1 Organic-First

Shop BMJ bergantung pada organic search, jadi category utama harus:

- jelas secara user intent
- cukup luas untuk menampung banyak SKU
- tidak tipis
- tidak saling tumpang tindih terlalu berat
- bisa dipromosikan sebagai landing page kategori

### 2.2 Category Bukan Filter

Category utama harus merepresentasikan kelompok tanaman yang stabil, bukan:

- kondisi penggunaan
- karakter visual sementara
- fungsi proyek yang bisa lintas banyak jenis tanaman

Karena itu, istilah seperti `Indoor`, `Outdoor`, `Berbunga`, `Pagar Hidup`, dan `Border` tidak boleh dijadikan category utama.

### 2.3 Minimum Disruption

Karena `/shop` sudah berjalan, maka:

- jangan membuat vocabulary baru di atas system yang sudah aktif tanpa kebutuhan nyata
- jangan memperkenalkan route baru hanya demi taxonomy
- jangan mengubah slug live yang sudah dipakai tanpa migration plan

Jika suatu category sudah terpasang dan terindeks, prioritaskan:

- ubah display label dulu
- pertahankan slug bila perubahan slug berisiko merusak kestabilan sistem atau SEO

### 2.4 Tag Tidak Diprioritaskan untuk V1

Untuk BMJ, layer `tag` tidak diprioritaskan pada fase ini.

Yang aktif di V1:

- `primary category`
- `attribute`
- `use case / filter`

Yang ditunda:

- `tag`

### 2.5 Payload Ecommerce Adalah Fondasi, Bukan Taxonomy Jadi

Payload Ecommerce plugin memberi fondasi berikut:

- `products`
- `variants`
- `carts`
- `orders`
- `transactions`
- `addresses`
- `payments`
- `currencies`
- collection overrides untuk menyesuaikan schema

Tetapi plugin tidak otomatis menyediakan:

- taxonomy BMJ
- category wording yang SEO-aware
- faceted filtering BMJ seperti `attribute` dan `use case`
- landing page kategori yang siap organic search
- shipping, taxes, atau subscription flow native

Artinya, taxonomy BMJ harus dibangun di atas fondasi plugin, bukan diasumsikan sudah tersedia dari template bawaan.

---

## 3. Struktur Klasifikasi Final

Struktur konseptual BMJ dibagi menjadi 3 layer dan ketiganya aktif pada implementasi V1:

1. `Primary Category`
2. `Attribute`
3. `Use Case / Filter`

### 3.1 Primary Category

Ini adalah kelompok utama yang membentuk arsitektur kategori shop.

### 3.2 Attribute

Ini adalah sifat atau karakter produk yang bisa menempel lintas category.

### 3.3 Use Case / Filter

Ini adalah konteks penggunaan produk, terutama untuk kebutuhan proyek.

---

## 4. Primary Category Final

Ini adalah category inti yang dikunci sebagai acuan BMJ.

| Priority | Display Label Final | Fungsi | Catatan |
|---|---|---|---|
| Core | `Tanaman Pelindung` | Menampung pohon pelindung/pohon lanskap untuk kebutuhan proyek | Dipilih karena lebih marketable daripada `Pohon` |
| Core | `Tanaman Palem` | Menampung semua keluarga palem | Berdiri sendiri, tidak dicampur ke `Tanaman Pelindung` |
| Core | `Tanaman Semak & Perdu` | Menampung kelompok semak/perdu proyek | Normalisasi dari istilah `Semak` agar lebih stabil |
| Core | `Tanaman Rambat` | Menampung tanaman merambat/menjalar | Salah satu category paling kuat secara growth form |
| Core | `Ground Cover / Tanaman Penutup Tanah` | Menampung tanaman penutup tanah | Harus dipertahankan karena kuat di supply proyek BMJ |

### 4.1 Definisi Category Inti

#### Tanaman Pelindung

Dipakai untuk:

- pule
- trembesi
- angsana
- ketapang kencana
- dan pohon non-palem lain yang relevan untuk fungsi pelindung, peneduh, boulevard, atau penghijauan kawasan

Tidak dipakai untuk:

- palem

#### Tanaman Palem

Dipakai untuk:

- semua kelompok palem yang secara pasar memang dipahami sebagai kategori tersendiri

Tidak dipakai untuk:

- pohon non-palem

#### Tanaman Semak & Perdu

Dipakai untuk:

- teh-tehan
- duranta
- bougenville
- lantana
- heliconia
- dan tanaman sejenis yang paling tepat dikelompokkan sebagai semak/perdu

#### Tanaman Rambat

Dipakai untuk:

- air mata pengantin
- thunbergia
- passiflora
- ipomea
- dan kelompok tanaman merambat/menjalar lain

#### Ground Cover / Tanaman Penutup Tanah

Dipakai untuk:

- wedelia
- arachis pintoi
- rumput jepang
- portulaca jika secara merchandising memang diposisikan sebagai penutup tanah
- dan kelompok tanaman penutup tanah lain

---

## 5. Attribute Final

Attribute dipakai untuk menyatakan sifat produk, bukan kategori utama.

| Attribute | Fungsi |
|---|---|
| `Berbunga` | Menandai tanaman yang nilai visual utamanya berasal dari bunga |
| `Indoor` | Menandai tanaman yang cocok untuk penggunaan dalam ruang |
| `Outdoor` | Menandai tanaman yang cocok untuk luar ruang |
| `Tahan Panas` | Menandai tanaman yang cocok untuk area terpapar panas |
| `Gantung` | Menandai tanaman yang cocok diposisikan menggantung |
| `Low Maintenance` | Menandai tanaman yang perawatannya relatif ringan |

### 5.1 Kenapa Ini Attribute, Bukan Category

Karena semua istilah ini bisa overlap ke banyak category.

Contoh:

- `Tanaman Rambat` + `Indoor`
- `Tanaman Semak & Perdu` + `Berbunga`
- `Tanaman Palem` + `Outdoor`

Kalau istilah-istilah ini dijadikan category utama, taxonomy akan cepat kacau.

---

## 6. Use Case / Filter Final

Use case dipakai untuk konteks penggunaan proyek, bukan untuk kategori utama.

| Use Case | Fungsi |
|---|---|
| `Pagar Hidup` | Untuk kebutuhan pagar hijau atau barrier visual |
| `Border` | Untuk pembatas tepi jalur, taman, atau area |
| `Median & Penghijauan` | Untuk median jalan, penghijauan kawasan, dan area infrastruktur |
| `Focal Point` | Untuk aksen/titik perhatian utama |

### 6.1 Kenapa Ini Bukan Category Utama

Karena satu produk bisa punya lebih dari satu use case.

Contoh:

- teh-tehan -> `Tanaman Semak & Perdu` + `Pagar Hidup` + `Border`
- wedelia -> `Ground Cover / Tanaman Penutup Tanah` + `Border` + `Median & Penghijauan`
- pule -> `Tanaman Pelindung` + `Focal Point`

---

## 7. Category Yang Ditunda

Category di bawah ini valid secara taxonomy, tetapi tidak dikunci sebagai core category BMJ saat ini.

| Candidate | Status | Alasan |
|---|---|---|
| `Tanaman Air` | Deferred | Valid, tetapi masuk hanya jika depth SKU cukup |
| `Bambu` | Deferred | Valid, tetapi belum dikunci sebagai category inti |
| `Rumput Hias` | Deferred | Bisa valid, tetapi rawan tipis jika SKU belum cukup |
| `Sukulen & Kaktus` | Phase 2 | Lebih cocok untuk ekspansi segmen hias |
| `Bonsai` | Phase 2 | Terlalu niche untuk core BMJ sekarang |
| `Tanaman Buah` | Deferred / Phase 2 | Valid, tapi bukan prioritas core V1 |

---

## 8. Category Yang Ditolak Sebagai Primary Category

| Candidate | Keputusan | Alasan |
|---|---|---|
| `Tanaman Bunga` | Reject | Lebih tepat jadi attribute `Berbunga` |
| `Tanaman Gantung` | Reject | Lebih tepat jadi attribute `Gantung` |
| `Indoor` | Reject | Bukan kelompok tanaman, tetapi kondisi penggunaan |
| `Outdoor` | Reject | Bukan kelompok tanaman, tetapi kondisi penggunaan |
| `Rambat Indoor` | Reject | Mencampur category dan attribute |
| `Semak Indoor` | Reject | Mencampur category dan attribute |

---

## 9. Wording & SEO Guidance

### 9.1 Prinsip Wording

Nama category harus:

- terdengar natural di Indonesia
- cukup deskriptif untuk user
- cukup kuat untuk keyword intent
- seragam nadanya

Karena itu, wording final dipilih seperti ini:

- `Tanaman Pelindung`
- `Tanaman Palem`
- `Tanaman Semak & Perdu`
- `Tanaman Rambat`
- `Ground Cover / Tanaman Penutup Tanah`

### 9.2 Kenapa Tidak Semua Nama Dibuat Sangat Teknis

Kita tidak memakai istilah yang terlalu kaku seperti:

- `Pohon Struktural`
- `Semak Proyek`
- `Growth Form Category`

karena tujuan category page bukan hanya rapi secara internal, tetapi juga:

- enak dibaca user
- masuk akal secara komersial
- tetap bisa dikembangkan nanti

### 9.3 Slug Guidance

Jika belum live, slug ideal bisa dibuat singkat dan stabil. Contoh:

- `tanaman-pelindung`
- `palem`
- `semak-perdu`
- `rambat`
- `ground-cover`

Tetapi jika slug lama sudah dipakai di sistem atau sudah punya jejak SEO, maka:

- pertahankan slug lama bila memungkinkan
- revisi label display dulu
- jangan ganti slug tanpa migration plan

### 9.4 SEO Reality Check

Taxonomy yang rapi belum otomatis menghasilkan category page yang kuat di organic search.

Supaya category benar-benar punya nilai SEO, biasanya dibutuhkan:

- URL atau state halaman yang stabil
- heading/H1 yang jelas
- intro copy kategori
- meta title dan meta description
- internal linking ke produk dan halaman terkait

Karena shop BMJ saat ini masih memakai kontrak filter sederhana di `/shop`, maka:

- taxonomy tetap dikunci dari sekarang
- tetapi kemampuan category menjadi organic landing page penuh masih tergantung pada implementasi frontend berikutnya
- halaman hasil filter `use case` tidak boleh diasumsikan langsung layak diindeks

---

## 10. Contoh Mapping Produk (Konseptual)

Contoh di bawah ini dipakai sebagai acuan mapping taxonomy BMJ, dan selaras dengan implementasi V1 yang sudah mengaktifkan `attributes` dan `useCases`.

| Produk | Primary Category | Attribute | Use Case |
|---|---|---|---|
| Pule | `Tanaman Pelindung` | `Outdoor` | `Focal Point` |
| Trembesi | `Tanaman Pelindung` | `Outdoor` | `Focal Point`, `Median & Penghijauan` |
| Palem Raja | `Tanaman Palem` | `Outdoor` | `Focal Point` |
| Teh-tehan | `Tanaman Semak & Perdu` | `Outdoor` | `Pagar Hidup`, `Border` |
| Bougenville | `Tanaman Semak & Perdu` | `Berbunga`, `Outdoor` | `Pagar Hidup`, `Focal Point` |
| Air Mata Pengantin | `Tanaman Rambat` | `Berbunga` | `Pagar Hidup`, `Border` |
| Wedelia | `Ground Cover / Tanaman Penutup Tanah` | `Outdoor`, `Low Maintenance` | `Border`, `Median & Penghijauan` |

---

## 10A. Sample Product V1 per Category

Untuk kebutuhan implementasi, demo data, dan validasi filtering di shop BMJ, sample product minimum per category inti dikunci seperti ini:

| Primary Category | Sample Product | Attribute | Use Case |
|---|---|---|---|
| `Tanaman Pelindung` | `Pule` | `Outdoor` | `Focal Point` |
| `Tanaman Palem` | `Palem Raja` | `Outdoor` | `Focal Point` |
| `Tanaman Semak & Perdu` | `Teh-Tehan` | `Outdoor`, `Low Maintenance` | `Pagar Hidup`, `Border` |
| `Tanaman Rambat` | `Air Mata Pengantin` | `Berbunga`, `Gantung` | `Pagar Hidup`, `Border` |
| `Ground Cover / Tanaman Penutup Tanah` | `Wedelia` | `Outdoor`, `Low Maintenance`, `Tahan Panas` | `Border`, `Median & Penghijauan` |

Catatan:

- sample product ini dipakai untuk menguji filter `category`, `attribute`, dan `usecase`
- sample product bukan SKU final produksi; ini baseline data untuk validasi taxonomy BMJ
- jika taxonomy berubah, sample product wajib ikut disesuaikan agar coverage filter tetap lengkap

---

## 11. Audit Ringkas Sistem Shop Saat Ini

Berdasarkan audit codebase `payloadbmj`, kondisi shop saat ini adalah:

### 11.1 Route Aktif

- `/shop` sudah aktif sebagai index shop
- `/products/[slug]` sudah aktif sebagai detail produk
- preview produk juga sudah mengikuti prefix `/products`

### 11.2 Filtering Yang Sudah Ada

Filtering yang benar-benar aktif saat ini baru:

- `q` untuk search
- `sort` untuk sorting
- `category` untuk filter kategori

Belum ada filtering aktif untuk:

- `use case`
- `attribute`
- kombinasi facet yang lebih kaya

### 11.3 Kontrak Category Saat Ini

Kontrak category yang benar-benar dipakai shop saat ini adalah query parameter:

- `/shop?category=<id>`

Bukan path category custom.

Ada komponen lama yang masih mengarah ke `/shop/[slug]`, tetapi itu tidak boleh dijadikan acuan implementasi sampai route-nya benar-benar dibangun dan diresmikan.

### 11.4 Schema Yang Sudah Ada

- collection `categories` sudah ada, tetapi masih minimal
- field produk `categories` sudah ada, tetapi masih `hasMany`
- cart/checkout masih murni inventory-based sesuai template ecommerce default
- price, stock, variant, dan checkout masih mengikuti asumsi Payload Ecommerce plugin

Implikasinya:

- taxonomy BMJ bisa dipasang di atas sistem ini
- tetapi `attribute` dan `use case` memang belum tersedia dan harus ditambahkan
- implementasi tidak boleh langsung menyentuh checkout flow jika tujuannya baru taxonomy/filtering

### 11.5 Apa Yang Sudah Disediakan Payload Ecommerce Secara Resmi

Berdasarkan dokumentasi resmi Payload Ecommerce:

- plugin menyediakan `products`, `variants`, `carts`, `orders`, `transactions`, `payments`, `addresses`, dan currency handling
- `products` dan `orders` memang dirancang untuk dioverride lewat collection override
- `products` juga mendukung custom validation sebelum transaksi dibentuk
- `carts` mendukung custom cart item matching dan collection override
- frontend provider mendukung query customization untuk fetch cart

Artinya:

- plugin memang extensible
- tetapi filtering katalog, taxonomy BMJ, dan landing strategy kategori tetap menjadi tanggung jawab implementasi project
- jadi kekurangan taxonomy BMJ saat ini bukan bug plugin, tetapi gap implementasi di project

### 11.6 Pemetaan Tanggung Jawab di `payloadbmj`

Supaya implementasi tidak salah arah, layer tanggung jawabnya harus dibaca seperti ini:

| Layer | Tanggung Jawab | Lokasi Project Saat Ini |
|---|---|---|
| Plugin config | Mengaktifkan ecommerce plugin, payment, orders override, products override | `src/plugins/index.ts` |
| Product schema | Menentukan field produk yang tersedia di Payload | `src/collections/Products/index.ts` |
| Category schema | Menentukan field category shop | `src/collections/Categories.ts` |
| Frontend ecommerce provider | Menyediakan `useCart`, `usePayments`, currency, cart fetch config | `src/providers/index.tsx` |
| Shop query logic | Menentukan filter apa yang benar-benar mempengaruhi listing | `src/app/(app)/shop/page.tsx` |
| Shop filter UI | Menentukan kontrol filter yang dilihat user | `src/components/layout/search/*` |
| Product detail / cart UX | Menentukan add-to-cart, stock, variant, checkout behavior | `src/components/product/*`, `src/components/Cart/*`, `src/components/checkout/*` |

Kesimpulan penting:

- penambahan `use case` bukan pekerjaan di payment adapter
- penambahan taxonomy BMJ bukan alasan mengganti plugin ecommerce
- modifikasi utamanya ada di schema collection dan query/filter storefront

---

## 12. Modifikasi Sistem Yang Dibutuhkan

Taxonomy final BMJ tidak akan sepenuhnya terwujud jika shop hanya dibiarkan seperti template sekarang.

Perubahan minimum yang memang dibutuhkan adalah:

### 12.1 Pertahankan Kontrak Route Yang Sudah Live

Tetap gunakan:

- `/shop`
- `/products/[slug]`

Jangan menambah route baru hanya demi taxonomy pada fase ini.

### 12.1a Kontrak Category Dikunci Mengikuti Default System

Untuk fase ini, kontrak category dikunci mengikuti sistem yang sudah berjalan:

- gunakan `categories` existing
- gunakan query `category=<id>`
- jangan mengganti filter category menjadi slug-based routing
- jangan membuat `/shop/[category-slug]` hanya demi taxonomy

### 12.2 Evolve Collection `categories`, Jangan Ganti Fondasi

Collection `categories` yang sudah ada tetap dipakai sebagai basis `primary category`.

Yang perlu ditambahkan secara bertahap:

- label display yang final
- slug yang stabil
- deskripsi singkat kategori
- field SEO kategori jika nanti category ingin dipromosikan sebagai landing page
- status aktif/nonaktif jika dibutuhkan

Catatan:

- ini dilakukan di schema collection existing
- bukan dengan membuat ulang seluruh arsitektur kategori dari nol

### 12.3 Pertahankan Field Produk Yang Sudah Ada, Tapi Kunci Aturannya

Field `products.categories` tidak perlu dibuang.

Namun untuk BMJ harus diberi aturan bisnis:

- setiap produk BMJ hanya boleh punya 1 primary category efektif
- walaupun field teknis saat ini masih `hasMany`, UI admin dan validasi harus diarahkan agar tidak dipakai longgar

### 12.4 Tambahkan Layer `Attribute` dan `Use Case`

Karena shop sekarang baru punya `category`, maka untuk mendukung taxonomy BMJ pada fase ini perlu ditambahkan dua layer baru:

- `attributes`
- `useCases`

Struktur yang direkomendasikan:

- `categories` tetap untuk `primary category`
- collection atau controlled vocabulary baru untuk `attributes`
- collection atau controlled vocabulary baru untuk `useCases`
- relationship baru pada `products` untuk keduanya

Ini perubahan yang wajar dan sejalan dengan arsitektur Payload, karena plugin memang didesain untuk dioverride dan diextend.

Catatan implementasi:

- layer ini idealnya ditambahkan sebagai data model baru, bukan "disulap" dari category lama
- controlled vocabulary lebih aman daripada free text
- `attributes` dan `useCases` aman ditambahkan tanpa menyentuh cart atau checkout
- implementasi frontend perlu menjaga agar semua query param filter saling dipertahankan

### 12.5 Jangan Ubah Checkout Untuk Pekerjaan Taxonomy

Cart, inventory, variant, pricing, dan checkout sekarang masih template-driven.

Selama fokusnya:

- category
- attribute
- use case
- filtering

maka checkout flow tidak perlu disentuh dulu.

### 12.6 Modifikasi Yang Memang Terjadi di Frontend Shop

Karena plugin tidak mengatur faceted catalog UI secara otomatis, maka perubahan untuk mendukung taxonomy BMJ secara praktis akan terjadi di:

- query listing shop
- sidebar/filter controls
- parsing query params
- optional category intro / category metadata rendering

Bukan di:

- Stripe adapter
- order confirmation flow
- cart payment intent flow

---

## 13. Kontrak Filtering V1 Yang Direkomendasikan

Agar sesuai dengan system yang sudah running, kontrak filtering V1 direkomendasikan seperti ini:

- `q` -> search keyword
- `sort` -> sorting
- `category` -> primary category
- `attribute` -> attribute aktif
- `usecase` -> use case aktif

Contoh:

- `/shop?q=palem`
- `/shop?category=<id>`
- `/shop?category=<id>&attribute=<id>`
- `/shop?category=<id>&usecase=<id>`
- `/shop?category=<id>&attribute=<id>&usecase=<id>&sort=title`

### 13.1 Prinsip V1

Untuk menjaga implementasi tetap stabil:

- `category` diperlakukan sebagai filter utama
- `attribute` dan `usecase` ditambahkan di atas kontrak query yang sudah ada
- V1 tidak perlu langsung mendukung kombinasi facet yang terlalu kompleks
- multi-select lintas banyak facet bisa menjadi fase berikutnya setelah perilaku query dan UX tervalidasi

### 13.1a Catatan Teknis Penting dari Audit Ulang

Shop saat ini belum sepenuhnya generik dalam menjaga query params aktif.

Contoh:

- search sudah mempertahankan query params lain
- toggle category juga mempertahankan query params lain
- tetapi kontrol sort saat ini masih membangun URL baru yang hanya menjaga `q`

Implikasinya:

- jika `attribute` dan `usecase` diaktifkan, builder URL untuk sort harus dirapikan
- prinsip yang harus diikuti adalah: setiap kontrol filter harus mempertahankan state filter lain, kecuali memang sengaja menghapusnya

### 13.1b Kenapa Model Ini Paling Selaras dengan Payload

Model ini selaras dengan arsitektur Payload karena:

- Payload query API memang kuat untuk filtering relationship dan field tambahan
- storefront query di project ini memang sudah dibangun di level page/query server-side
- plugin ecommerce tidak memaksa satu model category tertentu
- collection override memungkinkan schema produk berkembang tanpa membuang fondasi cart/order/payment

### 13.2 Prinsip SEO untuk Filtered Pages

Secara default:

- `primary category` adalah kandidat halaman yang paling layak dibangun sebagai target SEO
- `attribute` dan `usecase` penting untuk relevansi user intent dan merchandising hasil listing
- halaman hasil filter `usecase` sebaiknya tidak diasumsikan langsung indexable
- filtered result pages baru layak dipromosikan jika memang ada keyword evidence dan konten pendukung

### 13.3 Implikasi Implementasi SEO

Urutan SEO yang paling sehat adalah:

1. kunci taxonomy
2. pasang category filtering yang konsisten
3. tambahkan wording, intro, dan metadata kategori
4. baru evaluasi apakah category state tertentu layak dijadikan landing page organic

Jangan dibalik. Jika landing page dibangun sebelum taxonomy dan filtering stabil, hasilnya rawan tipis, overlap, dan sulit dipelihara.

---

## 14. Spesifikasi Implementasi Teknis V1

Bagian ini menerjemahkan taxonomy BMJ ke struktur teknis minimum yang paling selaras dengan project `payloadbmj`.

### 14.1 Collection Yang Dipakai

#### Tetap Dipakai

- `categories`
  Dipakai sebagai `primary category` produk.

#### Ditambahkan

- `productAttributes`
  Controlled vocabulary untuk attribute produk.
- `productUseCases`
  Controlled vocabulary untuk use case produk.

Catatan:

- nama collection dibuat eksplisit agar tidak bentrok secara semantik dengan kebutuhan lain di masa depan
- `categories` tidak diganti karena sudah dipakai oleh shop saat ini

### 14.2 Struktur Minimal Collection Baru

#### `productAttributes`

Field minimum:

- `title`
- `slug`

Opsional jika ingin sedikit lebih siap:

- `description`

#### `productUseCases`

Field minimum:

- `title`
- `slug`

Opsional jika ingin sedikit lebih siap:

- `description`

Prinsip:

- jangan overbuild
- untuk V1, controlled vocabulary kecil lebih baik daripada schema kaya tapi belum dipakai

### 14.3 Perubahan di Collection `products`

Produk tetap memakai field existing:

- `categories`

Tambahan baru:

- `attributes`
  - type: `relationship`
  - relationTo: `productAttributes`
  - hasMany: `true`
- `useCases`
  - type: `relationship`
  - relationTo: `productUseCases`
  - hasMany: `true`

Catatan penting:

- `categories` secara teknis masih boleh `hasMany`, tetapi untuk BMJ harus divalidasi agar hanya 1 primary category efektif yang dipakai
- `attributes` dan `useCases` boleh multi-value

### 14.4 Query Contract V1

Query params aktif yang disarankan:

- `q`
- `sort`
- `category`
- `attribute`
- `usecase`

Semua filter taxonomy mengikuti pola `id`, bukan `slug`.

Contoh:

- `/shop?category=<id>`
- `/shop?category=<id>&attribute=<id>`
- `/shop?category=<id>&usecase=<id>`
- `/shop?category=<id>&attribute=<id>&usecase=<id>&sort=title`

### 14.5 Query Listing `products`

Query `/shop` harus diperluas dari kondisi saat ini menjadi:

- filter `_status = published`
- optional search `q`
- optional `category`
- optional `attribute`
- optional `usecase`
- optional `sort`

Secara logika:

- `category` memfilter `products.categories`
- `attribute` memfilter `products.attributes`
- `usecase` memfilter `products.useCases`

Semua bersifat additive dalam blok `and`.

### 14.6 UI Filter Yang Perlu Ada

Sidebar filter V1:

- search
- categories
- attributes
- use cases
- sort

Prinsip UI:

- category toggle tetap mengikuti pola existing
- attribute toggle meniru pola category toggle
- use case toggle meniru pola category toggle
- sort tidak boleh me-reset filter taxonomy lain

### 14.7 Aturan Query Param Preservation

Setiap kontrol filter harus mempertahankan query param lain yang sedang aktif.

Contoh perilaku yang benar:

- saat user memilih `sort`, state `category`, `attribute`, dan `usecase` tetap hidup
- saat user memilih `attribute`, state `q`, `sort`, `category`, dan `usecase` tetap hidup
- saat user menyalakan atau mematikan `usecase`, state lain tidak hilang

Ini penting karena audit codebase menunjukkan kontrak filter saat ini belum sepenuhnya generik.

### 14.8 Urutan Implementasi Paling Aman

1. Tambah collection `productAttributes`
2. Tambah collection `productUseCases`
3. Tambah relationship `attributes` dan `useCases` ke `products`
4. Tambah validasi agar `products.categories` efektif hanya 1 primary category
5. Perluas query `/shop`
6. Tambah UI filter `attributes`
7. Tambah UI filter `useCases`
8. Rapikan builder URL sort agar tidak membuang filter lain

### 14.9 Yang Sengaja Tidak Dikerjakan di Fase Ini

- route category berbasis slug
- landing page category SEO penuh
- perubahan checkout flow
- MOQ / RFQ logic
- perubahan inventory strategy
- perubahan payment flow

Fase ini hanya menyiapkan taxonomy dan filtering yang rapi di atas shop system yang sudah ada.

---

## 15. Final Lock

### Primary Category Locked

- `Tanaman Pelindung`
- `Tanaman Palem`
- `Tanaman Semak & Perdu`
- `Tanaman Rambat`
- `Ground Cover / Tanaman Penutup Tanah`

### Use Case Locked

- `Pagar Hidup`
- `Border`
- `Median & Penghijauan`
- `Focal Point`

### Attribute Locked

- `Berbunga`
- `Indoor`
- `Outdoor`
- `Tahan Panas`
- `Gantung`
- `Low Maintenance`

### Deferred

- `Tanaman Air`
- `Bambu`
- `Rumput Hias`
- `Sukulen & Kaktus`
- `Bonsai`
- `Tanaman Buah`

---

*Dokumen ini menjadi acuan kategorisasi ecommerce BMJ sampai ada keputusan revisi baru yang disepakati secara eksplisit. Revisi berikutnya harus tetap menjaga dua hal sekaligus: disiplin taxonomy dan kestabilan shop system yang sudah berjalan.*
