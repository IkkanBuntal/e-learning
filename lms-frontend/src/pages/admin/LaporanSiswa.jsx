import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import { 
  Download, 
  FileText, 
  Search,
  Filter,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';


const LaporanSiswa = () => {
  const [filters, setFilters] = useState({
    jurusan: 'all',
    kelas: 'all',
    periode: 'semester',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [laporanData, setLaporanData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getLaporanSiswa({
          jurusan: filters.jurusan,
          kelas: filters.kelas,
          search: filters.search
        });
        if (res.data) {
          setLaporanData(res.data);
        }
      } catch (error) {
        console.error('Error fetching laporan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.jurusan, filters.kelas, filters.search]);

  const avgNilaiAll = laporanData.length > 0
    ? Math.round((laporanData.reduce((sum, s) => sum + s.avgNilai, 0) / laporanData.length) * 10) / 10
    : 0;
  const avgKehadiranAll = laporanData.length > 0
    ? Math.round((laporanData.reduce((sum, s) => sum + s.kehadiran, 0) / laporanData.length) * 10) / 10
    : 0;
  const tugasOnTimePct = laporanData.length > 0 && laporanData[0].totalTugas > 0
    ? Math.round((laporanData.reduce((sum, s) => sum + s.tugasSelesai, 0) /
        laporanData.reduce((sum, s) => sum + Math.max(s.totalTugas, 1), 0)) * 100)
    : 0;

  const summary = {
    totalSiswa: laporanData.length,
    avgKehadiran: avgKehadiranAll,
    avgNilai: avgNilaiAll,
    tugasOnTime: tugasOnTimePct,
  };

  const summaryStats = [
    {
      title: 'Total Siswa',
      value: summary.totalSiswa.toString(),
      icon: Users,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Avg Kehadiran',
      value: `${summary.avgKehadiran}%`,
      icon: CheckCircle,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: 0,
      trendLabel: 'aktif',
    },
    {
      title: 'Avg Nilai',
      value: summary.avgNilai.toString(),
      icon: FileText,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: 0,
      trendLabel: 'rata-rata kelas',
    },
    {
      title: 'Tugas Tepat Waktu',
      value: `${summary.tugasOnTime}%`,
      icon: Calendar,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      trend: 0,
      trendLabel: 'rata-rata tugas',
    },
  ];

  const handleExport = (format) => {
    alert(`Export laporan ke format ${format}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Siswa"
        subtitle="Laporan lengkap performa siswa per periode"
        actions={
          <>
            <Button variant="outline" size="sm" icon={Download} onClick={() => handleExport('PDF')}>
              Export PDF
            </Button>
            <Button variant="primary" size="sm" icon={Download} onClick={() => handleExport('Excel')}>
              Export Excel
            </Button>
          </>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIS..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Jurusan Filter */}
          <select
            value={filters.jurusan}
            onChange={(e) => setFilters({ ...filters, jurusan: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Semua Jurusan</option>
            <option value="RPL">RPL</option>
            <option value="TKJ">TKJ</option>
            <option value="MM">Multimedia</option>
          </select>
          
          {/* Kelas Filter */}
          <select
            value={filters.kelas}
            onChange={(e) => setFilters({ ...filters, kelas: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Semua Kelas</option>
            <option value="XII">Kelas XII</option>
            <option value="XI">Kelas XI</option>
            <option value="X">Kelas X</option>
          </select>
          
          {/* Periode Filter */}
          <select
            value={filters.periode}
            onChange={(e) => setFilters({ ...filters, periode: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="semester">Semester Ini</option>
            <option value="tahun">Tahun Ajaran</option>
            <option value="bulan">Bulan Ini</option>
          </select>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-semibold text-gray-900 pb-3 px-4">NIS</th>
                <th className="text-left text-sm font-semibold text-gray-900 pb-3 px-4">Nama Siswa</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Kelas</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Jurusan</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Avg Nilai</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Kehadiran</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Tugas</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Ranking</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {laporanData.map((siswa) => (
                <tr key={siswa.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{siswa.nis}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{siswa.nama}</td>
                  <td className="py-4 px-4 text-center">
                    <Badge variant="secondary" size="sm">{siswa.kelas}</Badge>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge variant="primary" size="sm">{siswa.jurusan}</Badge>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`font-semibold ${
                      siswa.avgNilai >= 85 ? 'text-green-600' :
                      siswa.avgNilai >= 75 ? 'text-blue-600' :
                      siswa.avgNilai >= 65 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {siswa.avgNilai}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`font-semibold ${
                      siswa.kehadiran >= 90 ? 'text-green-600' :
                      siswa.kehadiran >= 80 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {siswa.kehadiran}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600">
                    {siswa.tugasSelesai}/{siswa.totalTugas}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge 
                      variant={siswa.ranking <= 3 ? 'success' : siswa.ranking <= 10 ? 'info' : 'secondary'}
                      size="sm"
                    >
                      #{siswa.ranking}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {siswa.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>
    </div>
  );
};

export default LaporanSiswa;
