<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MataPelajaran extends Model
{
    use HasFactory;

    protected $table = 'mata_pelajaran';

    protected $fillable = [
        'nama',
        'kode',
        'deskripsi',
        'jurusan_id',
        'tingkat',
        'jam_pelajaran',
        'jenis',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    /**
     * Get the jurusan that owns the mata pelajaran
     */
    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class);
    }

    /**
     * Get all jadwal mengajar for this mata pelajaran
     */
    public function jadwalMengajar(): HasMany
    {
        return $this->hasMany(JadwalMengajar::class);
    }

    /**
     * Get all materi for this mata pelajaran
     */
    public function materi(): HasMany
    {
        return $this->hasMany(Materi::class);
    }

    /**
     * Get all tugas for this mata pelajaran
     */
    public function tugas(): HasMany
    {
        return $this->hasMany(Tugas::class);
    }

    /**
     * Get all nilai for this mata pelajaran
     */
    public function nilai(): HasMany
    {
        return $this->hasMany(Nilai::class);
    }

    /**
     * Get all absensi for this mata pelajaran
     */
    public function absensi(): HasMany
    {
        return $this->hasMany(Absensi::class);
    }

    /**
     * Scope query to only include active mata pelajaran
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

    /**
     * Scope query by jenis
     */
    public function scopeByJenis($query, $jenis)
    {
        return $query->where('jenis', $jenis);
    }
}
