<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Order is important — parent tables must be seeded before child tables.
     */
    public function run(): void
    {
        $this->call([
            // 1. Roles (required by users)
            RoleSeeder::class,

            // 2. Jurusan (required by kelas & mata_pelajaran)
            JurusanSeeder::class,

            // 3. Kelas (required by users siswa & jadwal_mengajar)
            KelasSeeder::class,

            // 4. Mata Pelajaran (required by jadwal_mengajar, materi, tugas, nilai, absensi)
            MataPelajaranSeeder::class,

            // 5. Users: admin, guru, siswa
            UserSeeder::class,

            // 6. Jadwal Mengajar (requires guru + mata_pelajaran + kelas)
            JadwalMengajarSeeder::class,

            // 7. System Settings (singleton row)
            SettingSeeder::class,

            // 8. Materi (requires guru + mata_pelajaran + kelas)
            MateriSeeder::class,

            // 9. Tugas (requires guru + mata_pelajaran + kelas)
            TugasSeeder::class,

            // 10. Pengumpulan Tugas (requires tugas + siswa)
            PengumpulanTugasSeeder::class,

            // 11. Nilai (requires siswa + mata_pelajaran + guru)
            NilaiSeeder::class,

            // 12. Absensi (requires siswa + kelas + mata_pelajaran + guru)
            AbsensiSeeder::class,

            // 13. Pengumuman (requires admin user)
            PengumumanSeeder::class,
        ]);
    }
}
