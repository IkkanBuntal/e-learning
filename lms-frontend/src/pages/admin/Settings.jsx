import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import { 
  Save,
  Settings as SettingsIcon,
  Globe,
  Bell,
  Lock,
  Database,
  Mail,
  FileText,
  CheckCircle
} from 'lucide-react';
import settingService from '../../services/settingService';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Aplikasi
    appName: '',
    appDesc: '',
    appLogo: null,
    
    // Akademik
    tahunAjaran: '',
    semesterAktif: 'Ganjil',
    minKehadiran: 75,
    kkm: 70,
    
    // Notifikasi
    emailNotif: true,
    pushNotif: true,
    deadlineReminder: true,
    gradeNotif: true,
    
    // Email
    emailFrom: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    
    // File Upload
    maxFileSize: '10',
    allowedFormats: 'pdf,doc,docx,ppt,pptx,zip',
    
    // Backup
    autoBackup: true,
    backupFreq: 'daily',
    backupRetention: '30',
  });

  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // Map snake_case to camelCase
  const mapSnakeToCamel = (data) => ({
    appName: data.app_name || '',
    appDesc: data.app_desc || '',
    appLogo: data.app_logo || null,
    tahunAjaran: data.tahun_ajaran || '',
    semesterAktif: data.semester_aktif || 'Ganjil',
    minKehadiran: data.min_kehadiran || 75,
    kkm: data.kkm || 70,
    emailNotif: !!data.email_notif,
    pushNotif: !!data.push_notif,
    deadlineReminder: !!data.deadline_reminder,
    gradeNotif: !!data.grade_notif,
    emailFrom: data.email_from || '',
    smtpHost: data.smtp_host || '',
    smtpPort: data.smtp_port || '',
    smtpUser: data.smtp_user || '',
    smtpPassword: data.smtp_password || '',
    maxFileSize: data.max_file_size || '10',
    allowedFormats: data.allowed_formats || 'pdf,doc,docx,ppt,pptx,zip',
    autoBackup: !!data.auto_backup,
    backupFreq: data.backup_freq || 'daily',
    backupRetention: data.backup_retention || '30',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settingService.getSettings();
        if (res.data) {
          setSettings(mapSnakeToCamel(res.data));
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        setError('Gagal memuat pengaturan.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSaved(false);

      // We use FormData if uploading file, otherwise ordinary JSON
      // But let's build FormData for everything to support both setting values and file upload easily.
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Laravel expects PUT but we send as POST with _method=PUT to support files
      
      formData.append('app_name', settings.appName);
      formData.append('app_desc', settings.appDesc);
      formData.append('tahun_ajaran', settings.tahunAjaran);
      formData.append('semester_aktif', settings.semesterAktif);
      formData.append('min_kehadiran', settings.minKehadiran);
      formData.append('kkm', settings.kkm);
      
      formData.append('email_notif', settings.emailNotif ? 1 : 0);
      formData.append('push_notif', settings.pushNotif ? 1 : 0);
      formData.append('deadline_reminder', settings.deadlineReminder ? 1 : 0);
      formData.append('grade_notif', settings.gradeNotif ? 1 : 0);
      
      formData.append('email_from', settings.emailFrom);
      formData.append('smtp_host', settings.smtpHost);
      formData.append('smtp_port', settings.smtpPort);
      formData.append('smtp_user', settings.smtpUser);
      formData.append('smtp_password', settings.smtpPassword);
      
      formData.append('max_file_size', settings.maxFileSize);
      formData.append('allowed_formats', settings.allowedFormats);
      
      formData.append('auto_backup', settings.autoBackup ? 1 : 0);
      formData.append('backup_freq', settings.backupFreq);
      formData.append('backup_retention', settings.backupRetention);

      if (logoFile) {
        formData.append('app_logo', logoFile);
      }

      // API call
      const res = await settingService.updateSettings(formData);
      if (res.data) {
        setSettings(mapSnakeToCamel(res.data));
        setLogoFile(null); // Clear file selection
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Gagal menyimpan perubahan.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      <PageHeader
        title="Pengaturan Sistem"
        subtitle="Konfigurasi sistem dan preferensi aplikasi"
        actions={
          <Button
            variant={saved ? 'success' : 'primary'}
            icon={saved ? CheckCircle : Save}
            onClick={handleSave}
          >
            {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
          </Button>
        }
      />

      {/* Aplikasi Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pengaturan Aplikasi</h3>
            <p className="text-sm text-gray-600">Konfigurasi dasar aplikasi</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Aplikasi
            </label>
            <input
              type="text"
              value={settings.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Aplikasi
            </label>
            <textarea
              value={settings.appDesc}
              onChange={(e) => handleChange('appDesc', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Aplikasi
            </label>
            {settings.appLogo && (
              <div className="mb-3 p-2 bg-gray-50 border rounded-lg inline-block">
                <img 
                  src={settings.appLogo.startsWith('http') ? settings.appLogo : `http://localhost:8000/storage/${settings.appLogo}`} 
                  alt="App Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, SVG. Max: 2MB</p>
          </div>
        </div>
      </Card>

      {/* Akademik Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pengaturan Akademik</h3>
            <p className="text-sm text-gray-600">Konfigurasi tahun ajaran dan penilaian</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tahun Ajaran Aktif
            </label>
            <input
              type="text"
              value={settings.tahunAjaran}
              onChange={(e) => handleChange('tahunAjaran', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester Aktif
            </label>
            <select
              value={settings.semesterAktif}
              onChange={(e) => handleChange('semesterAktif', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Kehadiran (%)
            </label>
            <input
              type="number"
              value={settings.minKehadiran}
              onChange={(e) => handleChange('minKehadiran', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              KKM (Kriteria Ketuntasan Minimal)
            </label>
            <input
              type="number"
              value={settings.kkm}
              onChange={(e) => handleChange('kkm', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </Card>

      {/* Notifikasi Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Bell className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pengaturan Notifikasi</h3>
            <p className="text-sm text-gray-600">Kelola notifikasi sistem</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifikasi</p>
              <p className="text-xs text-gray-600">Kirim notifikasi via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotif}
                onChange={(e) => handleChange('emailNotif', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Push Notifikasi</p>
              <p className="text-xs text-gray-600">Notifikasi real-time di browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotif}
                onChange={(e) => handleChange('pushNotif', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Pengingat Deadline</p>
              <p className="text-xs text-gray-600">Reminder H-2 sebelum deadline</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deadlineReminder}
                onChange={(e) => handleChange('deadlineReminder', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Notifikasi Nilai</p>
              <p className="text-xs text-gray-600">Informasi nilai baru untuk siswa</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.gradeNotif}
                onChange={(e) => handleChange('gradeNotif', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Email Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Konfigurasi Email</h3>
            <p className="text-sm text-gray-600">SMTP server untuk pengiriman email</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Pengirim
            </label>
            <input
              type="email"
              value={settings.emailFrom}
              onChange={(e) => handleChange('emailFrom', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => handleChange('smtpHost', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="text"
              value={settings.smtpPort}
              onChange={(e) => handleChange('smtpPort', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Username
            </label>
            <input
              type="text"
              value={settings.smtpUser}
              onChange={(e) => handleChange('smtpUser', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Password
            </label>
            <input
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => handleChange('smtpPassword', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button variant="secondary" size="sm">
            Test Koneksi Email
          </Button>
        </div>
      </Card>

      {/* File Upload Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Database className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pengaturan File Upload</h3>
            <p className="text-sm text-gray-600">Batasan dan format file</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maksimal Ukuran File (MB)
            </label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => handleChange('maxFileSize', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format File Diizinkan
            </label>
            <input
              type="text"
              value={settings.allowedFormats}
              onChange={(e) => handleChange('allowedFormats', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="pdf,doc,docx,zip"
            />
            <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
          </div>
        </div>
      </Card>

      {/* Backup Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pengaturan Backup</h3>
            <p className="text-sm text-gray-600">Backup otomatis database</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto Backup</p>
              <p className="text-xs text-gray-600">Backup otomatis database</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => handleChange('autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frekuensi Backup
              </label>
              <select
                value={settings.backupFreq}
                onChange={(e) => handleChange('backupFreq', e.target.value)}
                disabled={!settings.autoBackup}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              >
                <option value="hourly">Setiap Jam</option>
                <option value="daily">Harian</option>
                <option value="weekly">Mingguan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retensi Backup (hari)
              </label>
              <input
                type="number"
                value={settings.backupRetention}
                onChange={(e) => handleChange('backupRetention', e.target.value)}
                disabled={!settings.autoBackup}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" size="sm">
              Backup Sekarang
            </Button>
            <Button variant="secondary" size="sm">
              Restore dari Backup
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
