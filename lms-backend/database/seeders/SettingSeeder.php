<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        // Only seed if no settings row exists yet (singleton pattern)
        if (Setting::count() === 0) {
            Setting::create([
                'app_name'         => 'E-LearningKu',
                'app_desc'         => 'Platform E-Learning SMKN 2 Kuningan',
                'app_logo'         => null,

                'tahun_ajaran'     => '2025/2026',
                'semester_aktif'   => 'Genap',
                'min_kehadiran'    => 75,
                'kkm'              => 70,

                'email_notif'      => true,
                'push_notif'       => true,
                'deadline_reminder'=> true,
                'grade_notif'      => true,

                'email_from'       => 'noreply@sekolah.sch.id',
                'smtp_host'        => 'smtp.gmail.com',
                'smtp_port'        => '587',
                'smtp_user'        => null,
                'smtp_password'    => null,

                'max_file_size'    => 10,
                'allowed_formats'  => 'pdf,doc,docx,ppt,pptx,zip',

                'auto_backup'      => true,
                'backup_freq'      => 'daily',
                'backup_retention' => 30,
            ]);
        }
    }
}
