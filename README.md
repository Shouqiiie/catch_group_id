# Penampil Grup WhatsApp

Aplikasi Node.js sederhana untuk menampilkan grup WhatsApp Anda menggunakan antarmuka web yang modern. Aplikasi ini menggunakan `whatsapp-web.js` untuk terhubung ke akun WhatsApp Anda dan Express.js untuk menyajikan halaman web.

## Fitur

-   **Pindai Kode QR**: Hubungkan akun WhatsApp Anda dengan mudah dengan memindai kode QR di terminal.
-   **Lihat Daftar Grup**: Menampilkan daftar semua grup WhatsApp Anda, termasuk nama grup, ID, dan jumlah anggota.
-   **UI Modern**: Antarmuka web yang bersih, bertema gelap, dan responsif untuk pengalaman pengguna yang lebih baik.
-   **Status Real-time**: Menampilkan status koneksi ke WhatsApp secara real-time.

## Kebutuhan Sistem

-   [Node.js](https://nodejs.org/) (versi 16 atau lebih tinggi direkomendasikan)
-   Google Chrome yang sudah terinstal disarankan agar Puppeteer dapat bekerja dengan benar.

## Instalasi

1.  **Clone repositori atau unduh file proyek.**

2.  **Buka direktori proyek:**
    ```bash
    cd /path/to/your/project
    ```

3.  **Instal dependensi yang diperlukan:**
    ```bash
    npm install
    ```

## Cara Menjalankan

1.  **Jalankan aplikasi dengan perintah berikut di terminal Anda:**
    ```bash
    node app.js
    ```

2.  **Pindai Kode QR**:
    *   Sebuah kode QR akan muncul di terminal Anda.
    *   Buka WhatsApp di ponsel Anda, buka **Setelan > Perangkat Tertaut**, lalu pindai kode QR tersebut.

3.  **Lihat di Browser**:
    *   Setelah terhubung, buka browser web Anda dan kunjungi `http://localhost:3001`.
    *   Klik tombol "Lihat Daftar Grup" untuk melihat semua grup Anda.

## Cara Kerja

-   **Backend**: File `app.js` menginisialisasi server Express dan klien `whatsapp-web.js`.
-   **Klien WhatsApp**: Menangani koneksi ke WhatsApp, menghasilkan kode QR, dan mengambil daftar grup.
-   **Antarmuka Web**: Server menyediakan dua rute utama:
    -   `/`: Halaman utama, menampilkan status koneksi.
    -   `/grup`: Halaman yang menampilkan daftar grup dalam tabel yang sudah ditata.
-   **Tampilan**: CSS disematkan langsung di dalam templat HTML untuk kesederhanaan, menyediakan tema gelap modern tanpa memerlukan file CSS terpisah.
