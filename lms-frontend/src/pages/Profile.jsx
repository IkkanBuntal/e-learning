import { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Lock, 
  GraduationCap, 
  Upload, 
  Save 
} from 'lucide-react';
import profileService from '../services/profileService';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('info'); // info, password
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  
  // Profile Form States
  const [profileData, setProfileData] = useState({
    nama: user?.name || '',
    email: user?.email || '',
    no_telp: user?.no_telp || '',
    alamat: user?.alamat || '',
  });

  // Password Form States
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // Image Preview State
  const [avatarPreview, setAvatarPreview] = useState(
    user?.foto ? `/storage/${user.foto}` : null
  );
  const [avatarFile, setAvatarFile] = useState(null);

  // Handle Input Changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // Handle Avatar Selection
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, foto: 'Ukuran file foto maksimal 2MB' }));
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.foto) setErrors(prev => ({ ...prev, foto: null }));
    }
  };

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('nama', profileData.nama);
      formData.append('email', profileData.email);
      formData.append('no_telp', profileData.no_telp || '');
      formData.append('alamat', profileData.alamat || '');
      
      if (avatarFile) {
        formData.append('foto', avatarFile);
      }

      const res = await profileService.update(formData);
      
      // Update global Auth state
      const updatedUser = {
        ...user,
        name: res.data.nama,
        email: res.data.email,
        foto: res.data.foto,
        no_telp: res.data.no_telp,
        alamat: res.data.alamat,
      };
      updateUser(updatedUser);
      
      setSuccessMsg('Profil berhasil diperbarui!');
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ global: err.response?.data?.message || 'Gagal memperbarui profil.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Update Submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      setErrors({ password_confirmation: ['Konfirmasi password baru tidak cocok.'] });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMsg('');

    try {
      const formData = new FormData();
      // Required parameters to trigger password update logic in ProfileController
      formData.append('current_password', passwordData.current_password);
      formData.append('password', passwordData.password);
      formData.append('password_confirmation', passwordData.password_confirmation);

      await profileService.update(formData);
      
      setSuccessMsg('Password berhasil diubah!');
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ global: err.response?.data?.message || 'Gagal mengubah password.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Profil Saya" 
        subtitle="Kelola informasi pribadi, foto avatar, dan kata sandi akun Anda"
      />

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          {successMsg}
        </div>
      )}

      {errors.global && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {errors.global}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Summary Card */}
        <Card className="flex flex-col items-center p-6 text-center h-fit">
          <div className="relative group cursor-pointer mt-4" onClick={handleAvatarClick}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg relative bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt={user?.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-4xl font-bold text-white uppercase">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden" 
            />
          </div>
          
          {errors.foto && (
            <p className="mt-2 text-xs font-medium text-red-500">{errors.foto}</p>
          )}

          <h3 className="text-xl font-bold text-gray-900 mt-4">{user?.name}</h3>
          
          <div className="mt-2 flex flex-col gap-1 items-center">
            <Badge variant="primary" className="capitalize text-sm font-semibold px-3 py-1">
              {user?.role}
            </Badge>
            <span className="text-xs text-gray-400 mt-1">{user?.email}</span>
          </div>

          {/* Academic Info (Read-only) */}
          <div className="w-full border-t border-gray-100 mt-6 pt-6 space-y-3.5 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" /> ID Pengguna
              </span>
              <span className="text-gray-900 font-bold">#{user?.id}</span>
            </div>
            
            {user?.role === 'siswa' && user?.nis && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" /> NIS (Siswa)
                </span>
                <span className="text-gray-900 font-bold">{user.nis}</span>
              </div>
            )}

            {user?.role === 'guru' && user?.nip && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" /> NIP (Guru)
                </span>
                <span className="text-gray-900 font-bold">{user.nip}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Right Column: Editable forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button
                onClick={() => { setActiveTab('info'); setErrors({}); }}
                className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === 'info'
                    ? 'border-primary text-primary bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Informasi Pribadi
              </button>
              <button
                onClick={() => { setActiveTab('password'); setErrors({}); }}
                className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === 'password'
                    ? 'border-primary text-primary bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Keamanan & Password
              </button>
            </div>

            {/* Tab 1: Personal Info Form */}
            {activeTab === 'info' && (
              <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nama Lengkap"
                    name="nama"
                    value={profileData.nama}
                    onChange={handleProfileChange}
                    error={errors.nama?.[0]}
                    required
                  />
                  <Input
                    label="Alamat Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    error={errors.email?.[0]}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nomor Telepon"
                    name="no_telp"
                    value={profileData.no_telp}
                    onChange={handleProfileChange}
                    error={errors.no_telp?.[0]}
                    placeholder="Contoh: 081234567890"
                  />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat Rumah
                    </label>
                    <textarea
                      name="alamat"
                      rows={2}
                      value={profileData.alamat}
                      onChange={handleProfileChange}
                      placeholder="Masukkan alamat lengkap..."
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.alamat?.[0] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.alamat?.[0] && (
                      <p className="mt-1 text-sm text-red-600">{errors.alamat[0]}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    loading={loading}
                    className="px-6"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            )}

            {/* Tab 2: Password Form */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                <Input
                  label="Password Saat Ini"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  error={errors.current_password?.[0]}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Password Baru"
                    name="password"
                    type="password"
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    error={errors.password?.[0]}
                    required
                  />
                  <Input
                    label="Konfirmasi Password Baru"
                    name="password_confirmation"
                    type="password"
                    value={passwordData.password_confirmation}
                    onChange={handlePasswordChange}
                    error={errors.password_confirmation?.[0]}
                    required
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    loading={loading}
                    className="px-6"
                  >
                    <Lock className="w-4 h-4 mr-1" />
                    Ubah Password
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
