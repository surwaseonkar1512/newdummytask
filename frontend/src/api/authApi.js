import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/api/auth/login', credentials),
  register: (data) => axiosClient.post('/api/auth/register', data),
  forgotPassword: (email) => axiosClient.post('/api/auth/forgot-password', { email }),
  resetPassword: (data) => axiosClient.post('/api/auth/reset-password', data),
};
