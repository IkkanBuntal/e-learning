<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use App\Models\MataPelajaran;
use Illuminate\Database\Seeder;

class MataPelajaranSeeder extends Seeder
{
    public function run(): void
    {
        $rpl = Jurusan::where('kode', 'RPL')->first();
        $tkj = Jurusan::where('kode', 'TKJ')->first();
        $mm  = Jurusan::where('kode', 'MM')->first();

        $mapel = [
            // ---- Mata Pelajaran Wajib (semua jurusan) ----
            ['nama' => 'Pendidikan Agama',          'kode' => 'PAI',  'jurusan_id' => null,     'tingkat' => null,  'jam_pelajaran' => 3, 'jenis' => 'Wajib'],
            ['nama' => 'Pendidikan Kewarganegaraan', 'kode' => 'PKN',  'jurusan_id' => null,     'tingkat' => null,  'jam_pelajaran' => 2, 'jenis' => 'Wajib'],
            ['nama' => 'Bahasa Indonesia',           'kode' => 'BIND', 'jurusan_id' => null,     'tingkat' => null,  'jam_pelajaran' => 4, 'jenis' => 'Wajib'],
            ['nama' => 'Matematika',                 'kode' => 'MTK',  'jurusan_id' => null,     'tingkat' => null,  'jam_pelajaran' => 4, 'jenis' => 'Wajib'],
            ['nama' => 'Bahasa Inggris',             'kode' => 'BING', 'jurusan_id' => null,     'tingkat' => null,  'jam_pelajaran' => 3, 'jenis' => 'Wajib'],
            ['nama' => 'Sejarah Indonesia',          'kode' => 'SEJ',  'jurusan_id' => null,     'tingkat' => null,  'jam_pelajaran' => 2, 'jenis' => 'Wajib'],

            // ---- RPL Peminatan ----
            ['nama' => 'Pemrograman Web',            'kode' => 'PWEB', 'jurusan_id' => $rpl->id, 'tingkat' => 'XI',  'jam_pelajaran' => 4, 'jenis' => 'Peminatan'],
            ['nama' => 'Pemrograman Berorientasi Objek', 'kode' => 'PBO', 'jurusan_id' => $rpl->id, 'tingkat' => 'XI',  'jam_pelajaran' => 4, 'jenis' => 'Peminatan'],
            ['nama' => 'Basis Data',                 'kode' => 'BDT',  'jurusan_id' => $rpl->id, 'tingkat' => 'XI',  'jam_pelajaran' => 4, 'jenis' => 'Peminatan'],
            ['nama' => 'Algoritma dan Pemrograman',  'kode' => 'ALGO', 'jurusan_id' => $rpl->id, 'tingkat' => 'X',   'jam_pelajaran' => 4, 'jenis' => 'Peminatan'],
            ['nama' => 'Pengembangan Aplikasi Mobile','kode' => 'MOB',  'jurusan_id' => $rpl->id, 'tingkat' => 'XII', 'jam_pelajaran' => 4, 'jenis' => 'Peminatan'],
            ['nama' => 'Proyek Perangkat Lunak',     'kode' => 'PPL',  'jurusan_id' => $rpl->id, 'tingkat' => 'XII', 'jam_pelajaran' => 6, 'jenis' => 'Peminatan'],

            // ---- TKJ Peminatan ----
            ['nama' => 'Administrasi Jaringan',      'kode' => 'AJRG', 'jurusan_id' => $tkj->id, 'tingkat' => 'XI',  'jam_pelajaran' => 4, 'jenis' => 'Peminatan'],
            ['nama' => 'Keamanan Jaringan',          'kode' => 'KJRG', 'jurusan_id' => $tkj->id, 'tingkat' => 'XII', 'jam_pelajaran' => 4, 'jenis' => 'Peminatan'],
            ['nama' => 'Sistem Operasi Jaringan',    'kode' => 'SOJ',  'jurusan_id' => $tkj->id, 'tingkat' => 'X',   'jam_pelajaran' => 4, 'jenis' => 'Peminatan'],

            // ---- Multimedia Peminatan ----
            ['nama' => 'Desain Grafis',              'kode' => 'DSGR', 'jurusan_id' => $mm->id,  'tingkat' => 'X',   'jam_pelajaran' => 4, 'jenis' => 'Peminatan'],
            ['nama' => 'Animasi 2D & 3D',            'kode' => 'ANIM', 'jurusan_id' => $mm->id,  'tingkat' => 'XI',  'jam_pelajaran' => 4, 'jenis' => 'Peminatan'],
            ['nama' => 'Produksi Video',             'kode' => 'VID',  'jurusan_id' => $mm->id,  'tingkat' => 'XII', 'jam_pelajaran' => 6, 'jenis' => 'Peminatan'],
        ];

        foreach ($mapel as $m) {
            MataPelajaran::firstOrCreate(['kode' => $m['kode']], array_merge($m, ['aktif' => true]));
        }
    }
}
