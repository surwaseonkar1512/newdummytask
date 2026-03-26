import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Loader2, Check, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { galleryApi } from '../../api';

const GalleryModal = ({ isOpen, onClose, onSelect }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchGallery();
    }
  }, [isOpen]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await galleryApi.getAll();
      setImages(data);
    } catch (error) {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const data = await galleryApi.uploadImage(formData);
      setImages([data, ...images]);
      toast.success('Image uploaded successfully');
      
      onSelect({ url: data.imageUrl, public_id: data.publicId });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Image Gallery</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">Select an image from the gallery or upload a new one.</p>
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current.click()} 
                disabled={uploading}
                className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {uploading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Upload size={18} className="mr-2" />}
                {uploading ? 'Uploading...' : 'Upload New Image'}
              </button>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-purple-600" /></div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images?.map?.(img => (
                <div 
                  key={img._id} 
                  onClick={() => {
                    onSelect({ url: img.imageUrl, public_id: img.publicId });
                    onClose();
                  }}
                  className="group relative aspect-square bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm border-2 border-transparent hover:border-purple-500 transition-all"
                >
                  <img src={img.imageUrl} alt="gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 bg-white text-purple-600 p-2 rounded-full shadow-lg transform scale-50 group-hover:scale-100 transition-all">
                      <Check size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-200">
              <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 font-medium">No images found in gallery.</p>
              <p className="text-gray-400 text-sm mt-1">Upload an image to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
