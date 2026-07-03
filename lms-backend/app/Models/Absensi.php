<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'absensi';

    protected $fillable = [
        'siswa_id',
        'kelas_id',
        'mata_pelajaran_id',
        'guru_id',
        'tanggal',
        'status',
        'keterangan',
        'semester',
        'tahun_ajaran',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    /**
     * Get the siswa (user)
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    /**
     * Get the kelas
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Get the mata pelajaran
     */
    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    /**
     * Get the guru (user)
     */
    public function guru(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    /**
     * Check if status is present (hadir)
     */
    public function isPresent(): bool
    {
        return $this->status === 'hadir';
    }

    /**
     * Check if status is absent (alpha)
     */
    public function isAbsent(): bool
    {
        return $this->status === 'alpha';
    }

    /**
     * Check if status is sick (sakit)
     */
    public function isSick(): bool
    {
        return $this->status === 'sakit';
    }

    /**
     * Check if status is excused (izin)
     */
    public function isExcused(): bool
    {
        return $this->status === 'izin';
    }

    /**
     * Scope query by siswa
     */
    public function scopeBySiswa($query, $siswaId)
    {
        return $query->where('siswa_id', $siswaId);
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
     * Scope query by guru
     */
    public function scopeByGuru($query, $guruId)
    {
        return $query->where('guru_id', $guruId);
    }

    /**
     * Scope query by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope query by date range
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('tanggal', [$startDate, $endDate]);
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
