<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PengumpulanTugas;
use App\Models\Tugas;
use App\Models\User;

class PengumpulanTugasSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil siswa
        $andi   = User::where('email', 'andi.pratama@siswa.sch.id')->first();
        $bella  = User::where('email', 'bella.safitri@siswa.sch.id')->first();
        $cahya  = User::where('email', 'cahya.ramadhan@siswa.sch.id')->first();
        $dina   = User::where('email', 'dina.kusumawati@siswa.sch.id')->first();
        $eko    = User::where('email', 'eko.prasetyo@siswa.sch.id')->first();
        $fitri  = User::where('email', 'fitri.handayani@siswa.sch.id')->first();
        $gilang = User::where('email', 'gilang.nugroho@siswa.sch.id')->first();
        $hana   = User::where('email', 'hana.permata@siswa.sch.id')->first();
        $ivan   = User::where('email', 'ivan.setiawan@siswa.sch.id')->first();

        // Ambil tugas berdasarkan judul
        $tugasLogin    = Tugas::where('judul', 'Membuat Halaman Login dengan HTML & CSS')->first();
        $tugasFlex     = Tugas::where('judul', 'Implementasi Flexbox dan Grid Layout')->first();
        $tugasNorm     = Tugas::where('judul', 'Normalisasi Database Sistem Perpustakaan')->first();
        $tugasQuery    = Tugas::where('judul', 'Query SQL Lanjutan: JOIN dan Subquery')->first();
        $tugasOOP      = Tugas::where('judul', 'Implementasi Konsep OOP: Inheritance dan Polymorphism')->first();
        $tugasCRUD     = Tugas::where('judul', 'Membuat Aplikasi CRUD Sederhana dengan Java')->first();
        $tugasSRS      = Tugas::where('judul', 'Membuat Dokumen SRS (Software Requirements Specification)')->first();
        $tugasSurat    = Tugas::where('judul', 'Menulis Surat Lamaran Kerja dalam Bahasa Indonesia')->first();

        $pengumpulan = [
            // Tugas Login PWEB - XI RPL 1 (andi, bella, cahya, dina, eko)
            [
                'tugas_id'       => $tugasLogin?->id,
                'siswa_id'       => $andi?->id,
                'file_path'      => 'submissions/pweb/login_andi.zip',
                'file_name'      => 'login_andi.zip',
                'file_type'      => 'application/zip',
                'file_size'      => 245760,
                'submitted_at'   => '2026-02-27 14:30:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 88,
                'catatan_siswa'  => 'Sudah saya tambahkan validasi JavaScript',
                'catatan_guru'   => 'Bagus, desain responsif dan validasi berjalan dengan baik',
                'tanggal_dinilai'=> '2026-03-02 10:00:00',
            ],
            [
                'tugas_id'       => $tugasLogin?->id,
                'siswa_id'       => $bella?->id,
                'file_path'      => 'submissions/pweb/login_bella.zip',
                'file_name'      => 'login_bella.zip',
                'file_type'      => 'application/zip',
                'file_size'      => 312000,
                'submitted_at'   => '2026-02-28 20:15:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 92,
                'catatan_siswa'  => 'Saya tambahkan animasi CSS untuk efek hover',
                'catatan_guru'   => 'Sangat kreatif, animasi CSS menambah nilai estetika',
                'tanggal_dinilai'=> '2026-03-02 10:30:00',
            ],
            [
                'tugas_id'       => $tugasLogin?->id,
                'siswa_id'       => $cahya?->id,
                'file_path'      => 'submissions/pweb/login_cahya.zip',
                'file_name'      => 'login_cahya.zip',
                'file_type'      => 'application/zip',
                'file_size'      => 198000,
                'submitted_at'   => '2026-03-01 08:00:00',
                'status'         => 'Terlambat',
                'nilai'          => 75,
                'catatan_siswa'  => 'Maaf terlambat, ada kendala teknis',
                'catatan_guru'   => 'Pengurangan nilai karena terlambat, namun kualitas cukup baik',
                'tanggal_dinilai'=> '2026-03-03 09:00:00',
            ],
            [
                'tugas_id'       => $tugasLogin?->id,
                'siswa_id'       => $dina?->id,
                'file_path'      => 'submissions/pweb/login_dina.zip',
                'file_name'      => 'login_dina.zip',
                'file_type'      => 'application/zip',
                'file_size'      => 276000,
                'submitted_at'   => '2026-02-26 16:45:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 90,
                'catatan_siswa'  => null,
                'catatan_guru'   => 'Desain bersih dan profesional',
                'tanggal_dinilai'=> '2026-03-02 11:00:00',
            ],
            [
                'tugas_id'       => $tugasLogin?->id,
                'siswa_id'       => $eko?->id,
                'file_path'      => 'submissions/pweb/login_eko.zip',
                'file_name'      => 'login_eko.zip',
                'file_type'      => 'application/zip',
                'file_size'      => 189000,
                'submitted_at'   => '2026-02-28 22:30:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 82,
                'catatan_siswa'  => 'Sudah saya coba di berbagai browser',
                'catatan_guru'   => 'Cross-browser compatibility bagus',
                'tanggal_dinilai'=> '2026-03-02 14:00:00',
            ],

            // Tugas Flexbox - XI RPL 1 (andi, bella, dina) - belum semua dinilai
            [
                'tugas_id'       => $tugasFlex?->id,
                'siswa_id'       => $andi?->id,
                'file_path'      => 'submissions/pweb/flex_andi.zip',
                'file_name'      => 'flex_andi.zip',
                'file_type'      => 'application/zip',
                'file_size'      => 320000,
                'submitted_at'   => '2026-03-14 19:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => null,
                'catatan_siswa'  => 'Sudah saya test di mobile dan desktop',
                'catatan_guru'   => null,
                'tanggal_dinilai'=> null,
            ],
            [
                'tugas_id'       => $tugasFlex?->id,
                'siswa_id'       => $bella?->id,
                'file_path'      => 'submissions/pweb/flex_bella.zip',
                'file_name'      => 'flex_bella.zip',
                'file_type'      => 'application/zip',
                'file_size'      => 415000,
                'submitted_at'   => '2026-03-15 10:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => null,
                'catatan_siswa'  => null,
                'catatan_guru'   => null,
                'tanggal_dinilai'=> null,
            ],

            // Tugas Normalisasi BDT - XI RPL 1 (andi, bella, cahya, dina, eko)
            [
                'tugas_id'       => $tugasNorm?->id,
                'siswa_id'       => $andi?->id,
                'file_path'      => 'submissions/bdt/norm_andi.pdf',
                'file_name'      => 'norm_andi.pdf',
                'file_type'      => 'application/pdf',
                'file_size'      => 512000,
                'submitted_at'   => '2026-03-09 15:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 85,
                'catatan_siswa'  => 'Saya sertakan ERD menggunakan draw.io',
                'catatan_guru'   => 'ERD sudah benar, normalisasi 3NF tepat',
                'tanggal_dinilai'=> '2026-03-12 09:00:00',
            ],
            [
                'tugas_id'       => $tugasNorm?->id,
                'siswa_id'       => $bella?->id,
                'file_path'      => 'submissions/bdt/norm_bella.pdf',
                'file_name'      => 'norm_bella.pdf',
                'file_type'      => 'application/pdf',
                'file_size'      => 634000,
                'submitted_at'   => '2026-03-10 08:30:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 91,
                'catatan_siswa'  => null,
                'catatan_guru'   => 'Penjelasan sangat detail dan mudah dipahami',
                'tanggal_dinilai'=> '2026-03-12 10:00:00',
            ],
            [
                'tugas_id'       => $tugasNorm?->id,
                'siswa_id'       => $eko?->id,
                'file_path'      => 'submissions/bdt/norm_eko.pdf',
                'file_name'      => 'norm_eko.pdf',
                'file_type'      => 'application/pdf',
                'file_size'      => 445000,
                'submitted_at'   => '2026-03-08 20:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 78,
                'catatan_siswa'  => null,
                'catatan_guru'   => 'Normalisasi sudah benar namun ERD kurang lengkap',
                'tanggal_dinilai'=> '2026-03-12 11:00:00',
            ],

            // Tugas Query SQL BDT - XI RPL 2 (fitri, gilang)
            [
                'tugas_id'       => $tugasQuery?->id,
                'siswa_id'       => $fitri?->id,
                'file_path'      => 'submissions/bdt/query_fitri.sql',
                'file_name'      => 'query_fitri.sql',
                'file_type'      => 'text/plain',
                'file_size'      => 8192,
                'submitted_at'   => '2026-03-19 21:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 87,
                'catatan_siswa'  => 'Semua 15 soal sudah dikerjakan',
                'catatan_guru'   => '13 dari 15 soal benar, 2 soal subquery kurang tepat',
                'tanggal_dinilai'=> '2026-03-22 09:00:00',
            ],
            [
                'tugas_id'       => $tugasQuery?->id,
                'siswa_id'       => $gilang?->id,
                'file_path'      => 'submissions/bdt/query_gilang.sql',
                'file_name'      => 'query_gilang.sql',
                'file_type'      => 'text/plain',
                'file_size'      => 7680,
                'submitted_at'   => '2026-03-21 10:00:00',
                'status'         => 'Terlambat',
                'nilai'          => 70,
                'catatan_siswa'  => 'Maaf terlambat 1 hari',
                'catatan_guru'   => 'Pengurangan 10 poin karena terlambat',
                'tanggal_dinilai'=> '2026-03-22 10:00:00',
            ],

            // Tugas OOP PBO - XI RPL 2 (fitri, gilang)
            [
                'tugas_id'       => $tugasOOP?->id,
                'siswa_id'       => $fitri?->id,
                'file_path'      => 'submissions/pbo/oop_fitri.zip',
                'file_name'      => 'oop_fitri.zip',
                'file_type'      => 'application/zip',
                'file_size'      => 156000,
                'submitted_at'   => '2026-02-24 18:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 93,
                'catatan_siswa'  => 'Saya tambahkan interface dan abstract class',
                'catatan_guru'   => 'Implementasi OOP sangat baik, penggunaan interface tepat',
                'tanggal_dinilai'=> '2026-02-27 09:00:00',
            ],
            [
                'tugas_id'       => $tugasOOP?->id,
                'siswa_id'       => $gilang?->id,
                'file_path'      => 'submissions/pbo/oop_gilang.zip',
                'file_name'      => 'oop_gilang.zip',
                'file_type'      => 'application/zip',
                'file_size'      => 134000,
                'submitted_at'   => '2026-02-25 09:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 80,
                'catatan_siswa'  => null,
                'catatan_guru'   => 'Polymorphism sudah benar, perlu perbaikan pada encapsulation',
                'tanggal_dinilai'=> '2026-02-27 10:00:00',
            ],

            // Tugas SRS PPL - XII RPL 1 (hana, ivan)
            [
                'tugas_id'       => $tugasSRS?->id,
                'siswa_id'       => $hana?->id,
                'file_path'      => 'submissions/ppl/srs_hana.docx',
                'file_name'      => 'srs_hana.docx',
                'file_type'      => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'file_size'      => 892000,
                'submitted_at'   => '2026-03-04 20:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 89,
                'catatan_siswa'  => 'Dokumen SRS untuk aplikasi manajemen kos',
                'catatan_guru'   => 'Dokumen lengkap dan terstruktur dengan baik',
                'tanggal_dinilai'=> '2026-03-07 09:00:00',
            ],
            [
                'tugas_id'       => $tugasSRS?->id,
                'siswa_id'       => $ivan?->id,
                'file_path'      => 'submissions/ppl/srs_ivan.docx',
                'file_name'      => 'srs_ivan.docx',
                'file_type'      => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'file_size'      => 756000,
                'submitted_at'   => '2026-03-05 07:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => null,
                'catatan_siswa'  => 'SRS untuk aplikasi e-commerce UMKM',
                'catatan_guru'   => null,
                'tanggal_dinilai'=> null,
            ],

            // Tugas Surat BIND - XI RPL 1 (andi, bella, cahya, dina, eko)
            [
                'tugas_id'       => $tugasSurat?->id,
                'siswa_id'       => $andi?->id,
                'file_path'      => 'submissions/bind/surat_andi.docx',
                'file_name'      => 'surat_andi.docx',
                'file_type'      => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'file_size'      => 45000,
                'submitted_at'   => '2026-02-28 14:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 86,
                'catatan_siswa'  => null,
                'catatan_guru'   => 'Bahasa formal dan struktur surat sudah benar',
                'tanggal_dinilai'=> '2026-03-03 09:00:00',
            ],
            [
                'tugas_id'       => $tugasSurat?->id,
                'siswa_id'       => $bella?->id,
                'file_path'      => 'submissions/bind/surat_bella.docx',
                'file_name'      => 'surat_bella.docx',
                'file_type'      => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'file_size'      => 52000,
                'submitted_at'   => '2026-03-01 10:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 94,
                'catatan_siswa'  => 'Saya perhatikan EYD dengan seksama',
                'catatan_guru'   => 'Penulisan sangat baik, EYD tepat, isi meyakinkan',
                'tanggal_dinilai'=> '2026-03-03 10:00:00',
            ],
            [
                'tugas_id'       => $tugasSurat?->id,
                'siswa_id'       => $dina?->id,
                'file_path'      => 'submissions/bind/surat_dina.docx',
                'file_name'      => 'surat_dina.docx',
                'file_type'      => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'file_size'      => 48000,
                'submitted_at'   => '2026-02-27 16:00:00',
                'status'         => 'Tepat Waktu',
                'nilai'          => 88,
                'catatan_siswa'  => null,
                'catatan_guru'   => 'Surat profesional dan menarik',
                'tanggal_dinilai'=> '2026-03-03 11:00:00',
            ],
        ];

        foreach ($pengumpulan as $data) {
            if ($data['tugas_id'] && $data['siswa_id']) {
                PengumpulanTugas::firstOrCreate(
                    [
                        'tugas_id' => $data['tugas_id'],
                        'siswa_id' => $data['siswa_id'],
                    ],
                    $data
                );
            }
        }
    }
}
