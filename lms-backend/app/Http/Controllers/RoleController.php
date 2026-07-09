<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;
use App\Models\Role;

/**
 * RoleController — CRUD untuk Role & Permission.
 *
 * Routes (semuanya admin-only):
 *   GET    /api/roles          → index   (list semua role + jumlah user)
 *   GET    /api/roles/{id}     → show
 *   POST   /api/roles          → store
 *   PUT    /api/roles/{id}     → update
 *   DELETE /api/roles/{id}     → destroy
 *
 * Menggunakan withCount() per docs Laravel 13:
 * https://laravel.com/docs/13.x/eloquent-relationships#counting-related-models
 */
class RoleController extends Controller
{
    /**
     * GET /api/roles
     * Kembalikan semua role beserta jumlah user (withCount) dan permissions.
     */
    public function index()
    {
        // withCount('users') menambah atribut users_count tanpa load seluruh relasi
        $roles = Role::withCount('users')
            ->orderBy('id')
            ->get()
            ->map(fn($role) => $this->format($role));

        return response()->json([
            'status' => 'success',
            'data'   => $roles,
        ]);
    }

    /**
     * GET /api/roles/{role}
     */
    public function show(Role $role)
    {
        $role->loadCount('users');

        return response()->json([
            'status' => 'success',
            'data'   => $this->format($role),
        ]);
    }

    /**
     * POST /api/roles
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama'        => 'required|string|max:50|unique:roles,nama|lowercase',
            'deskripsi'   => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role = Role::create($validated);
        $role->loadCount('users');

        ActivityLog::log('create', 'Role', $role->nama, "Menambahkan role baru: {$role->nama}");

        return response()->json([
            'status'  => 'success',
            'message' => 'Role berhasil ditambahkan',
            'data'    => $this->format($role),
        ], 201);
    }

    /**
     * PUT /api/roles/{role}
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'nama'          => 'sometimes|string|max:50|unique:roles,nama,' . $role->id,
            'deskripsi'     => 'nullable|string|max:255',
            'permissions'   => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role->update($validated);
        $role->loadCount('users');

        ActivityLog::log('update', 'Role', $role->nama, "Mengubah role: {$role->nama}");

        return response()->json([
            'status'  => 'success',
            'message' => 'Role berhasil diperbarui',
            'data'    => $this->format($role),
        ]);
    }

    /**
     * DELETE /api/roles/{role}
     * Tidak boleh hapus role 'admin' agar sistem tidak terkunci.
     */
    public function destroy(Role $role)
    {
        if (strtolower($role->nama) === 'admin') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Role admin tidak dapat dihapus',
            ], 422);
        }

        if ($role->users()->count() > 0) {
            return response()->json([
                'status'  => 'error',
                'message' => "Role '{$role->nama}' masih memiliki user aktif dan tidak dapat dihapus",
            ], 422);
        }

        ActivityLog::log('delete', 'Role', $role->nama, "Menghapus role: {$role->nama}");
        $role->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Role berhasil dihapus',
        ]);
    }

    // ─── Helper ──────────────────────────────────────────────────────────────

    /**
     * Format role untuk response API agar sesuai dengan struktur
     * yang dipakai oleh frontend Roles.jsx.
     */
    private function format(Role $role): array
    {
        return [
            'id'          => $role->id,
            'name'        => $role->nama,
            'displayName' => ucfirst($role->nama),
            'description' => $role->deskripsi ?? '',
            'userCount'   => $role->users_count ?? 0,
            'permissions' => $role->permissions ?? [],
        ];
    }
}
