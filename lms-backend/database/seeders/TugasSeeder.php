<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tugas;
use App\Models\User;
use App\Models\MataPelajaran;
use App\Models\Kelas;

class TugasSeeder extends Seeder
{
    public function run(): void
    {
        $budi   = User::where('email', 'budi.santoso@sekolah.sch.id')->first();
        $ahmad  = User::where('email', 'ahmad.fauzi@sekolah.sch.id')->first();
        $dewi   = User::where('email', 'dewi.lestari@sekolah.sch.id')->first();
        $siti   = User::where('email', 'siti.rahayu@sekolah.sch.id')->first();

        $pweb = MataPelajaran::where('kode', 'PWEB')->first();
        $bdt  = MataPelajaran::where('kode', 'BDT')->first();
        $pbo  = MataPelajaran::where('kode', 'PBO')->first();
        $ppl  = MataPelajaran::where('kode', 'PPL')->first();
        $bind = MataPelajaran::where('kode', 'BIND')->first();

        $xi_rpl1  = Kelas::where('nama', 'XI RPL 1')->first();
        $xi_rpl2  = Kelas::where('nama', 'XI RPL 2')->first();
        $xii_rpl1 = Kelas::where('nama', 'XII RPL 1')->first();

        $tugas = [
            // PWEB - Budi - XI RPL 1
            [
                'guru_id'           => $budi?->id,
                'mata_pelajaran_id' => $pweb?->id,
                'kelas_id'          => $xi_rpl1?->id,
                'judul'             => 'Membuat Halaman Login dengan HTML & CSS',
                'deskripsi'         => 'Buat halaman login yang responsif menggunakan HTML5 dan CSS3. Sertakan validasi form sederhana menggunakan JavaScript.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'deadline'          => '2026-02-28 23:59:00',
                'max_score'         => 100,
                'semester'          => 'Genap',
                'tahun_ajaran'      => '2025/2026',
            ],
            [
                'guru_id'           => $budi?->id,
                'mata_pelajaran_id' => $pweb?->id,
                'kelas_id'          => $xi_rpl1?->id,
                'judul'             => 'Implementasi Flexbox dan Grid Layout',
                'deskripsi'         => 'Buat layout website menggunakan CSS Flexbox dan Grid. Halaman harus responsif untuk mobile dan desktop.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'deadline'          => '2026-03-15 23:59:00',
                'max_score'         => 100,
                'semester'          => 'Genap',
                'tahun_ajaran'      => '2025/2026',
            ],
            [
                'guru_id'           => $budi?->id,
                'mata_pelajaran_id' => $pweb?->id,
                'kelas_id'          => $xi_rpl1?->id,
                'judul'             => 'Proyek Akhir: Website Portofolio',
                'deskripsi'         => 'Buat website portofolio pribadi menggunakan HTML, CSS, dan JavaScript. Harus memiliki minimal 4 halaman: Home, About, Portfolio, Contact.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'deadline'          => '2026-05-30 23:59:00',
                'max_score'         => 100,
                'semester'          => 'Genap',
                'tahun_ajaran'      => '2025/2026',
            ],

            // BDT - Ahmad - XI RPL 1
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $bdt?->id,
                'kelas_id'          => $xi_rpl1?->id,
                'judul'             => 'Normalisasi Database Sistem Perpustakaan',
                'deskripsi'         => 'Lakukan normalisasi database sistem perpustakaan hingga 3NF. Sertakan diagram ERD dan penjelasan setiap tahap normalisasi.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'deadline'          => '2026-03-10 23:59:00',
                'max_score'         => 100,
                'semester'          => 'Genap',
                'tahun_ajaran'      => '2025/2026',
            ],
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $bdt?->id,
                'kelas_id'          => $xi_rpl2?->id,
                'judul'             => 'Query SQL Lanjutan: JOIN dan Subquery',
                'deskripsi'         => 'Kerjakan 15 soal query SQL menggunakan INNER JOIN, LEFT JOIN, RIGHT JOIN, dan Subquery pada database yang telah disediakan.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'deadline'          => '2026-03-20 23:59:00',
                'max_score'         => 100,
                'semester'          => 'Genap',
                'tahun_ajaran'      => '2025/2026',
            ],

