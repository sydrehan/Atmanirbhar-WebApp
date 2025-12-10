import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WeatherWidget } from '../components/PublicDisplay/WeatherWidget';
import { LocationWeatherWidget } from '../components/PublicDisplay/LocationWeatherWidget';
import WeatherForecast from '../components/WeatherForecast';
import { SafetyStatus } from '../components/PublicDisplay/SafetyStatus';
import { DisasterMap } from '../components/Map/DisasterMap';
import { fetchDisasterAlerts } from '../services/disasterService';
import { MonitorPlay, AlertTriangle, Map as MapIcon, Shield, Menu, X, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/Layout/ThemeToggle';

export const PublicDisplay = () => {
  const [time, setTime] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadAlerts = async () => {
      const data = await fetchDisasterAlerts();
      setAlerts(data);
      setLoading(false);
    };
    loadAlerts();
    const interval = setInterval(loadAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Unify Alerts for Display (Sort by severity)
  const allAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { 'critical': 3, 'high': 2, 'medium': 1, 'low': 0 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  const criticalAlert = allAlerts.find(a => a.severity === 'critical');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Main Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-40 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none transition-all duration-300">
              RES<span className="text-red-600">Q</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          {/* Replaced Admin Link with Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Infinite Live Ticker - Moved Below Header */}
      {/* Infinite Live Ticker - Moved Below Header */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}
      </style>
      <div className="bg-red-600/90 backdrop-blur-sm text-white text-sm font-bold py-2.5 px-0 flex items-center gap-4 z-30 shadow-md border-b border-red-700 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 bg-red-700/80 px-4 flex items-center z-10 font-black tracking-wider shadow-xl dark:shadow-none h-full">
          LIVE ALERTS
        </div>
        <div className="flex overflow-hidden ml-32 mask-image-linear-gradient">
          <div className="animate-scroll flex shrink-0 items-center whitespace-nowrap gap-4 px-4">
             {allAlerts.length > 0 
              ? allAlerts.map((a, i) => {
                  const details = a.affected_areas ? `[AFFECTING: ${a.affected_areas.join(', ')}]` : '';
                  return <span key={i} className="inline-flex items-center">🚨 {a.title.toUpperCase()} {details} • {a.description} • </span>;
                })
              : <span className="inline-flex items-center">✅ NO ACTIVE MAJOR ALERTS • MONITORING SYSTEMS ACTIVE • STAY SAFE •</span>
            }
          </div>
          <div className="animate-scroll flex shrink-0 items-center whitespace-nowrap gap-4 px-4">
             {allAlerts.length > 0 
              ? allAlerts.map((a, i) => {
                  const details = a.affected_areas ? `[AFFECTING: ${a.affected_areas.join(', ')}]` : '';
                  return <span key={`dup-${i}`} className="inline-flex items-center">🚨 {a.title.toUpperCase()} {details} • {a.description} • </span>;
                })
              : <span className="inline-flex items-center">✅ NO ACTIVE MAJOR ALERTS • MONITORING SYSTEMS ACTIVE • STAY SAFE •</span>
            }
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-[2000] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-slate-900 dark:text-white font-bold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/" className="block px-4 py-3 bg-blue-600/10 text-blue-400 rounded-lg font-medium">
            Live Dashboard
          </Link>
          <Link to="/drills" className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            Mock Drills & Training
          </Link>
          <Link to="/routes" className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            Evacuation Routes
          </Link>
          <div className="pt-4 border-t border-slate-800 mt-4">
            <p className="px-4 text-xs text-slate-500 uppercase font-bold mb-2">Emergency Contacts</p>
            <div className="px-4 py-2 text-white font-mono">112 - General</div>
            <div className="px-4 py-2 text-white font-mono">101 - Fire</div>
            <div className="px-4 py-2 text-white font-mono">108 - Ambulance</div>
          </div>
        </nav>
      </div>

      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[1900] backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
        <div className="grid grid-cols-12 gap-6 h-full">
          
          {/* Map Section (Main Focus) */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
            
            {/* Location & Weather Widget (Now Top Priority) */}
            <div className="h-auto min-h-[220px] md:h-[240px] w-full"> 
               <LocationWeatherWidget />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl min-h-[500px] relative overflow-hidden transition-colors duration-300">
              <DisasterMap alerts={allAlerts} />
              
              {/* Overlay Stats on Map */}
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 md:grid-cols-4 gap-4 pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg pointer-events-auto transition-colors duration-300">
                  <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Total Alerts</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{allAlerts.length}</div>
                </div>
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg pointer-events-auto transition-colors duration-300">
                  <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Safe Zones</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-500">1,240</div>
                </div>
              </div>
            </div>



            {/* Unified Live Feed (Below Map) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors duration-300">
              <h3 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Live Disaster Monitor (All Regions)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAlerts.length > 0 ? (
                  allAlerts.map(alert => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${alert.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/50' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          alert.severity === 'critical' ? 'bg-red-500 text-white' : 
                          alert.severity === 'high' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-slate-400">{new Date(alert.time).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">{alert.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 mb-2">{alert.description}</p>
                      {alert.affected_areas && (
                        <div className="text-xs text-slate-500 font-mono">
                          Affecting: <span className="text-slate-300">{alert.affected_areas.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-slate-500 py-4">
                    No active alerts reported.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar Widgets */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">


            {/* Weather Forecast Widget */}
            <div className="h-[300px] w-full">
              <WeatherForecast />
            </div>

            {/* Safety Guidelines Widget (Dynamic) */}
            {criticalAlert && criticalAlert.safety_guide && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-red-100 dark:border-red-500/30 relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 pointer-events-none">
                  <Shield className="w-24 h-24 text-red-600 dark:text-red-500" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2 relative z-10">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-500" />
                  Safety Guidelines
                </h3>
                <div className="space-y-4 relative z-10">
                  <div>
                    <h4 className="text-green-600 dark:text-green-400 text-xs font-bold uppercase mb-2">DO's</h4>
                    <ul className="space-y-1">
                      {criticalAlert.safety_guide.dos.map((item, i) => (
                        <li key={i} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-500 font-bold">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-600 dark:text-red-400 text-xs font-bold uppercase mb-2">DON'Ts</h4>
                    <ul className="space-y-1">
                      {criticalAlert.safety_guide.donts.map((item, i) => (
                        <li key={i} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-red-600 dark:text-red-500 font-bold">✕</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
              <h3 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                <MonitorPlay className="w-5 h-5 text-blue-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/drills" className="block p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors group border border-slate-200 dark:border-transparent">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">NEW</span>
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold">Take Mock Drill</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">Test your preparedness</p>
                </Link>
                
                <Link to="/training" className="block p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors group border border-slate-200 dark:border-transparent">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <MonitorPlay className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold">Safety Videos</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">Learn survival skills</p>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
