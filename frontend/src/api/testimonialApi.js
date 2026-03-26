import axiosClient from './axiosClient';

export const testimonialApi = {
  // Public/Admin Fetcher (pass { isVisible: true } for public)
  getAll: async (params = {}) => {
    return await axiosClient.get('/api/testimonials', { params });
  },

  create: async (testimonialData) => {
    return await axiosClient.post('/api/testimonials', testimonialData);
  },

  update: async (id, testimonialData) => {
    return await axiosClient.put(`/api/testimonials/${id}`, testimonialData);
  },

  delete: async (id) => {
    return await axiosClient.delete(`/api/testimonials/${id}`);
  }
};
