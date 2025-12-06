import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import { PowerPanel } from '../components/TowerStatus/PowerPanel';
import { HardwareStatus } from '../components/TowerStatus/HardwareStatus';
import { InventoryPanel } from '../components/TowerStatus/InventoryPanel';
import { TowerControl } from 'lucide-react';

export const TowerMonitor = () => {
  const [alertActive, setAlertActive] = useState(false);

  useEffect(() => {
    const starCountRef = ref(db, 'tower/alert_active');
    const unsubscribe = onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setAlertActive(!!data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <TowerControl className="w-8 h-8 mr-3 text-disaster-red" />
          Disaster Information Tower (DIT) Monitor
        </h2>
        <p className="text-slate-400 mt-1">Hardware health, power systems, and inventory tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PowerPanel />
        <HardwareStatus activeAlert={alertActive} />
        <div className="lg:col-span-2">
          <InventoryPanel />
        </div>
      </div>
    </div>
  );
};