            // PBO - Dewi - XI RPL 2
            [
                'guru_id'           => $dewi?->id,
                'mata_pelajaran_id' => $pbo?->id,
                'kelas_id'          => $xi_rpl2?->id,
                'judul'             => 'Implementasi Konsep OOP: Inheritance dan Polymorphism',
                'deskripsi'         => 'Buat program Java yang mengimplementasikan konsep inheritance dan polymorphism. Gunakan studi kasus sistem kendaraan (Kendaraan, Mobil, Motor, Truk).',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'deadline'          => '2026-02-25 23:59:00',
                'max_score'         => 100,
                'semester'          => 'Genap',
                'tahun_ajaran'      => '2025/2026',
            ],
            [
                'guru_id'           => $dewi?->id,
                'mata_pelajaran_id' => $pbo?->id,
                'kelas_id'          => $xi_rpl2?->id,
                'judul'             => 'Membuat Aplikasi CRUD Sederhana dengan Java',
                'deskripsi'         => 'Buat aplikasi CRUD (Create, Read, Update, Delete) sederhana menggunakan Java dengan koneksi ke database MySQL. Gunakan JDBC untuk koneksi database.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'deadline'          => '2026-04-10 23:59:00',
                'max_score'         => 100,
                'semester'          => 'Genap',
                'tahun_ajaran'      => '2025/2026',
            ],

            // PPL - Ahmad - XII RPL 1
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $ppl?->id,
                'kelas_id'          => $xii_rpl1?->id,
                'judul'             => 'Membuat Dokumen SRS (Software Requirements Specification)',
                'deskripsi'         => 'Buat dokumen SRS untuk proyek aplikasi yang akan dikembangkan. Dokumen harus mencakup: deskripsi sistem, kebutuhan fungsional, kebutuhan non-fungsional, dan use case diagram.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'deadline'          => '2026-03-05 23:59:00',
                'max_score'         => 100,
                'semester'          => 'Genap',
                'tahun_ajaran'      => '2025/2026',
            ],
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $ppl?->id,
                'kelas_id'          => $xii_rpl1?->id,
                'judul'             => 'Implementasi Metodologi Agile: Sprint Planning',
                'deskripsi'         => 'Lakukan sprint planning untuk proyek kelompok. Buat product backlog, sprint backlog, dan estimasi story points untuk setiap user story.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'deadline'          => '2026-04-20 23:59:00',
                'max_score'         => 100,
                'semester'          => 'Genap',
                'tahun_ajaran'      => '2025/2026',
            ],

            // BIND - Siti - XI RPL 1
            [
                'guru_id'           => $siti?->id,
                'mata_pelajaran_id' => $bind?->id,
                'kelas_id'          => $xi_rpl1?->id,
                'judul'             => 'Menulis Surat Lamaran Kerja dalam Bahasa Indonesia',
                'deskripsi'         => 'Tulis surat lamaran kerja yang baik dan benar sesuai kaidah Bahasa Indonesia. Surat ditujukan untuk posisi Junior Web Developer di perusahaan teknologi.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'deadline'          => '2026-03-01 23:59:00',
                'max_score'         => 100,
                'semester'          => 'Genap',
                'tahun_ajaran'      => '2025/2026',
            ],
        ];

        foreach ($tugas as $data) {
            if ($data['guru_id'] && $data['mata_pelajaran_id'] && $data['kelas_id']) {
                Tugas::firstOrCreate(
                    [
                        'guru_id'           => $data['guru_id'],
                        'mata_pelajaran_id' => $data['mata_pelajaran_id'],
                        'kelas_id'          => $data['kelas_id'],
                        'judul'             => $data['judul'],
                    ],
                    $data
                );
            }
        }
    }
}
