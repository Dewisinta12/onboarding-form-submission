# Evaluasi Tertulis - Onboarding Form

## 1. Permasalahan
Saat ini, endpoint `/api/onboarding` masih mengembalikan data hardcoded langsung dari kode backend. Hal ini membuat sistem kurang fleksibel karena setiap kali ingin menambah atau mengubah field form, tim harus memodifikasi kode dan melakukan deploy ulang. Selain itu, tidak ada penyimpanan terpusat di database, sehingga sulit untuk mengelola versi form yang berbeda.

## 2. Solusi yang Diusulkan
Untuk membuat sistem lebih dinamis, data onboarding sebaiknya disimpan di database. Solusinya:
- Tambahkan tabel **`onboarding_steps`** (menyimpan urutan langkah) dan **`onboarding_fields`** (menyimpan detail setiap field seperti `name`, `label`, `type`, dan `required`).
- Ubah endpoint `GET /api/onboarding` agar mengambil data dari database, bukan dari variabel hardcoded.
- Buat endpoint baru `POST /api/onboarding` yang menyimpan jawaban user ke tabel **`user_onboarding_data`**, lalu tandai user sebagai telah menyelesaikan onboarding di tabel `users`.

## 3. Pertimbangan Teknis
Beberapa hal penting yang harus diperhatikan:
- **Autentikasi:** Pastikan hanya user yang login bisa menyimpan data onboarding-nya sendiri.  
- **Validasi:** Semua field wajib (`required`) harus diisi sebelum data disimpan.  
- **Struktur & efisiensi:** Gunakan relasi antar tabel (foreign key) dan indeks untuk performa query yang baik.  
- **Keamanan:** Hindari data sensitif tersimpan secara langsung tanpa enkripsi.  

Dengan pendekatan ini, form onboarding menjadi lebih fleksibel, mudah dikelola, dan aman tanpa perlu memodifikasi kode backend setiap kali ada perubahan form.
