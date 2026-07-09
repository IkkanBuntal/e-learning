<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class HealthController extends Controller
{
    /**
     * Check overall system health.
     */
    public function check(Request $request)
    {
        $startTime = microtime(true);

        // --- Database check ---
        $dbStatus = 'ok';
        $dbLatencyMs = null;
        try {
            $dbStart = microtime(true);
            DB::select('SELECT 1');
            $dbLatencyMs = round((microtime(true) - $dbStart) * 1000, 2);
        } catch (\Exception $e) {
            $dbStatus = 'error';
        }

        // --- Cache check ---
        $cacheStatus = 'ok';
        try {
            Cache::put('health_check_ping', 'pong', 5);
            $cacheVal = Cache::get('health_check_ping');
            if ($cacheVal !== 'pong') {
                $cacheStatus = 'error';
            }
        } catch (\Exception $e) {
            $cacheStatus = 'error';
        }

        // --- Memory usage ---
        $memoryUsedBytes  = memory_get_usage(true);
        $memoryLimitBytes = $this->parseMemoryLimit(ini_get('memory_limit'));
        $memoryPercent    = $memoryLimitBytes > 0
            ? round(($memoryUsedBytes / $memoryLimitBytes) * 100, 1)
            : 0;

        // --- Total response time ---
        $responseTimeMs = round((microtime(true) - $startTime) * 1000, 2);

        // --- Overall status ---
        $overallStatus = ($dbStatus === 'ok' && $cacheStatus === 'ok') ? 'ok' : 'degraded';

        return response()->json([
            'status'  => $overallStatus,
            'timestamp' => now()->toIso8601String(),
            'uptime'  => $this->getUptime(),
            'response_time_ms' => $responseTimeMs,
            'services' => [
                'database' => [
                    'status'     => $dbStatus,
                    'latency_ms' => $dbLatencyMs,
                ],
                'cache' => [
                    'status' => $cacheStatus,
                ],
                'api' => [
                    'status' => 'ok',
                ],
            ],
            'memory' => [
                'used_mb'    => round($memoryUsedBytes / 1024 / 1024, 2),
                'limit_mb'   => round($memoryLimitBytes / 1024 / 1024, 2),
                'percent'    => $memoryPercent,
            ],
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
        ]);
    }

    /**
     * Parse PHP memory_limit string to bytes.
     */
    private function parseMemoryLimit(string $val): int
    {
        $val  = trim($val);
        $last = strtolower($val[strlen($val) - 1]);
        $num  = (int) $val;
        switch ($last) {
            case 'g': $num *= 1024;
            // fall through
            case 'm': $num *= 1024;
            // fall through
            case 'k': $num *= 1024;
        }
        return $num;
    }

    /**
     * Get server uptime (Linux only).
     */
    private function getUptime(): ?string
    {
        if (PHP_OS_FAMILY !== 'Linux') {
            return null;
        }
        $uptimeFile = '/proc/uptime';
        if (!file_exists($uptimeFile)) {
            return null;
        }
        $seconds = (float) explode(' ', file_get_contents($uptimeFile))[0];
        $days    = floor($seconds / 86400);
        $hours   = floor(($seconds % 86400) / 3600);
        $minutes = floor(($seconds % 3600) / 60);

        if ($days > 0) {
            return "{$days}d {$hours}h {$minutes}m";
        }
        if ($hours > 0) {
            return "{$hours}h {$minutes}m";
        }
        return "{$minutes}m";
    }
}
