<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tugas extends Model
{
    use HasFactory;

    protected $table = 'tugas';

    protected $fillable = [
        'guru_id',
        'mata_pelajaran_id',
        'kelas_id',
        'judul',
        'deskripsi',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'deadline',
        'max_score',        // renamed from nilai_maksimal to match frontend
        'semester',
        'tahun_ajaran',
    ];

    protected $casts = [
        'deadline' => 'datetime',
    ];

    /**
     * Get the guru (user) that owns the tugas
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
     * Get all pengumpulan for this tugas
     */
    public function pengumpulan(): HasMany
    {
        return $this->hasMany(PengumpulanTugas::class);
    }

    /**
     * Check if tugas is overdue
     */
    public function isOverdue(): bool
    {
        return now()->isAfter($this->deadline);
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
     * Scope query by mata pelajaran
     */
    public function scopeByMataPelajaran($query, $mapelId)
    {
        return $query->where('mata_pelajaran_id', $mapelId);
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

    /**
     * Scope query for active tugas (not overdue)
     */
    public function scopeActive($query)
    {
        return $query->where('deadline', '>', now());
    }

    /**
     * Scope query for overdue tugas
     */
    public function scopeOverdue($query)
    {
        return $query->where('deadline', '<', now());
    }
}
