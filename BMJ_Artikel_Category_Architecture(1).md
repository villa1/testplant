# Artikel Category Architecture
## PT Bumi Mekarsari Jaya — Website V1

**Status:** Planning Final  
**Berlaku untuk:** `/artikel` dan `/artikel/[slug]`  
**CMS:** Payload CMS 3.84.1 — Collection: `Posts` + `Categories`  
**Tanggal:** April 2025

---

## Daftar Isi

1. [Konteks & Filosofi](#1-konteks--filosofi)
2. [Dua Fungsi Halaman Artikel](#2-dua-fungsi-halaman-artikel)
3. [Search Cluster — Dasar Penentuan Category](#3-search-cluster--dasar-penentuan-category)
4. [Keputusan Arsitektur](#4-keputusan-arsitektur)
5. [Struktur 4 Category Final](#5-struktur-4-category-final)
6. [Mapping Cluster ke Category](#6-mapping-cluster-ke-category)
7. [Detail Per Category](#7-detail-per-category)
8. [Jadwal Produksi Konten](#8-jadwal-produksi-konten)
9. [Internal Linking Strategy](#9-internal-linking-strategy)
10. [Implementasi di Payload CMS](#10-implementasi-di-payload-cms)
11. [Checklist Dev](#11-checklist-dev)

---

## 1. Konteks & Filosofi

### Bisnis
PT Bumi Mekarsari Jaya adalah koordinator jaringan petani tanaman hias di kawasan Cipanas, Cianjur. Core bisnis: **penjualan tanaman proyek skala massal dan retail**. Bukan nursery tunggal — model kelompok tani dengan banyak lokasi kebun anggota.

### Segmen Target
| Segmen | Karakteristik |
|---|---|
| B2B | Kontraktor, developer, pengadaan pemerintah, konsultan landscape |
| Retail | Individu, pembelian satuan atau jumlah kecil |

### Prinsip Konten
- Konten artikel **bukan promosi produk** — tapi konten yang memberikan nilai nyata
- Setiap artikel harus diakhiri dengan **CTA konsultasi via WhatsApp**
- Jangan klaim angka stok spesifik di dalam artikel
- Tulis dari sudut pandang **kebutuhan buyer** — bukan sudut pandang petani

---

## 2. Dua Fungsi Halaman Artikel

```
FUNGSI 1 — AUTHORITY HUB
Membuktikan bahwa PT BMJ adalah entitas paling kompeten
di bidang tanaman proyek. Pengunjung yang datang ke hub
ini harus pulang dengan kesan:
"Bisnis ini tahu apa yang mereka bicarakan."

FUNGSI 2 — PENYARING ORGANIK
Menarik audiens yang tepat dari Google secara selektif.
Bukan mengejar traffic sebanyak mungkin — tapi traffic
yang paling mungkin berkonversi menjadi pembeli.

Google Search
     ↓
Artikel PT BMJ muncul di hasil pencarian
     ↓
Yang klik = audiens relevan
(kontraktor, pengadaan, konsultan landscape)
     ↓
Membaca → percaya → menghubungi WA
```

---

## 3. Search Cluster — Dasar Penentuan Category

Category ditentukan dari **search cluster** — kelompok keyword yang dicari audiens relevan di Google. Bukan dari asumsi editorial.

### Cluster yang Diidentifikasi

#### Cluster 1 — Jenis Tanaman
Orang mencari berdasarkan nama atau tipe tanaman yang dibutuhkan.

```
"tanaman rambat untuk proyek"
"jenis ground cover"
"pohon pelindung jalan"
"tanaman pagar hidup"
"tanaman hias outdoor"
"tanaman penghijauan kota"
```

| Field | Nilai |
|---|---|
| Audiens | Kontraktor, konsultan landscape, arsitek |
| Intent | Informational → Investigational |
| Volume Potensi | Tinggi |
| Kualitas Audiens | B2B + Retail |
| Jarak ke Konversi | Sedang |
| Target V1 | ✅ Ya |

---

#### Cluster 2 — Fungsi & Penggunaan
Orang mencari berdasarkan **untuk apa** tanaman dipakai, bukan nama tanamannya.

```
"tanaman untuk median jalan"
"tanaman untuk lereng jalan tol"
"tanaman untuk taman kota"
"tanaman untuk area parkir"
"tanaman untuk proyek perumahan"
"tanaman peneduh area publik"
```

| Field | Nilai |
|---|---|
| Audiens | Project manager, pengadaan, developer properti |
| Intent | Investigational — sudah tahu kebutuhan, cari solusinya |
| Volume Potensi | Tinggi |
| Kualitas Audiens | B2B Dominan |
| Jarak ke Konversi | Dekat |
| Target V1 | ✅ Ya — Prioritas |

---

#### Cluster 3 — Pengadaan & Pembelian
Orang mencari cara membeli atau proses pengadaan tanaman skala besar.

```
"cara pengadaan tanaman proyek"
"supplier tanaman hias Jawa Barat"
"beli tanaman massal"
"harga tanaman proyek per pohon"
"minimum order tanaman proyek"
"supplier tanaman Cipanas"
```

| Field | Nilai |
|---|---|
| Audiens | Buyer proyek, panitia pengadaan, kontraktor |
| Intent | Transactional / Commercial — paling tinggi konversinya |
| Volume Potensi | Medium |
| Kualitas Audiens | B2B Murni |
| Jarak ke Konversi | Sangat Dekat |
| Target V1 | ✅ Ya — Prioritas Utama |

---

#### Cluster 4 — Estimasi & Perencanaan
Orang mencari angka dan kalkulasi untuk perencanaan proyek.

```
"berapa kebutuhan tanaman untuk 1 km jalan"
"estimasi biaya penghijauan proyek"
"cara hitung kebutuhan tanaman ground cover"
"RAB tanaman proyek penghijauan"
"spesifikasi tanaman untuk dokumen tender"
```

| Field | Nilai |
|---|---|
| Audiens | Quantity surveyor, konsultan, panitia tender |
| Intent | Investigational Tinggi — sedang susun RAB atau dokumen proyek |
| Volume Potensi | Rendah–Medium |
| Kualitas Audiens | B2B Niche |
| Jarak ke Konversi | Dekat |
| Target V1 | ✅ Ya |

---

#### Cluster 5 — Lokasi & Supplier
Orang mencari **dari mana membeli** — location-based searches.

```
"supplier tanaman Cipanas"
"nursery tanaman proyek Cianjur"
"jual tanaman hias Jawa Barat"
"petani tanaman hias Cipanas"
"pusat tanaman hias Cipanas"
```

| Field | Nilai |
|---|---|
| Audiens | Semua segmen dengan lokasi intent |
| Intent | Navigational / Transactional — siap beli |
| Volume Potensi | Medium |
| Kualitas Audiens | Semua Segmen |
| Jarak ke Konversi | Paling Dekat |
| Target V1 | ✅ Ya — Keyword Paling Berharga untuk PT BMJ |

---

#### Cluster 6 — Regulasi & Tender
Orang mencari ketentuan formal pengadaan tanaman untuk proyek pemerintah.

```
"spesifikasi teknis tanaman penghijauan jalan"
"standar tanaman untuk proyek pemerintah"
"persyaratan tanaman dalam dokumen AMDAL"
"tanaman sesuai Permen PUPR penghijauan"
```

| Field | Nilai |
|---|---|
| Audiens | Panitia pengadaan pemerintah, konsultan AMDAL |
| Intent | Investigational — sedang menyusun dokumen resmi |
| Volume Potensi | Rendah |
| Kualitas Audiens | Pemerintah |
| Jarak ke Konversi | Sedang |
| Target V1 | ⚠️ Category dibuat V1 — konten diproduksi Fase 2 |

---

#### Cluster 7 — Inspirasi Visual
Orang mencari ide atau referensi visual desain taman atau penghijauan.

```
"inspirasi taman kota dengan tanaman lokal"
"contoh desain median jalan dengan tanaman"
"referensi penghijauan proyek perumahan"
"taman hijau proyek pemerintah"
```

| Field | Nilai |
|---|---|
| Audiens | Arsitek landscape, desainer taman, developer properti |
| Intent | Informational |
| Volume Potensi | Medium |
| Kualitas Audiens | Arsitek, Developer |
| Jarak ke Konversi | Jauh |
| Target V1 | ❌ Fase 2 |

---

#### Cluster 8 — Perawatan & Karakteristik
Orang mencari sifat dan perawatan tanaman tertentu.

```
"cara merawat tanaman rambat"
"tanaman yang tidak perlu banyak air"
"tanaman tahan panas untuk outdoor"
"karakteristik pohon Pule"
```

| Field | Nilai |
|---|---|
| Audiens | Retail — individu, bukan B2B |
| Intent | Informational |
| Volume Potensi | Tinggi |
| Kualitas Audiens | Retail Dominan |
| Jarak ke Konversi | Sangat Jauh |
| Target V1 | ❌ Fase 2 — jika segmen retail dikembangkan |

---

### Ringkasan Evaluasi Cluster

| Cluster | Volume | Kualitas Audiens | Jarak Konversi | Status |
|---|---|---|---|---|
| 1 — Jenis Tanaman | Tinggi | B2B + Retail | Sedang | ✅ V1 |
| 2 — Fungsi & Penggunaan | Tinggi | B2B Dominan | Dekat | ✅ V1 Prioritas |
| 3 — Pengadaan & Pembelian | Medium | B2B Murni | Sangat Dekat | ✅ V1 Prioritas |
| 4 — Estimasi & Perencanaan | Rendah–Medium | B2B Niche | Dekat | ✅ V1 |
| 5 — Lokasi & Supplier | Medium | Semua | Paling Dekat | ✅ V1 |
| 6 — Regulasi & Tender | Rendah | Pemerintah | Sedang | ⚠️ Category V1, Konten Fase 2 |
| 7 — Inspirasi Visual | Medium | Arsitek, Developer | Jauh | ❌ Fase 2 |
| 8 — Perawatan | Tinggi | Retail Dominan | Sangat Jauh | ❌ Fase 2 |

---

## 4. Keputusan Arsitektur

### Tags Tidak Dipakai di V1

Tags dinonaktifkan untuk V1. Category menjadi **satu-satunya mekanisme navigasi dan pengelompokan** di halaman artikel.

**Implikasi:**
- Category harus lebih granular dari rancangan awal (3 → 4 category)
- Setiap cluster yang relevan harus menemukan rumahnya di salah satu category
- Tidak ada mekanisme cross-filter antar topik di V1

Tags bisa diaktifkan di Fase 2 setelah jumlah artikel cukup untuk membuat filter bermakna.

---

### Mengapa 4 Category, Bukan 3 atau 6

**Bukan 3 category:** Dengan 3 category dan tanpa tags, Cluster 6 (Regulasi) tidak punya rumah yang tepat. Menggabungkannya ke Panduan akan menyembunyikan konten dari audiens spesifik pemerintah yang mencarinya.

**Bukan 6 category:** Terlalu banyak category dengan jumlah artikel awal yang sedikit akan menghasilkan hub yang tipis — thin pages yang merusak authority di mata Google.

**4 category adalah titik keseimbangan** antara granularitas yang cukup dan kepadatan konten yang sehat per hub.

---

### Prinsip Hub Page

Setiap category page (`/artikel/[category-slug]`) berfungsi sebagai **hub page** — bukan sekadar filter. Google memperlakukan hub page sebagai topical authority node.

```
Aturan kesehatan hub:
- Launch    : 1–2 artikel per hub → fondasi terbentuk
- 3 bulan   : 3–4 artikel per hub → Google mulai mengenali
- 6 bulan   : 6–7 artikel per hub → hub mulai ranking
- 12 bulan  : 10+ artikel per hub → pertimbangkan split category
```

---

## 5. Struktur 4 Category Final

```
/artikel
├── /artikel/edukasi       → Cluster 1 + 2 (V1) · Cluster 8 (Fase 2)
├── /artikel/panduan       → Cluster 3 + 4 (V1) · Cluster 6 dialihkan ke Regulasi
├── /artikel/regulasi      → Cluster 6 (Category V1, konten Fase 2)
└── /artikel/wawasan       → Cluster 5 (V1) · Cluster 7 (Fase 2)
```

| Category | Pertanyaan Dijawab | Audiens Utama | Cluster | Status |
|---|---|---|---|---|
| **Edukasi** | Apa itu dan untuk apa? | Kontraktor, arsitek, konsultan | 1, 2, 8 | V1 |
| **Panduan** | Bagaimana cara melakukannya? | Buyer dalam proses pengadaan | 3, 4 | V1 |
| **Regulasi** | Apa standar formalnya? | Panitia tender, konsultan AMDAL | 6 | V1 — konten Fase 2 |
| **Wawasan** | Kenapa dan ada apa? | Decision maker, project manager | 5, 7 | V1 |

---

## 6. Mapping Cluster ke Category

```
EDUKASI
├── Cluster 1 — Jenis Tanaman              ← V1
├── Cluster 2 — Fungsi & Penggunaan        ← V1
└── Cluster 8 — Perawatan & Karakteristik  ← Fase 2

PANDUAN
├── Cluster 3 — Pengadaan & Pembelian      ← V1
└── Cluster 4 — Estimasi & Perencanaan     ← V1

REGULASI
└── Cluster 6 — Regulasi & Tender          ← Category V1 / Konten Fase 2

WAWASAN
├── Cluster 5 — Lokasi & Supplier          ← V1
└── Cluster 7 — Inspirasi Visual           ← Fase 2
```

---

## 7. Detail Per Category

---

### 7.1 EDUKASI

**Slug:** `edukasi`  
**Deskripsi category:** Pengetahuan dasar tentang jenis dan fungsi tanaman proyek  
**Pertanyaan dijawab:** *"Apa itu dan untuk apa?"*  
**Audiens:** Kontraktor, arsitek landscape, konsultan, semua segmen yang ingin memahami tanaman proyek  
**Intent dominan:** Informational → Investigational  

#### Artikel Kandidat — Cluster 1 (Jenis Tanaman)

| Judul Kandidat | Cluster | Target Keyword | Status |
|---|---|---|---|
| Mengenal Jenis Tanaman Rambat untuk Proyek Infrastruktur | 1 | tanaman rambat proyek infrastruktur | ✅ V1 — Artikel 2 |
| Apa Itu Ground Cover dan Fungsinya di Proyek Penghijauan | 1 | ground cover penghijauan | ✅ V1 |
| Mengenal Pohon Pelindung yang Umum Dipakai di Jalan Nasional | 1 | pohon pelindung jalan nasional | ✅ V1 |
| Jenis Tanaman Pagar Hidup untuk Area Proyek | 1 | tanaman pagar hidup proyek | Post-launch |
| Tanaman Hias Outdoor yang Cocok untuk Proyek Skala Besar | 1 | tanaman hias outdoor proyek | Post-launch |

#### Artikel Kandidat — Cluster 2 (Fungsi & Penggunaan)

| Judul Kandidat | Cluster | Target Keyword | Status |
|---|---|---|---|
| Tanaman yang Cocok untuk Median Jalan Tol | 2 | tanaman median jalan tol | ✅ V1 |
| Pilihan Tanaman Penghijauan untuk Proyek Perumahan | 2 | tanaman penghijauan proyek perumahan | ✅ V1 |
| Tanaman Peneduh untuk Area Publik dan Taman Kota | 2 | tanaman peneduh area publik | Post-launch |
| Tanaman untuk Lereng Jalan Tol — Fungsi dan Jenisnya | 2 | tanaman lereng jalan tol | Post-launch |
| Pilihan Tanaman untuk Area Parkir Proyek Komersial | 2 | tanaman area parkir | Post-launch |

#### Artikel Kandidat — Cluster 8 (Fase 2)

| Judul Kandidat | Cluster | Target Keyword | Status |
|---|---|---|---|
| Cara Merawat Tanaman Rambat agar Tumbuh Optimal | 8 | cara merawat tanaman rambat | Fase 2 |
| Tanaman Tahan Panas untuk Area Outdoor Proyek | 8 | tanaman tahan panas outdoor | Fase 2 |
| Karakteristik Pohon Pule dan Kegunaannya di Proyek | 8 | karakteristik pohon pule | Fase 2 |

---

### 7.2 PANDUAN

**Slug:** `panduan`  
**Deskripsi category:** Langkah dan cara kerja pengadaan tanaman proyek  
**Pertanyaan dijawab:** *"Bagaimana cara melakukannya?"*  
**Audiens:** Buyer yang sedang dalam proses pengadaan — kontraktor, panitia pengadaan, project manager  
**Intent dominan:** Investigational → Transactional — paling dekat ke konversi  

#### Artikel Kandidat — Cluster 3 (Pengadaan & Pembelian)

| Judul Kandidat | Cluster | Target Keyword | Status |
|---|---|---|---|
| Yang Perlu Disiapkan Sebelum Konsultasi ke Supplier Tanaman Proyek | 3 | konsultasi supplier tanaman proyek | ✅ V1 — Artikel 1 |
| Cara Membeli Tanaman Proyek Skala Besar — Dari Konsultasi ke Transaksi | 3 | beli tanaman proyek massal | ✅ V1 |
| Perbedaan Beli Tanaman Retail vs Massal untuk Proyek | 3 | tanaman retail vs massal proyek | Post-launch |
| Cara Memilih Supplier Tanaman Proyek yang Tepat | 3 | supplier tanaman proyek terpercaya | Post-launch |
| Apa Itu Minimum Order Tanaman Proyek dan Cara Kerjanya | 3 | minimum order tanaman proyek | Post-launch |

#### Artikel Kandidat — Cluster 4 (Estimasi & Perencanaan)

| Judul Kandidat | Cluster | Target Keyword | Status |
|---|---|---|---|
| Cara Menghitung Kebutuhan Tanaman untuk Proyek Penghijauan | 4 | hitung kebutuhan tanaman penghijauan | ✅ V1 — Artikel 3 |
| Cara Menghitung Kebutuhan Ground Cover per Meter Persegi | 4 | hitung kebutuhan ground cover | Post-launch |
| Apa Saja yang Masuk dalam RAB Tanaman Proyek | 4 | RAB tanaman proyek | Post-launch |
| Estimasi Biaya Penghijauan untuk Proyek Skala Menengah | 4 | estimasi biaya penghijauan proyek | Post-launch |

---

### 7.3 REGULASI

**Slug:** `regulasi`  
**Deskripsi category:** Standar dan ketentuan formal pengadaan tanaman untuk proyek pemerintah  
**Pertanyaan dijawab:** *"Apa standar formalnya?"*  
**Audiens:** Panitia pengadaan pemerintah, konsultan AMDAL, quantity surveyor  
**Intent dominan:** Investigational — sedang menyusun dokumen resmi  

> **Catatan Implementasi Dev:**  
> Category ini dibuat dan dikonfigurasi di Payload sejak V1.  
> Konten artikel untuk category ini diproduksi di **Fase 2**.  
> Category page `/artikel/regulasi` akan tampil di navigasi tetapi belum ada artikel saat launch.  
> Pertimbangkan menambahkan placeholder copy di category page: *"Konten sedang disiapkan."*

#### Artikel Kandidat — Cluster 6 (Fase 2)

| Judul Kandidat | Cluster | Target Keyword | Status |
|---|---|---|---|
| Spesifikasi Teknis Tanaman Penghijauan Jalan Sesuai Standar PUPR | 6 | spesifikasi tanaman penghijauan jalan | Fase 2 |
| Persyaratan Tanaman dalam Dokumen AMDAL Proyek Infrastruktur | 6 | tanaman dokumen AMDAL | Fase 2 |
| Panduan Pengadaan Tanaman untuk Proyek Pemerintah Sesuai Regulasi | 6 | pengadaan tanaman proyek pemerintah | Fase 2 |
| Standar Tanaman untuk Tender Proyek Penghijauan Pemerintah | 6 | standar tanaman tender pemerintah | Fase 2 |

> **Catatan Konten:**  
> Konten regulasi membutuhkan riset mendalam soal Permen PUPR, standar AMDAL, dan spesifikasi teknis tender pemerintah. Konten yang tidak akurat di cluster ini merusak credibility PT BMJ di mata audiens pemerintah. Jangan dipaksakan sebelum riset selesai.

---

### 7.4 WAWASAN

**Slug:** `wawasan`  
**Deskripsi category:** Perspektif industri dan keunikan kawasan Cipanas sebagai sentra tanaman proyek  
**Pertanyaan dijawab:** *"Kenapa dan ada apa?"*  
**Audiens:** Decision maker, project manager, arsitek landscape  
**Intent dominan:** Informational — bukan beli sekarang, tapi membangun relasi dan kepercayaan  

> **Catatan Strategis:**  
> Category ini adalah yang paling membedakan PT BMJ dari kompetitor.  
> Konten Cluster 5 (Lokasi & Supplier) hanya bisa ditulis secara otentik oleh PT BMJ —  
> karena menyangkut kawasan Cipanas dan model kelompok tani yang unik untuk PT BMJ.  
> Ini bukan konten yang bisa ditiru kompetitor dari luar kawasan.

#### Artikel Kandidat — Cluster 5 (Lokasi & Supplier)

| Judul Kandidat | Cluster | Target Keyword | Status |
|---|---|---|---|
| Mengapa Cipanas Menjadi Sentra Tanaman Proyek di Jawa Barat | 5 | sentra tanaman proyek Cipanas Jawa Barat | ✅ V1 — Artikel 4 |
| Keunggulan Tanaman dari Dataran Tinggi Cipanas untuk Proyek Penghijauan | 5 | tanaman Cipanas proyek penghijauan | ✅ V1 |
| Model Kelompok Tani sebagai Solusi Supply Tanaman Proyek Skala Besar | 5 | kelompok tani supplier tanaman proyek | Post-launch |
| Tantangan Supply Tanaman Massal dan Bagaimana Jaringan Petani Mengatasinya | 5 | supply tanaman massal proyek | Post-launch |
| Mengenal Kawasan Pertanian Tanaman Hias Cipanas, Cianjur | 5 | pertanian tanaman hias Cipanas Cianjur | Post-launch |

#### Artikel Kandidat — Cluster 7 (Fase 2)

| Judul Kandidat | Cluster | Target Keyword | Status |
|---|---|---|---|
| Inspirasi Penghijauan Median Jalan dengan Tanaman Lokal | 7 | desain median jalan tanaman lokal | Fase 2 |
| Contoh Referensi Taman Kota Menggunakan Tanaman Hias Cipanas | 7 | referensi taman kota tanaman lokal | Fase 2 |
| Tren Penggunaan Tanaman Lokal dalam Proyek Penghijauan Pemerintah | 7 | tren tanaman lokal proyek pemerintah | Fase 2 |

---

## 8. Jadwal Produksi Konten

### Launch V1 — Minimum 4 Artikel

Urutan produksi dipilih berdasarkan proximity ke konversi dan coverage semua 4 category:

```
Artikel 1 — PANDUAN
Judul  : Yang Perlu Disiapkan Sebelum Konsultasi ke Supplier Tanaman Proyek
Cluster: 3 — Pengadaan & Pembelian
Alasan : Paling dekat ke konversi. Langsung relevan ke alur kerja PT BMJ.
         Menurunkan barrier sebelum pengunjung menghubungi WA.

Artikel 2 — EDUKASI
Judul  : Mengenal Jenis Tanaman Rambat untuk Proyek Infrastruktur
Cluster: 1 — Jenis Tanaman
Alasan : Traffic luas. Keyword kuat. Audiens B2B yang tepat.

Artikel 3 — PANDUAN
Judul  : Cara Menghitung Kebutuhan Tanaman untuk Proyek Penghijauan
Cluster: 4 — Estimasi & Perencanaan
Alasan : High intent. Yang mencari ini sedang aktif menyusun RAB proyek.

Artikel 4 — WAWASAN
Judul  : Mengapa Cipanas Menjadi Sentra Tanaman Proyek di Jawa Barat
Cluster: 5 — Lokasi & Supplier
Alasan : Authority + local SEO. Konten yang hanya bisa ditulis oleh PT BMJ.
```

---

### Post-Launch V1 — Artikel 5–12

| Urutan | Category | Cluster | Prioritas |
|---|---|---|---|
| Artikel 5 | Edukasi | 2 — Fungsi & Penggunaan | Tinggi |
| Artikel 6 | Edukasi | 2 — Fungsi & Penggunaan | Tinggi |
| Artikel 7 | Panduan | 3 — Pengadaan & Pembelian | Tinggi |
| Artikel 8 | Wawasan | 5 — Lokasi & Supplier | Medium |
| Artikel 9 | Edukasi | 1 — Jenis Tanaman | Medium |
| Artikel 10 | Panduan | 4 — Estimasi & Perencanaan | Medium |
| Artikel 11 | Wawasan | 5 — Lokasi & Supplier | Medium |
| Artikel 12 | Regulasi | 6 — Regulasi & Tender | Rendah — riset dulu |

---

### Fase 2 — Ekspansi

| Category | Cluster | Catatan |
|---|---|---|
| Panduan | 6 — Regulasi & Tender | Pindah dari Regulasi jika konten terlalu teknis |
| Wawasan | 7 — Inspirasi Visual | Butuh aset visual yang kuat |
| Edukasi | 8 — Perawatan | Aktifkan jika segmen retail dikembangkan |

---

## 9. Internal Linking Strategy

Setiap artikel harus memiliki internal link yang mengalirkan pembaca ke halaman konversi:

```
Artikel Edukasi (jenis / fungsi tanaman)
          ↓  link ke
Artikel Panduan (cara beli / cara hitung)
          ↓  link ke
Halaman /layanan (proses pemesanan)
          ↓  link ke
Halaman /kontak (CTA akhir — WhatsApp)
```

### Aturan Internal Linking per Artikel

| Tipe Link | Target | Wajib / Opsional |
|---|---|---|
| Link ke artikel relevan lain | Artikel dalam category yang sama atau berbeda | Wajib — min. 2 per artikel |
| Link ke `/layanan` | Halaman layanan & cara pemesanan | Wajib — 1 per artikel |
| Link ke `/kontak` | Halaman kontak | Wajib — di CTA akhir artikel |
| Link ke `/tentang` | Halaman tentang kami | Opsional — jika artikel menyebut identitas PT BMJ |

### CTA Standar di Akhir Setiap Artikel

```
Butuh tanaman untuk proyek Anda?
Konsultasikan kebutuhan Anda langsung dengan tim PT Bumi Mekarsari Jaya.
[Hubungi via WhatsApp →]
```

---

## 10. Implementasi di Payload CMS

### Collections yang Terlibat

| Collection | Fungsi |
|---|---|
| `Posts` | Konten artikel — sudah tersedia di template bawaan Payload |
| `Categories` | Data category — sudah tersedia di template bawaan Payload |
| `Media` | Thumbnail dan gambar artikel |

---

### Data Category yang Perlu Dibuat di Payload

Buat 4 category berikut di Payload Admin → Categories:

| Nama | Slug | Deskripsi | Status Konten |
|---|---|---|---|
| Edukasi | `edukasi` | Pengetahuan dasar tentang jenis dan fungsi tanaman proyek | Aktif — produksi V1 |
| Panduan | `panduan` | Langkah dan cara kerja pengadaan tanaman proyek | Aktif — produksi V1 |
| Regulasi | `regulasi` | Standar dan ketentuan formal pengadaan tanaman pemerintah | Aktif — konten Fase 2 |
| Wawasan | `wawasan` | Perspektif industri dan keunikan kawasan Cipanas | Aktif — produksi V1 |

---

### Struktur Route

| Route | Halaman | Keterangan |
|---|---|---|
| `/artikel` | Index semua artikel | Tampilkan semua artikel, diurutkan terbaru |
| `/artikel/[slug]` | Detail artikel | Halaman konten artikel individual |

> **Catatan Dev:**  
> Template bawaan Payload menggunakan `/posts` dan `/posts/[slug]`.  
> Tentukan apakah route akan diganti menjadi `/artikel` atau tetap `/posts`.  
> Jika diganti, konfigurasi di `next.config.js` dan pastikan Payload `slug` di collection Posts disesuaikan.  
> Redirects dari `/posts` ke `/artikel` perlu dikonfigurasi jika sebelumnya sudah ada konten.

---

### Field Minimal di Collection Posts (untuk kebutuhan artikel)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `title` | Text | ✅ | Judul artikel |
| `slug` | Text | ✅ | Auto-generate dari title |
| `category` | Relationship → Categories | ✅ | Satu category per artikel |
| `content` | RichText | ✅ | Isi artikel |
| `excerpt` | Textarea | ✅ | Ringkasan untuk index page dan SEO |
| `thumbnail` | Upload → Media | ✅ | Gambar utama artikel |
| `publishedAt` | Date | ✅ | Tanggal publish |
| `status` | Select (draft/published) | ✅ | Status publish |
| `meta` | Group (SEO plugin) | ✅ | Title, description, OG image via plugin SEO |
| `author` | Text atau Relationship → Users | Opsional | Bisa "Tim PT Bumi Mekarsari Jaya" |

---

### Konfigurasi Category Page

Category Regulasi tidak memiliki artikel saat launch. Pertimbangkan salah satu dari dua pendekatan:

**Opsi A — Tampilkan dengan empty state:**
```
/artikel/regulasi menampilkan:
"Konten untuk kategori ini sedang disiapkan.
 Kunjungi kembali dalam waktu dekat."
```

**Opsi B — Sembunyikan dari navigasi sampai ada konten:**
```
Category Regulasi dibuat di Payload tetapi tidak ditampilkan
di filter/navigasi halaman /artikel sampai artikel pertamanya publish.
```

> Rekomendasi: **Opsi B** — lebih bersih secara UX dan tidak menampilkan halaman kosong ke pengunjung.

---

## 11. Checklist Dev

### Sebelum Development Dimulai

- [ ] Konfirmasi route: `/artikel` atau tetap `/posts`
- [ ] Konfirmasi apakah category page (`/artikel/[category-slug]`) perlu diimplementasi di V1
- [ ] Konfirmasi pendekatan category Regulasi: Opsi A atau Opsi B

### Saat Setup Payload CMS

- [ ] Buat 4 category di Payload Admin: Edukasi, Panduan, Regulasi, Wawasan
- [ ] Pastikan field `category` di collection Posts adalah relationship ke Categories
- [ ] Aktifkan SEO plugin untuk collection Posts
- [ ] Konfigurasi field `meta` (title, description, OG image) per artikel

### Sebelum Launch

- [ ] Minimum 4 artikel sudah dipublish sesuai urutan produksi
- [ ] Setiap artikel sudah memiliki category yang benar
- [ ] Setiap artikel sudah memiliki thumbnail, excerpt, dan meta SEO
- [ ] Internal link ke `/layanan` dan `/kontak` sudah ada di setiap artikel
- [ ] CTA WhatsApp sudah ada di akhir setiap artikel
- [ ] Category Regulasi disembunyikan dari navigasi (jika pilih Opsi B)
- [ ] Route `/artikel` berfungsi dan menampilkan daftar artikel
- [ ] Route `/artikel/[slug]` berfungsi dan menampilkan konten artikel

---

*Dokumen ini adalah bagian dari BMJ Website V1 Blueprint.*  
*Update dokumen ini setiap kali ada keputusan baru yang disepakati.*  
*Versi: 1.0 — April 2025*
