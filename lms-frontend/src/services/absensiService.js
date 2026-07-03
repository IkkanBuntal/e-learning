import api from './api';

/**
 * Get all absensi with filters
 * @param {Object} params - Filter parameters
 * @returns {Promise}
 */
export const getAllAbsensi = async (params = {}) => {
  try {
    const response = await api.get('/absensi', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get absensi by kelas for input (Guru)
 * @param {number} kelasId - Kelas ID
 * @param {number} mataPelajaranId - Mata Pelajaran ID
 * @param {string} tanggal - Tanggal (YYYY-MM-DD)
 * @returns {Promise}
 */
export const getAbsensiByKelas = async (kelasId, mataPelajaranId, tanggal) => {
  try {
    const response = await api.get('/absensi/kelas', {
      params: { kelas_id: kelasId, mata_pelajaran_id: mataPelajaranId, tanggal }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Bulk input absensi (Guru)
 * @param {Object} data - Bulk absensi data
 * @returns {Promise}
 */
export const bulkInputAbsensi = async (data) => {
  try {
    const response = await api.post('/absensi/bulk', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get my absensi (Siswa)
 * @param {Object} params - Filter parameters
 * @returns {Promise}
 */
export const getMyAbsensi = async (params = {}) => {
  try {
    const response = await api.get('/absensi', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get absensi summary (Siswa)
 * Count hadir, sakit, izin, alpha
 * @param {Object} params - Filter parameters (bulan)
 * @returns {Promise}
 */
export const getAbsensiSummary = async (params = {}) => {
  try {
    const response = await api.get('/absensi/summary', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get absensi chart data (Siswa)
 * For visualization per bulan
 * @param {string} tahun - Year (YYYY)
 * @returns {Promise}
 */
export const getAbsensiChart = async (tahun = '2024') => {
  try {
    const response = await api.get('/absensi/chart', { params: { tahun } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get absensi by siswa ID
 * @param {number} siswaId - Siswa ID
 * @returns {Promise}
 */
export const getBySiswa = async (siswaId) => {
  try {
    const response = await api.get('/absensi', { params: { siswa_id: siswaId } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const absensiService = {
  getAllAbsensi,
  getAbsensiByKelas,
  bulkInputAbsensi,
  getMyAbsensi,
  getAbsensiSummary,
  getAbsensiChart,
  getBySiswa,
};

export default absensiService;
