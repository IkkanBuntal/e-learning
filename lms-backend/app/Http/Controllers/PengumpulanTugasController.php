<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\PengumpulanTugas;

class PengumpulanTugasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PengumpulanTugas::with(['tugas', 'siswa']);

        // Filter by tugas
        if ($request->has('tugas_id')) {
            $query->where('tugas_id', $request->tugas_id);
        }

        // Filter by siswa
        if ($request->has('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }

        $pengumpulan = $query->latest()->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $pengumpulan
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tugas_id' => 'required|exists:tugas,id',
            'siswa_id' => 'nullable|exists:users,id',
            'catatan' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx,zip|max:10240'
        ]);

        $data = $validated;
        $data['siswa_id'] = $request->siswa_id ?? $request->user()->id;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('pengumpulan_tugas', 'public');
            $data['file_path'] = $path;
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_size'] = $file->getSize();
            $data['file_type'] = $file->getMimeType();
        }

        $pengumpulan = PengumpulanTugas::create($data);
        $pengumpulan->load(['tugas', 'siswa']);

        return response()->json([
            'status' => 'success',
            'message' => 'Tugas berhasil dikumpulkan',
            'data' => $pengumpulan
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PengumpulanTugas $pengumpulanTugas)
    {
        $pengumpulanTugas->load(['tugas', 'siswa']);
        return response()->json([
            'status' => 'success',
            'data' => $pengumpulanTugas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PengumpulanTugas $pengumpulanTugas)
    {
        $validated = $request->validate([
            'nilai' => 'nullable|numeric|min:0|max:100',
            'catatan_guru' => 'nullable|string'
        ]);

        $pengumpulanTugas->update($validated);
        $pengumpulanTugas->load(['tugas', 'siswa']);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengumpulan tugas berhasil diperbarui',
            'data' => $pengumpulanTugas
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PengumpulanTugas $pengumpulanTugas)
    {
        // Delete file
        if ($pengumpulanTugas->file_path) {
            Storage::disk('public')->delete($pengumpulanTugas->file_path);
        }

        $pengumpulanTugas->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Pengumpulan tugas berhasil dihapus'
        ]);
    }

    /**
     * Download pengumpulan tugas file
     */
    public function download(PengumpulanTugas $pengumpulanTugas)
    {
        if (!$pengumpulanTugas->file_path) {
            return response()->json([
                'status' => 'error',
                'message' => 'File tidak ditemukan'
            ], 404);
        }

        return Storage::disk('public')->download($pengumpulanTugas->file_path, $pengumpulanTugas->file_name);
    }
}
