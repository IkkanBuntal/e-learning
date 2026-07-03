/**
 * Service untuk master data (Kelas, Mata Pelajaran, dll)
 */
import api from './api';

/**
 * Jurusan CRUD
 */
export const getAllJurusan = async () => {
  const response = await api.get('/jurusan');
  return response.data;
};

export const getJurusanById = async (id) => {
  const response = await api.get(`/jurusan/${id}`);
  return response.data;
};

export const createJurusan = async (data) => {
  const response = await api.post('/jurusan', data);
  return response.data;
};

export const updateJurusan = async (id, data) => {
  const response = await api.put(`/jurusan/${id}`, data);
  return response.data;
};

export const deleteJurusan = async (id) => {
  const response = await api.delete(`/jurusan/${id}`);
  return response.data;
};

/**
 * Kelas CRUD
 */
export const getAllKelas = async (mataPelajaranId = null) => {
  const response = await api.get('/kelas');
  return response.data;
};

export const getKelasById = async (id) => {
  const response = await api.get(`/kelas/${id}`);
  return response.data;
};

export const createKelas = async (data) => {
  const response = await api.post('/kelas', data);
  return response.data;
};

export const updateKelas = async (id, data) => {
  const response = await api.put(`/kelas/${id}`, data);
  return response.data;
};

export const deleteKelas = async (id) => {
  const response = await api.delete(`/kelas/${id}`);
  return response.data;
};

/**
 * Mata Pelajaran CRUD
 */
export const getAllMataPelajaran = async () => {
  const response = await api.get('/mata-pelajaran');
  return response.data;
};

export const getMataPelajaranById = async (id) => {
  const response = await api.get(`/mata-pelajaran/${id}`);
  return response.data;
};

export const createMataPelajaran = async (data) => {
  const response = await api.post('/mata-pelajaran', data);
  return response.data;
};

export const updateMataPelajaran = async (id, data) => {
  const response = await api.put(`/mata-pelajaran/${id}`, data);
  return response.data;
};

export const deleteMataPelajaran = async (id) => {
  const response = await api.delete(`/mata-pelajaran/${id}`);
  return response.data;
};

/**
 * Jadwal Mengajar CRUD
 */
export const getTeachingAssignments = async (guruId = null) => {
  const params = guruId ? { guru_id: guruId } : {};
  const response = await api.get('/jadwal-mengajar', { params });
  return response.data;
};

export const getJadwalById = async (id) => {
  const response = await api.get(`/jadwal-mengajar/${id}`);
  return response.data;
};

export const createJadwal = async (data) => {
  const response = await api.post('/jadwal-mengajar', data);
  return response.data;
};

export const updateJadwal = async (id, data) => {
  const response = await api.put(`/jadwal-mengajar/${id}`, data);
  return response.data;
};

export const deleteJadwal = async (id) => {
  const response = await api.delete(`/jadwal-mengajar/${id}`);
  return response.data;
};

const masterDataService = {
  // Jurusan
  getAllJurusan,
  getJurusanById,
  createJurusan,
  updateJurusan,
  deleteJurusan,
  // Kelas
  getAllKelas,
  getKelasById,
  createKelas,
  updateKelas,
  deleteKelas,
  // Mata Pelajaran
  getAllMataPelajaran,
  getMataPelajaranById,
  createMataPelajaran,
  updateMataPelajaran,
  deleteMataPelajaran,
  // Jadwal
  getTeachingAssignments,
  getJadwalById,
  createJadwal,
  updateJadwal,
  deleteJadwal,
};

export default masterDataService;
