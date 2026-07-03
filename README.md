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

### 1. Clone Repository
```bash
git clone <repository-url>
cd e-learning
```

### 2. Setup Backend

```bash
cd lms-backend

# Install dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Run migrations & seeders
php artisan migrate --seed

# Start development server
php artisan serve
```

Backend akan berjalan di: **http://127.0.0.1:8000**

### 3. Setup Frontend

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

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: [Your Name]

---
