import React, { useState, useEffect } from 'react';
import { leadApi } from '../../../api';
import { Loader2, TrendingUp, Users, Target, Send, CheckCircle, PieChart, LayoutDashboardIcon } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadApi.getAnalytics()
      .then(res => {
        setData(res);
      })
      .catch(err => {
        console.error('Failed to fetch lead analytics', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={32} /></div>;
  if (!data) return <div className="text-center py-10 text-gray-500">Failed to load analytics</div>;

  const { metrics, charts } = data;

  // Basic percentage delta
  const leadDelta = metrics.prevTotalLeads > 0
    ? (((metrics.totalLeads - metrics.prevTotalLeads) / metrics.prevTotalLeads) * 100).toFixed(1)
    : 100;

  return (
    <div className="h-full overflow-y-auto pb-10 space-y-6">

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${leadDelta >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} flex items-center`}>
              <TrendingUp size={12} className={`mr-1 ${leadDelta < 0 ? 'rotate-180' : ''}`} /> {leadDelta}%
            </span>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">New Leads (This Month)</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.totalLeads}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Send size={20} /></div>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Quotations Sent</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.quotationsSent}</p>
            <p className="text-xs text-gray-400 mt-1">Total engaged potential</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Closed Deals</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.closedWon}</p>
            <p className="text-xs text-gray-400 mt-1">Successfully transacted</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Target size={20} /></div>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Conversion Rate</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.conversionRate}%</p>
            <p className="text-xs text-gray-400 mt-1">Against total historical volume</p>
          </div>
        </div>

      </div>

      {/* Charts / Data Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><PieChart size={18} className="mr-2 text-purple-600" /> Leads by Source</h3>
          <div className="space-y-4">
            {charts.sources.length === 0 && <p className="text-sm text-gray-500">No data available yet.</p>}
            {charts.sources.map(source => {
              const percentage = ((source.count / metrics.totalEver) * 100).toFixed(0);
              return (
                <div key={source._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 capitalize">{source._id || 'Unknown'}</span>
                    <span className="text-gray-500">{source.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><LayoutDashboardIcon size={18} className="mr-2 text-blue-600" /> Current Pipeline Load</h3>
          <div className="space-y-4">
            {charts.status.length === 0 && <p className="text-sm text-gray-500">No data available yet.</p>}
            {charts.status.map(stat => {
              const percentage = ((stat.count / metrics.totalEver) * 100).toFixed(0);
              return (
                <div key={stat._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
                    <span className="text-gray-500">{stat.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsDashboard;
