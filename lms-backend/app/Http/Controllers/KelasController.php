<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kelas;

class KelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kelas = Kelas::with('jurusan')->get();
        return response()->json([
            'status' => 'success',
            'data' => $kelas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jurusan_id' => 'required|exists:jurusan,id',
            'tingkat' => 'required|in:X,XI,XII',
            'deskripsi' => 'nullable|string'
        ]);

        $kelas = Kelas::create($validated);
        $kelas->load('jurusan');

        return response()->json([
            'status' => 'success',
            'message' => 'Kelas berhasil ditambahkan',
            'data' => $kelas
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Kelas $kelas)
    {
        $kelas->load(['jurusan', 'siswa']);
        return response()->json([
            'status' => 'success',
            'data' => $kelas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kelas $kelas)
    {
        $validated = $request->validate([
            'nama' => 'string|max:255',
            'jurusan_id' => 'exists:jurusan,id',
            'tingkat' => 'in:X,XI,XII',
            'deskripsi' => 'nullable|string'
        ]);

        $kelas->update($validated);
        $kelas->load('jurusan');

        return response()->json([
            'status' => 'success',
            'message' => 'Kelas berhasil diperbarui',
            'data' => $kelas
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kelas $kelas)
    {
        $kelas->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Kelas berhasil dihapus'
        ]);
    }
}
