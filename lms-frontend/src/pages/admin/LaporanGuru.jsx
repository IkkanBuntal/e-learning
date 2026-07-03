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
  GraduationCap,
  BookOpen,
  ClipboardList,
  Users,
  CheckCircle
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';

const LaporanGuru = () => {
  const [filters, setFilters] = useState({
    periode: 'semester',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [laporanData, setLaporanData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getLaporanGuru({ search: filters.search });
        setLaporanData(res.data || []);
      } catch (error) {
        console.error('Error fetching laporan guru:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.search]);

  const totalMateriAll = laporanData.reduce((sum, g) => sum + g.materiUpload, 0);
  const totalTugasAll = laporanData.reduce((sum, g) => sum + g.tugasDibuat, 0);
  const avgKehadiran = laporanData.length > 0
    ? Math.round((laporanData.reduce((sum, g) => sum + g.kehadiranMengajar, 0) / laporanData.length) * 10) / 10
    : 0;

  const summary = {
    totalGuru: laporanData.length,
    avgKehadiran,
    totalMateri: totalMateriAll,
    totalTugas: totalTugasAll,
  };

  const summaryStats = [
    {
      title: 'Total Guru',
      value: '45',
      icon: GraduationCap,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: 12,
      trendLabel: 'vs last month',
    },
    {
      title: 'Avg Kehadiran',
      value: '96.3%',
      icon: CheckCircle,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: 2,
      trendLabel: 'vs last month',
    },
    {
      title: 'Total Materi',
      value: '342',
      icon: BookOpen,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: 15,
      trendLabel: 'vs last month',
    },
    {
      title: 'Total Tugas',
      value: '215',
      icon: ClipboardList,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      trend: 8,
      trendLabel: 'vs last month',
    },
  ];

  const handleExport = (format) => {
    alert(`Export laporan ke format ${format}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Guru"
        subtitle="Laporan aktivitas dan performa mengajar guru"
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
              placeholder="Cari nama atau NIP..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
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
                <th className="text-left text-sm font-semibold text-gray-900 pb-3 px-4">NIP</th>
                <th className="text-left text-sm font-semibold text-gray-900 pb-3 px-4">Nama Guru</th>
                <th className="text-left text-sm font-semibold text-gray-900 pb-3 px-4">Mata Pelajaran</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Kelas</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Siswa</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Materi</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Tugas</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Avg Nilai</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Kehadiran</th>
                <th className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {laporanData.map((guru) => (
                <tr key={guru.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900 max-w-[160px] truncate">{guru.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{guru.nama}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{guru.mataPelajaran}</td>
                  <td className="py-4 px-4 text-center text-sm font-semibold text-gray-900">
                    {guru.totalKelas}
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600">
                    {guru.totalSiswa}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge variant="primary" size="sm">{guru.materiUpload}</Badge>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge variant="success" size="sm">{guru.tugasDibuat}</Badge>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`font-semibold ${
                      guru.avgNilaiSiswa >= 85 ? 'text-green-600' :
                      guru.avgNilaiSiswa >= 75 ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {guru.avgNilaiSiswa}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`font-semibold ${
                      guru.kehadiranMengajar >= 95 ? 'text-green-600' :
                      guru.kehadiranMengajar >= 85 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {guru.kehadiranMengajar}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge 
                      variant={guru.statusAktif ? 'success' : 'danger'}
                      size="sm"
                    >
                      {guru.statusAktif ? 'Aktif' : 'Non-Aktif'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Guru Berdasarkan Materi
          </h3>
          <div className="space-y-3">
            {[...laporanData]
              .sort((a, b) => b.materiUpload - a.materiUpload)
              .slice(0, 5)
              .map((guru, index) => (
                <div key={guru.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    } font-bold text-sm`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{guru.nama}</p>
                      <p className="text-xs text-gray-500">{guru.mataPelajaran}</p>
                    </div>
                  </div>
                  <Badge variant="primary">{guru.materiUpload} Materi</Badge>
                </div>
              ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Guru Berdasarkan Avg Nilai Siswa
          </h3>
          <div className="space-y-3">
            {[...laporanData]
              .sort((a, b) => b.avgNilaiSiswa - a.avgNilaiSiswa)
              .slice(0, 5)
              .map((guru, index) => (
                <div key={guru.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    } font-bold text-sm`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{guru.nama}</p>
                      <p className="text-xs text-gray-500">{guru.mataPelajaran}</p>
                    </div>
                  </div>
                  <Badge variant="success">{guru.avgNilaiSiswa} Avg</Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LaporanGuru;
