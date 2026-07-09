import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    const data = response.data.data;
    
    return {
      token: data.token,
      user: {
        id: data.user.id,
        name: data.user.nama,
        email: data.user.email,
        role: data.user.role.nama,
        kelas_id: data.user.kelas_id,
        nis: data.user.nis,
        nip: data.user.nip,
        foto: data.user.foto,
        no_telp: data.user.no_telp,
        alamat: data.user.alamat,
      },
    };
  },

  register: async (data) => {
    const response = await api.post('/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  me: async () => {
    const response = await api.get('/me');
    const data = response.data.data;
    
    return {
      id: data.id,
      name: data.nama,
      email: data.email,
      role: data.role.nama,
      kelas_id: data.kelas_id,
      nis: data.nis,
      nip: data.nip,
      foto: data.foto,
      no_telp: data.no_telp,
      alamat: data.alamat,
    };
  },
};
