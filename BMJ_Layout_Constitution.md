# BMJ Layout Constitution

Date: 2026-05-05  
Project: `payloadbmj`  
Scope: **Phase 0 only** from `Layout_Build_Order_Master_Guide.md`

## Scope Boundary

Dokumen ini hanya membekukan keputusan desain tingkat atas yang diwajibkan oleh Phase 0:

1. layout model
2. page families
3. container rules
4. breakpoint interpretation
5. spacing economics
6. typography system
7. surface/panel visual language
8. color system

Dokumen ini **tidak** membahas:

- implementasi runtime CSS
- `PageFrame` refactor
- `SectionShell` refactor
- hero implementation
- transition/divider/adjacency implementation
- block-by-block cleanup

Itu semua berada di phase berikutnya dan tidak boleh dikerjakan sebelum keputusan di dokumen ini dibekukan.

---

## 1. Layout Model

### 1.1 Canonical layout model

BMJ memakai:

**full-width sections, contained inner content**

Artinya:

- background section boleh melebar penuh dari edge ke edge viewport
- konten utama di dalam section mengikuti container width yang sama
- section tidak boleh mendefinisikan max-width sendiri-sendiri di level outer shell

### 1.2 Why this is final

Keputusan ini sesuai dengan:

- arsitektur `SectionShell` yang sudah ada
- kebutuhan homepage BMJ yang memakai decorative/background sections
- pola WordPress reference yang dibaca sebagai shell penuh dengan konten yang tetap contained

### 1.3 What this forbids

Setelah keputusan ini dibekukan:

- block tidak boleh mengubah halaman menjadi contained penuh dari edge luar
- block tidak boleh membuat layout model baru seperti “narrow full page” di level section root
- route tidak boleh menambal canvas behavior sendiri jika itu seharusnya milik page family

---

## 2. Page Families

### 2.1 Final page families for BMJ

BMJ membekukan 5 page family:

1. `homepage`
2. `marketing`
3. `editorial`
4. `commerce`
5. `utility`

### 2.2 Meaning of each family

`homepage`

- opener utama brand BMJ
- paling ekspresif
- boleh memakai hero opener penuh
- decorative tolerance paling tinggi
- tidak boleh diwariskan mentah dari `marketing`

`marketing`

- page marketing umum selain homepage
- ritme lebih tenang daripada homepage
- masih boleh memakai shell visual, tetapi bukan family paling ekspresif

`editorial`

- fokus readability
- density lebih rapat
- decorative behavior minimum

`commerce`

- fokus browse, list, decision support
- container discipline tinggi
- decorative behavior rendah

`utility`

- login, account, checkout, support-like flows
- paling minimal
- ritme dan hierarchy harus paling fungsional

### 2.3 Constitutional rule

`homepage` **dipisahkan** dari `marketing`.

Ini final sebagai keputusan desain.  
Jika homepage tetap dipaksa hidup di family `marketing`, maka route layer akan terus tergoda menambal perilakunya sendiri.

---

## 3. Breakpoint Interpretation

### 3.1 Canonical breakpoints

BMJ memakai breakpoint yang sudah hidup di repo:

- `sm = 40rem`
- `md = 48rem`
- `lg = 64rem`
- `xl = 80rem`
- `2xl = 86rem`

### 3.2 Human interpretation

Untuk layout law, breakpoint dibaca sebagai:

`mobile`

- `< 48rem`

`tablet`

- `>= 48rem` dan `< 64rem`

`desktop`

- `>= 64rem`

### 3.3 Law per breakpoint

`mobile`

- rhythm paling ketat
- decorative behavior paling ditahan
- section gap harus hemat
- typography harus paling disiplin

`tablet`

- rhythm mulai longgar, tapi belum boleh airy
- panel spacing boleh naik satu tingkat dari mobile
- decorative surfaces boleh hidup lebih banyak dari mobile, tapi tetap terkendali

`desktop`

- ekspresi visual paling besar
- chapter break paling terasa
- decorative tolerance paling tinggi
- tetap tidak boleh boros empty space

### 3.4 Constitutional rule

Desktop, tablet, dan mobile **bukan sekadar scale-down**.

Setiap phase implementasi berikutnya harus memperlakukan ketiganya sebagai mode komposisi yang berbeda.

---

## 4. Container Rules

### 4.1 Canonical container model

BMJ memakai satu outer container canonical untuk inner content.

### 4.2 Container width decision

Global outer content ceiling BMJ:

- **max content shell = `86rem`**

Ini mengikuti ceiling container yang sudah hidup di repo saat ini pada `2xl`.

### 4.3 Horizontal padding decision

Global container side padding:

- mobile: `1rem`
- tablet and above: `2rem`

### 4.4 Inner measure rule

Walaupun outer shell container = `86rem`, tidak semua teks boleh memakai lebar penuh.

BMJ membekukan aturan measure:

