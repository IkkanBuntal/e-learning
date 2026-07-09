<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Models\User;
use App\Models\ActivityLog;

/**
 * ProfileController — handles personal profile updates
 * for the currently authenticated user (Admin, Guru, or Siswa).
 *
 * Routes (protected by auth:sanctum):
 *   GET /api/profile        → show   (get current user details)
 *   PUT /api/profile        → update (update name, email, phone, address, photo, password)
 */
class ProfileController extends Controller
{
    /**
     * GET /api/profile
     * Returns the currently authenticated user details.
     */
    public function show(Request $request)
    {
        $user = User::with(['role', 'kelas.jurusan'])->find($request->user()->id);

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * PUT /api/profile
     * Updates personal user info, profile photo, and password.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'no_telp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // max 2MB
            
            // Password change fields
            'current_password' => 'required_with:password|nullable|string',
            'password' => 'nullable|string|min:6|confirmed', // password_confirmation must be passed
        ]);

        // Validate current password if password is being updated
        if (!empty($validated['password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Password saat ini salah',
                    'errors' => [
                        'current_password' => ['Password saat ini tidak sesuai dengan database kami.']
                    ]
                ], 422);
            }
            $user->password = Hash::make($validated['password']);
        }

        // Handle profile photo upload or deletion
        if ($request->boolean('delete_photo')) {
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }
            $user->foto = null;
        } elseif ($request->hasFile('foto')) {
            // Delete old photo if it exists
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }
            $path = $request->file('foto')->store('avatars', 'public');
            $user->foto = $path;
        }

        // Update other fields
        if ($request->has('nama')) {
            $user->nama = $validated['nama'];
        }
        if ($request->has('email')) {
            $user->email = $validated['email'];
        }
        if ($request->has('no_telp')) {
            $user->no_telp = $validated['no_telp'];
        }
        if ($request->has('alamat')) {
            $user->alamat = $validated['alamat'];
        }

        $user->save();

        // Refresh user relation details for response
        $user->load(['role', 'kelas.jurusan']);

        // Log action
        ActivityLog::log('update', 'Profil', $user->nama, "Memperbarui pengaturan profil mandiri");

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui',
            'data' => $user
        ]);
    }
}
