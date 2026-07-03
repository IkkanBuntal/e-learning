import api from './api';

/**
 * Get dashboard stats
 * @returns {Promise}
 */
export const getStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get student report data
 * @param {Object} params - Filtering params (jurusan, kelas, search)
 * @returns {Promise}
 */
export const getLaporanSiswa = async (params = {}) => {
  try {
    const response = await api.get('/laporan/siswa', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getLaporanGuru = async (params = {}) => {
  try {
    const response = await api.get('/laporan/guru', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const dashboardService = {
  getStats,
  getLaporanSiswa,
  getLaporanGuru,
};

export default dashboardService;
