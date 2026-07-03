<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    // Cache TTL constants (in seconds)
    const TTL_SHORT = 300;      // 5 minutes
    const TTL_MEDIUM = 1800;    // 30 minutes
    const TTL_LONG = 3600;      // 1 hour
    const TTL_VERY_LONG = 86400; // 24 hours

    /**
     * Cache keys patterns
     */
    const PATTERN_USER = 'user:';
    const PATTERN_KELAS = 'kelas:';
    const PATTERN_JADWAL = 'jadwal:';
    const PATTERN_MATERI = 'materi:';
    const PATTERN_TUGAS = 'tugas:';
    const PATTERN_NILAI = 'nilai:';
    const PATTERN_ABSENSI = 'absensi:';
    const PATTERN_DASHBOARD = 'dashboard:';

    /**
     * Remember data with caching
     */
    public static function remember(string $key, int $ttl, callable $callback)
    {
        return Cache::remember($key, $ttl, $callback);
    }

    /**
     * Get cached data
     */
    public static function get(string $key, $default = null)
    {
        return Cache::get($key, $default);
    }

    /**
     * Put data into cache
     */
    public static function put(string $key, $value, int $ttl = self::TTL_MEDIUM): bool
    {
        return Cache::put($key, $value, $ttl);
    }

    /**
     * Forget (delete) cached data
     */
    public static function forget(string $key): bool
    {
        return Cache::forget($key);
    }

    /**
     * Clear cache by pattern
     */
    public static function clearByPattern(string $pattern): void
    {
        $keys = Cache::getRedis()->keys("*{$pattern}*");
        
        if (!empty($keys)) {
            foreach ($keys as $key) {
                // Remove prefix from key if exists
                $cleanKey = str_replace(config('cache.prefix'), '', $key);
                Cache::forget($cleanKey);
            }
        }
    }

    /**
     * Clear user-related cache
     */
    public static function clearUserCache(int $userId): void
    {
        self::clearByPattern(self::PATTERN_USER . $userId);
    }

    /**
     * Clear kelas-related cache
     */
    public static function clearKelasCache(int $kelasId = null): void
    {
        $pattern = self::PATTERN_KELAS . ($kelasId ? $kelasId : '*');
        self::clearByPattern($pattern);
    }

    /**
     * Clear jadwal-related cache
     */
    public static function clearJadwalCache(): void
    {
        self::clearByPattern(self::PATTERN_JADWAL);
    }

    /**
     * Clear materi-related cache
     */
    public static function clearMateriCache(int $materiId = null): void
    {
        $pattern = self::PATTERN_MATERI . ($materiId ? $materiId : '*');
        self::clearByPattern($pattern);
    }

    /**
     * Clear tugas-related cache
     */
    public static function clearTugasCache(int $tugasId = null): void
    {
        $pattern = self::PATTERN_TUGAS . ($tugasId ? $tugasId : '*');
        self::clearByPattern($pattern);
    }

    /**
     * Clear nilai-related cache
     */
    public static function clearNilaiCache(int $siswaId = null): void
    {
        $pattern = self::PATTERN_NILAI . ($siswaId ? $siswaId : '*');
        self::clearByPattern($pattern);
    }

    /**
     * Clear absensi-related cache
     */
    public static function clearAbsensiCache(): void
    {
        self::clearByPattern(self::PATTERN_ABSENSI);
    }

    /**
     * Clear dashboard cache
     */
    public static function clearDashboardCache(int $userId = null): void
    {
        $pattern = self::PATTERN_DASHBOARD . ($userId ? $userId : '*');
        self::clearByPattern($pattern);
    }

    /**
     * Clear all application cache
     */
    public static function clearAll(): bool
    {
        return Cache::flush();
    }

    /**
     * Get cache statistics
     */
    public static function getStats(): array
    {
        try {
            $redis = Cache::getRedis();
            $info = $redis->info();
            
            return [
                'connected' => true,
                'used_memory' => $info['used_memory_human'] ?? 'N/A',
                'total_keys' => $redis->dbSize(),
                'hits' => $info['keyspace_hits'] ?? 0,
                'misses' => $info['keyspace_misses'] ?? 0,
                'hit_rate' => self::calculateHitRate($info),
            ];
        } catch (\Exception $e) {
            return [
                'connected' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Calculate cache hit rate
     */
    private static function calculateHitRate(array $info): string
    {
        $hits = $info['keyspace_hits'] ?? 0;
        $misses = $info['keyspace_misses'] ?? 0;
        $total = $hits + $misses;

        if ($total === 0) {
            return '0%';
        }

        return number_format(($hits / $total) * 100, 2) . '%';
    }
}
