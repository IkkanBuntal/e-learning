<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Absensi;
use App\Models\User;
use App\Models\Kelas;
use App\Models\MataPelajaran;

class AbsensiSeeder extends Seeder
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

        // Kelas
        $xi_rpl1  = Kelas::where('nama', 'XI RPL 1')->first();
        $xi_rpl2  = Kelas::where('nama', 'XI RPL 2')->first();
        $xii_rpl1 = Kelas::where('nama', 'XII RPL 1')->first();

        // Mata Pelajaran
        $pweb = MataPelajaran::where('kode', 'PWEB')->first();
        $bdt  = MataPelajaran::where('kode', 'BDT')->first();
        $pbo  = MataPelajaran::where('kode', 'PBO')->first();
        $ppl  = MataPelajaran::where('kode', 'PPL')->first();
        $bind = MataPelajaran::where('kode', 'BIND')->first();

        // Tanggal pertemuan
        $pwebDates = [
            '2026-02-02', '2026-02-04', '2026-02-09', '2026-02-11',
            '2026-02-16', '2026-02-18', '2026-02-23', '2026-02-25',
            '2026-03-02', '2026-03-04', '2026-03-09', '2026-03-11',
            '2026-03-16', '2026-03-18', '2026-03-23', '2026-03-25',
        ];

        $bdtDates = [
            '2026-02-03', '2026-02-05', '2026-02-10', '2026-02-12',
            '2026-02-17', '2026-02-19', '2026-02-24', '2026-02-26',
            '2026-03-03', '2026-03-05', '2026-03-10', '2026-03-12',
            '2026-03-17', '2026-03-19', '2026-03-24', '2026-03-26',
        ];

        $bindDates = [
            '2026-02-06', '2026-02-13', '2026-02-20', '2026-02-27',
            '2026-03-06', '2026-03-13', '2026-03-20', '2026-03-27',
        ];

        $absensiData = [];

        // Helper closure untuk generate absensi
        $generate = function ($siswa, $kelas, $mapel, $guru, $dates, $statuses) use (&$absensiData) {
            if (!$siswa || !$kelas || !$mapel || !$guru) return;
            foreach ($dates as $i => $tanggal) {
                $status = $statuses[$i] ?? 'hadir';
                $absensiData[] = [
                    'siswa_id'          => $siswa->id,
                    'kelas_id'          => $kelas->id,
                    'mata_pelajaran_id' => $mapel->id,
                    'guru_id'           => $guru->id,
                    'tanggal'           => $tanggal,
                    'status'            => $status,
                    'keterangan'        => match ($status) {
                        'sakit' => 'Sakit',
                        'izin'  => 'Izin keperluan keluarga',
                        default => null,
                    },
                    'semester'     => 'Genap',
                    'tahun_ajaran' => '2025/2026',
                ];
            }
        };

        // ===== XI RPL 1 - PWEB (Budi) =====
        $generate($andi,  $xi_rpl1, $pweb, $budi, $pwebDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($bella, $xi_rpl1, $pweb, $budi, $pwebDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($cahya, $xi_rpl1, $pweb, $budi, $pwebDates, ['hadir','hadir','sakit','hadir','hadir','hadir','izin', 'hadir','hadir','hadir','hadir','hadir','hadir','alpha','hadir','hadir']);
        $generate($dina,  $xi_rpl1, $pweb, $budi, $pwebDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($eko,   $xi_rpl1, $pweb, $budi, $pwebDates, ['hadir','hadir','hadir','hadir','sakit','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);

        // ===== XI RPL 1 - BDT (Ahmad) =====
        $generate($andi,  $xi_rpl1, $bdt, $ahmad, $bdtDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($bella, $xi_rpl1, $bdt, $ahmad, $bdtDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($cahya, $xi_rpl1, $bdt, $ahmad, $bdtDates, ['hadir','hadir','hadir','sakit','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','izin', 'hadir','hadir','hadir']);
        $generate($dina,  $xi_rpl1, $bdt, $ahmad, $bdtDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($eko,   $xi_rpl1, $bdt, $ahmad, $bdtDates, ['hadir','hadir','hadir','hadir','hadir','hadir','sakit','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);

        // ===== XI RPL 1 - BIND (Siti) =====
        $generate($andi,  $xi_rpl1, $bind, $siti, $bindDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($bella, $xi_rpl1, $bind, $siti, $bindDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($cahya, $xi_rpl1, $bind, $siti, $bindDates, ['hadir','sakit','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($dina,  $xi_rpl1, $bind, $siti, $bindDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($eko,   $xi_rpl1, $bind, $siti, $bindDates, ['hadir','hadir','hadir','hadir','hadir','alpha','hadir','hadir']);

        // ===== XI RPL 2 - BDT (Ahmad) =====
        $generate($fitri,  $xi_rpl2, $bdt, $ahmad, $bdtDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($gilang, $xi_rpl2, $bdt, $ahmad, $bdtDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','sakit','hadir','hadir','hadir','hadir','hadir','hadir','alpha','hadir']);

        // ===== XI RPL 2 - PBO (Dewi) =====
        $generate($fitri,  $xi_rpl2, $pbo, $dewi, $pwebDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($gilang, $xi_rpl2, $pbo, $dewi, $pwebDates, ['hadir','hadir','hadir','hadir','hadir','izin', 'hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);

        // ===== XII RPL 1 - PPL (Ahmad) =====
        $generate($hana, $xii_rpl1, $ppl, $ahmad, $bdtDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir']);
        $generate($ivan, $xii_rpl1, $ppl, $ahmad, $bdtDates, ['hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','hadir','sakit','hadir','hadir','hadir','hadir','hadir','hadir']);

        // Insert semua data absensi
        foreach ($absensiData as $data) {
            Absensi::firstOrCreate(
                [
                    'siswa_id'          => $data['siswa_id'],
                    'mata_pelajaran_id' => $data['mata_pelajaran_id'],
                    'tanggal'           => $data['tanggal'],
                ],
                $data
            );
        }
    }
}
