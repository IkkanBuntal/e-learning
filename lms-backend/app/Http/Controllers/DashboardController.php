<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Materi;
use App\Models\Tugas;
use App\Models\Nilai;
use App\Models\Absensi;
use App\Models\PengumpulanTugas;
use App\Models\JadwalMengajar;
use App\Services\CacheService;

class DashboardController extends Controller
{
    /**
     * Get overall statistics for dashboard based on user role
     */
    public function getStats(Request $request)
    {
        $user = $request->user();
        $role = $user->role ? $user->role->nama : 'siswa';
        $period = $request->input('period', 'today'); // today, week, month, year
        
        // Cache key based on role, user ID, and period
        $cacheKey = CacheService::PATTERN_DASHBOARD . "{$role}:{$user->id}:{$period}";
        
        // Use cache with 5 minutes TTL for dashboard data
        $data = CacheService::remember($cacheKey, CacheService::TTL_SHORT, function() use ($user, $role, $period) {
            return $this->generateDashboardStats($user, $role, $period);
        });
        
        return response()->json($data);
    }
    
    /**
     * Generate dashboard statistics (extracted for caching)
     */
    private function generateDashboardStats($user, $role, $period = 'today')
    {
        // Get date range based on period
        $dateRange = $this->getDateRange($period);
        
        // Day translation helper
        $dayMap = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu',
        ];
        $todayInIndonesian = $dayMap[date('l')] ?? 'Senin';

        if ($role === 'admin') {
            $totalSiswa = User::whereHas('role', function($q) { $q->where('nama', 'siswa'); })->count();
            $totalGuru = User::whereHas('role', function($q) { $q->where('nama', 'guru'); })->count();
            $totalKelas = Kelas::count();
            $totalMateri = Materi::whereBetween('created_at', $dateRange)->count();
            $totalTugas = Tugas::whereBetween('created_at', $dateRange)->count();
            
            $avgNilai = Nilai::whereBetween('created_at', $dateRange)->avg('nilai') ?? 0;
            
            $totalAbsensi = Absensi::whereBetween('tanggal', $dateRange)->count();
            $hadirCount = Absensi::whereBetween('tanggal', $dateRange)->where('status', 'hadir')->count();
            $avgKehadiran = $totalAbsensi > 0 ? ($hadirCount / $totalAbsensi) * 100 : 0;
            
            $totalSubmissions = PengumpulanTugas::whereBetween('created_at', $dateRange)->count();
            
            // Siswa per jurusan distribution
            $siswaPerJurusan = DB::table('users')
                ->join('roles', 'users.role_id', '=', 'roles.id')
                ->join('kelas', 'users.kelas_id', '=', 'kelas.id')
                ->join('jurusan', 'kelas.jurusan_id', '=', 'jurusan.id')
                ->where('roles.nama', 'siswa')
                ->select('jurusan.kode as name', DB::raw('count(users.id) as siswa'))
                ->groupBy('jurusan.kode')
                ->get();
                
            foreach ($siswaPerJurusan as $jurusan) {
                $jurusan->percentage = $totalSiswa > 0 ? round(($jurusan->siswa / $totalSiswa) * 100) : 0;
            }

            return [
                'status' => 'success',
                'data' => [
                    'totalUsers' => User::count(),
                    'totalSiswa' => $totalSiswa,
                    'totalGuru' => $totalGuru,
                    'totalKelas' => $totalKelas,
                    'totalMateri' => $totalMateri,
                    'totalTugas' => $totalTugas,
                    'avgNilai' => round($avgNilai, 1),
                    'avgKehadiran' => round($avgKehadiran, 1),
                    'totalSubmissions' => $totalSubmissions,
                    'siswaPerJurusan' => $siswaPerJurusan->values()->toArray(), // Force to array
                    'recentActivities' => $this->getRecentActivities($dateRange)
                ]
            ];
        } 
        
