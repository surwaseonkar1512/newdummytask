import axiosClient from './axiosClient';

export const galleryApi = {
  getAll: () => axiosClient.get('/api/gallery'),
  uploadImage: (formData) => axiosClient.post('/api/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
