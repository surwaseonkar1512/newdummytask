import React, { useState } from 'react';
import { X, Mail, Phone, Clock, FileText, Image as ImageIcon, Trash2, Send, Tag } from 'lucide-react';
import moment from 'moment';
import { leadApi } from '../../../api';
import { toast } from 'react-toastify';
import QuotationModal from './QuotationModal';

const LeadDetailDrawer = ({ lead, onClose, onUpdate }) => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!lead) return null;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setUpdatingStatus(true);
      await leadApi.updateStatus(lead._id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      onUpdate(); // Bubble to parent to refetch pipeline
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this lead?")) {
      try {
        setDeleting(true);
        await leadApi.delete(lead._id);
        toast.success("Lead softly deleted.");
        onClose();
        onUpdate();
      } catch (err) {
        toast.error("Failed to delete lead");
        setDeleting(false);
      }
    }
  };

  const renderProductDetails = () => {
    if (lead.source === 'product') {
      return (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center"><Tag size={14} className="mr-1" /> Product Interest</h4>
          <p className="font-semibold text-gray-900">{lead.product?.name || 'Unknown Product'}</p>
          {(lead.product?.size || lead.product?.color) && (
            <div className="flex gap-3 text-sm text-gray-600 mt-2">
              {lead.product.size && <span><strong className="text-gray-800">Size:</strong> {lead.product.size}</span>}
              {lead.product.color && <span><strong className="text-gray-800">Color:</strong> {lead.product.color}</span>}
            </div>
          )}
        </div>
      );
    } else if (lead.source === 'custom') {
      return (
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mt-4">
          <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 flex items-center"><FileText size={14} className="mr-1" /> Custom Art Request</h4>
          <p className="text-sm text-gray-800">{lead.customDetails?.description || 'No description provided.'}</p>
          {lead.customDetails?.image?.url && (
            <div className="mt-3">
              <a href={lead.customDetails.image.url} target="_blank" rel="noreferrer" className="flex items-center text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg w-fit hover:bg-purple-200 transition-colors">
                <ImageIcon size={14} className="mr-1.5" /> View Reference Image
              </a>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
            <div className="flex items-center text-xs text-gray-500 mt-1 gap-3">
              <span className="bg-gray-100 px-2 py-0.5 rounded font-medium uppercase tracking-wider border border-gray-200">{lead.source}</span>
              <span className="flex items-center"><Clock size={12} className="mr-1" /> {moment(lead.createdAt).format('MMM Do YYYY')}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Actions / Status */}
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current Stage</label>
              <select
                value={lead.status}
                onChange={handleStatusChange}
                disabled={updatingStatus}
                className="w-full text-sm font-medium border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500 bg-gray-50"
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="quotation">Quotation Sent</option>
                <option value="closed">Closed (Won/Lost)</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-blue-600"><Mail size={16} /></div>
                <a href={`mailto:${lead.email}`} className="hover:text-blue-600 transition-colors font-medium">{lead.email}</a>
              </div>
              {lead.phone && (
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3 text-green-600"><Phone size={16} /></div>
                  <a href={`tel:${lead.phone}`} className="hover:text-green-600 transition-colors font-medium">{lead.phone}</a>
                </div>
              )}
            </div>
          </div>

          {renderProductDetails()}

          {/* User Message */}
          {lead.message && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message Included</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed italic">
                "{lead.message}"
              </p>
            </div>
          )}

          {/* Existing Quotation Log */}
          {lead.quotation?.sentAt && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center"><Send size={14} className="mr-1" /> Quotation Log</h4>
              <p className="text-sm font-medium text-amber-900 mb-1">Quoted Price: ₹{lead.quotation.price?.toLocaleString() || 'N/A'}</p>
              <p className="text-xs text-amber-700/80 mb-2 truncate">"{lead.quotation.description}"</p>
              <p className="text-[10px] text-amber-600 uppercase tracking-wider font-bold mt-2">Sent: {moment(lead.quotation.sentAt).format('MMM Do YYYY, h:mm a')}</p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-2 relative">
          <button
            onClick={() => setShowQuoteModal(true)}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-sm"
          >
            <Send size={16} className="mr-2" /> Format & Send Quotation
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50 mt-1"
          >
            <Trash2 size={16} className="mr-2" /> Delete Lead
          </button>
        </div>
      </div>

      <QuotationModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        lead={lead}
        onQuotationSent={() => {
          setShowQuoteModal(false);
          onUpdate(); // Bubble to refresh data and statuses properly
          // Keep drawer open so user sees log update, or can choose to close it.
        }}
      />
    </>
  );
};

export default LeadDetailDrawer;
