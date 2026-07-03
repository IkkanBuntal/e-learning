<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Absensi;

class AbsensiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Absensi::with(['siswa', 'guru', 'mataPelajaran', 'kelas']);

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

        // Filter by tanggal
        if ($request->has('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        $absensi = $query->latest()->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $absensi
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
            'tanggal' => 'required|date',
            'status' => 'required|in:Hadir,Sakit,Izin,Alpa',
            'catatan' => 'nullable|string'
        ]);

        $absensi = Absensi::create($validated);
        $absensi->load(['siswa', 'guru', 'mataPelajaran', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'Absensi berhasil ditambahkan',
            'data' => $absensi
        ], 201);
    }

    /**
     * Store multiple absensi at once
     */
    public function storeBulk(Request $request)
    {
        $validated = $request->validate([
            'absensi' => 'required|array',
            'absensi.*.siswa_id' => 'required|exists:users,id',
            'absensi.*.guru_id' => 'nullable|exists:users,id',
            'absensi.*.mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'absensi.*.kelas_id' => 'required|exists:kelas,id',
            'absensi.*.tanggal' => 'required|date',
            'absensi.*.status' => 'required|in:Hadir,Sakit,Izin,Alpa',
            'absensi.*.catatan' => 'nullable|string'
        ]);

        $absensiList = [];
        foreach ($validated['absensi'] as $data) {
            if (empty($data['guru_id'])) {
                $data['guru_id'] = $request->user()->id;
            }
            
            // Try to find existing record to update, or create new
            $absensi = Absensi::updateOrCreate(
                [
                    'siswa_id' => $data['siswa_id'],
                    'mata_pelajaran_id' => $data['mata_pelajaran_id'],
                    'tanggal' => $data['tanggal'],
                    'kelas_id' => $data['kelas_id']
                ],
                [
                    'guru_id' => $data['guru_id'],
                    'status' => $data['status'],
                    'catatan' => $data['catatan'] ?? null
                ]
            );
            
            $absensi->load(['siswa', 'guru', 'mataPelajaran', 'kelas']);
            $absensiList[] = $absensi;
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Absensi berhasil ditambahkan',
            'data' => $absensiList
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Absensi $absensi)
    {
        $absensi->load(['siswa', 'guru', 'mataPelajaran', 'kelas']);
        return response()->json([
            'status' => 'success',
            'data' => $absensi
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Absensi $absensi)
    {
        $validated = $request->validate([
            'siswa_id' => 'exists:users,id',
            'guru_id' => 'exists:users,id',
            'mata_pelajaran_id' => 'exists:mata_pelajarans,id',
            'kelas_id' => 'exists:kelas,id',
            'tanggal' => 'date',
            'status' => 'in:Hadir,Sakit,Izin,Alpa',
            'catatan' => 'nullable|string'
        ]);

        $absensi->update($validated);
        $absensi->load(['siswa', 'guru', 'mataPelajaran', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'Absensi berhasil diperbarui',
            'data' => $absensi
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Absensi $absensi)
    {
        $absensi->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Absensi berhasil dihapus'
        ]);
    }

    /**
     * Get Absensi by Kelas (for Bulk Input)
     * Fetches all students in a class and left joins their absensi for a specific mapel & tanggal.
     */
    public function getAbsensiByKelas(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'tanggal' => 'required|date'
        ]);

        $kelasId = $request->kelas_id;
        $mapelId = $request->mata_pelajaran_id;
        $tanggal = $request->tanggal;

        // Get all students in the class
        $siswaList = \App\Models\User::where('kelas_id', $kelasId)
            ->whereHas('role', function ($q) {
                $q->where('nama', 'siswa');
            })->get();

        // Get existing absensi for these students, mapel, and tanggal
        $existingAbsensi = Absensi::where('kelas_id', $kelasId)
            ->where('mata_pelajaran_id', $mapelId)
            ->whereDate('tanggal', $tanggal)
            ->get()
            ->keyBy('siswa_id');

        $result = $siswaList->map(function ($siswa) use ($existingAbsensi) {
            $absensiRecord = $existingAbsensi->get($siswa->id);
            return [
                'siswa_id' => $siswa->id,
                'nama' => $siswa->nama,
                'nis' => $siswa->nis,
                'status' => $absensiRecord ? strtolower($absensiRecord->status) : null,
                'catatan' => $absensiRecord ? $absensiRecord->catatan : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $result
        ]);
    }

    /**
     * Get Absensi summary for logged-in Siswa
     */
    public function summary(Request $request)
    {
        $user = $request->user();
        if ($user->role->nama !== 'siswa') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $query = Absensi::where('siswa_id', $user->id);

        if ($request->has('bulan')) {
            // bulan is expected in YYYY-MM format
            $query->where('tanggal', 'like', $request->bulan . '-%');
        }

        $absensi = $query->get();

        $hadir = $absensi->where('status', 'Hadir')->count();
        $sakit = $absensi->where('status', 'Sakit')->count();
        $izin = $absensi->where('status', 'Izin')->count();
        $alpha = $absensi->where('status', 'Alpa')->count(); // model enum uses Alpa not Alpha

        return response()->json([
            'status' => 'success',
            'data' => [
                'hadir' => $hadir,
                'sakit' => $sakit,
                'izin' => $izin,
                'alpha' => $alpha,
                'total' => $absensi->count()
            ]
        ]);
    }

    /**
     * Get Absensi chart data for logged-in Siswa
     */
    public function chart(Request $request)
    {
        $user = $request->user();
        if ($user->role->nama !== 'siswa') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $tahun = $request->tahun ?? date('Y');

        $absensi = Absensi::where('siswa_id', $user->id)
            ->whereYear('tanggal', $tahun)
            ->get();

        $chartData = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthAbsensi = $absensi->filter(function ($item) use ($tahun, $i) {
                return date('n', strtotime($item->tanggal)) == $i;
            });

            $chartData[] = [
                'name' => date('M', mktime(0, 0, 0, $i, 1)),
                'hadir' => $monthAbsensi->where('status', 'Hadir')->count(),
                'absen' => $monthAbsensi->whereIn('status', ['Sakit', 'Izin', 'Alpa'])->count(),
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => $chartData
        ]);
    }
}
