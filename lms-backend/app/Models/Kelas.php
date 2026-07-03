<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $fillable = [
        'nama',
        'jurusan_id',
        'tingkat',
        'kapasitas',
        'wali_kelas',
        'ruangan',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    /**
     * Get the jurusan that owns the kelas
     */
    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class);
    }

    /**
     * Get all siswa in this kelas
     */
    public function siswa(): HasMany
    {
        return $this->hasMany(User::class)->where('role_id', 3); // Assuming role_id 3 is siswa
    }

    /**
     * Get all jadwal mengajar for this kelas
     */
    public function jadwalMengajar(): HasMany
    {
        return $this->hasMany(JadwalMengajar::class);
    }

    /**
     * Get all materi for this kelas
     */
    public function materi(): HasMany
    {
        return $this->hasMany(Materi::class);
    }

    /**
     * Get all tugas for this kelas
     */
    public function tugas(): HasMany
    {
        return $this->hasMany(Tugas::class);
    }

    /**
     * Get all absensi for this kelas
     */
    public function absensi(): HasMany
    {
        return $this->hasMany(Absensi::class);
    }

    /**
     * Scope query to only include active kelas
     */
    public function scopeActive($query)
    {
        return $query->where('aktif', true);
    }

    /**
     * Scope query by tingkat
     */
    public function scopeByTingkat($query, $tingkat)
    {
        return $query->where('tingkat', $tingkat);
    }
}
