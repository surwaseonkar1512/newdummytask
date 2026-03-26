import axiosClient from './axiosClient';

export const aboutApi = {
  // Get master document
  get: async () => {
    return await axiosClient.get('/api/about');
  },

  // Update or Create master document
  update: async (aboutData) => {
    return await axiosClient.put('/api/about', aboutData);
  }
};
