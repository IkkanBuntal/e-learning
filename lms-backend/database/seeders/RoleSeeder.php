<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['nama' => 'admin',  'deskripsi' => 'Administrator sistem'],
            ['nama' => 'guru',   'deskripsi' => 'Guru / Pengajar'],
            ['nama' => 'siswa',  'deskripsi' => 'Siswa / Pelajar'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['nama' => $role['nama']], $role);
        }
    }
}
