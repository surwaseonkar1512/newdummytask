import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import LeadCard from './LeadCard';
import { leadApi } from '../../../api';
import { Loader2 } from 'lucide-react';

const COLUMNS = [
  { id: 'new', title: 'New Leads', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'contacted', title: 'Contacted', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { id: 'quotation', title: 'Quotation Sent', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  { id: 'closed', title: 'Closed (Won/Lost)', color: 'bg-green-50 border-green-200 text-green-800' }
];

const PipelineBoard = ({ openLeadDrawer }) => {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadApi.getAll();
      
      // Group leads by status
      const grouped = { new: [], contacted: [], quotation: [], closed: [] };
      data.forEach(lead => {
        if (grouped[lead.status]) grouped[lead.status].push(lead);
      });
      
      setColumns(grouped);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load CRM pipeline');
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic UI Update
    const sourceCol = [...columns[source.droppableId]];
    const destCol = source.droppableId === destination.droppableId ? sourceCol : [...columns[destination.droppableId]];
    const [movedItem] = sourceCol.splice(source.index, 1);
    
    // Update local status flag explicitly in memory map
    movedItem.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });

    if (source.droppableId !== destination.droppableId) {
      try {
        await leadApi.updateStatus(draggableId, destination.droppableId);
        toast.success(`Lead moved to ${destination.droppableId}`);
        // If moved to quotation, trigger quotation overlay natively via parent if needed, 
        // but user request specifies doing it via clicking or opening it on drop. 
        // We'll let the user open the drawer to initiate Quotation generation for safety.
      } catch (error) {
        toast.error('Failed to move lead');
        fetchLeads(); // Revert back
      }
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={32} /></div>;

  return (
    <div className="flex h-[calc(100vh-180px)] overflow-x-auto pb-4 gap-6 select-none hide-scrollbar">
      <DragDropContext onDragEnd={onDragEnd}>
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col w-[320px] flex-shrink-0 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            {/* Column Header */}
            <div className={`px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-white`}>
              <h3 className="font-bold text-gray-800">{col.title}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${col.color}`}>
                {columns?.[col.id]?.length || 0}
              </span>
            </div>

            {/* Droppable Zone */}
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
                >
                  {columns?.[col.id]?.map((lead, index) => (
                    <LeadCard key={lead._id} lead={lead} index={index} onClick={() => openLeadDrawer(lead)} />
                  ))}
                  {provided.placeholder}
                  
                  {(!columns?.[col.id] || columns[col.id].length === 0) && !snapshot.isDraggingOver && (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-medium">
                      Drop here
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default PipelineBoard;
