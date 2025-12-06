import React from 'react';
import { AlertHistoryTable } from '../components/Alerts/AlertHistoryTable';
import { History } from 'lucide-react';

export const AlertHistory = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <History className="w-8 h-8 mr-3 text-blue-400" />
          System Alert Logs
        </h2>
        <p className="text-slate-400 mt-1">Historical record of all critical events and warnings</p>
      </div>

      <div className="flex-1 min-h-0">
        <AlertHistoryTable />
      </div>
    </div>
  );
};
