<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Tugas;

class TugasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Tugas::with(['guru', 'mataPelajaran', 'kelas']);

        // Filter by guru
        if ($request->has('guru_id')) {
            $query->where('guru_id', $request->guru_id);
        }

        // Filter by kelas
        if ($request->has('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        $tugas = $query->latest()->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $tugas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'guru_id' => 'nullable|exists:users,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'kelas_id' => 'required|exists:kelas,id',
            'deadline' => 'required|date',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,zip|max:10240'
        ]);

        $data = $validated;
        $data['guru_id'] = $request->guru_id ?? $request->user()->id;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('tugas', 'public');
            $data['file_path'] = $path;
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_size'] = $file->getSize();
            $data['file_type'] = $file->getMimeType();
        }

        $tugas = Tugas::create($data);
        $tugas->load(['guru', 'mataPelajaran', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'Tugas berhasil ditambahkan',
            'data' => $tugas
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tugas $tugas)
    {
        $tugas->load(['guru', 'mataPelajaran', 'kelas', 'pengumpulanTugas.siswa']);
        return response()->json([
            'status' => 'success',
            'data' => $tugas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tugas $tugas)
    {
        $validated = $request->validate([
            'judul' => 'string|max:255',
            'deskripsi' => 'nullable|string',
            'guru_id' => 'nullable|exists:users,id',
            'mata_pelajaran_id' => 'exists:mata_pelajarans,id',
            'kelas_id' => 'exists:kelas,id',
            'deadline' => 'date',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,zip|max:10240'
        ]);

        $data = $validated;
        if (empty($data['guru_id'])) {
            $data['guru_id'] = $request->user()->id;
        }

        if ($request->hasFile('file')) {
            // Delete old file
            if ($tugas->file_path) {
                Storage::disk('public')->delete($tugas->file_path);
            }

            $file = $request->file('file');
            $path = $file->store('tugas', 'public');
            $data['file_path'] = $path;
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_size'] = $file->getSize();
            $data['file_type'] = $file->getMimeType();
        }

        $tugas->update($data);
        $tugas->load(['guru', 'mataPelajaran', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'Tugas berhasil diperbarui',
            'data' => $tugas
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tugas $tugas)
    {
        // Delete file
        if ($tugas->file_path) {
            Storage::disk('public')->delete($tugas->file_path);
        }

        $tugas->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Tugas berhasil dihapus'
        ]);
    }

    /**
     * Download tugas file
     */
    public function download(Tugas $tugas)
    {
        if (!$tugas->file_path) {
            return response()->json([
                'status' => 'error',
                'message' => 'File tidak ditemukan'
            ], 404);
        }

        return Storage::disk('public')->download($tugas->file_path, $tugas->file_name);
    }
}
