<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\User;
use App\Models\JadwalMengajar;
use Illuminate\Database\Seeder;

class JadwalMengajarSeeder extends Seeder
{
    public function run(): void
    {
        $tahunAjaran = '2025/2026';
        $semester    = 'Genap';

        // Ambil guru
        $budi   = User::where('email', 'budi.santoso@sekolah.sch.id')->first();
        $siti   = User::where('email', 'siti.rahayu@sekolah.sch.id')->first();
        $ahmad  = User::where('email', 'ahmad.fauzi@sekolah.sch.id')->first();
        $dewi   = User::where('email', 'dewi.lestari@sekolah.sch.id')->first();

        // Ambil kelas
        $kelasXIRPL1  = Kelas::where('nama', 'XI RPL 1')->first();
        $kelasXIRPL2  = Kelas::where('nama', 'XI RPL 2')->first();
        $kelasXIIRPL1 = Kelas::where('nama', 'XII RPL 1')->first();

        // Ambil mapel
        $pweb  = MataPelajaran::where('kode', 'PWEB')->first();
        $bdt   = MataPelajaran::where('kode', 'BDT')->first();
        $pbo   = MataPelajaran::where('kode', 'PBO')->first();
        $algo  = MataPelajaran::where('kode', 'ALGO')->first();
        $ppl   = MataPelajaran::where('kode', 'PPL')->first();

        $jadwalList = [
            // Budi — Pemrograman Web
            ['guru_id' => $budi?->id, 'mata_pelajaran_id' => $pweb?->id, 'kelas_id' => $kelasXIRPL1?->id,  'hari' => 'Senin',  'jam_mulai' => '07:00', 'jam_selesai' => '08:30', 'ruangan' => 'Lab RPL 1'],
            ['guru_id' => $budi?->id, 'mata_pelajaran_id' => $pweb?->id, 'kelas_id' => $kelasXIRPL2?->id,  'hari' => 'Selasa', 'jam_mulai' => '07:00', 'jam_selesai' => '08:30', 'ruangan' => 'Lab RPL 2'],

            // Ahmad — Basis Data
            ['guru_id' => $ahmad?->id, 'mata_pelajaran_id' => $bdt?->id, 'kelas_id' => $kelasXIRPL1?->id,  'hari' => 'Rabu',   'jam_mulai' => '07:00', 'jam_selesai' => '08:30', 'ruangan' => 'Lab RPL 1'],
            ['guru_id' => $ahmad?->id, 'mata_pelajaran_id' => $bdt?->id, 'kelas_id' => $kelasXIRPL2?->id,  'hari' => 'Kamis',  'jam_mulai' => '07:00', 'jam_selesai' => '08:30', 'ruangan' => 'Lab RPL 2'],

            // Dewi — PBO
            ['guru_id' => $dewi?->id, 'mata_pelajaran_id' => $pbo?->id,  'kelas_id' => $kelasXIRPL1?->id,  'hari' => 'Jumat',  'jam_mulai' => '07:00', 'jam_selesai' => '08:30', 'ruangan' => 'Lab RPL 1'],

            // Ahmad — PPL (kelas XII)
            ['guru_id' => $ahmad?->id, 'mata_pelajaran_id' => $ppl?->id, 'kelas_id' => $kelasXIIRPL1?->id, 'hari' => 'Senin',  'jam_mulai' => '09:00', 'jam_selesai' => '11:30', 'ruangan' => 'Lab RPL 1'],
            ['guru_id' => $ahmad?->id, 'mata_pelajaran_id' => $ppl?->id, 'kelas_id' => $kelasXIIRPL1?->id, 'hari' => 'Rabu',   'jam_mulai' => '09:00', 'jam_selesai' => '11:30', 'ruangan' => 'Lab RPL 1'],
        ];

        foreach ($jadwalList as $j) {
            // Skip jika ada data null (guru/mapel/kelas belum di-seed)
            if (array_search(null, $j, true) !== false) continue;

            JadwalMengajar::firstOrCreate(
                [
                    'guru_id'           => $j['guru_id'],
                    'mata_pelajaran_id' => $j['mata_pelajaran_id'],
                    'kelas_id'          => $j['kelas_id'],
                    'hari'              => $j['hari'],
                    'semester'          => $semester,
                    'tahun_ajaran'      => $tahunAjaran,
                ],
                array_merge($j, [
                    'semester'     => $semester,
                    'tahun_ajaran' => $tahunAjaran,
                    'aktif'        => true,
                ])
            );
        }
    }
}
