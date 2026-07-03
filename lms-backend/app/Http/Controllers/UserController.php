<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::with(['role', 'kelas']);

        // Filter by role
        if ($request->has('role')) {
            $query->whereHas('role', function($q) use ($request) {
                $q->where('nama', $request->role);
            });
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role_id' => 'required|exists:roles,id',
            'kelas_id' => 'nullable|exists:kelas,id',
            'nip' => 'nullable|string|unique:users,nip',
            'nis' => 'nullable|string|unique:users,nis',
            'jenis_kelamin' => 'nullable|in:L,P',
            'alamat' => 'nullable|string',
            'no_telp' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string',
            'aktif' => 'boolean'
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['aktif'] = $validated['aktif'] ?? true;

        $user = User::create($validated);
        $user->load(['role', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil ditambahkan',
            'data' => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load(['role', 'kelas']);
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'nama' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
            'role_id' => 'exists:roles,id',
            'kelas_id' => 'nullable|exists:kelas,id',
            'nip' => 'nullable|string|unique:users,nip,' . $user->id,
            'nis' => 'nullable|string|unique:users,nis,' . $user->id,
            'jenis_kelamin' => 'nullable|in:L,P',
            'alamat' => 'nullable|string',
            'no_telp' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string',
            'aktif' => 'boolean'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        $user->load(['role', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil diperbarui',
            'data' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil dihapus'
        ]);
    }
}
