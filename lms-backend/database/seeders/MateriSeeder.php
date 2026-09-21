<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Materi;
use App\Models\User;
use Illuminate\Database\Seeder;

class MateriSeeder extends Seeder
{
    public function run(): void
    {
        $semester    = 'Genap';
        $tahunAjaran = '2025/2026';

        // Ambil guru
        $budi  = User::where('email', 'budi.santoso@sekolah.sch.id')->first();
        $ahmad = User::where('email', 'ahmad.fauzi@sekolah.sch.id')->first();
        $dewi  = User::where('email', 'dewi.lestari@sekolah.sch.id')->first();
        $siti  = User::where('email', 'siti.rahayu@sekolah.sch.id')->first();

        // Ambil kelas
        $kelasXIRPL1  = Kelas::where('nama', 'XI RPL 1')->first();
        $kelasXIRPL2  = Kelas::where('nama', 'XI RPL 2')->first();
        $kelasXIIRPL1 = Kelas::where('nama', 'XII RPL 1')->first();

        // Ambil mapel
        $pweb = MataPelajaran::where('kode', 'PWEB')->first();
        $bdt  = MataPelajaran::where('kode', 'BDT')->first();
        $pbo  = MataPelajaran::where('kode', 'PBO')->first();
        $ppl  = MataPelajaran::where('kode', 'PPL')->first();
        $bind = MataPelajaran::where('kode', 'BIND')->first();

        $materiList = [
            // ── Pemrograman Web (Budi – XI RPL 1) ──────────────────────────
            [
                'guru_id'           => $budi?->id,
                'mata_pelajaran_id' => $pweb?->id,
                'kelas_id'          => $kelasXIRPL1?->id,
                'judul'             => 'Pengenalan HTML5 & Struktur Dasar Web',
                'deskripsi'         => 'Materi ini membahas struktur dasar dokumen HTML5, elemen semantik, dan cara membuat halaman web sederhana.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-10',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 42,
            ],
            [
                'guru_id'           => $budi?->id,
                'mata_pelajaran_id' => $pweb?->id,
                'kelas_id'          => $kelasXIRPL1?->id,
                'judul'             => 'CSS3 Flexbox & Grid Layout',
                'deskripsi'         => 'Penjelasan mendalam tentang Flexbox dan CSS Grid untuk membuat layout halaman web yang responsif dan modern.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-17',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 38,
            ],
            [
                'guru_id'           => $budi?->id,
                'mata_pelajaran_id' => $pweb?->id,
                'kelas_id'          => $kelasXIRPL1?->id,
                'judul'             => 'JavaScript ES6+ dan DOM Manipulation',
                'deskripsi'         => 'Materi tentang fitur modern JavaScript (arrow function, destructuring, async/await) dan cara memanipulasi DOM secara dinamis.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-03-03',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 55,
            ],
            [
                'guru_id'           => $budi?->id,
                'mata_pelajaran_id' => $pweb?->id,
                'kelas_id'          => $kelasXIRPL2?->id,
                'judul'             => 'Pengenalan HTML5 & Struktur Dasar Web',
                'deskripsi'         => 'Materi ini membahas struktur dasar dokumen HTML5, elemen semantik, dan cara membuat halaman web sederhana.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-11',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 30,
            ],
            [
                'guru_id'           => $budi?->id,
                'mata_pelajaran_id' => $pweb?->id,
                'kelas_id'          => $kelasXIRPL2?->id,
                'judul'             => 'CSS3 Flexbox & Grid Layout',
                'deskripsi'         => 'Penjelasan mendalam tentang Flexbox dan CSS Grid untuk membuat layout halaman web yang responsif dan modern.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-18',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 25,
            ],

            // ── Basis Data (Ahmad – XI RPL 1) ───────────────────────────────
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $bdt?->id,
                'kelas_id'          => $kelasXIRPL1?->id,
                'judul'             => 'Konsep Dasar Basis Data & ERD',
                'deskripsi'         => 'Pengenalan konsep basis data relasional, Entity Relationship Diagram (ERD), dan normalisasi tabel.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-12',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 60,
            ],
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $bdt?->id,
                'kelas_id'          => $kelasXIRPL1?->id,
                'judul'             => 'SQL Dasar: DDL & DML',
                'deskripsi'         => 'Perintah SQL untuk membuat tabel (CREATE, ALTER, DROP) dan memanipulasi data (INSERT, UPDATE, DELETE, SELECT).',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-19',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 72,
            ],
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $bdt?->id,
                'kelas_id'          => $kelasXIRPL1?->id,
                'judul'             => 'JOIN, Subquery & Agregasi Data',
                'deskripsi'         => 'Teknik lanjutan SQL: INNER JOIN, LEFT JOIN, subquery, GROUP BY, HAVING, dan fungsi agregasi (COUNT, SUM, AVG).',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-03-05',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 48,
            ],
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $bdt?->id,
                'kelas_id'          => $kelasXIRPL2?->id,
                'judul'             => 'Konsep Dasar Basis Data & ERD',
                'deskripsi'         => 'Pengenalan konsep basis data relasional, Entity Relationship Diagram (ERD), dan normalisasi tabel.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-13',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 35,
            ],

            // ── PBO (Dewi – XI RPL 1) ────────────────────────────────────────
            [
                'guru_id'           => $dewi?->id,
                'mata_pelajaran_id' => $pbo?->id,
                'kelas_id'          => $kelasXIRPL1?->id,
                'judul'             => 'Konsep OOP: Class, Object & Encapsulation',
                'deskripsi'         => 'Pengenalan paradigma pemrograman berorientasi objek: class, object, atribut, method, dan enkapsulasi data.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-14',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 50,
            ],
            [
                'guru_id'           => $dewi?->id,
                'mata_pelajaran_id' => $pbo?->id,
                'kelas_id'          => $kelasXIRPL1?->id,
                'judul'             => 'Inheritance & Polymorphism',
                'deskripsi'         => 'Konsep pewarisan (inheritance) dan polimorfisme dalam OOP beserta implementasinya menggunakan Java/Python.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-03-07',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 44,
            ],

            // ── PPL (Ahmad – XII RPL 1) ──────────────────────────────────────
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $ppl?->id,
                'kelas_id'          => $kelasXIIRPL1?->id,
                'judul'             => 'Software Development Life Cycle (SDLC)',
                'deskripsi'         => 'Penjelasan tahapan SDLC: Perencanaan, Analisis, Desain, Implementasi, Testing, dan Maintenance.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-09',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 80,
            ],
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $ppl?->id,
                'kelas_id'          => $kelasXIIRPL1?->id,
                'judul'             => 'Agile & Scrum Framework',
                'deskripsi'         => 'Metodologi pengembangan perangkat lunak Agile dan implementasi Scrum: Sprint, Backlog, Daily Standup.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-23',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 65,
            ],
            [
                'guru_id'           => $ahmad?->id,
                'mata_pelajaran_id' => $ppl?->id,
                'kelas_id'          => $kelasXIIRPL1?->id,
                'judul'             => 'Dokumentasi Teknis & Use Case Diagram',
                'deskripsi'         => 'Cara membuat dokumentasi teknis proyek perangkat lunak: SRS, Use Case Diagram, Activity Diagram.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-03-09',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 58,
            ],

            // ── Bahasa Indonesia (Siti – XI RPL 1) ──────────────────────────
            [
                'guru_id'           => $siti?->id,
                'mata_pelajaran_id' => $bind?->id,
                'kelas_id'          => $kelasXIRPL1?->id,
                'judul'             => 'Teks Laporan Hasil Observasi',
                'deskripsi'         => 'Struktur, ciri kebahasaan, dan cara menyusun teks laporan hasil observasi yang baik dan benar.',
                'file_path'         => null,
                'file_name'         => null,
                'file_type'         => null,
                'file_size'         => null,
                'tanggal_upload'    => '2026-02-16',
                'semester'          => $semester,
                'tahun_ajaran'      => $tahunAjaran,
                'views'             => 28,
            ],
        ];

        foreach ($materiList as $m) {
            if (!$m['guru_id'] || !$m['mata_pelajaran_id'] || !$m['kelas_id']) continue;
            Materi::firstOrCreate(
                [
                    'guru_id'           => $m['guru_id'],
                    'mata_pelajaran_id' => $m['mata_pelajaran_id'],
                    'kelas_id'          => $m['kelas_id'],
                    'judul'             => $m['judul'],
                ],
                $m
            );
        }
    }
}
