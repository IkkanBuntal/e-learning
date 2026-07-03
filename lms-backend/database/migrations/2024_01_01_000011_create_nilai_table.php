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
        Schema::create('nilai', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('users')->onDelete('cascade');
            $table->enum('jenis', ['Tugas', 'UTS', 'UAS', 'Quiz', 'Praktik', 'Proyek']);
            $table->integer('nilai'); // 0-100
            $table->string('keterangan')->nullable();
            $table->date('tanggal');
            $table->enum('semester', ['Ganjil', 'Genap']);
            $table->string('tahun_ajaran', 20);
            $table->timestamps();

            // Index untuk query
            $table->index(['siswa_id', 'mata_pelajaran_id']);
            $table->index(['mata_pelajaran_id', 'jenis']);
            $table->index('tanggal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai');
    }
};
