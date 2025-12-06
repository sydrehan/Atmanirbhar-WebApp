import React from 'react';
import { NetworkGraph } from '../components/MeshGraph/NetworkGraph';
import { Network } from 'lucide-react';

export const MeshNetwork = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Network className="w-8 h-8 mr-3 text-disaster-red" />
            Mesh Network Topology
          </h2>
          <p className="text-slate-400 mt-1">Real-time visualization of node interconnections and signal strength</p>
        </div>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Strong Signal</div>
          <div className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span> Weak Signal</div>
          <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span> Critical/Offline</div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <NetworkGraph />
      </div>
    </div>
  );
};
