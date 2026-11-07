# Panduan Instalasi ZulfaSpace

## A. Backend (Google Apps Script) — berkas `Kode.gs` dan `appsscript.json` diberikan terpisah
1. Buka https://script.google.com → **Proyek baru**, beri nama `ZulfaSpace API`.
2. Ganti isi `Code.gs` dengan isi `Kode.gs` (rename ke `Kode`).
3. Setelan Proyek (⚙️) → centang **Show "appsscript.json" manifest file** → tempel isi `appsscript.json`.
4. Pilih fungsi `setupAppEnvironment` → ▶ Run → izinkan akses Drive, Sheets, Gmail. Cukup sekali; aman diulang (rahasia dan data tidak ditimpa).
   Hasil: folder `ZulfaSpace-Aset`, spreadsheet `Database ZulfaSpace` (sheet Profil, Riwayat, Karya, Pesan, Statistik) berisi data dari CV dan daftar website Anda.
5. **Deploy → New deployment → Web app** → Execute as: **Me**, Who has access: **Anyone** → salin URL berakhiran `/exec`.
6. Rahasia (`ADMIN_EMAIL`, `ADMIN_PATH_KEY`, `SESSION_SECRET`) dibuat otomatis di ⚙️ Setelan Proyek → Script Properties. Jangan menambah editor proyek sembarangan.

## B. Frontend (GitHub Pages) — dari ZIP `zulfaspace-frontend.zip`
1. Ekstrak ZIP. Folder hasil ekstraksi **adalah** folder yang di-`git init` (di dalamnya langsung terlihat `index.html`).
2. Buka `js/config.js`, ganti `GANTI_DENGAN_ID_DEPLOYMENT` dengan URL `/exec` dari langkah A5.
3. Di folder itu, buka terminal dan pastikan `dir` (Windows) atau `ls` menampilkan `index.html`:
```
git init
git add .
git commit -m "ZulfaSpace pertama"
git branch -M main
git remote add origin https://github.com/USERNAME/zulfaspace.git
git push -u origin main
```
4. GitHub → repo → Settings → Pages → Deploy from branch → `main` / root → Save. Tunggu 1–2 menit.
5. Pembaruan: ubah file → `git add .` → `git commit -m "update"` → `git push`.

## C. Mengubah konten
Buka spreadsheet, edit sheet **Karya / Riwayat / Profil**. Perubahan tampil maksimal 10 menit (atau jalankan `bersihkanCache`).
- **Banyak gambar per karya (slideshow):** isi kolom `sampul` dengan beberapa URL `https://` dipisah `|`. Kosong = sampul otomatis.
- **Unduh PDF/PNG:** isi kolom `unduh` (link Drive "Anyone with the link").
- Atur `tampil` = FALSE untuk menyembunyikan karya.

## D. Uji cepat
Buka situs → data tampil; kirim formulir → baris baru di sheet Pesan + email masuk; klik "Buka Website" → baris di Statistik.

## Pembaruan versi (WAJIB bila sebelumnya sudah setup)
Tempel `Kode.gs` terbaru → jalankan `setupAppEnvironment` lagi (aman: membuat sheet **Pengaturan**, menambah kolom **foto** di Profil, data lama tidak berubah) → Deploy ulang (New version). Lalu `git add . && git commit -m "update" && git push` untuk frontend.

**Jika muncul error "Specified permissions are not sufficient":** tempel ulang `appsscript.json` terbaru (sudah memuat izin email dan trigger), simpan, jalankan `setupAppEnvironment` lagi, lalu klik *Review permissions → Allow*. Setup juga memasang jadwal otomatis yang merangkum log lebih dari 90 hari menjadi rekap bulanan.

## E. Mengaktifkan Dashboard Admin
1. Google Cloud Console → buat proyek → APIs & Services → Credentials → **OAuth client ID** (Web application). Pada *Authorized JavaScript origins* isi `https://USERNAME.github.io`. Salin Client ID.
2. Apps Script → ⚙️ Setelan Proyek → Script Properties → tambah `OAUTH_CLIENT_ID` = Client ID tadi. Pastikan `ADMIN_EMAIL` = email Google Anda (otomatis terisi saat setup; ubah bila perlu).
3. Lihat nilai `ADMIN_PATH_KEY` di Script Properties. Alamat admin: `https://USERNAME.github.io/zulfaspace/admin.html?k=ISI_ADMIN_PATH_KEY` — simpan di bookmark pribadi, jangan dibagikan.
4. Deploy ulang Apps Script: Deploy → Manage deployments → ✏️ → Version: New version.
5. Buka alamat admin → Masuk dengan Google. Akun lain mendapat "Akses ditolak".
Catatan: unduh Excel berformat CSV (terbuka di Excel); unduh PDF memakai Cetak → Simpan sebagai PDF. Berkas maks 7 MB; untuk yang lebih besar unggah manual ke Drive lalu tempel tautannya.
