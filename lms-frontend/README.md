# LMS Frontend - SMKN 2 Kuningan

Learning Management System Frontend built with React + Vite + Tailwind CSS

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components (Button, Input, Card, etc.)
│   ├── layout/          # Layout components (Sidebar, Navbar, Footer)
│   └── forms/           # Form components
├── layouts/
│   ├── AppLayout.jsx    # Main app layout with sidebar
│   └── AuthLayout.jsx   # Authentication pages layout
├── pages/
│   ├── auth/            # Login, Register pages
│   ├── admin/           # Admin dashboard & pages
│   ├── guru/            # Teacher pages
│   └── siswa/           # Student pages
├── routes/
│   ├── index.jsx        # Route definitions
│   └── PrivateRoute.jsx # Protected route wrapper
├── context/
│   ├── AuthContext.jsx  # Authentication state management
│   └── ThemeContext.jsx # Theme (dark mode) management
├── services/
│   ├── api.js           # Axios instance with interceptors
│   ├── authService.js   # Auth API calls
│   └── userService.js   # User CRUD API calls
├── hooks/
│   ├── useAuth.js       # Auth context hook
│   └── useFetch.js      # Data fetching hook
├── utils/
│   ├── formatDate.js    # Date formatting utilities
│   ├── roleHelper.js    # Role checking utilities
│   └── validation.js    # Form validation helpers
└── App.jsx              # Root component
```

## 🎨 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
VITE_API_URL=http://localhost:8000/api
```

### Vite Config

- Dev server runs on port **3000**
- API proxy configured to forward `/api` requests to Laravel backend

### Tailwind Config

Custom colors:
- **Primary**: `#002B5B` (Navy Blue)
- **Secondary**: `#0056A3` (Blue)

Custom font:
- **Poppins** (Google Fonts)

## 📦 Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

Authentication uses Laravel Sanctum tokens:
1. Login returns `{ user, token }`
2. Token stored in `localStorage`
3. Axios interceptor adds token to all requests
4. 401 responses trigger automatic logout

## 🎯 Development Phases

- [x] Phase 1: Project Setup
- [ ] Phase 2: Authentication System
- [ ] Phase 3: Dashboard & Layout
- [ ] Phase 4: CRUD Management
- [ ] Phase 5: Materi & Tugas
- [ ] Phase 6: Nilai & Absensi
- [ ] Phase 7: Finishing & Deployment

## 📝 Notes

- All API calls go through `src/services/api.js`
- Use common components from `src/components/common/`
- Follow existing patterns for new pages
- Keep components small and reusable

## 🤝 Contributing

Follow the implementation plan in `LMS-Implementation-Plan.md`
