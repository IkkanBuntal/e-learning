<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Jurusan;

class JurusanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jurusan = Jurusan::all();
        return response()->json([
            'status' => 'success',
            'data' => $jurusan
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|unique:jurusan,kode|max:20',
            'deskripsi' => 'nullable|string'
        ]);

        $jurusan = Jurusan::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Jurusan berhasil ditambahkan',
            'data' => $jurusan
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Jurusan $jurusan)
    {
        return response()->json([
            'status' => 'success',
            'data' => $jurusan
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Jurusan $jurusan)
    {
        $validated = $request->validate([
            'nama' => 'string|max:255',
            'kode' => 'string|unique:jurusan,kode,' . $jurusan->id . '|max:20',
            'deskripsi' => 'nullable|string'
        ]);

        $jurusan->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Jurusan berhasil diperbarui',
            'data' => $jurusan
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jurusan $jurusan)
    {
        $jurusan->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Jurusan berhasil dihapus'
        ]);
    }
}
