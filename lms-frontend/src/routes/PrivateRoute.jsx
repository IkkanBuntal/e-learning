import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Optionally checks for specific roles
 * 
 * @param {Array} allowedRoles - Array of roles that can access this route
 * @returns {JSX.Element} - Protected route or redirect
 * 
 * @example
 * // Protect route for authenticated users only
 * <Route element={<PrivateRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 * 
 * @example
 * // Protect route for specific roles
 * <Route element={<PrivateRoute allowedRoles={['admin', 'guru']} />}>
 *   <Route path="/users" element={<Users />} />
 * </Route>
 */
const PrivateRoute = ({ allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role authorization if allowedRoles is specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Akses Ditolak
          </h2>
          <p className="text-gray-600 mb-6">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and authorized - render child routes
  return <Outlet />;
};

export default PrivateRoute;
