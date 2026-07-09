import api from './api';

const roleService = {
  /**
   * GET /api/roles — ambil semua role dengan jumlah user dari DB
   */
  getAll: () => api.get('/roles').then(r => r.data),

  /**
   * GET /api/roles/:id
   */
  getById: (id) => api.get(`/roles/${id}`).then(r => r.data),

  /**
   * POST /api/roles
   */
  create: (data) => api.post('/roles', data).then(r => r.data),

  /**
   * PUT /api/roles/:id
   */
  update: (id, data) => api.put(`/roles/${id}`, data).then(r => r.data),

  /**
   * DELETE /api/roles/:id
   */
  delete: (id) => api.delete(`/roles/${id}`).then(r => r.data),
};

export default roleService;
