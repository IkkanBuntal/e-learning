import api from './api';

const profileService = {
  /**
   * GET /api/profile — Ambil data profil pribadi user yang sedang login
   */
  get: () => api.get('/profile').then(r => r.data),

  /**
   * POST /api/profile — Update profil mandiri (menggunakan POST karena upload foto/multipart-form-data)
   */
  update: (formData) => api.post('/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(r => r.data),
};

export default profileService;
