# Noir AI Inspector

Alat publik berbasis browser untuk menguji indikator perilaku API model AI kompatibel OpenAI.

## Privasi

- Tidak ada backend, database, analytics, cookie, atau penyimpanan browser.
- API key hanya berada di memori tab dan dikirim langsung ke Base URL yang dimasukkan pengguna.
- Hanya endpoint HTTPS yang didukung pada deployment publik.
- Jangan gunakan kredensial produksi; buat key terpisah dengan limit rendah jika tersedia.

## Batasan

Tes black-box tidak dapat membuktikan identitas model atau menjamin provider bebas prompt injection. Provider dapat memalsukan metadata, mengubah prompt, mencatat permintaan, atau merutekan model secara dinamis. Hasil hanya indikator risiko.

## Jalankan lokal

```bash
python3 -m http.server 8080
```

Buka `http://localhost:8080`.
