# 🎓 E-Learning LMS

Learning Management System (LMS) berbasis web untuk SMKN 2 Kuningan yang memudahkan pengelolaan pembelajaran, tugas, nilai, dan absensi siswa.

## 📋 Deskripsi

Sistem ini terdiri dari:
- **Backend**: REST API menggunakan Laravel 13 (PHP 8.3)
- **Frontend**: SPA menggunakan React 19 + Vite
- **Database**: SQLite (dapat diganti MySQL/PostgreSQL)
- **Authentication**: Laravel Sanctum (Token-based)

## ✨ Fitur Utama

### 👨‍💼 Admin
- Manajemen users (guru & siswa)
- Manajemen master data (jurusan, kelas, mata pelajaran)
- Manajemen jadwal mengajar
- Pengumuman sekolah
- Laporan & statistik
- Pengaturan sistem
- Manajemen cache (clear & optimize)

### 👨‍🏫 Guru
- Upload materi pembelajaran
- Buat & kelola tugas/assignment
- Input nilai siswa (individual/bulk)
- Input absensi siswa (individual/bulk)
- Lihat submission tugas dari siswa
- Dashboard jadwal mengajar

### 👨‍🎓 Siswa
- Lihat materi pembelajaran
- Submit tugas/assignment
- Lihat nilai & summary
- Lihat absensi & summary
- Lihat pengumuman
- Dashboard jadwal belajar

## 🛠️ Tech Stack

### Backend
- Laravel 13.8
- PHP 8.3
- Laravel Sanctum (Authentication)
- SQLite Database
- Redis Cache (Optional)
- Composer

### Frontend
- React 19.2
- Vite 8.0
- Tailwind CSS 4.3
- React Router DOM 7.15
- Axios
- Framer Motion
- Lucide React

## 📦 Instalasi

### Prerequisites
- PHP >= 8.3
- Composer
- Node.js >= 18
- NPM atau Yarn
- Redis (Optional, untuk cache optimization)

### 1. Clone Repository
```bash
git clone <repository-url>
cd e-learning
```

### 2. Install Redis (Optional - untuk Performance Optimization)

#### Windows
1. **Download Redis untuk Windows**
   - Download dari: https://github.com/microsoftarchive/redis/releases
   - Pilih versi terbaru (contoh: Redis-x64-3.0.504.msi)
   - Install seperti aplikasi biasa

2. **Atau gunakan Memurai (Redis-compatible untuk Windows)**
   ```bash
   # Download dari: https://www.memurai.com/
   # Install dan jalankan sebagai Windows Service
   ```

3. **Atau gunakan Docker**
   ```bash
   docker run -d -p 6379:6379 --name redis redis:alpine
   ```

4. **Verifikasi Redis berjalan**
   ```bash
   redis-cli ping
   # Output: PONG
   ```

#### Linux/Ubuntu
```bash
# Update package list
sudo apt update

# Install Redis
sudo apt install redis-server

# Start Redis service
sudo systemctl start redis-server

# Enable Redis on boot
sudo systemctl enable redis-server

# Verifikasi
redis-cli ping
# Output: PONG
```

#### macOS
```bash
# Menggunakan Homebrew
brew install redis

# Start Redis service
brew services start redis

# Verifikasi
redis-cli ping
# Output: PONG
```

#### Konfigurasi Redis di Laravel
Setelah Redis terinstall, update file `.env` di `lms-backend`:
```env
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

Jika tidak menggunakan Redis, gunakan file cache:
```env
CACHE_DRIVER=file
```

### 3. Setup Backend

```bash
cd lms-backend

# Install dependencies
composer install

# Install predis (Redis client untuk PHP)
composer require predis/predis

# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Konfigurasi .env sesuai kebutuhan
# Edit CACHE_DRIVER, DB settings, dll

# Run migrations & seeders
php artisan migrate --seed

# Clear & optimize cache (jika menggunakan Redis)
php artisan cache:clear
php artisan config:cache

# Start development server
php artisan serve
```

Backend akan berjalan di: **http://127.0.0.1:8000**

### 4. Setup Frontend

```bash
cd lms-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend akan berjalan di: **http://localhost:3000**

## 🔑 Default Login

### Admin
```
Email: admin@smkn2kuningan.sch.id
Password: password
```

### Guru
```
Email: guru1@smkn2kuningan.sch.id
Password: password
```

### Siswa
```
Email: siswa1@smkn2kuningan.sch.id
Password: password
```

## 📁 Struktur Project

```
e-learning/
├── lms-backend/              # Laravel Backend API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # API Controllers
│   │   │   └── Middleware/   # Custom Middleware
│   │   └── Models/          # Eloquent Models
│   ├── database/
│   │   ├── migrations/      # Database Migrations
│   │   └── seeders/        # Database Seeders
│   ├── routes/
│   │   └── api.php         # API Routes
│   └── config/             # Configuration Files
│
└── lms-frontend/            # React Frontend
    ├── src/
    │   ├── components/      # Reusable Components
    │   ├── pages/          # Page Components
    │   ├── services/       # API Services
    │   ├── context/        # React Context
    │   ├── routes/         # Route Definitions
    │   ├── hooks/          # Custom Hooks
    │   └── utils/          # Utility Functions
    └── public/             # Static Assets
```

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Master Data (Admin)
- `/api/users` - User management
- `/api/jurusan` - Jurusan CRUD
- `/api/kelas` - Kelas CRUD
- `/api/mata-pelajaran` - Mata Pelajaran CRUD
- `/api/jadwal-mengajar` - Jadwal Mengajar CRUD

