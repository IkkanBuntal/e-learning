<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Tambah kolom permissions (JSON) ke tabel roles.
 * Default permissions sesuai konfigurasi sistem yang sudah ada.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->json('permissions')->nullable()->after('deskripsi');
        });

        // Seed default permissions per role
        $defaults = [
            'admin' => [
                'users.create', 'users.read', 'users.update', 'users.delete',
                'materi.create', 'materi.read', 'materi.update', 'materi.delete',
                'tugas.create', 'tugas.read', 'tugas.update', 'tugas.delete',
                'nilai.create', 'nilai.read', 'nilai.update', 'nilai.delete',
                'absensi.create', 'absensi.read', 'absensi.update', 'absensi.delete',
                'reports.view', 'reports.export',
                'settings.manage',
            ],
            'guru' => [
                'materi.create', 'materi.read', 'materi.update', 'materi.delete',
                'tugas.create', 'tugas.read', 'tugas.update', 'tugas.delete',
                'nilai.create', 'nilai.read', 'nilai.update',
                'absensi.create', 'absensi.read', 'absensi.update',
                'reports.view',
            ],
            'siswa' => [
                'materi.read',
                'tugas.read', 'tugas.submit',
                'nilai.read',
                'absensi.read',
            ],
        ];

        foreach ($defaults as $nama => $permissions) {
            DB::table('roles')
                ->where('nama', $nama)
                ->update(['permissions' => json_encode($permissions)]);
        }
    }

    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('permissions');
        });
    }
};
