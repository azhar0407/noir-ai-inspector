# Noir AI Inspector

Alat publik berbasis browser untuk menguji indikator perilaku API model AI kompatibel OpenAI.

## Privasi

- Tidak ada backend, database, analytics, cookie, atau penyimpanan browser.
- API key hanya berada di memori tab. Browser mencoba request langsung ke provider.
- Jika provider memblokir CORS, request diteruskan sementara oleh Cloudflare Function tanpa database, cache, analytics, atau logging aplikasi. Infrastruktur Cloudflare serta provider tetap memproses request.
- Hanya endpoint HTTPS yang didukung pada deployment publik. Gunakan key khusus dengan limit rendah.
- Jangan gunakan kredensial produksi; buat key terpisah dengan limit rendah jika tersedia.

## Batasan

Tes black-box tidak dapat membuktikan identitas model atau menjamin provider bebas prompt injection. Provider dapat memalsukan metadata, mengubah prompt, mencatat permintaan, atau merutekan model secara dinamis. Hasil hanya indikator risiko.

## Jalankan lokal

```bash
python3 -m http.server 8080
```

Buka `http://localhost:8080`.
