<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nilai extends Model
{
    use HasFactory;

    protected $table = 'nilai';

    protected $fillable = [
        'siswa_id',
        'mata_pelajaran_id',
        'guru_id',
        'jenis',
        'nilai',
        'keterangan',
        'tanggal',
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
     * Get grade letter (A, B, C, D, E)
     */
    public function getGradeLetter(): string
    {
        if ($this->nilai >= 90) return 'A';
        if ($this->nilai >= 80) return 'B';
        if ($this->nilai >= 70) return 'C';
        if ($this->nilai >= 60) return 'D';
        return 'E';
    }

    /**
     * Scope query by siswa
     */
    public function scopeBySiswa($query, $siswaId)
    {
        return $query->where('siswa_id', $siswaId);
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
     * Scope query by jenis
     */
    public function scopeByJenis($query, $jenis)
    {
        return $query->where('jenis', $jenis);
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
