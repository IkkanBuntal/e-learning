<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nilai;

class NilaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Nilai::with(['siswa', 'guru', 'mataPelajaran', 'kelas']);

        // Filter by guru
        if ($request->has('guru_id')) {
            $query->where('guru_id', $request->guru_id);
        }

        // Filter by siswa
        if ($request->has('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }

        // Filter by kelas
        if ($request->has('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        // Filter by mata pelajaran
        if ($request->has('mata_pelajaran_id')) {
            $query->where('mata_pelajaran_id', $request->mata_pelajaran_id);
        }

        $nilai = $query->latest()->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $nilai
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:users,id',
            'guru_id' => 'required|exists:users,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'kelas_id' => 'required|exists:kelas,id',
            'nilai' => 'required|numeric|min:0|max:100',
            'jenis' => 'required|in:UH,UTS,UAS,Tugas',
            'catatan' => 'nullable|string'
        ]);

        $nilai = Nilai::create($validated);
        $nilai->load(['siswa', 'guru', 'mataPelajaran', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'Nilai berhasil ditambahkan',
            'data' => $nilai
        ], 201);
    }

    /**
     * Store multiple nilai at once
     */
    public function storeBulk(Request $request)
    {
        $validated = $request->validate([
            'nilai' => 'required|array',
            'nilai.*.siswa_id' => 'required|exists:users,id',
            'nilai.*.guru_id' => 'nullable|exists:users,id',
            'nilai.*.mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'nilai.*.kelas_id' => 'required|exists:kelas,id',
            'nilai.*.nilai' => 'required|numeric|min:0|max:100',
            'nilai.*.jenis' => 'required|in:UH,UTS,UAS,Tugas',
            'nilai.*.catatan' => 'nullable|string'
        ]);

        $nilaiList = [];
        foreach ($validated['nilai'] as $data) {
            if (empty($data['guru_id'])) {
                $data['guru_id'] = $request->user()->id;
            }
            
            // Try to find existing record to update, or create new
            $nilai = Nilai::updateOrCreate(
                [
                    'siswa_id' => $data['siswa_id'],
                    'mata_pelajaran_id' => $data['mata_pelajaran_id'],
                    'jenis' => $data['jenis'],
                    'kelas_id' => $data['kelas_id']
                ],
                [
                    'guru_id' => $data['guru_id'],
                    'nilai' => $data['nilai'],
                    'catatan' => $data['catatan'] ?? null
                ]
            );
            
            $nilai->load(['siswa', 'guru', 'mataPelajaran', 'kelas']);
            $nilaiList[] = $nilai;
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Nilai berhasil ditambahkan',
            'data' => $nilaiList
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Nilai $nilai)
    {
        $nilai->load(['siswa', 'guru', 'mataPelajaran', 'kelas']);
        return response()->json([
            'status' => 'success',
            'data' => $nilai
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Nilai $nilai)
    {
        $validated = $request->validate([
            'siswa_id' => 'exists:users,id',
            'guru_id' => 'exists:users,id',
            'mata_pelajaran_id' => 'exists:mata_pelajarans,id',
            'kelas_id' => 'exists:kelas,id',
            'nilai' => 'numeric|min:0|max:100',
            'jenis' => 'in:UH,UTS,UAS,Tugas',
            'catatan' => 'nullable|string'
        ]);

        $nilai->update($validated);
        $nilai->load(['siswa', 'guru', 'mataPelajaran', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'Nilai berhasil diperbarui',
            'data' => $nilai
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Nilai $nilai)
    {
        $nilai->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Nilai berhasil dihapus'
        ]);
    }

    /**
     * Get Nilai by Kelas (for Bulk Input)
     * Fetches all students in a class and left joins their grades for a specific mapel & jenis.
     */
    public function getNilaiByKelas(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'jenis' => 'required|in:UH,UTS,UAS,Tugas'
        ]);

        $kelasId = $request->kelas_id;
        $mapelId = $request->mata_pelajaran_id;
        $jenis = $request->jenis;

        // Get all students in the class
        $siswaList = \App\Models\User::where('kelas_id', $kelasId)
            ->whereHas('role', function ($q) {
                $q->where('nama', 'siswa');
            })->get();

        // Get existing grades for these students, mapel, and jenis
        $existingNilai = Nilai::where('kelas_id', $kelasId)
            ->where('mata_pelajaran_id', $mapelId)
            ->where('jenis', $jenis)
            ->get()
            ->keyBy('siswa_id');

        $result = $siswaList->map(function ($siswa) use ($existingNilai) {
            $nilaiRecord = $existingNilai->get($siswa->id);
            return [
                'siswa_id' => $siswa->id,
                'nama' => $siswa->nama,
                'nis' => $siswa->nis,
                'nilai' => $nilaiRecord ? $nilaiRecord->nilai : null,
                'catatan' => $nilaiRecord ? $nilaiRecord->catatan : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $result
        ]);
    }

    /**
     * Get Nilai summary for logged-in Siswa
     */
    public function summary(Request $request)
    {
        $user = $request->user();
        if ($user->role->nama !== 'siswa') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $allNilai = Nilai::where('siswa_id', $user->id)->get();

        if ($allNilai->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'rata_rata' => 0,
                    'tertinggi' => 0,
                    'terendah' => 0
                ]
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'rata_rata' => round($allNilai->avg('nilai'), 1),
                'tertinggi' => $allNilai->max('nilai'),
                'terendah' => $allNilai->min('nilai')
            ]
        ]);
    }

    /**
     * Get Nilai grouped by Mapel for logged-in Siswa
     */
    public function byMapel(Request $request)
    {
        $user = $request->user();
        if ($user->role->nama !== 'siswa') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $allNilai = Nilai::with('mataPelajaran')
            ->where('siswa_id', $user->id)
            ->get();

        // Group by mapel name
        $grouped = $allNilai->groupBy(function ($item) {
            return $item->mataPelajaran->nama;
        });

        $result = [];
        foreach ($grouped as $mapelName => $nilaiList) {
            $result[] = [
                'mata_pelajaran' => $mapelName,
                'rata_rata' => round($nilaiList->avg('nilai'), 1),
                'nilai_tertinggi' => $nilaiList->max('nilai'),
                'nilai_terendah' => $nilaiList->min('nilai'),
                'detail' => $nilaiList->map(function ($n) {
                    return [
                        'jenis' => $n->jenis,
                        'nilai' => $n->nilai,
                        'catatan' => $n->catatan
                    ];
                })
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => $result
        ]);
    }
}
