<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MataPelajaran;

class MataPelajaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mataPelajaran = MataPelajaran::with('jurusan')->get();
        return response()->json([
            'status' => 'success',
            'data' => $mataPelajaran
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|unique:mata_pelajarans,kode|max:20',
            'jurusan_id' => 'nullable|exists:jurusan,id',
            'deskripsi' => 'nullable|string'
        ]);

        $mataPelajaran = MataPelajaran::create($validated);
        $mataPelajaran->load('jurusan');

        return response()->json([
            'status' => 'success',
            'message' => 'Mata Pelajaran berhasil ditambahkan',
            'data' => $mataPelajaran
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(MataPelajaran $mataPelajaran)
    {
        $mataPelajaran->load('jurusan');
        return response()->json([
            'status' => 'success',
            'data' => $mataPelajaran
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MataPelajaran $mataPelajaran)
    {
        $validated = $request->validate([
            'nama' => 'string|max:255',
            'kode' => 'string|unique:mata_pelajarans,kode,' . $mataPelajaran->id . '|max:20',
            'jurusan_id' => 'nullable|exists:jurusan,id',
            'deskripsi' => 'nullable|string'
        ]);

        $mataPelajaran->update($validated);
        $mataPelajaran->load('jurusan');

        return response()->json([
            'status' => 'success',
            'message' => 'Mata Pelajaran berhasil diperbarui',
            'data' => $mataPelajaran
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MataPelajaran $mataPelajaran)
    {
        $mataPelajaran->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Mata Pelajaran berhasil dihapus'
        ]);
    }
}