        if ($role === 'guru') {
            $guruId = $user->id;
            
            $totalMateri = Materi::where('guru_id', $guruId)->whereBetween('created_at', $dateRange)->count();
            $totalTugas = Tugas::where('guru_id', $guruId)->whereBetween('created_at', $dateRange)->count();
            $activeTugas = Tugas::where('guru_id', $guruId)
                ->whereBetween('created_at', $dateRange)
                ->where('deadline', '>', now())
                ->count();
            
            // Pending submissions
            $pendingSubmissions = PengumpulanTugas::whereHas('tugas', function($q) use ($guruId) {
                $q->where('guru_id', $guruId);
            })->whereBetween('created_at', $dateRange)->whereNull('nilai')->count();
            
            // Classes taught
            $taughtKelasIds = JadwalMengajar::where('guru_id', $guruId)->distinct('kelas_id')->pluck('kelas_id');
            $totalKelas = $taughtKelasIds->count();
            
            // Today's schedule
            $todaySchedule = JadwalMengajar::where('guru_id', $guruId)
                ->where('hari', $todayInIndonesian)
                ->with(['kelas', 'mataPelajaran'])
                ->get()
                ->map(function($j) {
                    return [
                        'class' => $j->kelas ? $j->kelas->nama : '-',
                        'subject' => $j->mataPelajaran ? $j->mataPelajaran->nama : '-',
                        'time' => date('H:i', strtotime($j->jam_mulai)) . ' - ' . date('H:i', strtotime($j->jam_selesai)),
                        'room' => $j->ruangan ?? '-',
                    ];
                });
                
            $allTodaySchedule = JadwalMengajar::where('guru_id', $guruId)
                ->with(['kelas', 'mataPelajaran'])
                ->get()
                ->map(function($j) {
                    return [
                        'hari' => $j->hari,
                        'class' => $j->kelas ? $j->kelas->nama : '-',
                        'subject' => $j->mataPelajaran ? $j->mataPelajaran->nama : '-',
                    ];
                });

            // Class performance
            $classPerformance = Kelas::whereIn('id', $taughtKelasIds)->get()->map(function($k) use ($guruId, $dateRange) {
                $studentCount = User::where('kelas_id', $k->id)->whereHas('role', function($q) { $q->where('nama', 'siswa'); })->count();
                
                $avgScore = Nilai::whereHas('siswa', function($q) use ($k) {
                    $q->where('kelas_id', $k->id);
                })->where('guru_id', $guruId)->whereBetween('created_at', $dateRange)->avg('nilai') ?? 0;
                
                $totalAbsensi = Absensi::where('kelas_id', $k->id)->where('guru_id', $guruId)->whereBetween('tanggal', $dateRange)->count();
                $hadirCount = Absensi::where('kelas_id', $k->id)->where('guru_id', $guruId)->whereBetween('tanggal', $dateRange)->where('status', 'hadir')->count();
                $attendance = $totalAbsensi > 0 ? round(($hadirCount / $totalAbsensi) * 100) : 0;
                
                return [
                    'id' => $k->id,
                    'name' => $k->nama,
                    'students' => $studentCount,
                    'avgScore' => round($avgScore, 1),
                    'attendance' => $attendance
                ];
            });

            // Submission status calculation
            $totalExpected = 0;
            $tugasList = Tugas::where('guru_id', $guruId)->whereBetween('created_at', $dateRange)->get();
            foreach ($tugasList as $t) {
                $totalExpected += User::where('kelas_id', $t->kelas_id)->whereHas('role', function($q) { $q->where('nama', 'siswa'); })->count();
            }
            
            $sudahCount = PengumpulanTugas::whereHas('tugas', function($q) use ($guruId) { $q->where('guru_id', $guruId); })
                ->whereBetween('created_at', $dateRange)
                ->where('status', 'Tepat Waktu')->count();
            $terlambatCount = PengumpulanTugas::whereHas('tugas', function($q) use ($guruId) { $q->where('guru_id', $guruId); })
                ->whereBetween('created_at', $dateRange)
                ->where('status', 'Terlambat')->count();
            $belumCount = max(0, $totalExpected - ($sudahCount + $terlambatCount));
            $totalStatus = $belumCount + $sudahCount + $terlambatCount;

            $submissionStatus = [
                ['status' => 'Belum Dikumpulkan', 'count' => $belumCount, 'percentage' => $totalStatus > 0 ? round(($belumCount / $totalStatus) * 100) : 0, 'color' => 'bg-gray-400'],
                ['status' => 'Sudah Dikumpulkan', 'count' => $sudahCount, 'percentage' => $totalStatus > 0 ? round(($sudahCount / $totalStatus) * 100) : 0, 'color' => 'bg-green-500'],
                ['status' => 'Terlambat', 'count' => $terlambatCount, 'percentage' => $totalStatus > 0 ? round(($terlambatCount / $totalStatus) * 100) : 0, 'color' => 'bg-red-500'],
            ];

            return [
                'status' => 'success',
                'data' => [
                    'totalMateri' => $totalMateri,
                    'totalTugas' => $totalTugas,
                    'activeTugas' => $activeTugas,
                    'pendingSubmissions' => $pendingSubmissions,
                    'totalKelas' => $totalKelas,
                    'todaySchedule' => $todaySchedule,
                    'allTodaySchedule' => $allTodaySchedule,
                    'classPerformance' => $classPerformance,
                    'submissionStatus' => $submissionStatus
                ]
            ];
        }

