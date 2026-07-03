import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  ClipboardList,
  BarChart3,
  UserCheck,
  GraduationCap,
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
  Settings,
  FileBarChart,
} from 'lucide-react';

/**
 * Sidebar Component
 * Main navigation sidebar with role-based menu items
 * 
 * @param {boolean} isOpen - Sidebar open state (for mobile)
 * @param {function} onClose - Close sidebar callback (for mobile)
 */
const Sidebar = ({ isOpen = true, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Toggle dropdown
   */
  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  /**
   * Get menu items based on user role
   */
  const getMenuItems = () => {
    const role = user?.role;

    if (role === 'admin') {
      return [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        {
          key: 'manajemen-user',
          icon: Users,
          label: 'Manajemen User',
          isDropdown: true,
          children: [
            { path: '/admin/users', label: 'Kelola User' },
            { path: '/admin/roles', label: 'Role & Permission' },
          ]
        },
        {
          key: 'akademik',
          icon: GraduationCap,
          label: 'Akademik',
          isDropdown: true,
          children: [
            { path: '/admin/jurusan', label: 'Jurusan' },
            { path: '/admin/kelas', label: 'Kelas' },
            { path: '/admin/mata-pelajaran', label: 'Mata Pelajaran' },
            { path: '/admin/jadwal', label: 'Jadwal' },
          ]
        },
        {
          key: 'laporan',
          icon: FileBarChart,
          label: 'Laporan',
          isDropdown: true,
          children: [
            { path: '/admin/laporan/siswa', label: 'Laporan Siswa' },
            { path: '/admin/laporan/guru', label: 'Laporan Guru' },
            { path: '/admin/laporan/statistik', label: 'Statistik' },
          ]
        },
        { path: '/admin/settings', icon: Settings, label: 'Pengaturan Sistem' },
      ];
    }

    if (role === 'guru') {
      return [
        { path: '/guru/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/guru/materi', icon: BookOpen, label: 'Materi' },
        { path: '/guru/tugas', icon: ClipboardList, label: 'Tugas' },
        { path: '/guru/nilai', icon: BarChart3, label: 'Nilai' },
        { path: '/guru/absensi', icon: UserCheck, label: 'Absensi' },
      ];
    }

    if (role === 'siswa') {
      return [
        { path: '/siswa/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/siswa/materi', icon: BookOpen, label: 'Materi' },
        { path: '/siswa/tugas', icon: ClipboardList, label: 'Tugas' },
        { path: '/siswa/nilai', icon: BarChart3, label: 'Nilai' },
        { path: '/siswa/absensi', icon: UserCheck, label: 'Absensi' },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  // Auto-open dropdown if current path matches any children
  useEffect(() => {
    const currentPath = location.pathname;
    
    menuItems.forEach((item) => {
      if (item.isDropdown && item.children) {
        const isActive = item.children.some(child => currentPath.startsWith(child.path));
        if (isActive) {
          setOpenDropdowns(prev => ({
            ...prev,
            [item.key]: true
          }));
        }
      }
    });
  }, [location.pathname]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-primary-600 via-primary-700 to-primary-900 text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">E-LearningKu</h1>
                <p className="text-xs text-primary-100">Sekolah</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path || item.key}>
                  {item.isDropdown ? (
                    // Dropdown Menu Item
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.key)}
                        className="flex items-center justify-between w-full px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        {openDropdowns[item.key] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      {/* Dropdown Children */}
                      {openDropdowns[item.key] && (
                        <ul className="mt-1 ml-4 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.path}>
                              <NavLink
                                to={child.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                                    isActive
                                      ? 'bg-white/20 text-white font-medium'
                                      : 'text-white/80 hover:bg-white/10'
                                  }`
                                }
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                                <span>{child.label}</span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    // Regular Menu Item
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white font-medium'
                            : 'text-white/90 hover:bg-white/10'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-white/90 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
