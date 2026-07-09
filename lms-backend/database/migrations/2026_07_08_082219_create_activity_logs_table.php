<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('user_name')->nullable();        // snapshot nama user saat aksi
            $table->string('action');                       // create, update, delete
            $table->string('module');                       // jurusan, kelas, mata_pelajaran, jadwal
            $table->string('target_name')->nullable();      // nama data yang diaksi
            $table->text('description')->nullable();        // deskripsi lengkap
            $table->timestamps();

            $table->index(['created_at']);
            $table->index(['module']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
