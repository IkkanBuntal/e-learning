<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JadwalMengajar;

class JadwalMengajarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = JadwalMengajar::with(['guru', 'mataPelajaran', 'kelas']);

        // Filter by guru
        if ($request->has('guru_id')) {
            $query->where('guru_id', $request->guru_id);
        }

        // Filter by kelas
        if ($request->has('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        $jadwal = $query->orderBy('hari')->orderBy('jam_mulai')->get();

        return response()->json([
            'status' => 'success',
            'data' => $jadwal
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'guru_id' => 'required|exists:users,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'kelas_id' => 'required|exists:kelas,id',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'ruangan' => 'nullable|string|max:50'
        ]);

        $jadwal = JadwalMengajar::create($validated);
        $jadwal->load(['guru', 'mataPelajaran', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal berhasil ditambahkan',
            'data' => $jadwal
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(JadwalMengajar $jadwalMengajar)
    {
        $jadwalMengajar->load(['guru', 'mataPelajaran', 'kelas']);
        return response()->json([
            'status' => 'success',
            'data' => $jadwalMengajar
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JadwalMengajar $jadwalMengajar)
    {
        $validated = $request->validate([
            'guru_id' => 'exists:users,id',
            'mata_pelajaran_id' => 'exists:mata_pelajarans,id',
            'kelas_id' => 'exists:kelas,id',
            'hari' => 'in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'jam_mulai' => 'date_format:H:i',
            'jam_selesai' => 'date_format:H:i|after:jam_mulai',
            'ruangan' => 'nullable|string|max:50'
        ]);

        $jadwalMengajar->update($validated);
        $jadwalMengajar->load(['guru', 'mataPelajaran', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal berhasil diperbarui',
            'data' => $jadwalMengajar
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JadwalMengajar $jadwalMengajar)
    {
        $jadwalMengajar->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal berhasil dihapus'
        ]);
    }
}
