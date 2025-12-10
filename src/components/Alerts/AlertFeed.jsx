import React from 'react';
import { AlertTriangle, Activity, WifiOff, UserMinus } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const AlertItem = ({ alert }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'SOS': return <AlertTriangle className="w-5 h-5" />;
      case 'FALL': return <UserMinus className="w-5 h-5" />;
      case 'CONNECTIVITY': return <WifiOff className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (alert.severity) {
      case 'critical': return 'border-disaster-red bg-red-50 dark:bg-disaster-red/10 text-disaster-red';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500';
      case 'medium': return 'border-warning-yellow bg-yellow-50 dark:bg-warning-yellow/10 text-yellow-600 dark:text-warning-yellow';
      default: return 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className={`flex items-start p-4 mb-3 rounded-md border-l-4 ${getColors()} transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50`}>
      <div className="mr-3 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-sm uppercase tracking-wide">{alert.type} ALERT</h4>
            <span className="text-xs opacity-70">{formatDate(alert.time)}</span>
          </div>
          <div className="text-xs font-bold mb-1 opacity-90">
             Node: {alert.sender || alert.node || 'Unknown'}
          </div>
          <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{alert.message}</p>
      </div>
    </div>
  );
};

export const AlertFeed = ({ alerts }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full transition-colors">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-disaster-red" />
          Live Alert Feed
        </h3>
        <span className="text-xs bg-disaster-red px-2 py-1 rounded text-white animate-pulse">
          LIVE
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No active alerts</div>
        ) : (
          alerts.map(alert => <AlertItem key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  );
};
