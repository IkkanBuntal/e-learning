<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        if (!in_array($user->role->nama, $roles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki izin untuk mengakses halaman ini',
            ], 403);
        }

        return $next($request);
    }
}
