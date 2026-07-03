<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CacheService;

class CacheController extends Controller
{
    /**
     * Get cache statistics
     */
    public function stats()
    {
        $stats = CacheService::getStats();
        
        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }
    
    /**
     * Clear all cache
     */
    public function clearAll()
    {
        try {
            CacheService::clearAll();
            
            return response()->json([
                'status' => 'success',
                'message' => 'All cache cleared successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to clear cache: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Clear cache by pattern
     */
    public function clearPattern(Request $request)
    {
        $request->validate([
            'pattern' => 'required|string'
        ]);
        
        try {
            CacheService::clearByPattern($request->pattern);
            
            return response()->json([
                'status' => 'success',
                'message' => "Cache cleared for pattern: {$request->pattern}"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to clear cache: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Clear specific cache types
     */
    public function clearType(Request $request, string $type)
    {
        try {
            switch ($type) {
                case 'dashboard':
                    CacheService::clearDashboardCache();
                    break;
                    
                case 'jadwal':
                    CacheService::clearJadwalCache();
                    break;
                    
                case 'kelas':
                    CacheService::clearKelasCache();
                    break;
                    
                case 'materi':
                    CacheService::clearMateriCache();
                    break;
                    
                case 'tugas':
                    CacheService::clearTugasCache();
                    break;
                    
                case 'nilai':
                    CacheService::clearNilaiCache();
                    break;
                    
                case 'absensi':
                    CacheService::clearAbsensiCache();
                    break;
                    
                default:
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Invalid cache type'
                    ], 400);
            }
            
            return response()->json([
                'status' => 'success',
                'message' => ucfirst($type) . ' cache cleared successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to clear cache: ' . $e->getMessage()
            ], 500);
        }
    }
}
