import api from './api';

/**
 * Get all tugas with optional filters
 * @param {Object} params - Filter parameters
 * @returns {Promise}
 */
export const getAllTugas = async (params = {}) => {
  try {
    const response = await api.get('/tugas', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get tugas by ID
 * @param {number} id - Tugas ID
 * @returns {Promise}
 */
export const getTugasById = async (id) => {
  try {
    const response = await api.get(`/tugas/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create new tugas
 * @param {FormData} formData - Form data including file (optional)
 * @returns {Promise}
 */
export const createTugas = async (formData) => {
  try {
    const response = await api.post('/tugas', formData, {
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
 * Update tugas
 * @param {number} id - Tugas ID
 * @param {FormData} formData - Form data
 * @returns {Promise}
 */
export const updateTugas = async (id, formData) => {
  try {
    formData.append('_method', 'PUT');
    const response = await api.post(`/tugas/${id}`, formData, {
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
 * Delete tugas
 * @param {number} id - Tugas ID
 * @returns {Promise}
 */
export const deleteTugas = async (id) => {
  try {
    const response = await api.delete(`/tugas/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get submissions for a tugas (for Guru)
 * @param {number} tugasId - Tugas ID
 * @returns {Promise}
 */
export const getTugasSubmissions = async (tugasId) => {
  try {
    const response = await api.get('/pengumpulan-tugas', { params: { tugas_id: tugasId } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Submit tugas (for Siswa)
 * @param {number} tugasId - Tugas ID
 * @param {FormData} formData - Form data with file and catatan
 * @returns {Promise}
 */
export const submitTugas = async (tugasId, formData) => {
  try {
    const response = await api.post('/pengumpulan-tugas', formData, {
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
 * Grade submission (for Guru)
 * @param {number} submissionId - Submission ID
 * @param {Object} data - Grading data (nilai, feedback)
 * @returns {Promise}
 */
export const gradeSubmission = async (submissionId, data) => {
  try {
    const response = await api.put(`/pengumpulan-tugas/${submissionId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get my submissions (for Siswa)
 * @param {Object} params - Filter parameters
 * @returns {Promise}
 */
export const getMySubmissions = async (params = {}) => {
  try {
    const response = await api.get('/pengumpulan-tugas', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get tugas by guru ID
 * @param {number} guruId - Guru ID
 * @returns {Promise}
 */
export const getByGuru = async (guruId) => {
  try {
    const response = await api.get('/tugas', { params: { guru_id: guruId } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get tugas by kelas ID
 * @param {number} kelasId - Kelas ID
 * @returns {Promise}
 */
export const getByKelas = async (kelasId) => {
  try {
    const response = await api.get('/tugas', { params: { kelas_id: kelasId } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get submissions by siswa ID
 * @param {number} siswaId - Siswa ID
 * @returns {Promise}
 */
export const getSubmissionsBySiswa = async (siswaId) => {
  try {
    const response = await api.get('/pengumpulan-tugas', { params: { siswa_id: siswaId } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all tugas (alias for getAllTugas)
 */
export const getAll = getAllTugas;

const tugasService = {
  getAllTugas,
  getTugasById,
  createTugas,
  updateTugas,
  deleteTugas,
  getTugasSubmissions,
  submitTugas,
  gradeSubmission,
  getMySubmissions,
  getByGuru,
  getByKelas,
  getSubmissionsBySiswa,
  getAll,
};

export default tugasService;