        if ($role === 'siswa') {
            $siswaId = $user->id;
            $kelasId = $user->kelas_id;

            $totalMateri = Materi::where('kelas_id', $kelasId)->whereBetween('created_at', $dateRange)->count();
            
            $activeTugas = Tugas::where('kelas_id', $kelasId)
                ->whereBetween('created_at', $dateRange)
                ->where('deadline', '>', now())
                ->whereDoesntHave('pengumpulanTugas', function($q) use ($siswaId) {
                    $q->where('siswa_id', $siswaId);
                })->count();
                
            $overdueTugas = Tugas::where('kelas_id', $kelasId)
                ->whereBetween('created_at', $dateRange)
                ->where('deadline', '<', now())
                ->whereDoesntHave('pengumpulanTugas', function($q) use ($siswaId) {
                    $q->where('siswa_id', $siswaId);
                })->count();

            $rataRataNilai = Nilai::where('siswa_id', $siswaId)->whereBetween('created_at', $dateRange)->avg('nilai') ?? 0;

            // Today's schedule
            $todaySchedule = JadwalMengajar::where('kelas_id', $kelasId)
                ->where('hari', $todayInIndonesian)
                ->with(['guru', 'mataPelajaran'])
                ->get()
                ->map(function($j) {
                    return [
                        'subject' => $j->mataPelajaran ? $j->mataPelajaran->nama : '-',
                        'teacher' => $j->guru ? $j->guru->nama : '-',
                        'time' => date('H:i', strtotime($j->jam_mulai)) . ' - ' . date('H:i', strtotime($j->jam_selesai)),
                        'room' => $j->ruangan ?? '-',
                        'status' => 'upcoming',
                    ];
                });

            $allSchedule = JadwalMengajar::where('kelas_id', $kelasId)
                ->with(['guru', 'mataPelajaran'])
                ->get()
                ->map(function($j) {
                    return [
                        'hari' => $j->hari,
                        'subject' => $j->mataPelajaran ? $j->mataPelajaran->nama : '-',
                    ];
                });

            // Learning progress
            $grades = Nilai::where('siswa_id', $siswaId)->whereBetween('created_at', $dateRange)->with(['mataPelajaran'])->get();
            $mapelNilai = [];
            foreach ($grades as $g) {
                $mapelId = $g->mata_pelajaran_id;
                if (!isset($mapelNilai[$mapelId])) {
                    $mapelNilai[$mapelId] = [
                        'subject' => $g->mataPelajaran ? $g->mataPelajaran->nama : '-',
                        'scores' => []
                    ];
                }
                $mapelNilai[$mapelId]['scores'][] = $g->nilai;
            }
            
            $learningProgress = [];
            foreach ($mapelNilai as $item) {
                $avg = round(array_sum($item['scores']) / count($item['scores']));
                $learningProgress[] = [
                    'subject' => $item['subject'],
                    'score' => $avg,
                    'progress' => $avg,
                    'color' => 'bg-primary'
                ];
            }

            // Upcoming deadlines
            $upcomingDeadlines = Tugas::where('kelas_id', $kelasId)
                ->whereBetween('created_at', $dateRange)
                ->where('deadline', '>', now())
                ->whereDoesntHave('pengumpulanTugas', function($q) use ($siswaId) {
                    $q->where('siswa_id', $siswaId);
                })
                ->with(['mataPelajaran'])
                ->orderBy('deadline', 'asc')
                ->take(5)
                ->get()
                ->map(function($t) {
                    $deadlineTime = strtotime($t->deadline);
                    $daysLeft = ceil(($deadlineTime - time()) / (60 * 60 * 24));
                    return [
                        'title' => $t->judul,
                        'subject' => $t->mataPelajaran ? $t->mataPelajaran->nama : '-',
                        'deadline' => date('d/m/Y', $deadlineTime),
                        'daysLeft' => $daysLeft,
                        'urgent' => $daysLeft <= 3,
                    ];
                });

            $totalAbsensi = Absensi::where('siswa_id', $siswaId)->whereBetween('tanggal', $dateRange)->count();
            $hadirAbsensi = Absensi::where('siswa_id', $siswaId)->whereBetween('tanggal', $dateRange)->where('status', 'hadir')->count();

            return [
                'status' => 'success',
                'data' => [
                    'totalMateri' => $totalMateri,
                    'activeTugas' => $activeTugas,
                    'overdueTugas' => $overdueTugas,
                    'rataRataNilai' => round($rataRataNilai, 1),
                    'todaySchedule' => $todaySchedule,
                    'allSchedule' => $allSchedule,
                    'learningProgress' => $learningProgress,
                    'upcomingDeadlines' => $upcomingDeadlines,
                    'totalAbsensi' => $totalAbsensi,
                    'hadirAbsensi' => $hadirAbsensi,
                ]
            ];
        }
    }


    /**
     * Get summary report for all students
     */
    public function getLaporanSiswa(Request $request)
    {
        // Cache key includes filters to cache different filter combinations
        $filterKey = md5(json_encode($request->only(['jurusan', 'kelas', 'search'])));
        $cacheKey = "laporan:siswa:{$filterKey}";
        
        // Cache report for 10 minutes
        $formattedData = CacheService::remember($cacheKey, 600, function() use ($request) {
            return $this->generateLaporanSiswa($request);
        });

        return response()->json([
            'status' => 'success',
            'data' => $formattedData
        ]);
    }
    
    /**
     * Generate student report data
     */
    private function generateLaporanSiswa(Request $request)
    {
        $query = User::whereHas('role', function($q) {
            $q->where('nama', 'siswa');
        })->with(['kelas.jurusan']);

        // Filtering
        if ($request->has('jurusan') && $request->jurusan !== 'all') {
            $query->whereHas('kelas.jurusan', function($q) use ($request) {
                $q->where('kode', $request->jurusan);
            });
        }
        
        if ($request->has('kelas') && $request->kelas !== 'all') {
            // Usually we pass ID or part of the name
            $query->whereHas('kelas', function($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->kelas . '%');
            });
        }
        
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
            });
        }

        // We use withCount and avg using eager loading to avoid N+1 query problem
        $siswaData = $query->withCount([
            'pengumpulanTugas as tugas_selesai',
            'absensi as total_absensi',
            'absensi as hadir_count' => function($q) {
                $q->where('status', 'hadir');
            }
        ])->get();
        
        // For avg nilai, Laravel doesn't have withAvg easily configurable for nested or simple relation without a specific column in older versions, 
        // we can use withAvg in Laravel 8+:
        $siswaData->loadAvg('nilai', 'nilai');
        
        $totalTugasGlobal = Tugas::count();

        $formattedData = $siswaData->map(function($siswa) use ($totalTugasGlobal) {
            $kehadiran = $siswa->total_absensi > 0 ? round(($siswa->hadir_count / $siswa->total_absensi) * 100) : 0;
            return [
                'id' => $siswa->id,
                'nis' => $siswa->nis ?? '-',
                'nama' => $siswa->nama,
                'kelas' => $siswa->kelas ? $siswa->kelas->nama : '-',
                'jurusan' => $siswa->kelas && $siswa->kelas->jurusan ? $siswa->kelas->jurusan->kode : '-',
                'avgNilai' => round($siswa->nilai_avg_nilai ?? 0, 1),
                'kehadiran' => $kehadiran,
                'tugasSelesai' => $siswa->tugas_selesai,
                'totalTugas' => $totalTugasGlobal, // Assuming total tugas applies to all, or we could calculate per kelas
                'ranking' => 0, // Will sort and assign later
                'trend' => rand(0, 1) ? 'up' : 'down' // Mock trend since historical data is complex
            ];
        })->sortByDesc('avgNilai')->values();

        // Assign rankings
        foreach ($formattedData as $index => $item) {
            $item['ranking'] = $index + 1;
            // Update array item
            $formattedData[$index] = $item;
        }

        return $formattedData;
    }

    /**
     * Get summary report for all teachers
     */
    public function getLaporanGuru(Request $request)
    {
        // Cache key includes filters
        $filterKey = md5(json_encode($request->only(['search'])));
        $cacheKey = "laporan:guru:{$filterKey}";
        
        // Cache report for 10 minutes
        $formattedData = CacheService::remember($cacheKey, 600, function() use ($request) {
            return $this->generateLaporanGuru($request);
        });

        return response()->json([
            'status' => 'success',
            'data' => $formattedData
        ]);
    }
    
    /**
     * Generate teacher report data
     */
    private function generateLaporanGuru(Request $request)
    {
        $query = User::whereHas('role', function($q) {
            $q->where('nama', 'guru');
        });

        // Filtering
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('nip', 'like', '%' . $request->search . '%');
            });
        }

        $guruData = $query->withCount([
            'materiGuru as materi_upload',
            'tugasGuru as tugas_dibuat'
        ])->with(['jadwalMengajar.kelas', 'jadwalMengajar.mataPelajaran'])->get();

        $formattedData = $guruData->map(function($guru) {
            // Get unique kelas taught
            $kelasIds = $guru->jadwalMengajar->pluck('kelas_id')->unique();
            $totalKelas = $kelasIds->count();
            
            // Get total student taught
            $totalSiswa = User::whereIn('kelas_id', $kelasIds)->whereHas('role', function($q) {
                $q->where('nama', 'siswa');
            })->count();

            // First mata pelajaran
            $firstJadwal = $guru->jadwalMengajar->first();
            $mataPelajaran = $firstJadwal && $firstJadwal->mataPelajaran ? $firstJadwal->mataPelajaran->nama : '-';

            // Average score of grades given by this teacher
            $avgNilaiSiswa = Nilai::where('guru_id', $guru->id)->avg('nilai') ?? 0;

            return [
                'id' => $guru->id,
                'email' => $guru->email,
                'nama' => $guru->nama,
                'mataPelajaran' => $mataPelajaran,
                'totalKelas' => $totalKelas,
                'totalSiswa' => $totalSiswa,
                'materiUpload' => $guru->materi_upload,
                'tugasDibuat' => $guru->tugas_dibuat,
                'avgNilaiSiswa' => round($avgNilaiSiswa, 1),
                'kehadiranMengajar' => 95 + rand(0, 5), // Mock attendance
                'statusAktif' => (bool)$guru->aktif
            ];
        });

        return $formattedData;
    }
    
    /**
     * Get recent activities for dashboard
     */
    private function getRecentActivities($dateRange)
    {
        $activities = [];
        
        // Recent users (last 10)
        $recentUsers = User::whereBetween('created_at', $dateRange)
            ->with('role')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        foreach ($recentUsers as $user) {
            $activities[] = [
                'type' => 'create',
                'user' => 'Admin',
                'action' => 'menambahkan',
                'target' => ($user->role ? $user->role->nama : 'user') . ' ' . $user->nama,
                'time' => $this->timeAgo($user->created_at),
                'timestamp' => $user->created_at->timestamp
            ];
        }
        
        // Recent materi (last 10)
        $recentMateri = Materi::whereBetween('created_at', $dateRange)
            ->with(['guru', 'mataPelajaran'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        foreach ($recentMateri as $materi) {
            $activities[] = [
                'type' => 'upload',
                'user' => $materi->guru ? $materi->guru->nama : 'Guru',
                'action' => 'mengupload materi',
                'target' => $materi->mataPelajaran ? $materi->mataPelajaran->nama : $materi->judul,
                'time' => $this->timeAgo($materi->created_at),
                'timestamp' => $materi->created_at->timestamp
            ];
        }
        
        // Recent tugas (last 10)
        $recentTugas = Tugas::whereBetween('created_at', $dateRange)
            ->with(['guru', 'mataPelajaran'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        foreach ($recentTugas as $tugas) {
            $activities[] = [
                'type' => 'create',
                'user' => $tugas->guru ? $tugas->guru->nama : 'Guru',
                'action' => 'membuat tugas',
                'target' => $tugas->judul,
                'time' => $this->timeAgo($tugas->created_at),
                'timestamp' => $tugas->created_at->timestamp
            ];
        }
        
        // Recent submissions (last 10)
        $recentSubmissions = PengumpulanTugas::whereBetween('created_at', $dateRange)
            ->with(['siswa', 'tugas'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        foreach ($recentSubmissions as $submission) {
            $activities[] = [
                'type' => 'upload',
                'user' => $submission->siswa ? $submission->siswa->nama : 'Siswa',
                'action' => 'mengumpulkan tugas',
                'target' => $submission->tugas ? $submission->tugas->judul : 'tugas',
                'time' => $this->timeAgo($submission->created_at),
                'timestamp' => $submission->created_at->timestamp
            ];
        }
        
        // Recent nilai (last 10)
        $recentNilai = Nilai::whereBetween('created_at', $dateRange)
            ->with(['guru', 'siswa', 'mataPelajaran'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        foreach ($recentNilai as $nilai) {
            $activities[] = [
                'type' => 'update',
                'user' => $nilai->guru ? $nilai->guru->nama : 'Guru',
                'action' => 'menginput nilai untuk',
                'target' => $nilai->siswa ? $nilai->siswa->nama : 'siswa',
                'time' => $this->timeAgo($nilai->created_at),
                'timestamp' => $nilai->created_at->timestamp
            ];
        }
        
        // Sort by timestamp descending and take 10 most recent
        usort($activities, function($a, $b) {
            return $b['timestamp'] <=> $a['timestamp'];
        });
        
        // Remove timestamp field and take only 10
        $activities = array_slice($activities, 0, 10);
        foreach ($activities as &$activity) {
            unset($activity['timestamp']);
        }
        
        return $activities;
    }
    
    /**
     * Convert timestamp to human readable time ago
     */
    private function timeAgo($datetime)
    {
        $now = now();
        $diff = $now->diffInSeconds($datetime);
        
        if ($diff < 60) {
            return 'Baru saja';
        } elseif ($diff < 3600) {
            $minutes = floor($diff / 60);
            return $minutes . ' menit yang lalu';
        } elseif ($diff < 86400) {
            $hours = floor($diff / 3600);
            return $hours . ' jam yang lalu';
        } elseif ($diff < 604800) {
            $days = floor($diff / 86400);
            return $days . ' hari yang lalu';
        } else {
            return $datetime->format('d M Y');
        }
    }
    
    /**
     * Get date range based on period
     */
    private function getDateRange($period)
    {
        $now = now();
        
        switch ($period) {
            case 'today':
                return [$now->copy()->startOfDay(), $now->copy()->endOfDay()];
                
            case 'week':
                return [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()];
                
            case 'month':
                return [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()];
                
            case 'year':
                return [$now->copy()->startOfYear(), $now->copy()->endOfYear()];
                
            default:
                return [$now->copy()->startOfDay(), $now->copy()->endOfDay()];
        }
    }
}
