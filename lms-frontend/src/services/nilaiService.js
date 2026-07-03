import api from './api';

/**
 * Get all nilai with filters
 * @param {Object} params - Filter parameters
 * @returns {Promise}
 */
export const getAllNilai = async (params = {}) => {
  try {
    const response = await api.get('/nilai', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get nilai by kelas for bulk input (Guru)
 * @param {number} kelasId - Kelas ID
 * @param {number} mataPelajaranId - Mata Pelajaran ID
 * @param {string} jenis - Jenis nilai (tugas, uts, uas)
 * @returns {Promise}
 */
export const getNilaiByKelas = async (kelasId, mataPelajaranId, jenis) => {
  try {
    const response = await api.get('/nilai/kelas', {
      params: { kelas_id: kelasId, mata_pelajaran_id: mataPelajaranId, jenis }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Bulk input nilai (Guru)
 * @param {Object} data - Bulk nilai data
 * @returns {Promise}
 */
export const bulkInputNilai = async (data) => {
  try {
    const response = await api.post('/nilai/bulk', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get my nilai (Siswa)
 * @param {Object} params - Filter parameters
 * @returns {Promise}
 */
export const getMyNilai = async (params = {}) => {
  try {
    const response = await api.get('/nilai', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get nilai summary (Siswa)
 * Calculate average, highest, lowest scores
 * @returns {Promise}
 */
export const getNilaiSummary = async () => {
  try {
    const response = await api.get('/nilai/summary');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get nilai by mata pelajaran (Siswa)
 * Group nilai by mata pelajaran
 * @returns {Promise}
 */
export const getNilaiByMapel = async () => {
  try {
    const response = await api.get('/nilai/by-mapel');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get nilai by siswa ID
 * @param {number} siswaId - Siswa ID
 * @returns {Promise}
 */
export const getBySiswa = async (siswaId) => {
  try {
    const response = await api.get('/nilai', { params: { siswa_id: siswaId } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const nilaiService = {
  getAllNilai,
  getNilaiByKelas,
  bulkInputNilai,
  getMyNilai,
  getNilaiSummary,
  getNilaiByMapel,
  getBySiswa,
};

export default nilaiService;
