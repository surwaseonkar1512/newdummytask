import React, { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { leadApi } from '../../../api';

const NewLeadModal = ({ isOpen, onClose, onLeadCreated }) => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      // Construct payload for manual leads
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        message: data.message || '',
        source: 'manual',
        status: 'new'
      };

      await leadApi.create(payload);
      toast.success('Manual lead created successfully');
      reset();
      onLeadCreated(); // Refresh pipeline visually
      onClose(); // Hide modal
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lead. Ensure email is provided.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center"><UserPlus size={20} className="mr-2 text-purple-600" /> New Manual Lead</h2>
            <p className="text-xs text-gray-500 mt-1">Directly inject a lead into the 'New Leads' column.</p>
          </div>
          <button onClick={onClose} disabled={submitting} className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              {...register('name', { required: true })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              placeholder="E.g., John Doe"
            />
            {errors.name && <span className="text-xs text-red-500 mt-1">Name is required</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              {...register('email', { required: true })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              placeholder="john@example.com"
            />
            {errors.email && <span className="text-xs text-red-500 mt-1">Email is required</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              {...register('phone')}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              placeholder="+91..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Inquiry / Notes</label>
            <textarea 
              rows="3"
              {...register('message')}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              placeholder="What are they looking for?"
            ></textarea>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? <Loader2 size={18} className="animate-spin mr-2" /> : <UserPlus size={18} className="mr-2" />} 
              Create Lead
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default NewLeadModal;
