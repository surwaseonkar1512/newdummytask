import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Phone, Clock, FileText, Image as ImageIcon } from 'lucide-react';
import moment from 'moment';

const getSourceColor = (source) => {
  switch(source) {
    case 'product': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'custom': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'contact': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'manual': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const LeadCard = ({ lead, index, onClick }) => {
  return (
    <Draggable draggableId={lead._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(lead)}
          className={`bg-white p-4 rounded-xl shadow-sm border ${snapshot.isDragging ? 'border-purple-500 shadow-md rotate-2 z-50' : 'border-gray-200'} cursor-pointer hover:border-purple-300 transition-all select-none group`}
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1">{lead.name}</h4>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getSourceColor(lead.source)} flex-shrink-0`}>
              {lead.source}
            </span>
          </div>

          <div className="space-y-2 text-xs text-gray-500">
            {lead.phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={12} className="text-gray-400" />
                <span className="truncate">{lead.phone}</span>
              </div>
            )}
            
            {lead.product?.name && (
              <div className="flex items-start gap-1.5">
                <FileText size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="truncate font-medium text-gray-700">Prod: {lead.product.name}</span>
              </div>
            )}

            {lead.customDetails?.image?.url && (
              <div className="flex items-center gap-1.5 font-medium text-purple-600 bg-purple-50 w-fit px-1.5 rounded">
                <ImageIcon size={12} /> Contains Image
              </div>
            )}

            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
              <Clock size={12} className="text-gray-400" />
              <span>{moment(lead.createdAt).fromNow()}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default LeadCard;
