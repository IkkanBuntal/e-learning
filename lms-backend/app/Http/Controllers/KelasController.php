<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kelas;

class KelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Kelas::with('jurusan');

        // Filter by jurusan
        if ($request->has('jurusan_id')) {
            $query->where('jurusan_id', $request->jurusan_id);
        }

        // Filter by tingkat
        if ($request->has('tingkat')) {
            $query->where('tingkat', $request->tingkat);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('ruangan', 'like', "%{$search}%")
                  ->orWhere('wali_kelas', 'like', "%{$search}%");
            });
        }

        $kelas = $query->paginate(10);
        
        // Add wali_kelas_id untuk setiap kelas
        $kelas->getCollection()->transform(function ($item) {
            if ($item->wali_kelas) {
                // Trim whitespace dan cari guru
                $namaWaliKelas = trim($item->wali_kelas);
                $guru = \App\Models\User::where('nama', $namaWaliKelas)->first();
                
                if (!$guru) {
                    \Illuminate\Support\Facades\Log::warning('Guru tidak ditemukan untuk wali kelas: ' . $namaWaliKelas);
                }
                
                $item->wali_kelas_id = $guru ? $guru->id : null;
            } else {
                $item->wali_kelas_id = null;
            }
            return $item;
        });

        return response()->json([
            'status' => 'success',
            'data' => $kelas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jurusan_id' => 'required|exists:jurusan,id',
            'tingkat' => 'required|in:10,11,12,X,XI,XII',
            'wali_kelas_id' => 'nullable|exists:users,id',
            'kapasitas' => 'nullable|integer|min:1|max:50',
            'is_active' => 'nullable|boolean',
            'ruangan' => 'nullable|string|max:50',
            'deskripsi' => 'nullable|string'
        ]);

        // Convert numeric tingkat to roman numeral
        if (in_array($validated['tingkat'], ['10', '11', '12'])) {
            $validated['tingkat'] = ['10' => 'X', '11' => 'XI', '12' => 'XII'][$validated['tingkat']];
        }

        // Set defaults
        $validated['aktif'] = $validated['is_active'] ?? true;
        unset($validated['is_active']);
        
        $validated['kapasitas'] = $validated['kapasitas'] ?? 36;
        
        // Handle wali_kelas - convert ID to name
        if (array_key_exists('wali_kelas_id', $validated)) {
            if ($validated['wali_kelas_id']) {
                $waliKelas = \App\Models\User::find($validated['wali_kelas_id']);
                $validated['wali_kelas'] = $waliKelas ? $waliKelas->nama : null;
            } else {
                $validated['wali_kelas'] = null;
            }
            unset($validated['wali_kelas_id']);
        }

        $kelas = Kelas::create($validated);
        $kelas->load('jurusan');

        return response()->json([
            'status' => 'success',
            'message' => 'Kelas berhasil ditambahkan',
            'data' => $kelas
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Kelas $kelas)
    {
        $kelas->load(['jurusan', 'siswa']);
        return response()->json([
            'status' => 'success',
            'data' => $kelas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kelas $kelas)
    {
        \Illuminate\Support\Facades\Log::info('Updating kelas ID: ' . $kelas->id);
        \Illuminate\Support\Facades\Log::info('Request data: ' . json_encode($request->all()));
        
        $validated = $request->validate([
            'nama' => 'string|max:255',
            'jurusan_id' => 'exists:jurusan,id',
            'tingkat' => 'in:10,11,12,X,XI,XII',
            'wali_kelas_id' => 'nullable|exists:users,id',
            'kapasitas' => 'nullable|integer|min:1|max:50',
            'is_active' => 'nullable|boolean',
            'ruangan' => 'nullable|string|max:50',
            'deskripsi' => 'nullable|string'
        ]);

        \Illuminate\Support\Facades\Log::info('Validated data: ' . json_encode($validated));

        // Convert numeric tingkat to roman numeral
        if (isset($validated['tingkat']) && in_array($validated['tingkat'], ['10', '11', '12'])) {
            $validated['tingkat'] = ['10' => 'X', '11' => 'XI', '12' => 'XII'][$validated['tingkat']];
        }

        // Handle is_active
        if (isset($validated['is_active'])) {
            $validated['aktif'] = $validated['is_active'];
            unset($validated['is_active']);
        }
        
        // Handle wali_kelas - convert ID to name
        if (array_key_exists('wali_kelas_id', $validated)) {
            if ($validated['wali_kelas_id']) {
                $waliKelas = \App\Models\User::find($validated['wali_kelas_id']);
                $validated['wali_kelas'] = $waliKelas ? $waliKelas->nama : null;
                \Illuminate\Support\Facades\Log::info('Found wali kelas: ' . ($waliKelas ? $waliKelas->nama : 'null'));
            } else {
                $validated['wali_kelas'] = null;
                \Illuminate\Support\Facades\Log::info('Wali kelas set to null');
            }
            unset($validated['wali_kelas_id']);
        }

        \Illuminate\Support\Facades\Log::info('Final data to update: ' . json_encode($validated));

        $kelas->update($validated);
        
        // Re-fetch from database to ensure fresh data
        $kelas = Kelas::with('jurusan')->find($kelas->id);
        
        // Add wali_kelas_id to response
        if ($kelas->wali_kelas) {
            $namaWaliKelas = trim($kelas->wali_kelas);
            $guru = \App\Models\User::where('nama', $namaWaliKelas)->first();
            $kelas->wali_kelas_id = $guru ? $guru->id : null;
        } else {
            $kelas->wali_kelas_id = null;
        }
        
        \Illuminate\Support\Facades\Log::info('Updated kelas: ' . json_encode($kelas));

        return response()->json([
            'status' => 'success',
            'message' => 'Kelas berhasil diperbarui',
            'data' => $kelas
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kelas $kelas)
    {
        try {
            \Illuminate\Support\Facades\Log::info('Attempting to delete kelas ID: ' . $kelas->id);
            \Illuminate\Support\Facades\Log::info('Kelas name: ' . $kelas->nama);
            
            // Remove students from this class (set kelas_id to NULL)
            // This is needed because FK is set to 'set null' not 'cascade'
            $updated = \App\Models\User::where('kelas_id', $kelas->id)->update(['kelas_id' => null]);
            \Illuminate\Support\Facades\Log::info('Updated ' . $updated . ' students');
            
            // Delete the kelas - related records will cascade automatically
            $deleted = $kelas->delete();
            \Illuminate\Support\Facades\Log::info('Delete result: ' . ($deleted ? 'success' : 'failed'));
            
            if (!$deleted) {
                throw new \Exception('Failed to delete kelas from database');
            }
            
            \Illuminate\Support\Facades\Log::info('Kelas deleted successfully');
            
            return response()->json([
                'status' => 'success',
                'message' => 'Kelas berhasil dihapus'
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            \Illuminate\Support\Facades\Log::error('QueryException deleting kelas: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error('SQL Error Code: ' . $e->getCode());
            
            // Check if it's a foreign key constraint
            if (strpos($e->getMessage(), 'foreign key constraint') !== false || 
                strpos($e->getMessage(), 'FOREIGN KEY') !== false ||
                strpos($e->getMessage(), 'Integrity constraint violation') !== false) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tidak dapat menghapus kelas karena masih memiliki data terkait'
                ], 400);
            }
            
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus kelas: Database error - ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Exception deleting kelas: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus kelas: ' . $e->getMessage()
            ], 500);
        }
    }
}
