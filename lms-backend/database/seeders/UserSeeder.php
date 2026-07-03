<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole  = Role::where('nama', 'admin')->first();
        $guruRole   = Role::where('nama', 'guru')->first();
        $siswaRole  = Role::where('nama', 'siswa')->first();

        $kelasXIRPL1  = Kelas::where('nama', 'XI RPL 1')->first();
        $kelasXIRPL2  = Kelas::where('nama', 'XI RPL 2')->first();
        $kelasXIIRPL1 = Kelas::where('nama', 'XII RPL 1')->first();
        $kelasXTKJ1   = Kelas::where('nama', 'X TKJ 1')->first();

        // ---- Admin ----
        User::firstOrCreate(
            ['email' => 'admin@sekolah.sch.id'],
            [
                'nama'              => 'Administrator',
                'password'          => Hash::make('password'),
                'role_id'           => $adminRole->id,
                'kelas_id'          => null,
                'aktif'             => true,
                'email_verified_at' => now(),
            ]
        );

        // ---- Guru ----
        $guruList = [
            [
                'nama'  => 'Budi Santoso, S.Kom',
                'email' => 'budi.santoso@sekolah.sch.id',
                'nip'   => '197501012000031001',
            ],
            [
                'nama'  => 'Siti Rahayu, S.Pd',
                'email' => 'siti.rahayu@sekolah.sch.id',
                'nip'   => '198003152005012002',
            ],
            [
                'nama'  => 'Ahmad Fauzi, M.Kom',
                'email' => 'ahmad.fauzi@sekolah.sch.id',
                'nip'   => '197808202006041003',
            ],
            [
                'nama'  => 'Dewi Lestari, S.T',
                'email' => 'dewi.lestari@sekolah.sch.id',
                'nip'   => '198512102010012004',
            ],
            [
                'nama'  => 'Hendra Wijaya, S.Kom',
                'email' => 'hendra.wijaya@sekolah.sch.id',
                'nip'   => '199001052015031005',
            ],
        ];

        foreach ($guruList as $guru) {
            User::firstOrCreate(
                ['email' => $guru['email']],
                [
                    'nama'              => $guru['nama'],
                    'password'          => Hash::make('password'),
                    'role_id'           => $guruRole->id,
                    'kelas_id'          => null,
                    'nip'               => $guru['nip'],
                    'aktif'             => true,
                    'email_verified_at' => now(),
                ]
            );
        }

        // ---- Siswa ----
        $siswaList = [
            ['nama' => 'Andi Pratama',      'email' => 'andi.pratama@siswa.sch.id',     'nis' => '2024001001', 'kelas_id' => $kelasXIRPL1?->id],
            ['nama' => 'Bella Safitri',     'email' => 'bella.safitri@siswa.sch.id',    'nis' => '2024001002', 'kelas_id' => $kelasXIRPL1?->id],
            ['nama' => 'Cahya Ramadhan',    'email' => 'cahya.ramadhan@siswa.sch.id',   'nis' => '2024001003', 'kelas_id' => $kelasXIRPL1?->id],
            ['nama' => 'Dina Kusumawati',   'email' => 'dina.kusumawati@siswa.sch.id',  'nis' => '2024001004', 'kelas_id' => $kelasXIRPL1?->id],
            ['nama' => 'Eko Prasetyo',      'email' => 'eko.prasetyo@siswa.sch.id',     'nis' => '2024001005', 'kelas_id' => $kelasXIRPL1?->id],
            ['nama' => 'Fitri Handayani',   'email' => 'fitri.handayani@siswa.sch.id',  'nis' => '2024002001', 'kelas_id' => $kelasXIRPL2?->id],
            ['nama' => 'Gilang Nugroho',    'email' => 'gilang.nugroho@siswa.sch.id',   'nis' => '2024002002', 'kelas_id' => $kelasXIRPL2?->id],
            ['nama' => 'Hana Permata',      'email' => 'hana.permata@siswa.sch.id',     'nis' => '2023001001', 'kelas_id' => $kelasXIIRPL1?->id],
            ['nama' => 'Ivan Setiawan',     'email' => 'ivan.setiawan@siswa.sch.id',    'nis' => '2023001002', 'kelas_id' => $kelasXIIRPL1?->id],
            ['nama' => 'Julia Wulandari',   'email' => 'julia.wulandari@siswa.sch.id',  'nis' => '2025001001', 'kelas_id' => $kelasXTKJ1?->id],
        ];

        foreach ($siswaList as $siswa) {
            User::firstOrCreate(
                ['email' => $siswa['email']],
                [
                    'nama'              => $siswa['nama'],
                    'password'          => Hash::make('password'),
                    'role_id'           => $siswaRole->id,
                    'kelas_id'          => $siswa['kelas_id'],
                    'nis'               => $siswa['nis'],
                    'aktif'             => true,
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
