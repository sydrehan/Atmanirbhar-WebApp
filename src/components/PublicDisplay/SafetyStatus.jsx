import React from 'react';
import { ShieldCheck, AlertTriangle, Siren } from 'lucide-react';

export const SafetyStatus = ({ level = 'safe' }) => {
  const config = {
    safe: {
      color: 'bg-green-500',
      text: 'text-green-500',
      icon: ShieldCheck,
      label: 'AREA SECURE',
      sub: 'No active threats detected'
    },
    warning: {
      color: 'bg-yellow-500',
      text: 'text-yellow-500',
      icon: AlertTriangle,
      label: 'CAUTION ADVISED',
      sub: 'Weather warning in effect'
    },
    danger: {
      color: 'bg-red-500',
      text: 'text-red-500',
      icon: Siren,
      label: 'EMERGENCY ALERT',
      sub: 'Seek shelter immediately'
    }
  };

  const current = config[level];
  const Icon = current.icon;

  return (
    <div className={`rounded-xl p-8 border-2 ${current.text.replace('text-', 'border-')} bg-slate-900/80 text-center`}>
      <div className={`w-24 h-24 mx-auto rounded-full ${current.color} flex items-center justify-center mb-6 animate-pulse`}>
        <Icon className="w-12 h-12 text-white" />
      </div>
      <h2 className={`text-4xl font-black ${current.text} mb-2`}>{current.label}</h2>
      <p className="text-xl text-slate-300">{current.sub}</p>
    </div>
  );
};
