import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    critical: 'bg-red-500 text-white shadow-red-500/20',
    high: 'bg-orange-500 text-white shadow-orange-500/20',
    info: 'bg-blue-500 text-white shadow-blue-500/20',
    success: 'bg-green-500 text-white shadow-green-500/20'
  };

  const icons = {
    critical: <AlertCircle className="w-6 h-6" />,
    high: <AlertTriangle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
    success: <CheckCircle className="w-6 h-6" />
  };

  if (!isVisible && !message) return null;

  return (
    <div className={`
      fixed top-4 right-4 z-[9999] flex items-center p-4 rounded-lg shadow-lg border border-white/10
      transition-all duration-300 transform
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${styles[type] || styles.info}
      min-w-[300px] max-w-md
    `}>
      <div className="mr-3">
        {icons[type] || icons.info}
      </div>
      <div className="flex-1 mr-2">
        <p className="font-bold text-sm uppercase tracking-wide">{type} ALERT</p>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
