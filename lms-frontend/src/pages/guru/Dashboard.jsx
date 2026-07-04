import { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import { 
  BookOpen, 
  ClipboardList, 
  Users, 
  Clock,
  CheckCircle,
  Calendar,
  TrendingUp,
  Download,
  BarChart3,
  FileText
} from 'lucide-react';
import { authService } from '../../services/authService';
import dashboardService from '../../services/dashboardService';

const GuruDashboard = () => {
  const [selectedClass, setSelectedClass] = useState('all');
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

        if (!user || user.role?.nama !== 'guru') {
          if (isMounted) setLoading(false);
          return;
        }

        const res = await dashboardService.getStats(selectedPeriod);
        
        if (!isMounted) return;
        
        console.log('📊 Guru dashboard response:', res);
        
        // res structure: { status: 'success', data: {...} }
        if (res && res.data) {
          setDashboardData(res.data);
        }
      } catch (error) {
        console.error('Error fetching guru dashboard:', error);
        
        if (!isMounted) return;
        
        setDashboardData({
          totalMateri: 0,
          totalTugas: 0,
          activeTugas: 0,
          pendingSubmissions: 0,
          totalKelas: 0,
          todaySchedule: [],
          allTodaySchedule: [],
          classPerformance: [],
          submissionStatus: [],
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
      title: 'Total Materi',
      value: (dashboardData.totalMateri ?? 0).toString(),
      icon: BookOpen,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: 0,
      trendLabel: 'total diupload',
    },
    {
      title: 'Total Tugas',
      value: (dashboardData.totalTugas ?? 0).toString(),
      icon: ClipboardList,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: 0,
      trendLabel: `${dashboardData.activeTugas ?? 0} aktif`,
    },
    {
      title: 'Pending Submissions',
      value: (dashboardData.pendingSubmissions ?? 0).toString(),
      icon: Clock,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Kelas Diajar',
      value: (dashboardData.totalKelas ?? 0).toString(),
      icon: Users,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  // Filter class performance based on selected class
  const filteredPerformance = selectedClass === 'all'
    ? dashboardData.classPerformance
    : dashboardData.classPerformance.filter(c => c.id.toString() === selectedClass);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Guru"
        subtitle={`Selamat datang, ${currentUser.name} — Kelola materi, tugas, dan penilaian siswa`}
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
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            >
              <option value="all">Semua Kelas</option>
              {dashboardData.classPerformance.map(cls => (
              <option key={cls.id} value={cls.id.toString()}>{cls.name}</option>
            ))}
          </select>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule — dari teachingAssignments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Jadwal Hari Ini
            </h3>
            <Badge variant="info" size="sm">
              {dashboardData.todaySchedule.length} Kelas
            </Badge>
          </div>
          <div className="space-y-3">
            {dashboardData.todaySchedule.length > 0 ? (
              dashboardData.todaySchedule.map((schedule, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border-l-4 border-primary">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900">{schedule.class}</p>
                    <Badge variant="secondary" size="sm">{schedule.room}</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{schedule.subject}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{schedule.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Tidak ada jadwal hari ini</p>
              </div>
            )}
          </div>
          {/* Show all weekly schedule as reference */}
          {dashboardData.allTodaySchedule.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-semibold text-gray-500 mb-2">Jadwal Minggu Ini:</p>
              <div className="space-y-1">
                {dashboardData.allTodaySchedule.map((s, i) => (
                  <div key={i} className="flex justify-between text-xs text-gray-600">
                    <span className="font-medium">{s.hari}</span>
                    <span>{s.subject} — {s.class}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4">
            <Button variant="secondary" size="sm" className="w-full" icon={Calendar}>
              Lihat Jadwal Lengkap
            </Button>
          </div>
        </Card>

        {/* Class Performance — hanya kelas yang diajar */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Performa Kelas
            </h3>
            <Button size="sm" variant="secondary" icon={Download}>
              Export
            </Button>
          </div>
          {filteredPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-sm font-semibold text-gray-900 pb-3">Kelas</th>
                    <th className="text-center text-sm font-semibold text-gray-900 pb-3">Siswa</th>
                    <th className="text-center text-sm font-semibold text-gray-900 pb-3">Rata-rata</th>
                    <th className="text-center text-sm font-semibold text-gray-900 pb-3">Kehadiran</th>
                    <th className="text-right text-sm font-semibold text-gray-900 pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPerformance.map((cls, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium text-gray-900">{cls.name}</td>
                      <td className="py-3 text-sm text-center text-gray-600">{cls.students}</td>
                      <td className="py-3 text-sm text-center">
                        <span className={`font-semibold ${
                          cls.avgScore >= 85 ? 'text-green-600' :
                          cls.avgScore >= 75 ? 'text-blue-600' :
                          cls.avgScore > 0 ? 'text-yellow-600' : 'text-gray-400'
                        }`}>
                          {cls.avgScore > 0 ? cls.avgScore : '—'}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-center">
                        <span className={`font-semibold ${
                          cls.attendance >= 90 ? 'text-green-600' :
                          cls.attendance >= 80 ? 'text-yellow-600' :
                          cls.attendance > 0 ? 'text-red-600' : 'text-gray-400'
                        }`}>
                          {cls.attendance > 0 ? `${cls.attendance}%` : '—'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {cls.avgScore >= 80 && cls.attendance >= 85 ? (
                          <Badge variant="success" size="sm">Baik</Badge>
                        ) : cls.avgScore > 0 ? (
                          <Badge variant="warning" size="sm">Perlu Perhatian</Badge>
                        ) : (
                          <Badge variant="secondary" size="sm">Belum Ada Data</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Tidak ada data kelas</p>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Status */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Status Pengumpulan Tugas
          </h3>
          <div className="space-y-4">
            {dashboardData.submissionStatus.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium text-gray-900">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.count}</span>
                    <span className="text-xs text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="primary" size="sm" className="w-full">
              Beri Nilai
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              Lihat Detail
            </Button>
          </div>
        </Card>

        {/* Aktivitas Terkini */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Aktivitas Terkini
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { type: 'materi', title: 'Pengenalan Pemrograman Web', class: 'XII RPL 1', time: '15 Jan 2024', icon: BookOpen, bg: 'bg-blue-100', color: 'text-blue-600' },
              { type: 'materi', title: 'Database MySQL', class: 'XII RPL 1', time: '16 Jan 2024', icon: BookOpen, bg: 'bg-blue-100', color: 'text-blue-600' },
              { type: 'tugas', title: 'Membuat Website Portfolio', class: 'XII RPL 1', time: '15 Jan 2024', icon: ClipboardList, bg: 'bg-green-100', color: 'text-green-600' },
              { type: 'tugas', title: 'Query Database MySQL', class: 'XII RPL 1', time: '18 Jan 2024', icon: ClipboardList, bg: 'bg-yellow-100', color: 'text-yellow-600' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" size="sm">{activity.class}</Badge>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GuruDashboard;
