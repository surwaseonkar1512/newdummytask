import axiosClient from './axiosClient';

export const productApi = {
  getAll: (params) => axiosClient.get('/api/products', { params }),
  getAllAdmin: () => axiosClient.get('/api/products/admin'),
  getById: (id) => axiosClient.get(`/api/products/${id}`),
  create: (data) => axiosClient.post('/api/products', data),
  update: (id, data) => axiosClient.put(`/api/products/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/products/${id}`),
  toggleFeatured: (id) => axiosClient.patch(`/api/products/${id}/toggle-featured`),
  toggleVisible: (id) => axiosClient.patch(`/api/products/${id}/toggle-visible`),
};
