<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pengumuman;

class PengumumanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pengumuman = Pengumuman::with('admin')->latest()->paginate(10);
        return response()->json([
            'status' => 'success',
            'data' => $pengumuman
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'admin_id' => 'required|exists:users,id',
            'tanggal' => 'required|date'
        ]);

        $pengumuman = Pengumuman::create($validated);
        $pengumuman->load('admin');

        return response()->json([
            'status' => 'success',
            'message' => 'Pengumuman berhasil ditambahkan',
            'data' => $pengumuman
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pengumuman $pengumuman)
    {
        $pengumuman->load('admin');
        return response()->json([
            'status' => 'success',
            'data' => $pengumuman
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pengumuman $pengumuman)
    {
        $validated = $request->validate([
            'judul' => 'string|max:255',
            'isi' => 'string',
            'admin_id' => 'exists:users,id',
            'tanggal' => 'date'
        ]);

        $pengumuman->update($validated);
        $pengumuman->load('admin');

        return response()->json([
            'status' => 'success',
            'message' => 'Pengumuman berhasil diperbarui',
            'data' => $pengumuman
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengumuman $pengumuman)
    {
        $pengumuman->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Pengumuman berhasil dihapus'
        ]);
    }
}
