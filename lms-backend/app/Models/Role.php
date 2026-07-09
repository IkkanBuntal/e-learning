<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'deskripsi',
        'permissions',
    ];

    /**
     * Cast permissions JSON column to array automatically
     * (Laravel 13 docs: https://laravel.com/docs/13.x/eloquent-mutators#array-and-json-casting)
     */
    protected $casts = [
        'permissions' => 'array',
    ];

    /**
     * Get all users with this role
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Check if role is admin
     */
    public function isAdmin(): bool
    {
        return strtolower($this->nama) === 'admin';
    }

    /**
     * Check if role is guru
     */
    public function isGuru(): bool
    {
        return strtolower($this->nama) === 'guru';
    }

    /**
     * Check if role is siswa
     */
    public function isSiswa(): bool
    {
        return strtolower($this->nama) === 'siswa';
    }
}
