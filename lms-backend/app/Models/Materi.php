<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Materi extends Model
{
    use HasFactory;

    protected $table = 'materi';

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
        'tanggal_upload',
        'semester',
        'tahun_ajaran',
        'views',
    ];

    protected $casts = [
        'tanggal_upload' => 'date',
    ];

    /**
     * Get the guru (user) that owns the materi
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
     * Increment view count
     */
    public function incrementViews()
    {
        $this->increment('views');
    }
}
