<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        // Aplikasi
        'app_name',
        'app_desc',
        'app_logo',

        // Akademik
        'tahun_ajaran',
        'semester_aktif',
        'min_kehadiran',
        'kkm',

        // Notifikasi
        'email_notif',
        'push_notif',
        'deadline_reminder',
        'grade_notif',

        // Email
        'email_from',
        'smtp_host',
        'smtp_port',
        'smtp_user',
        'smtp_password',

        // File Upload
        'max_file_size',
        'allowed_formats',

        // Backup
        'auto_backup',
        'backup_freq',
        'backup_retention',
    ];

    protected $casts = [
        'email_notif'       => 'boolean',
        'push_notif'        => 'boolean',
        'deadline_reminder' => 'boolean',
        'grade_notif'       => 'boolean',
        'auto_backup'       => 'boolean',
        'min_kehadiran'     => 'integer',
        'kkm'               => 'integer',
        'max_file_size'     => 'integer',
        'backup_retention'  => 'integer',
    ];

    /**
     * Get the active settings row (singleton pattern).
     * Always use this instead of Setting::first() directly.
     */
    public static function current(): self
    {
        return static::firstOrCreate([], [
            'app_name'          => 'E-LearningKu',
            'app_desc'          => 'Platform E-Learning SMKN 2 Kuningan',
            'tahun_ajaran'      => '2025/2026',
            'semester_aktif'    => 'Genap',
            'min_kehadiran'     => 75,
            'kkm'               => 70,
            'email_notif'       => true,
            'push_notif'        => true,
            'deadline_reminder' => true,
            'grade_notif'       => true,
            'max_file_size'     => 10,
            'allowed_formats'   => 'pdf,doc,docx,ppt,pptx,zip',
            'auto_backup'       => true,
            'backup_freq'       => 'daily',
            'backup_retention'  => 30,
        ]);
    }
}
