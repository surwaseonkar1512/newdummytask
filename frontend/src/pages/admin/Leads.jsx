import React, { useState, useRef } from 'react';
import { LayoutDashboardIcon, Plus } from 'lucide-react';
import PipelineBoard from '../../components/admin/CRM/PipelineBoard';
import LeadDetailDrawer from '../../components/admin/CRM/LeadDetailDrawer';
import AnalyticsDashboard from '../../components/admin/CRM/AnalyticsDashboard';
import NewLeadModal from '../../components/admin/CRM/NewLeadModal';

const Leads = () => {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'analytics'
  const [selectedLead, setSelectedLead] = useState(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);

  // PipelineBoard needs a way to be told to refetch data after drawer updates.
  // We can use a key or state toggle.
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openLeadDrawer = (lead) => {
    setSelectedLead(lead);
  };

  const handleUpdateLead = () => {
    // Increment trigger causing PipelineBoard to refetch silently.
    setRefreshTrigger(prev => prev + 1);

    // In a real app we might fetch just the updated lead and merge it into state,
    // but refetching pipeline is cleaner since the status might have changed,
    // requiring it to jump columns. We'll close the drawer visually to reflect board updates.
    setSelectedLead(null);
  };

  return (
    <div className="p-4 sm:p-8 flex flex-col h-[calc(100vh-64px)] overflow-hidden">

      {/* CRM Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pipeline CRM</h1>
          <p className="text-gray-500 text-sm mt-1">Manage inquiries, quotes, and client tracking in one place.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Toggles */}
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'pipeline' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {/* <Trello size={16} className="mr-2" /> Board */} Board
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'analytics' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <LayoutDashboardIcon size={16} className="mr-2" /> Analytics
            </button>
          </div>

          <button
            onClick={() => setShowNewLeadModal(true)}
            className="flex items-center px-4 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus size={18} className="mr-2" /> New Lead
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'pipeline' ? (
          <PipelineBoard key={`pipeline-${refreshTrigger}`} openLeadDrawer={openLeadDrawer} />
        ) : (
          <AnalyticsDashboard />
        )}
      </div>

      <LeadDetailDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={handleUpdateLead}
      />

      <NewLeadModal
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
        onLeadCreated={handleUpdateLead}
      />
    </div>
  );
};

export default Leads;
