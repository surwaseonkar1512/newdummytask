import { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, Loader2, Check, Upload, X } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', orderImage: null });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Instant Local Preview
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, orderImage: { url: previewUrl, local: true } }));
    setImageUploading(true);
    
    const formDataObj = new FormData();
    formDataObj.append('image', file);
    
    try {
      const { data } = await axios.post('/api/upload/public', formDataObj);
      setFormData(prev => ({ ...prev, orderImage: data }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setFormData(prev => ({ ...prev, orderImage: null }));
    } finally {
      setImageUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/leads', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        orderImage: formData.orderImage,
        source: 'contact'
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '', orderImage: null });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-20 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">Whether you want to commission a custom piece or have an inquiry about our existing collection, we'd love to hear from you.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          
          <div className="lg:w-2/5 bg-gray-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-serif font-bold mb-8">Contact Information</h3>
              <ul className="space-y-8">
                <li className="flex items-start">
                  <Mail className="h-6 w-6 text-purple-400 mr-4 flex-shrink-0" />
                  <div>
                    <strong className="block text-lg font-medium">Email Us</strong>
                    <span className="text-gray-300">hello@artportfolio.com</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Phone className="h-6 w-6 text-purple-400 mr-4 flex-shrink-0" />
                  <div>
                    <strong className="block text-lg font-medium">Call Us</strong>
                    <span className="text-gray-300">+1 (555) 123-4567</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-6 w-6 text-purple-400 mr-4 flex-shrink-0" />
                  <div>
                    <strong className="block text-lg font-medium">Visit Studio</strong>
                    <span className="text-gray-300 line-clamp-3">123 Art Studio Lane,<br/>Creative City, CA 90210<br/>(By appointment only)</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative z-10 mt-12 pt-8 border-t border-gray-800">
               <p className="text-gray-400">Follow us on social media for behind-the-scenes looks into our creative process.</p>
            </div>
          </div>

          <div className="lg:w-3/5 p-12 flex flex-col justify-center">
            {success ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  <Check size={40} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                <p className="text-gray-500 text-lg mb-8">Thank you for reaching out. We will get back to you as soon as possible.</p>
                <button onClick={() => setSuccess(false)} className="px-8 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                  <textarea required rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" placeholder="How can we help you?"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference / Order Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {formData.orderImage ? (
                      <div className="relative inline-block">
                        <img src={formData.orderImage.url} alt="Reference" className={`w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm transition-all ${imageUploading ? 'opacity-50 blur-[2px] grayscale-[50%]' : ''}`} />
                        {imageUploading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="animate-spin text-purple-600" size={24} />
                          </div>
                        )}
                        {!imageUploading && (
                          <button type="button" onClick={() => setFormData({...formData, orderImage: null})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center h-full">
                          {imageUploading ? <Loader2 className="animate-spin text-purple-500 mb-1" size={20} /> : <Upload className="text-gray-400 mb-1" size={20} />}
                          <p className="text-xs text-gray-500 font-medium">{imageUploading ? 'Uploading...' : 'Click to attach image'}</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} />
                      </label>
                    )}
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 shadow-lg shadow-purple-200">
                  {loading ? <Loader2 className="animate-spin mr-2" size={24} /> : <Send className="mr-2" size={20} />} 
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
