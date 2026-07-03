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
        Schema::create('materi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('file_path')->nullable(); // Path file di storage
            $table->string('file_name')->nullable(); // Nama asli file
            $table->string('file_type')->nullable(); // pdf, doc, ppt, etc
            $table->integer('file_size')->nullable(); // dalam bytes
            $table->date('tanggal_upload');
            $table->enum('semester', ['Ganjil', 'Genap']);
            $table->string('tahun_ajaran', 20);
            $table->integer('views')->default(0); // Jumlah dilihat
            $table->timestamps();

            // Index untuk query
            $table->index(['mata_pelajaran_id', 'kelas_id']);
            $table->index('tanggal_upload');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materi');
    }
};
