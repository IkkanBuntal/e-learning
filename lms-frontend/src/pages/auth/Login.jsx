import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, AlertCircle, BookOpen, Users, Award, TrendingUp, X, Phone, MessageCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (error) setError('');
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Email dan password harus diisi');
      return;
    }

    try {
      setLoading(true);
      const response = await login(formData.email, formData.password);

      // Redirect based on role
      const role = response.user.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'guru') {
        navigate('/guru/dashboard');
      } else if (role === 'siswa') {
        navigate('/siswa/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Login gagal. Periksa email dan password Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Contact Admin Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Hubungi Admin</h3>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">
                Untuk mendapatkan akun baru atau bantuan login, silakan hubungi administrator melalui:
              </p>

              {/* Contact Options */}
              <div className="space-y-3">
                {/* Email */}
                <a
                  href="mailto:admin@elearningku.com"
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">admin@elearningku.com</p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+6281234567890"
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Telepon</p>
                    <p className="text-sm text-gray-600">+62 812-3456-7890</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20mendaftar%20akun%20E-LearningKu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-600">Chat langsung dengan admin</p>
                  </div>
                </a>
              </div>

              {/* Office Hours */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm font-semibold text-blue-900 mb-2">Jam Operasional</p>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>Senin - Jumat: 08:00 - 16:00 WIB</p>
                  <p>Sabtu: 08:00 - 12:00 WIB</p>
                  <p className="text-blue-600 font-medium">Minggu & Libur: Tutup</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white w-full">
          {/* Logo & Brand */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold">E-LearningKu</h1>
            </div>
            <p className="text-primary-100 text-base">
              Platform Pembelajaran Digital Terpadu
            </p>
          </div>

          {/* Main Heading */}
          <div className="mb-8">
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
              Transformasi Pendidikan
              <br />
              <span className="text-primary-200">Dimulai dari Sini</span>
            </h2>
            <p className="text-primary-100 text-base leading-relaxed max-w-md">
              Kelola pembelajaran, pantau perkembangan siswa, dan tingkatkan kualitas pendidikan dengan sistem manajemen pembelajaran yang modern dan efisien.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">Multi Role</h3>
              <p className="text-xs text-primary-100">Admin, Guru & Siswa</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">Materi Digital</h3>
              <p className="text-xs text-primary-100">Akses kapan saja</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">Penilaian</h3>
              <p className="text-xs text-primary-100">Otomatis & Akurat</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">Laporan</h3>
              <p className="text-xs text-primary-100">Real-time Analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form - Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3">
              <BookOpen className="w-7 h-7 text-primary-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">E-LearningKu</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Selamat Datang! 👋
              </h2>
              <p className="text-gray-600 text-sm">
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-gray-900 placeholder-gray-400"
                    placeholder="nama@sekolah.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-gray-900 placeholder-gray-400"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 font-medium"
                  >
                    Ingat saya
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Lupa password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <button
                  onClick={() => setShowContactModal(true)}
                  className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Hubungi admin
                </button>
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Demo Credentials
            </p>
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between items-center">
                <span className="font-medium">Admin:</span>
                <span className="text-gray-500">admin@sekolah.sch.id / password</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Guru:</span>
                <span className="text-gray-500">budi.santoso@sekolah.sch.id / password</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Siswa:</span>
                <span className="text-gray-500">andi.pratama@siswa.sch.id / password</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
