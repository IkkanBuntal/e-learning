import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import { 
  Download, 
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  PieChart,
  Calendar,
  GraduationCap
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';

const Statistik = () => {
  const [periode, setPeriode] = useState('semester');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getStats();
        if (res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Gagal memuat statistik.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    alert('Export statistik lengkap');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
        {error || 'Data tidak tersedia'}
      </div>
    );
  }

  // Construct overallStats for calculations
  const overallStats = {
    totalSiswa: stats.totalSiswa,
    totalGuru: stats.totalGuru,
    totalKelas: stats.totalKelas,
    totalMateri: stats.totalMateri,
    totalTugas: stats.totalTugas,
    avgNilai: stats.avgNilai,
    avgKehadiran: stats.avgKehadiran,
    tugasTepat: stats.tugasTepat || 0
  };

  const overallStatsCards = [
    {
      title: 'Total Siswa',
      value: stats.totalSiswa.toLocaleString(),
      icon: Users,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: 0,
      trendLabel: 'terdaftar',
    },
    {
      title: 'Total Guru',
      value: stats.totalGuru.toString(),
      icon: GraduationCap,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: 0,
      trendLabel: 'aktif',
    },
    {
      title: 'Total Materi',
      value: stats.totalMateri.toString(),
      icon: BookOpen,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: 0,
      trendLabel: 'diunggah',
    },
    {
      title: 'Total Tugas',
      value: stats.totalTugas.toString(),
      icon: ClipboardList,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      trend: 0,
      trendLabel: 'dibuat',
    },
  ];

  const growthData = [
    { label: 'Siswa Baru', value: stats.totalSiswa, change: 'total', positive: true },
    { label: 'Guru Baru', value: stats.totalGuru, change: 'total', positive: true },
    { label: 'Materi Upload', value: stats.totalMateri, change: 'total', positive: true },
    { label: 'Avg Kehadiran', value: `${stats.avgKehadiran}%`, change: 'avg', positive: true },
  ];

  const jurusanStats = stats.siswaPerJurusan || [];

  const kelasStats = [
    { tingkat: 'XII', total: 420, lulus: 400, avgNilai: stats.avgNilai },
    { tingkat: 'XI', total: 398, lulus: '-', avgNilai: stats.avgNilai },
    { tingkat: 'X', total: 371, lulus: '-', avgNilai: stats.avgNilai },
  ];

  const performanceByMonth = [
    { bulan: 'Jan', avgNilai: 78, kehadiran: 85 },
    { bulan: 'Feb', avgNilai: 80, kehadiran: 87 },
    { bulan: 'Mar', avgNilai: 82, kehadiran: 88 },
    { bulan: 'Apr', avgNilai: 81, kehadiran: 89 },
    { bulan: 'Mei', avgNilai: 83, kehadiran: 90 },
    { bulan: 'Jun', avgNilai: stats.avgNilai, kehadiran: stats.avgKehadiran },
  ];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistik Sistem"
        subtitle="Statistik lengkap dan analisis performa sistem"
        actions={
          <div className="flex gap-2">
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            >
              <option value="bulan">Bulan Ini</option>
              <option value="semester">Semester Ini</option>
              <option value="tahun">Tahun Ajaran</option>
            </select>
            <Button variant="primary" size="sm" icon={Download} onClick={handleExport}>
              Export
            </Button>
          </div>
        }
      />

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallStatsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Growth Statistics */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pertumbuhan {periode === 'bulan' ? 'Bulan Ini' : periode === 'semester' ? 'Semester Ini' : 'Tahun Ini'}</h3>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {growthData.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{item.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  item.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.positive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{item.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi per Jurusan */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Distribusi per Jurusan
            </h3>
          </div>
          <div className="space-y-4">
            {jurusanStats.map((jurusan, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{jurusan.name}</span>
                  <span className="text-sm text-gray-600">
                    {jurusan.siswa} siswa
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${jurusan.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{jurusan.percentage}% dari total</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Statistik per Tingkat */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Statistik per Tingkat
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-semibold text-gray-900 pb-3">Tingkat</th>
                  <th className="text-center text-sm font-semibold text-gray-900 pb-3">Siswa</th>
                  <th className="text-center text-sm font-semibold text-gray-900 pb-3">Lulus</th>
                  <th className="text-right text-sm font-semibold text-gray-900 pb-3">Avg Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {kelasStats.map((kelas, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">Kelas {kelas.tingkat}</td>
                    <td className="py-3 text-center text-sm text-gray-600">{kelas.total}</td>
                    <td className="py-3 text-center text-sm">
                      {kelas.lulus !== '-' ? (
                        <Badge variant="success" size="sm">{kelas.lulus}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`text-sm font-semibold ${
                        kelas.avgNilai >= 85 ? 'text-green-600' :
                        kelas.avgNilai >= 75 ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {kelas.avgNilai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Performance Trend */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Trend Performa (6 Bulan Terakhir)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-semibold text-gray-900 pb-3 px-4">Bulan</th>
                {performanceByMonth.map((data) => (
                  <th key={data.bulan} className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">
                    {data.bulan}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">Avg Nilai</td>
                {performanceByMonth.map((data, index) => (
                  <td key={index} className="py-3 px-4 text-center">
                    <span className={`font-semibold ${
                      data.avgNilai >= 85 ? 'text-green-600' :
                      data.avgNilai >= 75 ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {data.avgNilai}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">Kehadiran %</td>
                {performanceByMonth.map((data, index) => (
                  <td key={index} className="py-3 px-4 text-center">
                    <span className={`font-semibold ${
                      data.kehadiran >= 90 ? 'text-green-600' :
                      data.kehadiran >= 80 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {data.kehadiran}%
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Rata-rata Nilai Keseluruhan"
          value={overallStats.avgNilai}
          icon={BarChart3}
          iconBgColor="bg-primary-100"
          iconColor="text-primary-600"
          trend={3.5}
          trendLabel="vs last semester"
        />
        <StatCard
          title="Rata-rata Kehadiran"
          value={`${overallStats.avgKehadiran}%`}
          icon={Users}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          trend={-1.2}
          trendLabel="vs last semester"
        />
        <StatCard
          title="Tugas Tepat Waktu"
          value={`${overallStats.tugasTepat}%`}
          icon={ClipboardList}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          trend={5}
          trendLabel="vs last semester"
        />
      </div>
    </div>
  );
};

export default Statistik;
