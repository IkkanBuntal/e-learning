<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use App\Models\Kelas;
use Illuminate\Database\Seeder;

class KelasSeeder extends Seeder
{
    public function run(): void
    {
        $rpl = Jurusan::where('kode', 'RPL')->first();
        $tkj = Jurusan::where('kode', 'TKJ')->first();
        $mm  = Jurusan::where('kode', 'MM')->first();

        // Get some guru to assign as wali kelas
        $guruList = \App\Models\User::whereHas('role', function($q) {
            $q->where('nama', 'guru');
        })->get();
        
        $guruIndex = 0;

        $kelas = [
            // RPL
            ['nama' => 'X RPL 1',   'jurusan_id' => $rpl->id, 'tingkat' => 'X',   'kapasitas' => 36, 'ruangan' => 'Lab RPL 1'],
            ['nama' => 'X RPL 2',   'jurusan_id' => $rpl->id, 'tingkat' => 'X',   'kapasitas' => 36, 'ruangan' => 'Lab RPL 2'],
            ['nama' => 'XI RPL 1',  'jurusan_id' => $rpl->id, 'tingkat' => 'XI',  'kapasitas' => 36, 'ruangan' => 'Lab RPL 1'],
            ['nama' => 'XI RPL 2',  'jurusan_id' => $rpl->id, 'tingkat' => 'XI',  'kapasitas' => 36, 'ruangan' => 'Lab RPL 2'],
            ['nama' => 'XII RPL 1', 'jurusan_id' => $rpl->id, 'tingkat' => 'XII', 'kapasitas' => 36, 'ruangan' => 'Lab RPL 1'],
            ['nama' => 'XII RPL 2', 'jurusan_id' => $rpl->id, 'tingkat' => 'XII', 'kapasitas' => 36, 'ruangan' => 'Lab RPL 2'],

            // TKJ
            ['nama' => 'X TKJ 1',   'jurusan_id' => $tkj->id, 'tingkat' => 'X',   'kapasitas' => 36, 'ruangan' => 'Lab TKJ 1'],
            ['nama' => 'X TKJ 2',   'jurusan_id' => $tkj->id, 'tingkat' => 'X',   'kapasitas' => 36, 'ruangan' => 'Lab TKJ 2'],
            ['nama' => 'XI TKJ 1',  'jurusan_id' => $tkj->id, 'tingkat' => 'XI',  'kapasitas' => 36, 'ruangan' => 'Lab TKJ 1'],
            ['nama' => 'XI TKJ 2',  'jurusan_id' => $tkj->id, 'tingkat' => 'XI',  'kapasitas' => 36, 'ruangan' => 'Lab TKJ 2'],
            ['nama' => 'XII TKJ 1', 'jurusan_id' => $tkj->id, 'tingkat' => 'XII', 'kapasitas' => 36, 'ruangan' => 'Lab TKJ 1'],

            // Multimedia
            ['nama' => 'X MM 1',    'jurusan_id' => $mm->id, 'tingkat' => 'X',   'kapasitas' => 36, 'ruangan' => 'Lab MM 1'],
            ['nama' => 'XI MM 1',   'jurusan_id' => $mm->id, 'tingkat' => 'XI',  'kapasitas' => 36, 'ruangan' => 'Lab MM 1'],
            ['nama' => 'XII MM 1',  'jurusan_id' => $mm->id, 'tingkat' => 'XII', 'kapasitas' => 36, 'ruangan' => 'Lab MM 1'],
        ];

        foreach ($kelas as $k) {
            // Assign wali kelas if guru available
            if ($guruList->isNotEmpty()) {
                $guru = $guruList[$guruIndex % $guruList->count()];
                $k['wali_kelas'] = $guru->nama;
                $guruIndex++;
            }
            
            Kelas::firstOrCreate(['nama' => $k['nama']], array_merge($k, ['aktif' => true]));
        }
    }
}
