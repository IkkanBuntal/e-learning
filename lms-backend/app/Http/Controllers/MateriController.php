<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Materi;

class MateriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Materi::with(['guru', 'mataPelajaran', 'kelas']);

        // Filter by guru
        if ($request->has('guru_id')) {
            $query->where('guru_id', $request->guru_id);
        }

        // Filter by kelas
        if ($request->has('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        // Filter by mata pelajaran
        if ($request->has('mata_pelajaran_id')) {
            $query->where('mata_pelajaran_id', $request->mata_pelajaran_id);
        }

        $materi = $query->latest()->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $materi
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
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,zip|max:10240'
        ]);

        $data = $validated;
        $data['guru_id'] = $request->guru_id ?? $request->user()->id;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('materi', 'public');
            $data['file_path'] = $path;
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_size'] = $file->getSize();
            $data['file_type'] = $file->getMimeType();
        }

        $materi = Materi::create($data);
        $materi->load(['guru', 'mataPelajaran', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'Materi berhasil ditambahkan',
            'data' => $materi
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Materi $materi)
    {
        $materi->load(['guru', 'mataPelajaran', 'kelas']);
        return response()->json([
            'status' => 'success',
            'data' => $materi
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Materi $materi)
    {
        $validated = $request->validate([
            'judul' => 'string|max:255',
            'deskripsi' => 'nullable|string',
            'guru_id' => 'nullable|exists:users,id',
            'mata_pelajaran_id' => 'exists:mata_pelajarans,id',
            'kelas_id' => 'exists:kelas,id',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,zip|max:10240'
        ]);

        $data = $validated;
        if (empty($data['guru_id'])) {
            $data['guru_id'] = $request->user()->id;
        }

        if ($request->hasFile('file')) {
            // Delete old file
            if ($materi->file_path) {
                Storage::disk('public')->delete($materi->file_path);
            }

            $file = $request->file('file');
            $path = $file->store('materi', 'public');
            $data['file_path'] = $path;
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_size'] = $file->getSize();
            $data['file_type'] = $file->getMimeType();
        }

        $materi->update($data);
        $materi->load(['guru', 'mataPelajaran', 'kelas']);

        return response()->json([
            'status' => 'success',
            'message' => 'Materi berhasil diperbarui',
            'data' => $materi
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Materi $materi)
    {
        // Delete file
        if ($materi->file_path) {
            Storage::disk('public')->delete($materi->file_path);
        }

        $materi->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Materi berhasil dihapus'
        ]);
    }

    /**
     * Download materi file
     */
    public function download(Materi $materi)
    {
        if (!$materi->file_path) {
            return response()->json([
                'status' => 'error',
                'message' => 'File tidak ditemukan'
            ], 404);
        }

        return Storage::disk('public')->download($materi->file_path, $materi->file_name);
    }
}
