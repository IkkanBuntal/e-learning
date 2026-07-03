<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jurusan extends Model
{
    use HasFactory;

    protected $table = 'jurusan';

    protected $fillable = [
        'nama',
        'kode',
        'deskripsi',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    /**
     * Get all kelas in this jurusan
     */
    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class);
    }

    /**
     * Get all mata pelajaran in this jurusan
     */
    public function mataPelajaran(): HasMany
    {
        return $this->hasMany(MataPelajaran::class);
    }

    /**
     * Scope query to only include active jurusan
     */
    public function scopeActive($query)
    {
        return $query->where('aktif', true);
    }
}
