<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, int $ttl = 3600): Response
    {
        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        // Generate cache key based on URL and query parameters
        $cacheKey = $this->getCacheKey($request);

        // Check if response is already cached
        if (Cache::has($cacheKey)) {
            $cachedResponse = Cache::get($cacheKey);
            
            return response()->json($cachedResponse['data'], $cachedResponse['status'])
                ->withHeaders([
                    'X-Cache' => 'HIT',
                    'X-Cache-Key' => $cacheKey,
                ]);
        }

        // Process request
        $response = $next($request);

        // Cache successful responses
        if ($response->isSuccessful() && $response instanceof \Illuminate\Http\JsonResponse) {
            Cache::put($cacheKey, [
                'data' => $response->getData(true),
                'status' => $response->getStatusCode(),
            ], $ttl);

            $response->withHeaders([
                'X-Cache' => 'MISS',
                'X-Cache-Key' => $cacheKey,
            ]);
        }

        return $response;
    }

    /**
     * Generate cache key based on request
     */
    private function getCacheKey(Request $request): string
    {
        $user = $request->user();
        $userId = $user ? $user->id : 'guest';
        $role = $user ? $user->role->nama : 'guest';
        
        $url = $request->fullUrl();
        
        return 'api_cache:' . $role . ':' . $userId . ':' . md5($url);
    }
}
