import React, { useState, useEffect } from 'react';
import { fetchDisasterAlerts } from '../services/disasterService';
import { StatsCards } from '../components/Dashboard/StatsCards';
import { LiveMap } from '../components/Map/LiveMap';
import { DisasterMap } from '../components/Map/DisasterMap';
import { AlertFeed } from '../components/Alerts/AlertFeed';
import { DrillStats } from '../components/Dashboard/DrillStats';
import WeatherForecast from '../components/WeatherForecast';
import { useDashboardData } from '../hooks/useDashboardData';
import { Loader2, Radio, Activity, CloudRain, Award } from 'lucide-react';

import { Toast } from '../components/common/Toast';

export const Dashboard = () => {
  const { stats, nodes, alerts: systemAlerts, loading } = useDashboardData();
  const [activeView, setActiveView] = useState('live'); 
  const [disasterAlerts, setDisasterAlerts] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);

  useEffect(() => {
    const loadDisasterAlerts = async () => {
      const data = await fetchDisasterAlerts();
      setDisasterAlerts(data);
    };
    loadDisasterAlerts();
  }, []);

  // Monitor for new critical alerts to trigger Toast & Physical Tower Light
  useEffect(() => {
    if (systemAlerts.length > 0) {
      const newsest = systemAlerts[0];
      // Check if it's recent (within last 10 seconds to avoid showing old alerts on refresh)
      const isRecent = (Date.now() - newsest.time) < 10000; 
      
      if ((newsest.severity === 'critical' || newsest.severity === 'high') && isRecent) {
        setLatestAlert({
          message: `${newsest.type}: ${newsest.message} (${newsest.sender})`,
          type: newsest.severity,
          id: newsest.id
        });


      }
    }
  }, [systemAlerts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-disaster-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
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
          <h2 className="text-2xl font-bold text-white">Command Center Overview</h2>
          <p className="text-slate-400 text-sm">Real-time monitoring of disaster resilience infrastructure</p>
        </div>
        
        {/* View Toggle Tabs */}
        <div className="bg-slate-800/50 p-1 rounded-lg flex items-center border border-slate-700">
          <button
            onClick={() => setActiveView('live')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeView === 'live' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Radio className="w-4 h-4" />
            Live Network
          </button>
          <button
            onClick={() => setActiveView('disaster')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeView === 'disaster' 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            Disaster Alerts
          </button>
          <button
            onClick={() => setActiveView('weather')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeView === 'weather' 
                ? 'bg-sky-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            Weather
          </button>
          <button
            onClick={() => setActiveView('drills')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeView === 'drills' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            Drills
          </button>
        </div>
      </div>

      <div className="shrink-0 mb-4">
        <StatsCards stats={stats} />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full flex flex-col bg-panel-bg rounded-lg border border-slate-700 overflow-hidden relative">
          {activeView === 'live' && <LiveMap nodes={nodes} />}
          {activeView === 'disaster' && <DisasterMap alerts={disasterAlerts} />}
          {activeView === 'weather' && (
            <div className="h-full w-full p-0">
              <WeatherForecast />
            </div>
          )}
          {activeView === 'drills' && <DrillStats />}
        </div>
        
        <div className="h-full min-h-0">
          <AlertFeed alerts={systemAlerts} />
        </div>
      </div>
    </div>
  );
};
