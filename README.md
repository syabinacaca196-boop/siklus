# Siklus — Media Informasi Zero Waste & Daur Ulang

Desain web untuk **Lomba Web Design — EcoDigital for Environment** dengan subtema
*media informasi tentang gaya hidup zero waste, daur ulang, dan sejenisnya*.

Siklus adalah satu halaman statis tanpa build tool: buka `index.html` di browser,
atau jalankan lewat server lokal.

## Isi

- **Peta perjalanan benda** — animasi conveyor yang menunjukkan tahap
  kumpul, pilah, sortir, proses, dan kembali.
- **Prinsip 5R** — Refuse, Reduce, Reuse, Recycle, Rot dalam tab interaktif.
- **Panduan memilah** — 24 benda yang bisa dicari dan disaring per kategori,
  lengkap dengan status dan tujuan penanganannya.
- **Kode material** — tujuh kode resin plastik dan kemudahan daur ulangnya.
- **Kalkulator jejak** — enam pertanyaan gaya hidup dengan hasil dan saran.
- **Proses daur ulang**, **kiat**, **FAQ**, dan **daftar aksi** interaktif.

## Menjalankan

```bash
# dari folder ini
php -S localhost:8000
# lalu buka http://localhost:8000
```

Tidak ada dependensi dan tidak ada data yang dikirim ke mana pun.

## Struktur

```
index.html
assets/css/style.css
assets/js/app.js
```
