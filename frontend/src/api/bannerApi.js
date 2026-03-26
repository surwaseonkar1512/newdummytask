import axiosClient from './axiosClient';

export const bannerApi = {
  getAll: () => axiosClient.get('/api/banners'),
  getAllAdmin: () => axiosClient.get('/api/banners/admin'),
  getById: (id) => axiosClient.get(`/api/banners/${id}`),
  create: (data) => axiosClient.post('/api/banners', data),
  update: (id, data) => axiosClient.put(`/api/banners/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/banners/${id}`),
  toggleStatus: (id) => axiosClient.patch(`/api/banners/${id}/toggle`),
};