- intro/body measure utama: sekitar `60–65ch`
- panel prose measure: sekitar `55–65ch`
- hero copy measure: sekitar `45–55ch`

### 4.5 Constitutional rule

- container outer hanya satu
- measure content boleh berbeda per konteks, tapi tidak boleh membuat outer container baru
- block tidak boleh menetapkan max-width outer sendiri jika keputusan itu sebenarnya milik container law

---

## 5. Spacing Economics

### 5.1 Spacing philosophy

BMJ memakai:

**compact-balanced default**

Bukan:

- airy by default
- luxury whitespace
- aggressively compressed UI

Artinya:

- ruang besar adalah pengecualian
- ruang default harus terasa rapi, natural, modern
- empty space harus melayani hierarchy, bukan menguasai halaman

### 5.2 Vertical rhythm ownership principle

Untuk BMJ, vertical rhythm utama hanya boleh dibayar oleh:

1. page law
2. section law
3. surface internal law

Bukan oleh patch lokal yang bertumpuk.

### 5.3 Frozen spacing tiers

#### Page-level rhythm targets

`homepage`

- top opening default: `0` jika hero opener memimpin halaman
- bottom closure: `6rem`

`marketing`

- top opening: `3rem`
- bottom closure: `5rem`

`editorial`

- top opening: `3rem`
- bottom closure: `5rem`

`commerce`

- top opening: `2.5rem`
- bottom closure: `4rem`

`utility`

- top opening: `2.5rem`
- bottom closure: `4rem`

#### Section spacing tiers

`none`

- `0`

`compact`

- mobile: `3rem`
- tablet/desktop: `4rem`

`default`

- mobile: `4rem`
- tablet/desktop: `5rem`

`relaxed`

- mobile: `5rem`
- tablet/desktop: `6rem`

### 5.4 Surface padding targets

Canonical surface internal padding:

- mobile: `2rem`
- tablet/desktop: `2.5rem`

### 5.5 Element gap targets

Canonical stack gaps:

- `xs = 0.5rem`
- `sm = 1rem`
- `md = 1.5rem`
- `lg = 2rem`
- `xl = 2.5rem`
- `2xl = 3rem`

### 5.6 Constitutional rules

- section spacing tidak boleh implicit di feature block
- block tidak boleh menambah compensatory `mt-*`, `pb-*`, atau `py-*` untuk menyelesaikan kelemahan page law
- transition layer bukan sumber utama spacing economics

---

## 6. Typography Constitution

### 6.1 Typeface decision

Untuk BMJ, family global yang dibekukan sekarang:

- primary interface/body/heading font: `Geist Sans`
- mono/supporting technical font: `Geist Mono`

### 6.2 Exception policy for specialty fonts

Font khusus seperti:

- `Plus Jakarta Sans`
- `Heebo`

yang saat ini dipakai di `ProcessSteps`, **bukan** bagian dari typography constitution global.

Mereka diperlakukan sebagai:

- scoped visual exception
- belum dipromosikan menjadi global type law

### 6.3 Global type roles

BMJ membekukan role typography berikut:

1. `hero-title`
2. `page-title`
3. `section-title`
4. `subsection-title`
5. `card-title`
6. `body`
7. `intro`
8. `small`
9. `caption`
10. `eyebrow`

### 6.4 Frozen type scale

`hero-title`

- mobile: `2.25rem`
- tablet: `3rem`
- desktop: `3.75rem`

`page-title`

- mobile: `2.25rem`
- tablet: `3rem`
- desktop: `3rem`

`section-title`

- mobile: `1.875rem`
- tablet: `2.25rem`
- desktop: `2.25rem`

`subsection-title`

- mobile: `1.5rem`
- tablet: `1.875rem`
- desktop: `1.875rem`

`card-title`

- mobile: `1.125rem`
- tablet: `1.25rem`

`body`

- all breakpoints: `1rem`

`intro`

- mobile: `1rem`
- tablet/desktop: `1.125rem`

`small`

- all breakpoints: `0.875rem`

`caption`

- all breakpoints: `0.75rem`

`eyebrow`

- all breakpoints: `0.75rem`

### 6.5 Leading and tracking decisions

`hero-title`

- leading: `tight`
- tracking: `tight`

`section-title`

- leading: `tight`
- tracking: `tight`

`body`

- leading: `relaxed`

`intro`

- leading: `relaxed`

`small/caption/eyebrow`

- leading: `normal`

`eyebrow`

- tracking: `wide to wider`
- uppercase by default

### 6.6 Why these values are grounded

Keputusan ini mengikuti pola yang paling sering muncul di repo saat ini:

- `HomeHero`: `text-4xl md:text-6xl`
- `SectionHeader`: `text-3xl md:text-4xl`
- `ProcessSteps`: `text-3xl md:text-4xl`
- intro/body section sering memakai `text-base leading-7`, dengan sebagian naik ke `md:text-lg`

Jadi konstitusi ini tidak mengarang sistem asing; ia membekukan pola yang paling dominan dan menertibkannya menjadi hukum.

