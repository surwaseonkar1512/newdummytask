import axiosClient from './axiosClient';

export const blogApi = {
  getAll: () => axiosClient.get('/api/blogs'),
  getById: (id) => axiosClient.get(`/api/blogs/${id}`),
  getBySlug: (slug) => axiosClient.get(`/api/blogs/slug/${slug}`),
  create: (data) => axiosClient.post('/api/blogs', data),
  update: (id, data) => axiosClient.put(`/api/blogs/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/blogs/${id}`),
};
