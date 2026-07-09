<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Services\CacheService;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';

    protected $fillable = [
        'user_id',
        'user_name',
        'action',
        'module',
        'target_name',
        'description',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Helper to log an activity
     */
    public static function log(string $action, string $module, string $targetName, string $description = ''): void
    {
        $user = auth()->user();
        static::create([
            'user_id'     => $user?->id,
            'user_name'   => $user?->nama ?? 'Sistem',
            'action'      => $action,
            'module'      => $module,
            'target_name' => $targetName,
            'description' => $description,
        ]);

        // Invalidate dashboard cache so Aktivitas Terkini always shows fresh data
        CacheService::clearDashboardCache();
    }
}
