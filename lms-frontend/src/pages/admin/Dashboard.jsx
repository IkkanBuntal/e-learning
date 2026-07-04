import { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from API with AbortController
    let isMounted = true;
    const abortController = new AbortController();
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch from API with selected period
        const res = await dashboardService.getStats(selectedPeriod);
        
        // Only update state if component is still mounted and not aborted
        if (!isMounted || abortController.signal.aborted) return;
        
        console.log('📊 Dashboard response:', res);
        
        // res structure: { status: 'success', data: {...} }
        const data = res.data;
        
        console.log('📊 Raw data:', data);
        console.log('📊 siswaPerJurusan type:', typeof data.siswaPerJurusan, 'isArray:', Array.isArray(data.siswaPerJurusan), 'value:', data.siswaPerJurusan);

        // Populate percentage if not returned by backend
        let totalSiswa = data.totalSiswa || 0;
        let siswaPerJurusan = [];
        
        // Handle siswaPerJurusan - ensure it's always an array
        if (data.siswaPerJurusan && Array.isArray(data.siswaPerJurusan) && data.siswaPerJurusan.length > 0) {
          siswaPerJurusan = data.siswaPerJurusan.map(j => ({
            ...j,
            percentage: totalSiswa > 0 ? Math.round((j.siswa / totalSiswa) * 100) : 0
          }));
        } else if (data.siswaPerJurusan && typeof data.siswaPerJurusan === 'object' && !Array.isArray(data.siswaPerJurusan)) {
          // If it's an object, convert to array
          siswaPerJurusan = Object.values(data.siswaPerJurusan).map(j => ({
            ...j,
            percentage: totalSiswa > 0 ? Math.round((j.siswa / totalSiswa) * 100) : 0
          }));
        } else {
          // Fallback: empty array
          siswaPerJurusan = [];
        }

        setDashboardData({
          ...data,
          siswaPerJurusan,
          recentActivities: data.recentActivities || []
        });
      } catch (error) {
        // Ignore abort errors
        if (error.name === 'AbortError' || abortController.signal.aborted) {
          return;
        }
        console.error('Error fetching dashboard data:', error);
        
        // Only update state if component is still mounted
        if (!isMounted) return;
        
        // Set default data on error
        setDashboardData({
          totalUsers: 0,
          totalGuru: 0,
          totalSiswa: 0,
          totalKelas: 0,
          totalMateri: 0,
          totalTugas: 0,
          totalSubmissions: 0,
          totalAbsensi: 0,
          rataRataNilai: 0,
          siswaPerJurusan: [],
          recentActivities: [],
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
    
    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [selectedPeriod]); // Re-fetch when period changes

  if (loading || !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: (dashboardData.totalUsers ?? 0).toString(),
      icon: Users,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: 0,
      trendLabel: '',
    },
    {
      title: 'Total Guru',
      value: (dashboardData.totalGuru ?? 0).toString(),
      icon: GraduationCap,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: 0,
      trendLabel: 'aktif mengajar',
    },
    {
      title: 'Total Siswa',
      value: (dashboardData.totalSiswa ?? 0).toString(),
      icon: Users,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      trend: 0,
      trendLabel: 'terdaftar',
    },
    {
      title: 'Total Kelas',
      value: (dashboardData.totalKelas ?? 0).toString(),
      icon: BookOpen,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: 0,
      trendLabel: 'aktif',
    },
  ];

  const activityStats = [
    { label: 'Materi Diupload', value: (dashboardData.totalMateri ?? 0).toString(), change: 'total', positive: true },
    { label: 'Tugas Dibuat', value: (dashboardData.totalTugas ?? 0).toString(), change: 'total', positive: true },
    { label: 'Tugas Dikumpulkan', value: (dashboardData.totalSubmissions ?? 0).toString(), change: 'total', positive: true },
    { label: 'Rata-rata Nilai', value: (dashboardData.avgNilai ?? 0).toString(), change: `${dashboardData.avgKehadiran ?? 0}% kehadiran`, positive: true },
  ];

  const jurusanDistribution = dashboardData.siswaPerJurusan || [];
  const recentActivities = dashboardData.recentActivities || [];

  const systemHealth = {
    server: 'Operational',
    database: 'Operational',
    storage: '65% Used',
    lastBackup: '2 hours ago',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Admin"
        subtitle="Overview dan statistik sistem LMS"
        actions={
          <div className="flex gap-2">
            {['today', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Activity Stats */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Aktivitas Sistem
          </h3>
          <Button size="sm" variant="secondary" icon={Download}>
            Export
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {activityStats.map((stat, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.positive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribusi Jurusan */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Distribusi Siswa per Jurusan
            </h3>
          </div>
          <div className="space-y-4">
            {jurusanDistribution.length > 0 ? (
              jurusanDistribution.map((jurusan, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{jurusan.name}</span>
                    <span className="text-sm text-gray-600">{jurusan.siswa} siswa</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${jurusan.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{jurusan.percentage}%</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Belum ada data siswa per jurusan</p>
                <p className="text-xs mt-1">Tambahkan siswa untuk melihat distribusi</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t">
            <Button variant="secondary" size="sm" className="w-full" icon={BarChart3}>
              Lihat Detail Statistik
            </Button>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Aktivitas Terkini
            </h3>
            <Badge variant="info" size="sm">Live</Badge>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'create' ? 'bg-green-100' :
                    activity.type === 'update' ? 'bg-blue-100' :
                    activity.type === 'upload' ? 'bg-purple-100' :
                    'bg-red-100'
                  }`}>
                    {activity.type === 'create' && <Users className="w-4 h-4 text-green-600" />}
                    {activity.type === 'update' && <Calendar className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'upload' && <BookOpen className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'delete' && <FileText className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Belum ada aktivitas dalam periode ini</p>
                <p className="text-xs mt-1">Aktivitas akan muncul saat ada kegiatan di sistem</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">Tambah User</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
              <GraduationCap className="w-6 h-6" />
              <span className="text-sm font-medium">Tambah Jurusan</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm font-medium">Tambah Kelas</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
              <Calendar className="w-6 h-6" />
              <span className="text-sm font-medium">Atur Jadwal</span>
            </button>
          </div>
        </Card>

        {/* System Health */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Status Sistem
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Server</span>
              <Badge variant="success">{systemHealth.server}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Database</span>
              <Badge variant="success">{systemHealth.database}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Storage</span>
              <Badge variant="warning">{systemHealth.storage}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Last Backup</span>
              <span className="text-sm text-gray-600">{systemHealth.lastBackup}</span>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="secondary" size="sm" className="w-full" icon={FileText}>
              Lihat Log Sistem
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
