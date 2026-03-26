import axiosClient from './axiosClient';

export const settingApi = {
  getSettings: () => axiosClient.get('/api/settings'),
  updateSettings: (data) => axiosClient.put('/api/settings', data),
};
