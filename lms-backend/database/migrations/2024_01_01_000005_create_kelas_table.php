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
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 50); // XII RPL 1
            $table->foreignId('jurusan_id')->constrained('jurusan')->onDelete('cascade');
            $table->enum('tingkat', ['X', 'XI', 'XII']); // 10, 11, 12
            $table->integer('kapasitas')->default(36);
            $table->string('wali_kelas')->nullable();
            $table->string('ruangan')->nullable();
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
