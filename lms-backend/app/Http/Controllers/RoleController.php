<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use App\Services\CacheService;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Role::withCount('users');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        $roles = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|unique:roles,nama|max:50',
            'deskripsi' => 'nullable|string'
        ]);

        $role = Role::create($validated);
        $role->loadCount('users');

        // Clear dashboard cache if needed
        CacheService::clearPattern(CacheService::PATTERN_DASHBOARD);

        return response()->json([
            'status' => 'success',
            'message' => 'Role berhasil ditambahkan',
            'data' => $role
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $role->loadCount('users');
        $role->load(['users' => function($q) {
            $q->select('id', 'role_id', 'nama', 'email', 'nip', 'nis', 'aktif')->limit(20);
        }]);

        return response()->json([
            'status' => 'success',
            'data' => $role
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'nama' => 'string|unique:roles,nama,' . $role->id . '|max:50',
            'deskripsi' => 'nullable|string'
        ]);

        // Prevent changing core system role names (admin, guru, siswa)
        $coreRoles = ['admin', 'guru', 'siswa'];
        if (in_array(strtolower($role->nama), $coreRoles) && isset($validated['nama']) && strtolower($validated['nama']) !== strtolower($role->nama)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nama role sistem bawaan (admin, guru, siswa) tidak boleh diubah'
            ], 422);
        }

        $role->update($validated);
        $role->loadCount('users');

        return response()->json([
            'status' => 'success',
            'message' => 'Role berhasil diperbarui',
            'data' => $role
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        // Core roles cannot be deleted
        $coreRoles = ['admin', 'guru', 'siswa'];
        if (in_array(strtolower($role->nama), $coreRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role sistem bawaan (admin, guru, siswa) tidak dapat dihapus'
            ], 422);
        }

        // Roles with users cannot be deleted
        if ($role->users()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role tidak dapat dihapus karena masih memiliki user yang terhubung'
            ], 422);
        }

        $role->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Role berhasil dihapus'
        ]);
    }
}
