<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JadwalMengajar extends Model
{
    use HasFactory;

    protected $table = 'jadwal_mengajar';

    protected $fillable = [
        'guru_id',
        'mata_pelajaran_id',
        'kelas_id',
        'hari',
        'jam_mulai',
        'jam_selesai',
        'ruangan',
        'semester',
        'tahun_ajaran',
        'aktif',
    ];

    protected $casts = [
        'jam_mulai' => 'datetime:H:i',
        'jam_selesai' => 'datetime:H:i',
        'aktif' => 'boolean',
    ];

    /**
     * Get the guru (user) that owns the jadwal
     */
    public function guru(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    /**
     * Get the mata pelajaran
     */
    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    /**
     * Get the kelas
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Scope query to only include active jadwal
     */
    public function scopeActive($query)
    {
        return $query->where('aktif', true);
    }

    /**
     * Scope query by guru
     */
    public function scopeByGuru($query, $guruId)
    {
        return $query->where('guru_id', $guruId);
    }

    /**
     * Scope query by kelas
     */
    public function scopeByKelas($query, $kelasId)
    {
        return $query->where('kelas_id', $kelasId);
    }

    /**
     * Scope query by tahun ajaran
     */
    public function scopeByTahunAjaran($query, $tahunAjaran)
    {
        return $query->where('tahun_ajaran', $tahunAjaran);
    }

    /**
     * Scope query by semester
     */
    public function scopeBySemester($query, $semester)
    {
        return $query->where('semester', $semester);
    }
}
