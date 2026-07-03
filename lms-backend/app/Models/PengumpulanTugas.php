<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengumpulanTugas extends Model
{
    use HasFactory;

    protected $table = 'pengumpulan_tugas';

    protected $fillable = [
        'tugas_id',
        'siswa_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'submitted_at',      // renamed from tanggal_submit
        'status',
        'nilai',
        'catatan_siswa',     // catatan dari siswa saat submit
        'catatan_guru',      // feedback dari guru setelah dinilai
        'tanggal_dinilai',
    ];

    protected $casts = [
        'submitted_at'    => 'datetime',
        'tanggal_dinilai' => 'datetime',
    ];

    /**
     * Get the tugas
     */
    public function tugas(): BelongsTo
    {
        return $this->belongsTo(Tugas::class);
    }

    /**
     * Get the siswa (user)
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    /**
     * Check if submission is graded
     */
    public function isGraded(): bool
    {
        return !is_null($this->nilai);
    }

    /**
     * Check if submission is late
     */
    public function isLate(): bool
    {
        return $this->status === 'Terlambat';
    }

    /**
     * Scope query by tugas
     */
    public function scopeByTugas($query, $tugasId)
    {
        return $query->where('tugas_id', $tugasId);
    }

    /**
     * Scope query by siswa
     */
    public function scopeBySiswa($query, $siswaId)
    {
        return $query->where('siswa_id', $siswaId);
    }

    /**
     * Scope query for graded submissions
     */
    public function scopeGraded($query)
    {
        return $query->whereNotNull('nilai');
    }

    /**
     * Scope query for ungraded submissions
     */
    public function scopeUngraded($query)
    {
        return $query->whereNull('nilai');
    }

    /**
     * Scope query for late submissions
     */
    public function scopeLate($query)
    {
        return $query->where('status', 'Terlambat');
    }

    /**
     * Scope query for on-time submissions
     */
    public function scopeOnTime($query)
    {
        return $query->where('status', 'Tepat Waktu');
    }
}
