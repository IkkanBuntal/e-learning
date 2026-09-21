<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Nilai;
use App\Models\User;
use App\Models\MataPelajaran;

class NilaiSeeder extends Seeder
{
    public function run(): void
    {
        // Siswa XI RPL 1
        $andi  = User::where('email', 'andi.pratama@siswa.sch.id')->first();
        $bella = User::where('email', 'bella.safitri@siswa.sch.id')->first();
        $cahya = User::where('email', 'cahya.ramadhan@siswa.sch.id')->first();
        $dina  = User::where('email', 'dina.kusumawati@siswa.sch.id')->first();
        $eko   = User::where('email', 'eko.prasetyo@siswa.sch.id')->first();

        // Siswa XI RPL 2
        $fitri  = User::where('email', 'fitri.handayani@siswa.sch.id')->first();
        $gilang = User::where('email', 'gilang.nugroho@siswa.sch.id')->first();

        // Siswa XII RPL 1
        $hana = User::where('email', 'hana.permata@siswa.sch.id')->first();
        $ivan = User::where('email', 'ivan.setiawan@siswa.sch.id')->first();

        // Guru
        $budi  = User::where('email', 'budi.santoso@sekolah.sch.id')->first();
        $ahmad = User::where('email', 'ahmad.fauzi@sekolah.sch.id')->first();
        $dewi  = User::where('email', 'dewi.lestari@sekolah.sch.id')->first();
        $siti  = User::where('email', 'siti.rahayu@sekolah.sch.id')->first();

        // Mata Pelajaran
        $pweb = MataPelajaran::where('kode', 'PWEB')->first();
        $bdt  = MataPelajaran::where('kode', 'BDT')->first();
        $pbo  = MataPelajaran::where('kode', 'PBO')->first();
        $ppl  = MataPelajaran::where('kode', 'PPL')->first();
        $bind = MataPelajaran::where('kode', 'BIND')->first();

        $nilaiData = [
            // ===== XI RPL 1 - PWEB (Budi) =====
            // Andi
            ['siswa_id' => $andi?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'Tugas', 'nilai' => 88, 'keterangan' => 'Tugas Halaman Login', 'tanggal' => '2026-03-02', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $andi?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'Quiz', 'nilai' => 80, 'keterangan' => 'Quiz HTML & CSS Dasar', 'tanggal' => '2026-02-10', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $andi?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'UTS', 'nilai' => 82, 'keterangan' => null, 'tanggal' => '2026-03-25', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            // Bella
            ['siswa_id' => $bella?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'Tugas', 'nilai' => 92, 'keterangan' => 'Tugas Halaman Login', 'tanggal' => '2026-03-02', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $bella?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'Quiz', 'nilai' => 90, 'keterangan' => 'Quiz HTML & CSS Dasar', 'tanggal' => '2026-02-10', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $bella?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'UTS', 'nilai' => 91, 'keterangan' => null, 'tanggal' => '2026-03-25', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            // Cahya
            ['siswa_id' => $cahya?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'Tugas', 'nilai' => 75, 'keterangan' => 'Tugas Halaman Login (terlambat)', 'tanggal' => '2026-03-03', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $cahya?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'Quiz', 'nilai' => 72, 'keterangan' => 'Quiz HTML & CSS Dasar', 'tanggal' => '2026-02-10', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $cahya?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'UTS', 'nilai' => 74, 'keterangan' => null, 'tanggal' => '2026-03-25', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            // Dina
            ['siswa_id' => $dina?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'Tugas', 'nilai' => 90, 'keterangan' => 'Tugas Halaman Login', 'tanggal' => '2026-03-02', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $dina?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'Quiz', 'nilai' => 85, 'keterangan' => 'Quiz HTML & CSS Dasar', 'tanggal' => '2026-02-10', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $dina?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'UTS', 'nilai' => 88, 'keterangan' => null, 'tanggal' => '2026-03-25', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            // Eko
            ['siswa_id' => $eko?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'Tugas', 'nilai' => 82, 'keterangan' => 'Tugas Halaman Login', 'tanggal' => '2026-03-02', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $eko?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'Quiz', 'nilai' => 78, 'keterangan' => 'Quiz HTML & CSS Dasar', 'tanggal' => '2026-02-10', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $eko?->id, 'mata_pelajaran_id' => $pweb?->id, 'guru_id' => $budi?->id, 'jenis' => 'UTS', 'nilai' => 80, 'keterangan' => null, 'tanggal' => '2026-03-25', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],

            // ===== XI RPL 1 - BDT (Ahmad) =====
            ['siswa_id' => $andi?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Tugas', 'nilai' => 85, 'keterangan' => 'Normalisasi Database', 'tanggal' => '2026-03-12', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $andi?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Praktik', 'nilai' => 83, 'keterangan' => 'Praktik Query MySQL', 'tanggal' => '2026-02-20', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $andi?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'UTS', 'nilai' => 79, 'keterangan' => null, 'tanggal' => '2026-03-26', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $bella?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Tugas', 'nilai' => 91, 'keterangan' => 'Normalisasi Database', 'tanggal' => '2026-03-12', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $bella?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Praktik', 'nilai' => 89, 'keterangan' => 'Praktik Query MySQL', 'tanggal' => '2026-02-20', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $bella?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'UTS', 'nilai' => 88, 'keterangan' => null, 'tanggal' => '2026-03-26', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $eko?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Tugas', 'nilai' => 78, 'keterangan' => 'Normalisasi Database', 'tanggal' => '2026-03-12', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $eko?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'UTS', 'nilai' => 76, 'keterangan' => null, 'tanggal' => '2026-03-26', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],

            // ===== XI RPL 1 - BIND (Siti) =====
            ['siswa_id' => $andi?->id, 'mata_pelajaran_id' => $bind?->id, 'guru_id' => $siti?->id, 'jenis' => 'Tugas', 'nilai' => 86, 'keterangan' => 'Surat Lamaran Kerja', 'tanggal' => '2026-03-03', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $andi?->id, 'mata_pelajaran_id' => $bind?->id, 'guru_id' => $siti?->id, 'jenis' => 'UTS', 'nilai' => 84, 'keterangan' => null, 'tanggal' => '2026-03-27', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $bella?->id, 'mata_pelajaran_id' => $bind?->id, 'guru_id' => $siti?->id, 'jenis' => 'Tugas', 'nilai' => 94, 'keterangan' => 'Surat Lamaran Kerja', 'tanggal' => '2026-03-03', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $bella?->id, 'mata_pelajaran_id' => $bind?->id, 'guru_id' => $siti?->id, 'jenis' => 'UTS', 'nilai' => 92, 'keterangan' => null, 'tanggal' => '2026-03-27', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $dina?->id, 'mata_pelajaran_id' => $bind?->id, 'guru_id' => $siti?->id, 'jenis' => 'Tugas', 'nilai' => 88, 'keterangan' => 'Surat Lamaran Kerja', 'tanggal' => '2026-03-03', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $dina?->id, 'mata_pelajaran_id' => $bind?->id, 'guru_id' => $siti?->id, 'jenis' => 'UTS', 'nilai' => 87, 'keterangan' => null, 'tanggal' => '2026-03-27', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],

            // ===== XI RPL 2 - BDT (Ahmad) =====
            ['siswa_id' => $fitri?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Tugas', 'nilai' => 87, 'keterangan' => 'Query SQL Lanjutan', 'tanggal' => '2026-03-22', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $fitri?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Praktik', 'nilai' => 85, 'keterangan' => 'Praktik Query MySQL', 'tanggal' => '2026-02-21', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $fitri?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'UTS', 'nilai' => 86, 'keterangan' => null, 'tanggal' => '2026-03-26', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $gilang?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Tugas', 'nilai' => 70, 'keterangan' => 'Query SQL Lanjutan (terlambat)', 'tanggal' => '2026-03-22', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $gilang?->id, 'mata_pelajaran_id' => $bdt?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'UTS', 'nilai' => 73, 'keterangan' => null, 'tanggal' => '2026-03-26', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],

            // ===== XI RPL 2 - PBO (Dewi) =====
            ['siswa_id' => $fitri?->id, 'mata_pelajaran_id' => $pbo?->id, 'guru_id' => $dewi?->id, 'jenis' => 'Tugas', 'nilai' => 93, 'keterangan' => 'OOP Inheritance & Polymorphism', 'tanggal' => '2026-02-27', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $fitri?->id, 'mata_pelajaran_id' => $pbo?->id, 'guru_id' => $dewi?->id, 'jenis' => 'Quiz', 'nilai' => 90, 'keterangan' => 'Quiz OOP Dasar', 'tanggal' => '2026-02-05', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $fitri?->id, 'mata_pelajaran_id' => $pbo?->id, 'guru_id' => $dewi?->id, 'jenis' => 'UTS', 'nilai' => 91, 'keterangan' => null, 'tanggal' => '2026-03-28', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $gilang?->id, 'mata_pelajaran_id' => $pbo?->id, 'guru_id' => $dewi?->id, 'jenis' => 'Tugas', 'nilai' => 80, 'keterangan' => 'OOP Inheritance & Polymorphism', 'tanggal' => '2026-02-27', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $gilang?->id, 'mata_pelajaran_id' => $pbo?->id, 'guru_id' => $dewi?->id, 'jenis' => 'Quiz', 'nilai' => 75, 'keterangan' => 'Quiz OOP Dasar', 'tanggal' => '2026-02-05', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $gilang?->id, 'mata_pelajaran_id' => $pbo?->id, 'guru_id' => $dewi?->id, 'jenis' => 'UTS', 'nilai' => 77, 'keterangan' => null, 'tanggal' => '2026-03-28', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],

            // ===== XII RPL 1 - PPL (Ahmad) =====
            ['siswa_id' => $hana?->id, 'mata_pelajaran_id' => $ppl?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Tugas', 'nilai' => 89, 'keterangan' => 'Dokumen SRS', 'tanggal' => '2026-03-07', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $hana?->id, 'mata_pelajaran_id' => $ppl?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Proyek', 'nilai' => 87, 'keterangan' => 'Proyek Pengembangan Aplikasi Sprint 1', 'tanggal' => '2026-02-28', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $hana?->id, 'mata_pelajaran_id' => $ppl?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'UTS', 'nilai' => 88, 'keterangan' => null, 'tanggal' => '2026-03-29', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $ivan?->id, 'mata_pelajaran_id' => $ppl?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'Proyek', 'nilai' => 82, 'keterangan' => 'Proyek Pengembangan Aplikasi Sprint 1', 'tanggal' => '2026-02-28', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
            ['siswa_id' => $ivan?->id, 'mata_pelajaran_id' => $ppl?->id, 'guru_id' => $ahmad?->id, 'jenis' => 'UTS', 'nilai' => 84, 'keterangan' => null, 'tanggal' => '2026-03-29', 'semester' => 'Genap', 'tahun_ajaran' => '2025/2026'],
        ];

        foreach ($nilaiData as $data) {
            if ($data['siswa_id'] && $data['mata_pelajaran_id'] && $data['guru_id']) {
                Nilai::firstOrCreate(
                    [
                        'siswa_id'          => $data['siswa_id'],
                        'mata_pelajaran_id' => $data['mata_pelajaran_id'],
                        'guru_id'           => $data['guru_id'],
                        'jenis'             => $data['jenis'],
                        'tanggal'           => $data['tanggal'],
                    ],
                    $data
                );
            }
        }
    }
}
