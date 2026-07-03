<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use Illuminate\Database\Seeder;

class JurusanSeeder extends Seeder
{
    public function run(): void
    {
        $jurusan = [
            [
                'nama'      => 'Rekayasa Perangkat Lunak',
                'kode'      => 'RPL',
                'deskripsi' => 'Program keahlian pembuatan perangkat lunak dan aplikasi',
                'aktif'     => true,
            ],
            [
                'nama'      => 'Teknik Komputer dan Jaringan',
                'kode'      => 'TKJ',
                'deskripsi' => 'Program keahlian jaringan komputer dan sistem operasi',
                'aktif'     => true,
            ],
            [
                'nama'      => 'Multimedia',
                'kode'      => 'MM',
                'deskripsi' => 'Program keahlian desain grafis, animasi, dan produksi media',
                'aktif'     => true,
            ],
        ];

        foreach ($jurusan as $j) {
            Jurusan::firstOrCreate(['kode' => $j['kode']], $j);
        }
    }
}
