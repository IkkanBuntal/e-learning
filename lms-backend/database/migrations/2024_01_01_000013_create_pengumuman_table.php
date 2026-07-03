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
        Schema::create('pengumuman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('judul');
            $table->text('isi');
            $table->enum('target_role', ['Semua', 'Guru', 'Siswa'])->default('Semua');
            $table->enum('prioritas', ['Rendah', 'Sedang', 'Tinggi'])->default('Sedang');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai')->nullable();
            $table->boolean('aktif')->default(true);
            $table->timestamps();

            // Index untuk query
            $table->index(['target_role', 'aktif']);
            $table->index('tanggal_mulai');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengumuman');
    }
};
