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

## E. Cara masuk ke dashboard (tanpa tombol login di situs publik)
Dashboard sengaja tidak punya tautan di situs publik. Aksesnya hanya lewat alamat rahasia yang Anda simpan sendiri.

**Persiapan satu kali**
1. Google Cloud Console → proyek baru → *APIs & Services* → *OAuth consent screen* (External, isi nama aplikasi dan email Anda; tambahkan email Anda di *Test users* bila status masih Testing) → *Credentials* → **Create OAuth client ID** → *Web application*. Pada *Authorized JavaScript origins* isi `https://USERNAME.github.io` (tanpa garis miring di akhir dan tanpa nama repo). Salin Client ID.
2. Apps Script → ⚙️ Setelan Proyek → Script Properties → tambah `OAUTH_CLIENT_ID` berisi Client ID tadi. Pastikan `ADMIN_EMAIL` berisi email Google yang akan Anda pakai masuk.
3. Salin nilai `ADMIN_PATH_KEY` dari Script Properties yang sama.
4. Deploy ulang Apps Script (Deploy → Manage deployments → ✏️ → New version).

**Alamat dashboard Anda**
`https://USERNAME.github.io/NAMA-REPO/admin.html?k=ISI_ADMIN_PATH_KEY`

**Kiat masuk**
- Buka alamat itu, klik *Sign in with Google*, pilih akun yang sama dengan `ADMIN_EMAIL`.
- Simpan alamat lengkap sebagai bookmark atau di pengelola kata sandi. Jangan dibagikan, jangan ditempel di bio atau situs publik.
- Pakai profil browser yang sudah login ke akun Google tersebut agar tidak salah akun.
- Sesi berlaku sekitar 2 jam; setelah itu cukup masuk lagi.
- Jika alamat bocor: Dashboard → Pengaturan → *Ganti alamat rahasia*.
- "Akses ditolak": kunci `k` salah atau email tidak sama dengan `ADMIN_EMAIL`. Setelah 8 kali gagal, login terkunci 15 menit.
- Tombol Google tidak muncul / "OAUTH_CLIENT_ID belum diisi": cek langkah 2 dan origin pada langkah 1, lalu deploy ulang.

## E2. Alternatif tanpa Google Cloud: masuk dengan kata sandi
1. Apps Script → ⚙️ Setelan Proyek → Script Properties → **Add script property**: nama `ADMIN_PASSWORD_BARU`, nilai kata sandi pilihan Anda (minimal 12 karakter, sebaiknya frasa panjang yang unik). Save.
2. Di editor, pilih fungsi `aturKataSandiAdmin` → ▶ Run. Fungsi ini menyimpan hash kata sandi lalu **menghapus** properti sementara tadi.
3. Deploy → Manage deployments → ✏️ → New version → Deploy.
4. Buka `admin.html?k=ADMIN_PATH_KEY` → kolom kata sandi muncul. Untuk mengganti kata sandi, ulangi langkah 1–3.
Keamanan: akses butuh dua rahasia (kunci pada alamat + kata sandi), kata sandi hanya tersimpan sebagai hash, dan 8 kali gagal mengunci login 15 menit. Login Google tetap lebih kuat karena memakai verifikasi 2 langkah akun Anda; keduanya bisa aktif bersamaan.

## E3. Lampiran materi pada Karya (semua jenis dokumen, berkas besar)
- Dashboard → **Karya** → **+ Tambah** / **Ubah** → bagian **📎 Lampiran materi**: seret satu atau banyak berkas (PDF, Word, PowerPoint, Excel, ZIP, video, .ggb, .sb3, dan lainnya, hingga 2 GB per berkas). Ada bilah progres per berkas dan tombol ✕ untuk membuang lampiran.
- Browser mengunggah **langsung ke Google Drive** sehingga tidak terbentur batas ukuran Apps Script. Di kartu karya pada situs publik: 1 lampiran = tombol Unduh langsung; lebih dari 1 = tombol "Unduh Materi (n)" yang membuka daftar berkas.
- Berkas otomatis diatur "siapa pun yang punya tautan" agar bisa diunduh pengunjung; jangan unggah dokumen pribadi. Berkas lebih dari 25 MB dibuka lewat halaman pratinjau Drive (ada tombol Unduh). Menghapus karya juga memindahkan lampirannya ke Sampah Drive.
- Jenis yang diizinkan dibatasi (dokumen, arsip, gambar, audio/video, .ggb, .sb3, .py, .ipynb, .json); berkas yang bisa dijalankan seperti .exe atau .js ditolak. Kuota Drive gratis 15 GB dibagi dengan Gmail dan Foto.
- Setelah menempel `Kode.gs` baru: jalankan `setupAppEnvironment` lagi (menambah kolom **berkas** dan **peran**), lalu Deploy → New version.

## F. Yang dikelola dari dashboard
Profil dan foto hero, Riwayat (pendidikan, pengalaman, kompetensi), Karya (judul, kategori, tautan, gambar sampul banyak, file unduhan), Pesan Masuk, Statistik & Laporan, serta Pengaturan situs: judul, deskripsi SEO, warna aksen, status maintenance, lokasi, 3 label di foto hero, daftar keahlian berjalan, teks footer, dan hashtag. Google Sheets tidak perlu dibuka lagi untuk pekerjaan sehari-hari.
