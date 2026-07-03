<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pengumuman extends Model
{
    use HasFactory;

    protected $table = 'pengumuman';

    protected $fillable = [
        'admin_id',
        'judul',
        'isi',
        'target_role',
        'prioritas',
        'tanggal_mulai',
        'tanggal_selesai',
        'aktif',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'aktif' => 'boolean',
    ];

    /**
     * Get the admin (user) that created the pengumuman
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Check if pengumuman is currently active
     */
    public function isCurrentlyActive(): bool
    {
        $now = now()->toDateString();
        $started = $this->tanggal_mulai <= $now;
        $notEnded = is_null($this->tanggal_selesai) || $this->tanggal_selesai >= $now;
        
        return $this->aktif && $started && $notEnded;
    }

    /**
     * Scope query to only include active pengumuman
     */
    public function scopeActive($query)
    {
        return $query->where('aktif', true);
    }

    /**
     * Scope query to only include currently valid pengumuman
     */
    public function scopeCurrentlyActive($query)
    {
        $now = now()->toDateString();
        return $query->where('aktif', true)
            ->where('tanggal_mulai', '<=', $now)
            ->where(function ($q) use ($now) {
                $q->whereNull('tanggal_selesai')
                  ->orWhere('tanggal_selesai', '>=', $now);
            });
    }

    /**
     * Scope query by target role
     */
    public function scopeByTargetRole($query, $role)
    {
        return $query->where(function ($q) use ($role) {
            $q->where('target_role', 'Semua')
              ->orWhere('target_role', $role);
        });
    }

    /**
     * Scope query by prioritas
     */
    public function scopeByPrioritas($query, $prioritas)
    {
        return $query->where('prioritas', $prioritas);
    }

    /**
     * Scope query ordered by prioritas (Tinggi first)
     */
    public function scopeOrderedByPrioritas($query)
    {
        return $query->orderByRaw("FIELD(prioritas, 'Tinggi', 'Sedang', 'Rendah')");
    }
}
