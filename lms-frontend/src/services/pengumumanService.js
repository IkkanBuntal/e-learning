import api from './api';

export const getAllPengumuman = async (params = {}) => {
  const response = await api.get('/pengumuman', { params });
  return response.data;
};

export const getPengumumanById = async (id) => {
  const response = await api.get(`/pengumuman/${id}`);
  return response.data;
};

export const createPengumuman = async (data) => {
  const response = await api.post('/pengumuman', data);
  return response.data;
};

export const updatePengumuman = async (id, data) => {
  const response = await api.put(`/pengumuman/${id}`, data);
  return response.data;
};

export const deletePengumuman = async (id) => {
  const response = await api.delete(`/pengumuman/${id}`);
  return response.data;
};

export const pengumumanService = {
  getAll: getAllPengumuman,
  getOne: getPengumumanById,
  create: createPengumuman,
  update: updatePengumuman,
  delete: deletePengumuman,
};

export default pengumumanService;
