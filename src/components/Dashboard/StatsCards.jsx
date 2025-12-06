import React from 'react';
import { ShieldCheck, AlertTriangle, Radio, Activity } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color, bg }) => (
  <div className="bg-panel-bg rounded-lg p-4 border border-slate-700 shadow-lg relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-3 opacity-10 ${color}`}>
      <Icon className="w-16 h-16" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-full ${bg} ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bg} ${color}`}>
          LIVE
        </span>
      </div>
      <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</h3>
      <div className="mt-1 flex items-baseline">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="ml-2 text-xs text-slate-500">{subtext}</span>
      </div>
    </div>
  </div>
);

export const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
      <StatCard
        title="Active Nodes"
        value={stats.total}
        subtext="Devices Online"
        icon={Radio}
        color="text-blue-500"
        bg="bg-blue-500/10"
      />
      <StatCard
        title="Safe Status"
        value={stats.safe}
        subtext="Personnel Secure"
        icon={ShieldCheck}
        color="text-safe-green"
        bg="bg-safe-green/10"
      />
      <StatCard
        title="Critical Alerts"
        value={stats.help}
        subtext="Immediate Action"
        icon={AlertTriangle}
        color="text-disaster-red"
        bg="bg-disaster-red/10"
      />
      <StatCard
        title="Offline / Warnings"
        value={stats.trouble}
        subtext="Nodes Disconnected"
        icon={Activity}
        color="text-warning-yellow"
        bg="bg-warning-yellow/10"
      />
    </div>
  );
};
