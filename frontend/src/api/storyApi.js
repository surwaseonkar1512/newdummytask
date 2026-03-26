import axiosClient from './axiosClient';

export const storyApi = {
  create: (data) => axiosClient.post('/api/stories', data),
  getAllAdmin: () => axiosClient.get('/api/stories'),
  getAllPublic: () => axiosClient.get('/api/stories?isPublished=true'),
  getByIdOrSlug: (idOrSlug) => axiosClient.get(`/api/stories/${idOrSlug}`),
  update: (id, data) => axiosClient.put(`/api/stories/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/stories/${id}`),
};
