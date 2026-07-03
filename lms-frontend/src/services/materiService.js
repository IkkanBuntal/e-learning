import api from './api';

/**
 * Get all materi with optional filters
 * @param {Object} params - Filter parameters
 * @returns {Promise}
 */
export const getAllMateri = async (params = {}) => {
  try {
    const response = await api.get('/materi', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get materi by ID
 * @param {number} id - Materi ID
 * @returns {Promise}
 */
export const getMateriById = async (id) => {
  try {
    const response = await api.get(`/materi/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create new materi (with file upload)
 * @param {FormData} formData - Form data including file
 * @returns {Promise}
 */
export const createMateri = async (formData) => {
  try {
    const response = await api.post('/materi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update materi
 * @param {number} id - Materi ID
 * @param {FormData} formData - Form data
 * @returns {Promise}
 */
export const updateMateri = async (id, formData) => {
  try {
    formData.append('_method', 'PUT');
    const response = await api.post(`/materi/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete materi
 * @param {number} id - Materi ID
 * @returns {Promise}
 */
export const deleteMateri = async (id) => {
  try {
    const response = await api.delete(`/materi/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Download materi file
 * @param {number} id - Materi ID
 * @returns {Promise}
 */
export const downloadMateri = async (id) => {
  try {
    const response = await api.post(`/materi/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get materi by guru ID
 * @param {number} guruId - Guru ID
 * @returns {Promise}
 */
export const getByGuru = async (guruId) => {
  try {
    const response = await api.get('/materi', { params: { guru_id: guruId } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get materi by kelas ID
 * @param {number} kelasId - Kelas ID
 * @returns {Promise}
 */
export const getByKelas = async (kelasId) => {
  try {
    const response = await api.get('/materi', { params: { kelas_id: kelasId } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all materi (alias for getAllMateri)
 */
export const getAll = getAllMateri;

const materiService = {
  getAllMateri,
  getMateriById,
  createMateri,
  updateMateri,
  deleteMateri,
  downloadMateri,
  getByGuru,
  getByKelas,
  getAll,
};

export default materiService;
