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
        Schema::create('tugas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('file_path')->nullable(); // File soal (opsional)
            $table->string('file_name')->nullable();
            $table->string('file_type')->nullable();
            $table->integer('file_size')->nullable();
            $table->dateTime('deadline');
            $table->integer('max_score')->default(100); // renamed from nilai_maksimal to match frontend
            $table->enum('semester', ['Ganjil', 'Genap']);
            $table->string('tahun_ajaran', 20);
            $table->timestamps();

            // Index untuk query
            $table->index(['mata_pelajaran_id', 'kelas_id']);
            $table->index('deadline');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tugas');
    }
};
