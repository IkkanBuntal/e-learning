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
        Schema::create('jadwal_mengajar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']);
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->string('ruangan', 50)->nullable();
            $table->enum('semester', ['Ganjil', 'Genap']);
            $table->string('tahun_ajaran', 20); // 2024/2025
            $table->boolean('aktif')->default(true);
            $table->timestamps();

            // Index untuk query authorization
            $table->index(['guru_id', 'mata_pelajaran_id', 'kelas_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_mengajar');
    }
};