### Learning (Admin & Guru)
- `/api/materi` - Materi pembelajaran
- `/api/tugas` - Tugas/assignments
- `/api/nilai` - Penilaian siswa
- `/api/absensi` - Absensi siswa

### Student
- `/api/pengumpulan-tugas` - Submit tugas
- `/api/nilai` - View nilai
- `/api/absensi` - View absensi

### Others
- `/api/pengumuman` - Pengumuman
- `/api/dashboard/stats` - Dashboard statistics
- `/api/setting` - System settings
- `/api/cache/clear` - Clear cache (Admin only)
- `/api/cache/status` - Cache status

## 🗄️ Database Schema

Database terdiri dari 13 tabel utama:
- `users` - Data pengguna (admin, guru, siswa)
- `roles` - Role pengguna
- `jurusan` - Program studi
- `kelas` - Kelas/rombongan belajar
- `mata_pelajaran` - Mata pelajaran
- `jadwal_mengajar` - Jadwal mengajar guru
- `materi` - Materi pembelajaran
- `tugas` - Tugas/assignment
- `pengumpulan_tugas` - Submission tugas siswa
- `nilai` - Nilai siswa
- `absensi` - Absensi siswa
- `pengumuman` - Pengumuman
- `settings` - Pengaturan sistem

## 🚀 Deployment

### Backend (Laravel)
```bash
# Production build
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend (React)
```bash
# Production build
npm run build

# Build output akan ada di folder dist/
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## ⚡ Performance Optimization

Sistem ini dilengkapi dengan caching mechanism untuk meningkatkan performance:
- Response caching untuk API endpoints yang sering diakses
- Cache management dashboard untuk admin
- Automatic cache invalidation saat data berubah
- Redis support untuk cache yang lebih cepat (optional)

### Perintah Cache Management

```bash
# Clear semua cache
php artisan cache:clear

# Clear config cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# Clear view cache
php artisan view:clear

# Optimize cache (production)
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Custom cache command
php artisan cache:manage clear
php artisan cache:manage optimize
php artisan cache:manage status
```

### Monitoring Cache

Akses halaman **Cache Management** di dashboard admin untuk:
- Melihat status cache (hits, misses, size)
- Clear cache secara manual
- Optimize cache
- Monitoring performance

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: [Your Name]

## 📝 Changelog

### Latest Updates (2026-07-06)

#### 🔧 Bug Fixes & Improvements
- ✅ **Filter Tingkatan Kelas**: Fixed filter tingkatan (X, XI, XII) yang tidak menampilkan hasil
- ✅ **Wali Kelas Management**: 
  - Fixed wali kelas tidak muncul di tabel kelas
  - Fixed wali kelas tidak berubah setelah edit
  - Auto-assign wali kelas untuk data existing
- ✅ **Delete Kelas**: Fixed delete functionality dengan route model binding
- ✅ **Route Model Binding**: Fixed Laravel singular route parameter issue (`{kela}`)
- ✅ **Paginated Response**: Fixed handling paginated response di UserForm, JadwalForm, dan Jadwal page
- 🔨 **Helper Command**: Tambah command `php artisan kelas:fix-wali` untuk fix data wali kelas yang kosong

#### Technical Improvements
- 🔧 **Backend**:
  - Enhanced route model binding di AppServiceProvider
  - Improved KelasController dengan proper model binding
  - Better error handling dan logging
  - Updated KelasSeeder untuk auto-assign wali kelas
- 🎨 **Frontend**:
  - Fixed filter component untuk handle nilai X, XI, XII
  - Improved form validation dan error handling
  - Better pagination handling
  - Enhanced data mapping untuk paginated responses

#### Code Quality
- 📝 Added comprehensive logging untuk debugging
- 🧹 Cleanup unused code dan temporary commands
- 📦 Better code organization dan structure
- ✨ Improved error messages untuk better UX

---

### Previous Updates (2026-07-05)

#### UI/UX Improvements
- ✨ **Modern Loading States**: Implementasi skeleton loading yang lebih smooth dan modern di semua halaman
- 🎨 **Enhanced Visual Design**: 
  - Gradient borders dan backgrounds untuk cards
  - Improved animations menggunakan Framer Motion
  - Hover effects dan transitions yang lebih halus
  - Modern stat cards dengan gradient icons
- 📊 **Dashboard Enhancements**:
  - Redesign dashboard admin dengan stat cards yang lebih informatif
  - Chart area yang lebih modern dengan gradient fills
  - Activity feed dengan timeline design
  - Improved dashboard untuk guru dan siswa

#### Performance Optimizations
- ⚡ **Smart Loading**: Skeleton loading menggantikan spinner untuk UX yang lebih baik
- 🚀 **Optimized Animations**: Smooth transitions dengan Framer Motion
- 💾 **Cache Enhancement**: Improved dashboard stats caching di backend

#### Technical Improvements
- 🔧 **CORS Configuration**: Fixed CORS settings untuk production
- 📦 **Component Structure**: Removed redundant LoadingSpinner component
- 🎯 **Code Quality**: Cleaner code structure dan better component composition
- 🔒 **Security**: Enhanced validation dan error handling

#### Bug Fixes
- 🐛 Fixed loading states tidak konsisten
- 🐛 Fixed CORS issues untuk production deployment
- 🐛 Improved error handling di dashboard statistics

---
