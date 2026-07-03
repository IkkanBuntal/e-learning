# 🎓 LMS SMKN 2 Kuningan - Backend API

Laravel REST API untuk Learning Management System SMKN 2 Kuningan.

## 🚀 Tech Stack

- **Laravel 11** - PHP Framework
- **Laravel Sanctum** - API Authentication
- **MySQL 8.0** - Database
- **PHP 8.2+** - Programming Language

## 📦 Installation

### Prerequisites
```bash
- PHP >= 8.2
- Composer
- MySQL 8.0+
- Node.js & NPM (optional, for frontend assets)
```

### Setup

1. **Install Dependencies**
```bash
composer install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
APP_NAME="LMS SMKN 2 Kuningan"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lms_smkn2
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

3. **Generate Application Key**
```bash
php artisan key:generate
```

4. **Create Database**
```bash
mysql -u root -p
CREATE DATABASE lms_smkn2;
exit;
```

5. **Run Migrations & Seeders**
```bash
php artisan migrate:fresh --seed
```

6. **Start Development Server**
```bash
php artisan serve
```

API akan berjalan di `http://localhost:8000`

## 📊 Database Structure

### Tables
- **roles** - Role definitions (Admin, Guru, Siswa)
- **users** - User accounts
- **jurusan** - Departments (RPL, TKJ, MM, BDP)
- **kelas** - Classes
- **mata_pelajaran** - Subjects
- **jadwal_mengajar** - Teaching schedules
- **materi** - Learning materials
- **tugas** - Assignments
- **pengumpulan_tugas** - Assignment submissions
- **nilai** - Grades
- **absensi** - Attendance records
- **pengumuman** - Announcements
- **settings** - System settings

### Relationships
- User belongsTo Role
- User belongsTo Kelas (for students)
- Kelas belongsTo Jurusan
- JadwalMengajar connects Guru, Kelas, MataPelajaran
- Materi, Tugas, Nilai, Absensi linked to JadwalMengajar

## 🔐 Authentication

### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@smkn2kuningan.sch.id",
  "password": "password"
}
```

Response:
```json
{
  "token": "1|xxxxxxxxxxxxx",
  "user": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@smkn2kuningan.sch.id",
    "role": {
      "id": 1,
      "name": "Admin"
    }
  }
}
```

### Authenticated Requests
Add token to header:
```http
Authorization: Bearer {token}
```

### Default Users
```
Admin:
- Email: admin@smkn2kuningan.sch.id
- Password: password

Guru:
- Email: guru1@smkn2kuningan.sch.id
- Password: password

Siswa:
- Email: siswa1@smkn2kuningan.sch.id
- Password: password
```

## 🛣️ API Routes

### Public Routes
```
POST /api/login           - User login
```

### Protected Routes (All require authentication)

#### Admin Only
```
GET/POST/PUT/DELETE  /api/users
GET/POST/PUT/DELETE  /api/jurusan
GET/POST/PUT/DELETE  /api/kelas
GET/POST/PUT/DELETE  /api/mata-pelajaran
GET/POST/PUT/DELETE  /api/jadwal-mengajar
GET                  /api/settings
PUT                  /api/settings
GET                  /api/dashboard/admin
```

#### Guru (Teacher)
```
GET/POST/PUT/DELETE  /api/materi
GET/POST/PUT/DELETE  /api/tugas
GET/POST             /api/nilai
GET/POST             /api/absensi
GET                  /api/dashboard/guru
GET                  /api/jadwal-mengajar/my
```

#### Siswa (Student)
```
GET      /api/materi
GET      /api/tugas
POST     /api/pengumpulan-tugas
GET      /api/nilai/my
GET      /api/absensi/my
GET      /api/dashboard/siswa
```

#### All Authenticated Users
```
GET      /api/pengumuman
POST     /api/logout
GET      /api/me
```

## 🧪 Testing API

### Using cURL
```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smkn2kuningan.sch.id","password":"password"}'

# Get Users (with token)
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer {your_token}"
```

### Using Postman
1. Import collection (if available)
2. Set base URL: `http://localhost:8000/api`
3. Login and save token
4. Use token in Authorization header

## 📁 Project Structure

```
lms-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── UserController.php
│   │   │   ├── JurusanController.php
│   │   │   ├── KelasController.php
│   │   │   ├── MataPelajaranController.php
│   │   │   ├── JadwalMengajarController.php
│   │   │   ├── MateriController.php
│   │   │   ├── TugasController.php
│   │   │   ├── PengumpulanTugasController.php
│   │   │   ├── NilaiController.php
│   │   │   ├── AbsensiController.php
│   │   │   ├── PengumumanController.php
│   │   │   ├── SettingController.php
│   │   │   └── DashboardController.php
│   │   └── Middleware/
│   │       └── CheckRole.php
│   └── Models/
│       ├── User.php
│       ├── Role.php
│       ├── Jurusan.php
│       ├── Kelas.php
│       ├── MataPelajaran.php
│       ├── JadwalMengajar.php
│       ├── Materi.php
│       ├── Tugas.php
│       ├── PengumpulanTugas.php
│       ├── Nilai.php
│       ├── Absensi.php
│       ├── Pengumuman.php
│       └── Setting.php
├── database/
│   ├── migrations/       # Database schema
│   └── seeders/         # Sample data
├── routes/
│   └── api.php          # API routes definition
└── config/
    ├── cors.php         # CORS configuration
    └── sanctum.php      # Sanctum configuration
```

## 🔧 Key Features

### Role-Based Access Control
- Middleware `CheckRole` validates user permissions
- Routes protected by role requirements
- Unauthorized access returns 403 Forbidden

### File Uploads
- Materi can include PDF, DOC, PPT files
- Tugas submissions support file uploads
- Files stored in `storage/app/public`
- Access via `/storage/{filename}`

### Validation
- Request validation in controllers
- Proper error messages
- Data sanitization

### API Response Format
Success:
```json
{
  "data": {...},
  "message": "Success message"
}
```

Error:
```json
{
  "message": "Error message",
  "errors": {...}
}
```

## 🚨 Common Issues

### CORS Error
Make sure `.env` has:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

### 500 Internal Server Error
```bash
# Check logs
tail -f storage/logs/laravel.log

# Clear cache
php artisan config:clear
php artisan cache:clear
```

### Migration Error
```bash
# Reset database
php artisan migrate:fresh --seed
```

### Storage Link
```bash
# Create symbolic link for file storage
php artisan storage:link
```

## 📝 Development

### Create New Migration
```bash
php artisan make:migration create_table_name
```

### Create New Model
```bash
php artisan make:model ModelName -m
```

### Create New Controller
```bash
php artisan make:controller ControllerName
```

### Create New Seeder
```bash
php artisan make:seeder SeederName
```

## 🔒 Security

- Password hashing with bcrypt
- CSRF protection
- SQL injection prevention via Eloquent
- XSS protection
- Rate limiting on login
- Sanctum token authentication

## 📚 Documentation

- [Laravel Docs](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Eloquent ORM](https://laravel.com/docs/eloquent)

## 📄 License

This project is for SMKN 2 Kuningan internal use.

---

**Version:** 1.0.0  
**Laravel:** 11.x  
**PHP:** 8.2+
