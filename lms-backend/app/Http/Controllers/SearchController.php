<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Jurusan;
use App\Models\MataPelajaran;
use App\Models\Materi;

class SearchController extends Controller
{
    /**
     * Perform a global search across multiple models.
     * GET /api/search?q=query_string
     */
    public function globalSearch(Request $request)
    {
        $query = $request->input('q');

        if (empty($query) || strlen(trim($query)) < 2) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'users' => [],
                    'kelas' => [],
                    'jurusan' => [],
                    'mata_pelajaran' => [],
                    'materi' => []
                ]
            ]);
        }

        $term = '%' . trim($query) . '%';

        // 1. Search Users (Siswa & Guru)
        $users = User::with('role')
            ->where(function($q) use ($term) {
                $q->where('nama', 'like', $term)
                  ->orWhere('email', 'like', $term)
                  ->orWhere('nis', 'like', $term)
                  ->orWhere('nip', 'like', $term);
            })
            ->limit(5)
            ->get()
            ->map(function($u) {
                return [
                    'id' => $u->id,
                    'title' => $u->nama,
                    'subtitle' => $u->role ? ucfirst($u->role->nama) : 'Pengguna',
                    'url' => '/admin/users?search=' . urlencode($u->nama),
                    'type' => 'user'
                ];
            });

        // 2. Search Kelas
        $kelas = Kelas::where('nama', 'like', $term)
            ->limit(5)
            ->get()
            ->map(function($k) {
                return [
                    'id' => $k->id,
                    'title' => $k->nama,
                    'subtitle' => 'Kelas',
                    'url' => '/admin/kelas',
                    'type' => 'kelas'
                ];
            });

        // 3. Search Jurusan
        $jurusan = Jurusan::where('nama', 'like', $term)
            ->orWhere('kode', 'like', $term)
            ->limit(5)
            ->get()
            ->map(function($j) {
                return [
                    'id' => $j->id,
                    'title' => $j->nama . ' (' . $j->kode . ')',
                    'subtitle' => 'Jurusan',
                    'url' => '/admin/jurusan',
                    'type' => 'jurusan'
                ];
            });

        // 4. Search Mata Pelajaran
        $mapel = MataPelajaran::where('nama', 'like', $term)
            ->orWhere('kode', 'like', $term)
            ->limit(5)
            ->get()
            ->map(function($mp) {
                return [
                    'id' => $mp->id,
                    'title' => $mp->nama,
                    'subtitle' => 'Mata Pelajaran',
                    'url' => '/admin/mata-pelajaran',
                    'type' => 'mata_pelajaran'
                ];
            });

        // 5. Search Materi
        $materi = Materi::where('judul', 'like', $term)
            ->limit(5)
            ->get()
            ->map(function($m) {
                $role = auth()->user()->role?->nama;
                $url = $role === 'admin' ? '/admin/dashboard' : ($role === 'guru' ? '/guru/materi' : '/siswa/materi');
                return [
                    'id' => $m->id,
                    'title' => $m->judul,
                    'subtitle' => 'Materi Pembelajaran',
                    'url' => $url,
                    'type' => 'materi'
                ];
            });

        // Merge all results into a single flat array for easier search-dropdown display
        $results = collect()
            ->concat($users)
            ->concat($kelas)
            ->concat($jurusan)
            ->concat($mapel)
            ->concat($materi)
            ->all();

        return response()->json([
            'status' => 'success',
            'data' => $results
        ]);
    }
}
