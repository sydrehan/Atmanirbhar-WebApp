import React, { useState, useEffect } from 'react';
import { fetchDisasterAlerts } from '../services/disasterService';
import { StatsCards } from '../components/Dashboard/StatsCards';
import { LiveMap } from '../components/Map/LiveMap';
import { DisasterMap } from '../components/Map/DisasterMap';
import { AlertFeed } from '../components/Alerts/AlertFeed';
import { DrillStats } from '../components/Dashboard/DrillStats';
import { FirebaseDataPanel } from '../components/Dashboard/FirebaseDataPanel';
import WeatherForecast from '../components/WeatherForecast';
import { useDashboardData } from '../hooks/useDashboardData';
import { useFirebaseLogs } from '../hooks/useFirebaseData'; // Import Firebase Hook
import { playAlertSound } from '../utils/sound'; // Import Sound Util
import { Loader2, Radio, Activity, CloudRain, Award, Database } from 'lucide-react';

import { Toast } from '../components/common/Toast';

export const Dashboard = () => {
  const { stats, nodes, alerts: systemAlerts, loading } = useDashboardData();
  const { logs } = useFirebaseLogs(); // Get live logs
  const [activeView, setActiveView] = useState('live'); 
  const [disasterAlerts, setDisasterAlerts] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const lastProcessedRef = React.useRef(Date.now()); // Ref to track last processed timestamp

  useEffect(() => {
    const loadDisasterAlerts = async () => {
      const data = await fetchDisasterAlerts();
      setDisasterAlerts(data);
    };
    loadDisasterAlerts();
  }, []);

  // Monitor for new critical alerts to trigger Toast & Physical Tower Light
  useEffect(() => {
    // 1. Check System Alerts (Existing logic)
    if (systemAlerts.length > 0) {
      const newsest = systemAlerts[0];
      const isRecent = (Date.now() - newsest.time) < 10000; 
      
      if ((newsest.severity === 'critical' || newsest.severity === 'high') && isRecent) {
        setLatestAlert({
            message: `${newsest.type}: ${newsest.message} (${newsest.sender})`,
            type: newsest.severity,
            id: newsest.id
        });
      }
    }

    // 2. Check Firebase Live Logs (New Logic for Popup + Sound)
    if (logs) {
        const allLogs = [
            ...Object.values(logs.critical || {}),
            ...Object.values(logs.rescue || {}),
            ...Object.values(logs.receiver || {})
        ];

        // Find any log that is NEWER than our last check
        const newLogs = allLogs.filter(log => log.timestamp > lastProcessedRef.current);

        if (newLogs.length > 0) {
            // Pick the latest one
            const latest = newLogs.sort((a, b) => b.timestamp - a.timestamp)[0];
            
            // Trigger Sound
            playAlertSound();

            // Trigger Popup
            setLatestAlert({
                message: `ALERT: ${latest.message} (${latest.sender || 'Unknown'})`,
                type: 'critical', // Force red for all loud alerts
                id: `firebase-${latest.timestamp}`
            });

            // Update ref so we don't alert again for this one
            lastProcessedRef.current = latest.timestamp;
        }
    }

  }, [systemAlerts, logs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-disaster-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-auto min-h-screen lg:h-full lg:min-h-0 overflow-visible lg:overflow-hidden relative p-2 lg:p-0">
      {latestAlert && (
        <Toast 
          key={latestAlert.id} // Re-mount on new id
          message={latestAlert.message} 
          type={latestAlert.severity} 
          onClose={() => setLatestAlert(null)} 
        />
      )}

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Command Center Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time monitoring of disaster resilience infrastructure</p>
        </div>
        
        {/* View Toggle Tabs */}
        <div className="bg-white dark:bg-slate-800/50 p-1 rounded-lg flex items-center border border-slate-200 dark:border-slate-700 self-start sm:self-auto overflow-x-auto max-w-full shadow-sm">
          <button
            onClick={() => setActiveView('live')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeView === 'live' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Radio className="w-4 h-4" />
            Live Network
          </button>
          <button
            onClick={() => setActiveView('disaster')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeView === 'disaster' 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            Disaster Alerts
          </button>
          <button
            onClick={() => setActiveView('weather')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeView === 'weather' 
                ? 'bg-sky-500 text-white shadow-lg' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            Weather
          </button>
          <button
            onClick={() => setActiveView('drills')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeView === 'drills' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            Drills
          </button>
          <button
            onClick={() => setActiveView('sensors')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeView === 'sensors' 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Database className="w-4 h-4" />
            Sensor Data
          </button>
        </div>
      </div>

      <div className="shrink-0 mb-4">
        <StatsCards stats={stats} />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4 lg:pb-0">
        <div className="col-span-1 lg:col-span-2 h-[500px] lg:h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative shadow-sm transition-colors">
          {activeView === 'live' && <LiveMap nodes={nodes} />}
          {activeView === 'disaster' && <DisasterMap alerts={disasterAlerts} />}
          {activeView === 'weather' && (
            <div className="h-full w-full p-0">
              <WeatherForecast />
            </div>
          )}
          {activeView === 'drills' && <DrillStats />}
          {activeView === 'sensors' && <FirebaseDataPanel />}
        </div>
        
        <div className="h-[400px] lg:h-full lg:min-h-0">
          <AlertFeed alerts={systemAlerts} />
        </div>
      </div>
    </div>
  );
};
