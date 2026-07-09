import { useState, useEffect, useRef, useCallback } from 'react';
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
  Activity,
  Plus,
  Pencil,
  Trash2,
  Zap,
  Server,
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  MemoryStick,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import api from '../../services/api';

// ─── Health check helper ──────────────────────────────────────────────────────
const fetchHealth = async () => {
  const start = performance.now();
  try {
    const res = await api.get('/health', { timeout: 8000 });
    const latency = Math.round(performance.now() - start);
    return { ...res.data, client_latency_ms: latency, online: true };
  } catch {
    return { online: false, status: 'error', client_latency_ms: null };
  }
};

// ─── Latency badge helper ─────────────────────────────────────────────────────
const latencyColor = (ms) => {
  if (ms === null) return 'text-gray-400';
  if (ms < 150)  return 'text-green-600';
  if (ms < 400)  return 'text-yellow-600';
  return 'text-red-600';
};
const latencyLabel = (ms) => {
  if (ms === null) return '—';
  return `${ms} ms`;
};

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Health state ---
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthRefreshing, setHealthRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const healthTimerRef = useRef(null);

  const doHealthCheck = useCallback(async (showSpinner = false) => {
    if (showSpinner) setHealthRefreshing(true);
    const data = await fetchHealth();
    setHealth(data);
    setLastChecked(new Date());
    setHealthLoading(false);
    if (showSpinner) setHealthRefreshing(false);
  }, []);

  useEffect(() => {
    doHealthCheck();
    healthTimerRef.current = setInterval(() => doHealthCheck(), 30_000);
    return () => clearInterval(healthTimerRef.current);
  }, [doHealthCheck]);
  // ─────────────────────────────────────────────────────────────────────────

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
  const totalJurusan = dashboardData.totalJurusan ?? 0;
  const totalMapel = dashboardData.totalMapel ?? 0;
  const totalJadwal = dashboardData.totalJadwal ?? 0;

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
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const isCreate = activity.type === 'create';
                const isUpdate = activity.type === 'update';
                const isDelete = activity.type === 'delete';
                const moduleIcon = {
                  'Jurusan':       <GraduationCap className="w-4 h-4" />,
                  'Kelas':         <BookOpen className="w-4 h-4" />,
                  'Mata Pelajaran':<FileText className="w-4 h-4" />,
                  'Jadwal':        <Calendar className="w-4 h-4" />,
                }[activity.module] || <Activity className="w-4 h-4" />;

                const bgColor = isCreate ? 'bg-green-100 text-green-600'
                              : isUpdate ? 'bg-blue-100 text-blue-600'
                              : isDelete ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600';

                const actionBadge = isCreate ? { label: 'Tambah', cls: 'bg-green-100 text-green-700' }
                                  : isUpdate ? { label: 'Edit',   cls: 'bg-blue-100 text-blue-700' }
                                  : isDelete ? { label: 'Hapus',  cls: 'bg-red-100 text-red-700' }
                                  : { label: activity.type, cls: 'bg-gray-100 text-gray-700' };

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}>
                      {moduleIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${actionBadge.cls}`}>
                          {actionBadge.label}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">{activity.module}</span>
                      </div>
                      <p className="text-sm text-gray-900 mt-0.5">
                        <span className="font-medium">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-medium text-primary">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Belum ada aktivitas dalam periode ini</p>
                <p className="text-xs mt-1">Aktivitas akan muncul saat admin menambah/edit/hapus data akademik</p>
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

        {/* System Health — real-time */}
        <Card>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Status Sistem
            </h3>
            <div className="flex items-center gap-2">
              {lastChecked && (
                <span className="text-xs text-gray-400">
                  {lastChecked.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
              <button
                onClick={() => doHealthCheck(true)}
                disabled={healthRefreshing}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Refresh status"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${healthRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {healthLoading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">

              {/* Overall / Online */}
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                health?.online ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-2">
                  {health?.online
                    ? <Wifi className="w-4 h-4 text-green-600" />
                    : <WifiOff className="w-4 h-4 text-red-600" />}
                  <span className="text-sm font-medium text-gray-900">Server</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    health?.online
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {health?.online ? 'Online' : 'Offline'}
                  </span>
                  {health?.uptime && (
                    <span className="text-xs text-gray-500">up {health.uptime}</span>
                  )}
                </div>
              </div>

              {/* API Latency */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">API Latency</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`font-bold text-sm ${
                    latencyColor(health?.client_latency_ms)
                  }`}>
                    {latencyLabel(health?.client_latency_ms)}
                  </span>
                  {health?.client_latency_ms !== null && health?.client_latency_ms !== undefined && (
                    <span className="text-xs text-gray-400">
                      {health.client_latency_ms < 150 ? '⚡ Cepat' : health.client_latency_ms < 400 ? '⚠ Normal' : '🐢 Lambat'}
                    </span>
                  )}
                </div>
              </div>

              {/* Database */}
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                health?.services?.database?.status === 'ok' ? 'bg-purple-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Database</span>
                </div>
                <div className="flex items-center gap-2">
                  {health?.services?.database?.status === 'ok'
                    ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                    : <XCircle className="w-4 h-4 text-red-500" />}
                  {health?.services?.database?.latency_ms && (
                    <span className="text-xs text-gray-500">
                      {health.services.database.latency_ms} ms
                    </span>
                  )}
                </div>
              </div>

              {/* Memory */}
              {health?.memory && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-900">Memory PHP</span>
                    </div>
                    <span className="text-xs font-semibold text-yellow-700">
                      {health.memory.used_mb} MB / {health.memory.limit_mb} MB
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-yellow-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        health.memory.percent < 60
                          ? 'bg-green-500'
                          : health.memory.percent < 85
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(health.memory.percent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">{health.memory.percent}% digunakan</p>
                </div>
              )}

              {/* Response time server-side */}
              {health?.response_time_ms !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">Server Response</span>
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {health.response_time_ms} ms
                  </span>
                </div>
              )}

            </div>
          )}

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
