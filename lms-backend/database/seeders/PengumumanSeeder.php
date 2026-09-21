<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pengumuman;
use App\Models\User;

class PengumumanSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@sekolah.sch.id')->first();

        if (!$admin) return;

        $pengumuman = [
            [
                'admin_id'       => $admin->id,
                'judul'          => 'Selamat Datang di Semester Genap 2025/2026',
                'isi'            => "Assalamu'alaikum Wr. Wb.\n\nKami mengucapkan selamat datang kepada seluruh warga sekolah di Semester Genap Tahun Ajaran 2025/2026. Semoga kita semua dapat menjalani semester ini dengan penuh semangat dan meraih prestasi terbaik.\n\nKegiatan belajar mengajar dimulai pada tanggal 3 Februari 2026. Harap seluruh siswa dan guru mempersiapkan diri dengan baik.\n\nWassalamu'alaikum Wr. Wb.\n\nHormat kami,\nKepala Sekolah SMK Nusantara",
                'target_role'    => 'Semua',
                'prioritas'      => 'Tinggi',
                'tanggal_mulai'  => '2026-02-01',
                'tanggal_selesai'=> '2026-02-07',
                'aktif'          => true,
            ],
            [
                'admin_id'       => $admin->id,
                'judul'          => 'Jadwal Ujian Tengah Semester (UTS) Genap 2025/2026',
                'isi'            => "Kepada seluruh siswa SMK Nusantara,\n\nDengan hormat kami informasikan bahwa Ujian Tengah Semester (UTS) Genap Tahun Ajaran 2025/2026 akan dilaksanakan pada:\n\n📅 Tanggal: 23 Maret 2026 - 29 Maret 2026\n⏰ Waktu: 07.30 - 12.00 WIB\n📍 Tempat: Ruang kelas masing-masing\n\nHal-hal yang perlu diperhatikan:\n1. Siswa wajib hadir 15 menit sebelum ujian dimulai\n2. Membawa kartu ujian yang telah ditandatangani wali kelas\n3. Berpakaian seragam lengkap dan rapi\n4. Dilarang membawa alat komunikasi ke dalam ruang ujian\n\nSemoga sukses!\n\nTim Akademik SMK Nusantara",
                'target_role'    => 'Siswa',
                'prioritas'      => 'Tinggi',
                'tanggal_mulai'  => '2026-03-10',
                'tanggal_selesai'=> '2026-03-29',
                'aktif'          => true,
            ],
            [
                'admin_id'       => $admin->id,
                'judul'          => 'Pengumpulan Nilai UTS - Batas Waktu 5 April 2026',
                'isi'            => "Kepada Yth. Bapak/Ibu Guru SMK Nusantara,\n\nDengan hormat, kami mengingatkan bahwa batas waktu pengumpulan nilai UTS Semester Genap 2025/2026 adalah:\n\n📅 Batas Waktu: 5 April 2026 pukul 15.00 WIB\n\nMohon Bapak/Ibu segera menginput nilai melalui sistem e-learning ini. Nilai yang belum diinput setelah batas waktu akan diproses oleh bagian akademik.\n\nJika ada kendala teknis, silakan hubungi admin di ext. 101.\n\nTerima kasih atas kerjasamanya.\n\nBagian Akademik SMK Nusantara",
                'target_role'    => 'Guru',
                'prioritas'      => 'Tinggi',
                'tanggal_mulai'  => '2026-03-30',
                'tanggal_selesai'=> '2026-04-05',
                'aktif'          => true,
            ],
            [
                'admin_id'       => $admin->id,
                'judul'          => 'Libur Nasional Hari Raya Idul Fitri 1447 H',
                'isi'            => "Kepada seluruh warga SMK Nusantara,\n\nDengan hormat kami informasikan bahwa sekolah akan libur dalam rangka Hari Raya Idul Fitri 1447 H pada:\n\n📅 Tanggal Libur: 28 Maret 2026 - 11 April 2026\n📅 Masuk Kembali: 14 April 2026\n\nSegenap keluarga besar SMK Nusantara mengucapkan:\n\n🌙 Selamat Hari Raya Idul Fitri 1447 H\nMohon Maaf Lahir dan Batin\n\nSemoga kita semua kembali fitri dan dapat menjalankan aktivitas belajar mengajar dengan lebih baik setelah libur.\n\nWassalamu'alaikum Wr. Wb.",
                'target_role'    => 'Semua',
                'prioritas'      => 'Sedang',
                'tanggal_mulai'  => '2026-03-25',
                'tanggal_selesai'=> '2026-04-14',
                'aktif'          => true,
            ],
            [
                'admin_id'       => $admin->id,
                'judul'          => 'Pembaruan Sistem E-Learning: Fitur Baru Tersedia',
                'isi'            => "Kepada seluruh pengguna sistem E-Learning SMK Nusantara,\n\nKami dengan bangga mengumumkan pembaruan sistem e-learning dengan fitur-fitur baru:\n\n✨ Fitur Baru:\n1. Dashboard yang lebih informatif dengan statistik real-time\n2. Notifikasi otomatis untuk tugas yang mendekati deadline\n3. Tampilan materi yang lebih interaktif\n4. Laporan absensi yang dapat diunduh\n5. Fitur komentar pada materi pembelajaran\n\n🔧 Perbaikan:\n- Performa sistem lebih cepat\n- Tampilan mobile yang lebih responsif\n- Keamanan sistem ditingkatkan\n\nJika menemukan kendala atau bug, silakan laporkan ke admin@sekolah.sch.id\n\nTerima kasih telah menggunakan sistem e-learning kami!",
                'target_role'    => 'Semua',
                'prioritas'      => 'Sedang',
                'tanggal_mulai'  => '2026-02-15',
                'tanggal_selesai'=> null,
                'aktif'          => true,
            ],
            [
                'admin_id'       => $admin->id,
                'judul'          => 'Kegiatan Praktik Kerja Lapangan (PKL) Kelas XII',
                'isi'            => "Kepada Yth. Siswa Kelas XII SMK Nusantara,\n\nDengan hormat, kami informasikan bahwa kegiatan Praktik Kerja Lapangan (PKL) untuk siswa kelas XII akan dilaksanakan pada:\n\n📅 Periode PKL: 1 Juni 2026 - 31 Agustus 2026\n\nPersyaratan yang harus dipenuhi:\n1. Telah menyelesaikan semua mata pelajaran semester genap\n2. Nilai rata-rata minimal 75\n3. Tidak memiliki tunggakan administrasi\n4. Telah mendapatkan tempat PKL yang disetujui sekolah\n\nPendaftaran tempat PKL dibuka mulai 1 April 2026 melalui sistem e-learning ini.\n\nUntuk informasi lebih lanjut, hubungi Koordinator PKL di ruang BK.\n\nSemangat dan sukses untuk PKL kalian!",
                'target_role'    => 'Siswa',
                'prioritas'      => 'Sedang',
                'tanggal_mulai'  => '2026-03-01',
                'tanggal_selesai'=> '2026-06-01',
                'aktif'          => true,
            ],
            [
                'admin_id'       => $admin->id,
                'judul'          => 'Rapat Koordinasi Guru - Evaluasi Semester Genap',
                'isi'            => "Kepada Yth. Bapak/Ibu Guru SMK Nusantara,\n\nDengan hormat, kami mengundang Bapak/Ibu untuk menghadiri Rapat Koordinasi Evaluasi Semester Genap 2025/2026:\n\n📅 Hari/Tanggal: Sabtu, 4 April 2026\n⏰ Waktu: 08.00 - 12.00 WIB\n📍 Tempat: Aula SMK Nusantara\n\nAgenda:\n1. Evaluasi pelaksanaan UTS\n2. Persiapan UAS\n3. Evaluasi penggunaan sistem e-learning\n4. Lain-lain\n\nKehadiran Bapak/Ibu sangat diharapkan. Mohon konfirmasi kehadiran paling lambat 2 April 2026.\n\nTerima kasih.\n\nKepala Sekolah SMK Nusantara",
                'target_role'    => 'Guru',
                'prioritas'      => 'Sedang',
                'tanggal_mulai'  => '2026-03-28',
                'tanggal_selesai'=> '2026-04-04',
                'aktif'          => true,
            ],
            [
                'admin_id'       => $admin->id,
                'judul'          => 'Pengingat: Absensi Harus Diisi Setiap Pertemuan',
                'isi'            => "Kepada Yth. Bapak/Ibu Guru SMK Nusantara,\n\nKami mengingatkan bahwa pengisian absensi siswa melalui sistem e-learning wajib dilakukan setiap pertemuan.\n\nPanduan pengisian absensi:\n1. Login ke sistem e-learning\n2. Pilih menu Absensi\n3. Pilih kelas dan mata pelajaran\n4. Isi status kehadiran setiap siswa\n5. Simpan data absensi\n\nAbsensi yang tidak diisi akan mempengaruhi laporan kehadiran siswa dan evaluasi kinerja guru.\n\nJika ada pertanyaan, hubungi admin sistem.\n\nTerima kasih atas perhatian dan kerjasamanya.",
                'target_role'    => 'Guru',
                'prioritas'      => 'Rendah',
                'tanggal_mulai'  => '2026-02-03',
                'tanggal_selesai'=> null,
                'aktif'          => true,
            ],
        ];

        foreach ($pengumuman as $data) {
            Pengumuman::firstOrCreate(
                [
                    'admin_id' => $data['admin_id'],
                    'judul'    => $data['judul'],
                ],
                $data
            );
        }
    }
}
