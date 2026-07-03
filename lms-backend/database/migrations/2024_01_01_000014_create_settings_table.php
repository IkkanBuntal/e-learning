<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Stores persistent system settings from admin Settings.jsx page.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();

            // ---- Pengaturan Aplikasi ----
            $table->string('app_name')->default('E-LearningKu');
            $table->string('app_desc')->nullable();
            $table->string('app_logo')->nullable(); // path to uploaded logo file

            // ---- Pengaturan Akademik ----
            $table->string('tahun_ajaran', 20)->default('2025/2026'); // e.g. 2025/2026
            $table->enum('semester_aktif', ['Ganjil', 'Genap'])->default('Genap');
            $table->integer('min_kehadiran')->default(75);  // minimum attendance %
            $table->integer('kkm')->default(70);            // Kriteria Ketuntasan Minimal

            // ---- Pengaturan Notifikasi ----
            $table->boolean('email_notif')->default(true);
            $table->boolean('push_notif')->default(true);
            $table->boolean('deadline_reminder')->default(true);
            $table->boolean('grade_notif')->default(true);

            // ---- Konfigurasi Email (SMTP) ----
            $table->string('email_from')->nullable();
            $table->string('smtp_host')->nullable();
            $table->string('smtp_port', 10)->nullable();
            $table->string('smtp_user')->nullable();
            $table->text('smtp_password')->nullable(); // encrypted in application layer

            // ---- Pengaturan File Upload ----
            $table->integer('max_file_size')->default(10); // in MB
            $table->string('allowed_formats')->default('pdf,doc,docx,ppt,pptx,zip');

            // ---- Pengaturan Backup ----
            $table->boolean('auto_backup')->default(true);
            $table->enum('backup_freq', ['hourly', 'daily', 'weekly'])->default('daily');
            $table->integer('backup_retention')->default(30); // days

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
