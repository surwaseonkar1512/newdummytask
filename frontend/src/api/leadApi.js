import axiosClient from './axiosClient';

export const leadApi = {
  // Public
  create: (leadData) => axiosClient.post('/api/leads', leadData),

  // Admin
  getAll: (status = '') => {
    const url = status ? `/api/leads?status=${status}` : '/api/leads';
    return axiosClient.get(url);
  },

  getAnalytics: () => axiosClient.get('/api/leads/analytics/dashboard'),

  getById: (id) => axiosClient.get(`/api/leads/${id}`),

  update: (id, data) => axiosClient.put(`/api/leads/${id}`, data),

  updateStatus: (id, status) => axiosClient.patch(`/api/leads/${id}/status`, { status }),

  addQuotation: (id, quotationData) => axiosClient.put(`/api/leads/${id}/quotation`, quotationData),

  delete: (id) => axiosClient.delete(`/api/leads/${id}`)
};
