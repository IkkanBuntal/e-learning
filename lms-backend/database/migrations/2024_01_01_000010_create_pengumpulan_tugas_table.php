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
        Schema::create('pengumpulan_tugas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tugas_id')->constrained('tugas')->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('users')->onDelete('cascade');
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_type');
            $table->integer('file_size');
            $table->dateTime('submitted_at'); // renamed from tanggal_submit to match frontend
            $table->enum('status', ['Tepat Waktu', 'Terlambat'])->default('Tepat Waktu');
            $table->integer('nilai')->nullable();
            $table->text('catatan_siswa')->nullable(); // Catatan dari siswa saat submit
            $table->text('catatan_guru')->nullable();  // Feedback dari guru setelah dinilai
            $table->dateTime('tanggal_dinilai')->nullable();
            $table->timestamps();

            // Index untuk query
            $table->index(['tugas_id', 'siswa_id']);
            $table->index('submitted_at');

            // Unique constraint: satu siswa hanya bisa submit sekali per tugas
            $table->unique(['tugas_id', 'siswa_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengumpulan_tugas');
    }
};
