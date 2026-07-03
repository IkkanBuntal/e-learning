import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Dispatch custom event for global toast handling
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Terjadi kesalahan pada server';
      
      if (status === 401) {
        // Token expired atau invalid
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('global-toast', { detail: { type: 'error', message: 'Sesi Anda telah berakhir, silakan login kembali' } }));
        window.location.href = '/login';
      } else if (status === 403) {
        window.dispatchEvent(new CustomEvent('global-toast', { detail: { type: 'error', message: 'Anda tidak memiliki akses ke halaman ini' } }));
      } else if (status >= 500) {
        window.dispatchEvent(new CustomEvent('global-toast', { detail: { type: 'error', message: 'Kesalahan Server Internal (500)' } }));
      }
    } else if (error.request) {
      // Network error
      window.dispatchEvent(new CustomEvent('global-toast', { detail: { type: 'error', message: 'Gagal terhubung ke server. Periksa koneksi internet Anda.' } }));
    }
    
    return Promise.reject(error);
  }
);

export default api;
