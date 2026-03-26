import React, { useState } from 'react';
import { X, Send, Mail, Loader2, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { leadApi } from '../../../api';

const QuotationModal = ({ isOpen, onClose, lead, onQuotationSent }) => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  if (!isOpen || !lead) return null;

  const price = watch('price');
  const description = watch('description');

  const generateMessage = () => {
    const defaultProductMatch = lead.product?.name || 'Custom Art Request';
    let msg = `Hello ${lead.name},\n\nThank you for your interest.\n\nHere is your quotation:\n\nProduct: ${defaultProductMatch}\nPrice: ₹${price || 'TBD'}\n\nDetails:\n${description || ''}\n\nRegards,\nStatue Studio`;
    return msg;
  };

  const saveQuotationToDb = async (data) => {
    try {
      setSubmitting(true);
      const updatedLead = await leadApi.addQuotation(lead._id, {
        price: data.price,
        description: data.description
      });
      toast.success('Quotation saved successfully');
      onQuotationSent(updatedLead);
      return true;
    } catch (error) {
      toast.error('Failed to save quotation to CRM');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = async (data) => {
    if (!lead.phone) {
      toast.error('Lead does not have a phone number saved');
      return;
    }
    const saved = await saveQuotationToDb(data);
    if (saved) {
      const msg = encodeURIComponent(generateMessage());
      // Strip non-numeric from phone
      const cleanPhone = lead.phone.replace(/\D/g, ''); 
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
      onClose();
    }
  };

  const handleEmail = async (data) => {
    if (!lead.email) {
      toast.error('Lead does not have an email saved');
      return;
    }
    const saved = await saveQuotationToDb(data);
    if (saved) {
      const msg = encodeURIComponent(generateMessage());
      const subject = encodeURIComponent(`Quotation from Statue Studio: ${lead.product?.name || 'Inquiry'}`);
      window.open(`mailto:${lead.email}?subject=${subject}&body=${msg}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center"><Send size={20} className="mr-2 text-purple-600" /> Send Quotation</h2>
            <p className="text-xs text-gray-500 mt-1">Generating quote for: <span className="font-semibold text-gray-700">{lead.name}</span></p>
          </div>
          <button onClick={onClose} disabled={submitting} className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quote Price (₹) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                {...register('price', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="0.00"
              />
              {errors.price && <span className="text-xs text-red-500 mt-1">Price is required</span>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quotation Details / Message <span className="text-red-500">*</span></label>
              <textarea 
                rows="4"
                {...register('description', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="Detail the materials, timeline, formatting, shipping costs, etc..."
              ></textarea>
              {errors.description && <span className="text-xs text-red-500 mt-1">Message is required</span>}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Message Preview</h4>
              <p className="text-xs text-blue-800 whitespace-pre-wrap font-mono leading-relaxed bg-white/50 p-3 rounded border border-blue-100">
                {generateMessage()}
              </p>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 flex-col sm:flex-row">
          <button 
            type="button" 
            onClick={handleSubmit(handleWhatsApp)}
            disabled={submitting}
            className="flex-1 flex items-center justify-center px-4 py-2.5 bg-[#25D366] text-white font-medium rounded-xl hover:bg-[#128C7E] transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? <Loader2 size={18} className="animate-spin mr-2" /> : <MessageCircle size={18} className="mr-2" />} 
            WhatsApp
          </button>
          <button 
            type="button" 
            onClick={handleSubmit(handleEmail)}
            disabled={submitting}
            className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-sm disabled:opacity-50"
          >
           {submitting ? <Loader2 size={18} className="animate-spin mr-2" /> : <Mail size={18} className="mr-2" />} 
            Email Match
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuotationModal;
