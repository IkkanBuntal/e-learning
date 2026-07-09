<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\JurusanController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\MataPelajaranController;
use App\Http\Controllers\JadwalMengajarController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\TugasController;
use App\Http\Controllers\PengumpulanTugasController;
use App\Http\Controllers\NilaiController;
use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CacheController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
|*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::get('/health', [HealthController::class, 'check']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/search', [SearchController::class, 'globalSearch']);
    
    // Profile routes (Any authenticated user)
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);

    // Resource routes with role middleware
    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('jurusan', JurusanController::class);
        Route::apiResource('kelas', KelasController::class);
        Route::apiResource('mata-pelajaran', MataPelajaranController::class);
        Route::apiResource('jadwal-mengajar', JadwalMengajarController::class);
        Route::apiResource('pengumuman', PengumumanController::class);
        Route::apiResource('roles', RoleController::class);
        Route::get('setting', [SettingController::class, 'show']);
        Route::put('setting', [SettingController::class, 'update']);
        Route::get('laporan/siswa', [DashboardController::class, 'getLaporanSiswa']);
        Route::get('laporan/guru', [DashboardController::class, 'getLaporanGuru']);
        
        // Cache management routes (admin only)
        Route::prefix('cache')->group(function () {
            Route::get('stats', [CacheController::class, 'stats']);
            Route::post('clear', [CacheController::class, 'clearAll']);
            Route::post('clear-pattern', [CacheController::class, 'clearPattern']);
            Route::post('clear/{type}', [CacheController::class, 'clearType']);
        });
    });

    Route::middleware(['role:admin,guru'])->group(function () {
        Route::apiResource('materi', MateriController::class)->except(['show', 'index']);
        Route::post('materi/{materi}/download', [MateriController::class, 'download']);
        
        Route::apiResource('tugas', TugasController::class)->except(['show', 'index']);
        Route::post('tugas/{tugas}/download', [TugasController::class, 'download']);
        
        Route::apiResource('pengumpulan-tugas', PengumpulanTugasController::class)->except(['store', 'show', 'index']);
        Route::post('pengumpulan-tugas/{pengumpulanTugas}/download', [PengumpulanTugasController::class, 'download']);
        
        Route::get('nilai/kelas', [NilaiController::class, 'getNilaiByKelas']);
        Route::apiResource('nilai', NilaiController::class);
        Route::post('nilai/bulk', [NilaiController::class, 'storeBulk']);
        
        Route::get('absensi/kelas', [AbsensiController::class, 'getAbsensiByKelas']);
        Route::apiResource('absensi', AbsensiController::class);
        Route::post('absensi/bulk', [AbsensiController::class, 'storeBulk']);
    });

    Route::middleware(['role:guru,siswa'])->group(function () {
        Route::get('materi', [MateriController::class, 'index']);
        Route::get('materi/{materi}', [MateriController::class, 'show']);
        
        Route::get('tugas', [TugasController::class, 'index']);
        Route::get('tugas/{tugas}', [TugasController::class, 'show']);
        
        Route::get('pengumuman', [PengumumanController::class, 'index']);
        Route::get('pengumuman/{pengumuman}', [PengumumanController::class, 'show']);
    });

    Route::middleware(['role:siswa'])->group(function () {
        Route::post('pengumpulan-tugas', [PengumpulanTugasController::class, 'store']);
        Route::get('pengumpulan-tugas', [PengumpulanTugasController::class, 'index']);
        Route::get('pengumpulan-tugas/{pengumpulanTugas}', [PengumpulanTugasController::class, 'show']);
        
        Route::get('nilai/summary', [NilaiController::class, 'summary']);
        Route::get('nilai/by-mapel', [NilaiController::class, 'byMapel']);
        Route::get('nilai', [NilaiController::class, 'index']);
        
        Route::get('absensi/summary', [AbsensiController::class, 'summary']);
        Route::get('absensi/chart', [AbsensiController::class, 'chart']);
        Route::get('absensi', [AbsensiController::class, 'index']);
    });
});
