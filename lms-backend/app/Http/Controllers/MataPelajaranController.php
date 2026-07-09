<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;
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
        $jenisMap = [
            'umum' => 'Wajib',
            'produktif' => 'Peminatan',
            'muatan_lokal' => 'Muatan Lokal'
        ];
        
        $tingkat = null;
        if ($request->has('tingkat') && is_array($request->tingkat)) {
            if (count($request->tingkat) === 1) {
                $tingkatMap = ['10' => 'X', '11' => 'XI', '12' => 'XII'];
                $tingkat = $tingkatMap[$request->tingkat[0]] ?? null;
            }
        }
        
        $jurusanId = null;
        if ($request->has('jurusan_ids') && is_array($request->jurusan_ids) && count($request->jurusan_ids) > 0) {
            $jurusanId = $request->jurusan_ids[0];
        }
        
        $data = [
            'nama' => $request->nama,
            'kode' => $request->kode,
            'deskripsi' => $request->deskripsi,
            'jurusan_id' => $jurusanId,
            'tingkat' => $tingkat,
            'jam_pelajaran' => $request->sks ?? 2,
            'jenis' => $jenisMap[$request->kategori] ?? 'Wajib',
            'aktif' => $request->is_active ?? true,
        ];

        $validator = \Validator::make($data, [
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|unique:mata_pelajaran,kode|max:20',
            'jurusan_id' => 'nullable|exists:jurusan,id',
            'deskripsi' => 'nullable|string',
            'tingkat' => 'nullable|in:X,XI,XII',
            'jam_pelajaran' => 'required|integer|min:1',
            'jenis' => 'required|in:Wajib,Peminatan,Muatan Lokal',
            'aktif' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        $mataPelajaran = MataPelajaran::create($validated);
        $mataPelajaran->load('jurusan');
        ActivityLog::log('create', 'Mata Pelajaran', $mataPelajaran->nama, 'Menambahkan mata pelajaran baru');

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
        $jenisMap = [
            'umum' => 'Wajib',
            'produktif' => 'Peminatan',
            'muatan_lokal' => 'Muatan Lokal'
        ];
        
        $tingkat = null;
        if ($request->has('tingkat')) {
            if (is_array($request->tingkat)) {
                if (count($request->tingkat) === 1) {
                    $tingkatMap = ['10' => 'X', '11' => 'XI', '12' => 'XII'];
                    $tingkat = $tingkatMap[$request->tingkat[0]] ?? null;
                }
            } else {
                $tingkat = $request->tingkat;
            }
        } else {
            $tingkat = $mataPelajaran->tingkat;
        }
        
        $jurusanId = null;
        if ($request->has('jurusan_ids') && is_array($request->jurusan_ids)) {
            if (count($request->jurusan_ids) > 0) {
                $jurusanId = $request->jurusan_ids[0];
            }
        } elseif ($request->has('jurusan_id')) {
            $jurusanId = $request->jurusan_id;
        } else {
            $jurusanId = $mataPelajaran->jurusan_id;
        }
        
        $data = [];
        if ($request->has('nama')) $data['nama'] = $request->nama;
        if ($request->has('kode')) $data['kode'] = $request->kode;
        if ($request->has('deskripsi')) $data['deskripsi'] = $request->deskripsi;
        if ($request->has('jurusan_ids') || $request->has('jurusan_id')) $data['jurusan_id'] = $jurusanId;
        if ($request->has('tingkat')) $data['tingkat'] = $tingkat;
        if ($request->has('sks')) $data['jam_pelajaran'] = $request->sks;
        if ($request->has('kategori')) $data['jenis'] = $jenisMap[$request->kategori] ?? 'Wajib';
        if ($request->has('is_active')) $data['aktif'] = $request->is_active;

        $validator = \Validator::make($data, [
            'nama' => 'string|max:255',
            'kode' => 'string|unique:mata_pelajaran,kode,' . $mataPelajaran->id . '|max:20',
            'jurusan_id' => 'nullable|exists:jurusan,id',
            'deskripsi' => 'nullable|string',
            'tingkat' => 'nullable|in:X,XI,XII',
            'jam_pelajaran' => 'integer|min:1',
            'jenis' => 'in:Wajib,Peminatan,Muatan Lokal',
            'aktif' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        
        // Handle explicit null for tingkat when multiple or zero levels are set
        if (array_key_exists('tingkat', $data) && $data['tingkat'] === null) {
            $validated['tingkat'] = null;
        }

        $mataPelajaran->update($validated);
        $mataPelajaran->load('jurusan');
        ActivityLog::log('update', 'Mata Pelajaran', $mataPelajaran->nama, 'Mengubah data mata pelajaran');

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
        ActivityLog::log('delete', 'Mata Pelajaran', $mataPelajaran->nama, 'Menghapus mata pelajaran');
        $mataPelajaran->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Mata Pelajaran berhasil dihapus'
        ]);
    }
}
