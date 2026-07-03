<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nama',
        'email',
        'password',
        'role_id',
        'kelas_id',
        'nip',
        'nis',
        'foto',
        'jenis_kelamin',
        'alamat',
        'no_telp',
        'tanggal_lahir',
        'tempat_lahir',
        'aktif',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'aktif' => 'boolean',
            'tanggal_lahir' => 'date',
        ];
    }

    /**
     * Get the role that owns the user
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the kelas that owns the user (for siswa)
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Get all jadwal mengajar for guru
     */
    public function jadwalMengajar(): HasMany
    {
        return $this->hasMany(JadwalMengajar::class, 'guru_id');
    }

    /**
     * Get all materi created by guru
     */
    public function materiGuru(): HasMany
    {
        return $this->hasMany(Materi::class, 'guru_id');
    }

    /**
     * Get all tugas created by guru
     */
    public function tugasGuru(): HasMany
    {
        return $this->hasMany(Tugas::class, 'guru_id');
    }

    /**
     * Get all pengumpulan tugas by siswa
     */
    public function pengumpulanTugas(): HasMany
    {
        return $this->hasMany(PengumpulanTugas::class, 'siswa_id');
    }

    /**
     * Get all nilai for siswa
     */
    public function nilai(): HasMany
    {
        return $this->hasMany(Nilai::class, 'siswa_id');
    }

    /**
     * Get all nilai given by guru
     */
    public function nilaiGuru(): HasMany
    {
        return $this->hasMany(Nilai::class, 'guru_id');
    }

    /**
     * Get all absensi for siswa
     */
    public function absensi(): HasMany
    {
        return $this->hasMany(Absensi::class, 'siswa_id');
    }

    /**
     * Get all absensi recorded by guru
     */
    public function absensiGuru(): HasMany
    {
        return $this->hasMany(Absensi::class, 'guru_id');
    }

    /**
     * Get all pengumuman created by admin
     */
    public function pengumuman(): HasMany
    {
        return $this->hasMany(Pengumuman::class, 'admin_id');
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role->nama === 'admin';
    }

    /**
     * Check if user is guru
     */
    public function isGuru(): bool
    {
        return $this->role->nama === 'guru';
    }

    /**
     * Check if user is siswa
     */
    public function isSiswa(): bool
    {
        return $this->role->nama === 'siswa';
    }

    /**
     * Scope query to only include active users
     */
    public function scopeActive($query)
    {
        return $query->where('aktif', true);
    }

    /**
     * Scope query by role
     */
    public function scopeByRole($query, $roleName)
    {
        return $query->whereHas('role', function ($q) use ($roleName) {
            $q->where('nama', $roleName);
        });
    }
}
