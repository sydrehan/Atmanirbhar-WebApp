import React from 'react';
import { CommandPanel } from '../components/Broadcast/CommandPanel';
import { Radio } from 'lucide-react';

export const EmergencyBroadcast = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Radio className="w-8 h-8 mr-3 text-disaster-red" />
          Emergency Broadcast System
        </h2>
        <p className="text-slate-400 mt-1">Global command center for mass alerts and evacuation orders</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <CommandPanel />
      </div>
    </div>
  );
};
