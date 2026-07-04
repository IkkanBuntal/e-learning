import { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import { 
  BookOpen, 
  ClipboardList, 
  BarChart3, 
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Target,
  Activity
} from 'lucide-react';
import { authService } from '../../services/authService';
import dashboardService from '../../services/dashboardService';

const SiswaDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get current user from localStorage
        const user = authService.getCurrentUser();
        
        if (!isMounted) return;
        setCurrentUser(user);

        if (!user || user.role?.nama !== 'siswa') {
          if (isMounted) setLoading(false);
          return;
        }

        const res = await dashboardService.getStats(selectedPeriod);
        
        if (!isMounted) return;
        
        console.log('📊 Siswa dashboard response:', res);
        
        // res structure: { status: 'success', data: {...} }
        if (res && res.data) {
          setDashboardData(res.data);
        }
      } catch (error) {
        console.error('Error fetching siswa dashboard:', error);
        
        if (!isMounted) return;
        
        setDashboardData({
          totalMateri: 0,
          activeTugas: 0,
          overdueTugas: 0,
          rataRataNilai: 0,
          todaySchedule: [],
          allSchedule: [],
          learningProgress: [],
          upcomingDeadlines: [],
          totalAbsensi: 0,
          hadirAbsensi: 0,
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
    };
  }, [selectedPeriod]); // Re-fetch when period changes

  if (loading || !dashboardData || !currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Materi Pelajaran',
      value: (dashboardData.totalMateri ?? 0).toString(),
      icon: BookOpen,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Tugas Aktif',
      value: (dashboardData.activeTugas ?? 0).toString(),
      icon: ClipboardList,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Tugas Terlambat',
      value: (dashboardData.overdueTugas ?? 0).toString(),
      icon: AlertCircle,
      iconBgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      title: 'Rata-rata Nilai',
      value: (dashboardData.rataRataNilai ?? 0).toString(),
      icon: BarChart3,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: 0,
      trendLabel: '',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Siswa"
        subtitle={`Selamat datang, ${currentUser.name}${currentUser.kelas ? ` — ${currentUser.kelas.nama}` : ''}`}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Progress — per mapel dari nilai siswa */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Progress Belajar per Mata Pelajaran
            </h3>
            <Badge variant="info" size="sm">Nilai Rata-rata</Badge>
          </div>
          {dashboardData.learningProgress.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.learningProgress.map((subject, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${
                        subject.score >= 85 ? 'text-green-600' :
                        subject.score >= 75 ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>{subject.score}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${subject.color} h-2.5 rounded-full transition-all`}
                      style={{ width: `${Math.min(subject.progress, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Belum ada nilai untuk ditampilkan</p>
            </div>
          )}
        </Card>

        {/* Upcoming Deadlines — dari tugas aktif kelas siswa */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Deadline Tugas
            </h3>
          </div>
          {dashboardData.upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.upcomingDeadlines.map((task, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    task.urgent
                      ? 'bg-red-50 border-red-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{task.subject}</p>
                    </div>
                    {task.urgent && (
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{task.deadline}</span>
                    <Badge
                      variant={task.daysLeft <= 0 ? 'danger' : task.urgent ? 'warning' : 'secondary'}
                      size="sm"
                    >
                      {task.daysLeft <= 0 ? 'Terlambat' : `${task.daysLeft} hari`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-green-500" />
              <p className="text-sm font-medium text-green-600">Semua tugas sudah dikerjakan!</p>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule — dari teachingAssignments kelas siswa */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Jadwal Hari Ini
            </h3>
            <Badge variant="info" size="sm">{dashboardData.todaySchedule.length} Mata Pelajaran</Badge>
          </div>
          {dashboardData.todaySchedule.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.todaySchedule.map((schedule, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    schedule.status === 'ongoing'
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-2 h-full min-h-[40px] rounded-full ${
                    schedule.status === 'ongoing' ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{schedule.subject}</p>
                    <p className="text-xs text-gray-500">{schedule.teacher} — {schedule.room}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-gray-700">{schedule.time}</p>
                    {schedule.status === 'ongoing' && (
                      <Badge variant="primary" size="sm">Sedang</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Tidak ada jadwal hari ini</p>
              {dashboardData.allSchedule.length > 0 && (
                <div className="mt-3 space-y-1 text-left">
                  <p className="text-xs font-semibold text-gray-500">Jadwal minggu ini:</p>
                  {dashboardData.allSchedule.map((s, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-600">
                      <span className="font-medium">{s.hari}</span>
                      <span>{s.subject}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Attendance Summary */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Ringkasan Kehadiran
          </h3>
          {dashboardData.totalAbsensi > 0 ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className={`text-4xl font-bold mb-1 ${
                  dashboardData.totalAbsensi > 0
                    ? Math.round((dashboardData.hadirAbsensi / dashboardData.totalAbsensi) * 100) >= 80
                      ? 'text-green-600' : 'text-yellow-600'
                    : 'text-gray-400'
                }`}>
                  {dashboardData.totalAbsensi > 0
                    ? `${Math.round((dashboardData.hadirAbsensi / dashboardData.totalAbsensi) * 100)}%`
                    : '—'}
                </div>
                <p className="text-sm text-gray-600">Persentase Kehadiran</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">{dashboardData.hadirAbsensi}</p>
                  <p className="text-xs text-gray-600">Hadir</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-xl font-bold text-red-500">
                    {dashboardData.totalAbsensi - dashboardData.hadirAbsensi}
                  </p>
                  <p className="text-xs text-gray-600">Tidak Hadir</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${dashboardData.totalAbsensi > 0
                      ? Math.round((dashboardData.hadirAbsensi / dashboardData.totalAbsensi) * 100)
                      : 0}%`
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Belum ada data absensi</p>
            </div>
          )}
          <div className="mt-4">
            <Button variant="secondary" size="sm" className="w-full" icon={Award}>
              Lihat Detail Absensi
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SiswaDashboard;
