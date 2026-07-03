<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add FK constraints to users table AFTER roles (000003) and kelas (000005) tables exist.
     * This migration runs after 000005 but before 000007 (jadwal_mengajar).
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add FK to roles
            $table->foreign('role_id')
                  ->references('id')
                  ->on('roles')
                  ->onDelete('cascade');

            // Add FK to kelas
            $table->foreign('kelas_id')
                  ->references('id')
                  ->on('kelas')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropForeign(['kelas_id']);
        });
    }
};
