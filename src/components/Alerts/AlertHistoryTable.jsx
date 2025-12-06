import React, { useState } from 'react';
import { Search, Filter, Download, AlertTriangle, UserMinus, WifiOff, Activity } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { useDashboardData } from '../../hooks/useDashboardData';

export const AlertHistoryTable = () => {
  const { alerts } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredData = alerts.filter(item => {
    const matchesSearch = (item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (item.sender && item.sender.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterSeverity === 'ALL' || item.severity === filterSeverity;
    return matchesSearch && matchesFilter;
  });

  const getSeverityBadge = (severity) => {
    const styles = {
      critical: 'bg-red-500/20 text-red-500 border-red-500/50',
      high: 'bg-orange-500/20 text-orange-500 border-orange-500/50',
      medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      low: 'bg-blue-500/20 text-blue-500 border-blue-500/50',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs border ${styles[severity] || styles.low} uppercase font-bold`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="bg-panel-bg rounded-lg border border-slate-700 shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-disaster-red"
          />
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-sm text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <button className="flex items-center px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-600 text-sm transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Node ID</th>
              <th className="px-6 py-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{formatDate(item.time)}</td>
                  <td className="px-6 py-4">{getSeverityBadge(item.severity)}</td>
                  <td className="px-6 py-4 font-medium text-white">{item.type}</td>
                  <td className="px-6 py-4 text-slate-300">{item.sender}</td>
                  <td className="px-6 py-4 text-slate-300">{item.message}</td>
                </tr>
              ))
            ) : (
               <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 italic">
                  No alerts found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
