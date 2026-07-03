import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Eager load only critical components
import AppLayout from '../layouts/AppLayout';
import Login from '../pages/auth/Login';

// Lazy load all other components
// Dashboard pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const GuruDashboard = lazy(() => import('../pages/guru/Dashboard'));
const SiswaDashboard = lazy(() => import('../pages/siswa/Dashboard'));

// Admin pages
const Users = lazy(() => import('../pages/admin/Users'));
const Jurusan = lazy(() => import('../pages/admin/Jurusan'));
const Kelas = lazy(() => import('../pages/admin/Kelas'));
const MataPelajaran = lazy(() => import('../pages/admin/MataPelajaran'));
const Jadwal = lazy(() => import('../pages/admin/Jadwal'));
const LaporanSiswa = lazy(() => import('../pages/admin/LaporanSiswa'));
const LaporanGuru = lazy(() => import('../pages/admin/LaporanGuru'));
const Statistik = lazy(() => import('../pages/admin/Statistik'));
const Settings = lazy(() => import('../pages/admin/Settings'));
const Roles = lazy(() => import('../pages/admin/Roles'));

// Guru pages
const GuruMateri = lazy(() => import('../pages/guru/Materi'));
const GuruTugas = lazy(() => import('../pages/guru/Tugas'));
const TugasSubmissions = lazy(() => import('../pages/guru/TugasSubmissions'));
const GuruNilai = lazy(() => import('../pages/guru/Nilai'));
const GuruAbsensi = lazy(() => import('../pages/guru/Absensi'));

// Siswa pages
const SiswaMateri = lazy(() => import('../pages/siswa/Materi'));
const SiswaTugas = lazy(() => import('../pages/siswa/Tugas'));
const SiswaNilai = lazy(() => import('../pages/siswa/Nilai'));
const SiswaAbsensi = lazy(() => import('../pages/siswa/Absensi'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p className="mt-4 text-gray-600">Memuat halaman...</p>
    </div>
  </div>
);

// Wrapper component with Suspense
const LazyComponent = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

/**
 * Application Routes Configuration
 * 
 * Structure:
 * - Public routes (Login, Register)
 * - Protected routes (Dashboard, etc)
 * - Role-based routes (Admin, Guru, Siswa)
 */
const router = createBrowserRouter([
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // Auth routes (public)
  {
    path: '/login',
    element: <Login />,
  },

  // Admin routes (protected)
  {
    path: '/admin',
    element: <PrivateRoute allowedRoles={['admin']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: 'dashboard',
            element: <LazyComponent><AdminDashboard /></LazyComponent>,
          },
          {
            path: 'users',
            element: <LazyComponent><Users /></LazyComponent>,
          },
          {
            path: 'jurusan',
            element: <LazyComponent><Jurusan /></LazyComponent>,
          },
          {
            path: 'kelas',
            element: <LazyComponent><Kelas /></LazyComponent>,
          },
          {
            path: 'mata-pelajaran',
            element: <LazyComponent><MataPelajaran /></LazyComponent>,
          },
          {
            path: 'jadwal',
            element: <LazyComponent><Jadwal /></LazyComponent>,
          },
          {
            path: 'roles',
            element: <LazyComponent><Roles /></LazyComponent>,
          },
          {
            path: 'laporan/siswa',
            element: <LazyComponent><LaporanSiswa /></LazyComponent>,
          },
          {
            path: 'laporan/guru',
            element: <LazyComponent><LaporanGuru /></LazyComponent>,
          },
          {
            path: 'laporan/statistik',
            element: <LazyComponent><Statistik /></LazyComponent>,
          },
          {
            path: 'settings',
            element: <LazyComponent><Settings /></LazyComponent>,
          },
        ],
      },
    ],
  },

  // Guru routes (protected)
  {
    path: '/guru',
    element: <PrivateRoute allowedRoles={['guru']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: 'dashboard',
            element: <LazyComponent><GuruDashboard /></LazyComponent>,
          },
          {
            path: 'materi',
            element: <LazyComponent><GuruMateri /></LazyComponent>,
          },
          {
            path: 'tugas',
            element: <LazyComponent><GuruTugas /></LazyComponent>,
          },
          {
            path: 'tugas/:tugasId/submissions',
            element: <LazyComponent><TugasSubmissions /></LazyComponent>,
          },
          {
            path: 'nilai',
            element: <LazyComponent><GuruNilai /></LazyComponent>,
          },
          {
            path: 'absensi',
            element: <LazyComponent><GuruAbsensi /></LazyComponent>,
          },
          // More guru routes can be added later
        ],
      },
    ],
  },

  // Siswa routes (protected)
  {
    path: '/siswa',
    element: <PrivateRoute allowedRoles={['siswa']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: 'dashboard',
            element: <LazyComponent><SiswaDashboard /></LazyComponent>,
          },
          {
            path: 'materi',
            element: <LazyComponent><SiswaMateri /></LazyComponent>,
          },
          {
            path: 'tugas',
            element: <LazyComponent><SiswaTugas /></LazyComponent>,
          },
          {
            path: 'nilai',
            element: <LazyComponent><SiswaNilai /></LazyComponent>,
          },
          {
            path: 'absensi',
            element: <LazyComponent><SiswaAbsensi /></LazyComponent>,
          },
          // More siswa routes can be added later
        ],
      },
    ],
  },

  // 404 Not Found
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;