### 6.7 Constitutional rules

- semua section heading harus tunduk pada satu section heading law
- block tidak boleh menentukan heading scale sendiri tanpa melewati canonical API
- angka literal typography bukan sumber kebenaran; type roles adalah sumber kebenaran

---

## 7. Surface / Panel Visual Language

### 7.1 Surface philosophy

BMJ memakai panel/surface sebagai:

- alat untuk mengangkat chapter penting
- alat untuk membedakan content cluster dari page canvas

Surface **bukan** alat untuk menambah empty space besar.

### 7.2 Canonical panel characteristics

Panel default BMJ:

- background: terang / near-white
- border: tipis, halus
- radius: medium-large, terasa ramah tetapi bukan “pill”
- shadow: lembut, tidak berat, lebih ke elevation daripada drama
- padding internal: mengikuti surface law global

### 7.3 Frozen surface values

`panel padding`

- mobile: `2rem`
- tablet/desktop: `2.5rem`

`panel radius`

- `1rem` sampai `1.5rem` range visual canonical

`panel border`

- `1px`

`panel shadow`

- subtle elevated shadow, bukan floating luxury shadow

### 7.4 Surface variants allowed

BMJ membekukan surface families berikut:

1. `default`
2. `elevated`
3. `flat`
4. `outlined`
5. `accent`
6. `dark`

### 7.5 Constitutional rules

- panel skeleton tidak boleh ditulis ulang per block
- panel law harus hidup di shared system, bukan di block panel individual
- kalau satu block “butuh panel”, dia harus mengonsumsi panel law yang sama

---

## 8. Color Constitution

### 8.1 Current canonical base roles

BMJ saat ini sudah memiliki role token yang benar secara domain:

- `--background`
- `--foreground`
- `--card`
- `--muted-foreground`
- `--border`
- `--primary`
- `--accent`

### 8.2 Color role freeze

BMJ membekukan role warna berikut:

1. `page-canvas`
2. `text-primary`
3. `text-secondary`
4. `panel-surface`
5. `panel-border`
6. `muted-surface`
7. `brand-accent`
8. `brand-accent-muted`
9. `decorative-soft`
10. `decorative-pattern-base`
11. `dark-surface`
12. `text-on-dark`

### 8.3 Constitutional reading of existing palette

Role mapping existing system:

- page canvas = `--background`
- text primary = `--foreground`
- panel surface = `--card`
- text secondary = `--muted-foreground`
- panel border = `--border`

### 8.4 Decorative color law

Warna dekoratif lembut yang saat ini sering muncul sebagai literal seperti:

- `#f7f8f1`
- `#f4f6ef`

dianggap valid sebagai **visual direction**, tetapi tidak boleh tetap menjadi literal dalam sistem final.

Mereka harus dipromosikan menjadi token role di phase implementasi berikutnya.

### 8.5 Constitutional rules

- component tidak boleh menjadi source of truth warna
- warna literal hanya boleh hidup sementara sampai dipindahkan ke token
- decorative shells tidak boleh memperkenalkan palette baru tanpa masuk ke role map

---

## 9. Page Density Law

BMJ bukan dashboard padat, tapi juga bukan editorial airy luxury site.

Density target final:

**balanced-compact**

Artinya:

- cukup lega untuk terasa premium dan profesional
- cukup rapat untuk terasa modern dan terkontrol
- tidak membiarkan ruang kosong mengambil alih narasi halaman

Constitutional implication:

- default harus condong ke `compact` atau `default`, bukan `relaxed`
- `relaxed` adalah exception tier
- decorative section tidak otomatis berarti vertical space besar

---

## 10. Override Policy

### 10.1 What may be overridden later

Di phase implementasi berikutnya, yang boleh di-extend:

- page family behavior
- section variant behavior
- canonical heading API
- surface variants

### 10.2 What may not be overridden locally

Block individual tidak boleh menjadi owner untuk:

- page opening/closing law
- section spacing law
- heading scale law
- panel skeleton law
- page canvas law

### 10.3 Constitutional rule

Jika sebuah block membutuhkan exception yang belum ada:

- exception harus naik ke shared law
- bukan langsung di-patch di block itu sendiri

---

## 11. Explicit Exclusions

Dokumen ini sengaja belum memutuskan:

- adjacency/divider/wash logic
- hero implementation detail
- `PageFrame` class map final
- `SectionShell` class map final
- runtime `globals.css` structure final

Semua itu berada di phase sesudah constitution dibekukan.

---

## 12. Frozen Contract Moment

Mulai setelah dokumen ini disetujui:

1. tidak ada keputusan layout baru yang boleh dibuat dari feature block
2. tidak ada runtime patch yang boleh masuk tanpa menjawab law mana yang diubah
3. semua pekerjaan berikutnya harus merujuk ke dokumen ini lebih dulu

Ini adalah momen pembekuan kontrak yang sebelumnya hilang dari project BMJ.

