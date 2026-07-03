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
        Schema::create('mata_pelajaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100); // Pemrograman Web
            $table->string('kode', 20)->unique(); // PWEB
            $table->text('deskripsi')->nullable();
            $table->foreignId('jurusan_id')->nullable()->constrained('jurusan')->onDelete('set null');
            $table->enum('tingkat', ['X', 'XI', 'XII'])->nullable();
            $table->integer('jam_pelajaran')->default(2); // Jumlah jam per minggu
            $table->enum('jenis', ['Wajib', 'Peminatan', 'Muatan Lokal'])->default('Wajib');
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mata_pelajaran');
    }
};
