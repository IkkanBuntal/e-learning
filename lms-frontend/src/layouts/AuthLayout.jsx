import { Outlet } from 'react-router-dom';

/**
 * AuthLayout Component
 * Layout wrapper for authentication pages (Login, Register, etc)
 * Provides consistent styling and structure
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Background Pattern - Optional decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-6 text-center text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} LMS Sekolah. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;
