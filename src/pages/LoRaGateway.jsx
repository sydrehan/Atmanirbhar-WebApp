import React from 'react';
import { TerminalConsole } from '../components/LoRaConsole/Terminal';
import { Radio } from 'lucide-react';

export const LoRaGateway = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Radio className="w-8 h-8 mr-3 text-blue-500" />
          LoRaWAN Gateway Console
        </h2>
        <p className="text-slate-400 mt-1">Direct packet inspection and command interface</p>
      </div>

      <div className="flex-1 min-h-0">
        <TerminalConsole />
      </div>
    </div>
  );
};
