import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import Login from '../pages/auth/Login';
import PrivateRoute from './PrivateRoute';

// Dashboard pages
import AdminDashboard from '../pages/admin/Dashboard';
import GuruDashboard from '../pages/guru/Dashboard';
import SiswaDashboard from '../pages/siswa/Dashboard';

// Admin pages
import Users from '../pages/admin/Users';
import Jurusan from '../pages/admin/Jurusan';
import Kelas from '../pages/admin/Kelas';
import MataPelajaran from '../pages/admin/MataPelajaran';
import Jadwal from '../pages/admin/Jadwal';
import LaporanSiswa from '../pages/admin/LaporanSiswa';
import LaporanGuru from '../pages/admin/LaporanGuru';
import Statistik from '../pages/admin/Statistik';
import Settings from '../pages/admin/Settings';
import Roles from '../pages/admin/Roles';

// Guru pages
import GuruMateri from '../pages/guru/Materi';
import GuruTugas from '../pages/guru/Tugas';
import TugasSubmissions from '../pages/guru/TugasSubmissions';
import GuruNilai from '../pages/guru/Nilai';
import GuruAbsensi from '../pages/guru/Absensi';

// Siswa pages
import SiswaMateri from '../pages/siswa/Materi';
import SiswaTugas from '../pages/siswa/Tugas';
import SiswaNilai from '../pages/siswa/Nilai';
import SiswaAbsensi from '../pages/siswa/Absensi';

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
            element: <AdminDashboard />,
          },
          {
            path: 'users',
            element: <Users />,
          },
          {
            path: 'jurusan',
            element: <Jurusan />,
          },
          {
            path: 'kelas',
            element: <Kelas />,
          },
          {
            path: 'mata-pelajaran',
            element: <MataPelajaran />,
          },
          {
            path: 'jadwal',
            element: <Jadwal />,
          },
          {
            path: 'roles',
            element: <Roles />,
          },
          {
            path: 'laporan/siswa',
            element: <LaporanSiswa />,
          },
          {
            path: 'laporan/guru',
            element: <LaporanGuru />,
          },
          {
            path: 'laporan/statistik',
            element: <Statistik />,
          },
          {
            path: 'settings',
            element: <Settings />,
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
            element: <GuruDashboard />,
          },
          {
            path: 'materi',
            element: <GuruMateri />,
          },
          {
            path: 'tugas',
            element: <GuruTugas />,
          },
          {
            path: 'tugas/:tugasId/submissions',
            element: <TugasSubmissions />,
          },
          {
            path: 'nilai',
            element: <GuruNilai />,
          },
          {
            path: 'absensi',
            element: <GuruAbsensi />,
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
            element: <SiswaDashboard />,
          },
          {
            path: 'materi',
            element: <SiswaMateri />,
          },
          {
            path: 'tugas',
            element: <SiswaTugas />,
          },
          {
            path: 'nilai',
            element: <SiswaNilai />,
          },
          {
            path: 'absensi',
            element: <SiswaAbsensi />,
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
