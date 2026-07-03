<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('absensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('users')->onDelete('cascade');
            $table->date('tanggal');
            $table->enum('status', ['hadir', 'sakit', 'izin', 'alpha']); // Match frontend Absensi.jsx
            $table->string('keterangan')->nullable();
            $table->enum('semester', ['Ganjil', 'Genap']);
            $table->string('tahun_ajaran', 20);
            $table->timestamps();

            // Index untuk query
            $table->index(['siswa_id', 'tanggal']);
            $table->index(['kelas_id', 'mata_pelajaran_id', 'tanggal']);
            $table->index('tanggal');

            // Unique constraint: satu siswa tidak bisa absen 2x di hari & mapel yang sama
            $table->unique(['siswa_id', 'mata_pelajaran_id', 'tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensi');
    }
};
