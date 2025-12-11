import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SafetyStatus } from '../components/PublicDisplay/SafetyStatus';
import { SafetyCategories } from '../components/PublicDisplay/SafetyCategories';
import { DisasterMap } from '../components/Map/DisasterMap';
import { fetchDisasterAlerts } from '../services/disasterService';
import { MonitorPlay, AlertTriangle, Shield, Phone, Activity, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/Layout/ThemeToggle';

export const PublicDisplay = () => {
  const [time, setTime] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-40 transition-colors duration-300 gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
           <img src="/logo.svg" alt="ResQ Logo" className="w-8 h-8 hidden" /> {/* Placeholder if logo exists */}
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              RES<span className="text-red-600">Q</span>
           </h1>
        </div>

        {/* Navigation Pills (Centered) */}
        <nav className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <Link to="/drills" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold whitespace-nowrap transition-colors shadow-sm shadow-orange-500/20">
            Mock Drills
          </Link>
          <Link to="/training" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium whitespace-nowrap border border-slate-700 transition-colors">
            Safety Videos
          </Link>
          <Link to="/awareness" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium whitespace-nowrap border border-slate-700 transition-colors">
            Awareness
          </Link>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium whitespace-nowrap border border-slate-700 transition-colors">
            Emergency Contacts
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium whitespace-nowrap border border-slate-700 transition-colors flex items-center gap-2">
            Live Alerts
            {allAlerts.length > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
           {/* User Profile (Visual Only) */}
           <div className="hidden md:flex items-center gap-2 text-right">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                 <div className="text-xs font-bold text-slate-900 dark:text-white">Citizen User</div>
                 <div className="text-[10px] text-slate-500 dark:text-slate-400">Chennai, IN</div>
              </div>
           </div>
           
           <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>
           <ThemeToggle />
        </div>
      </header>

      {/* Infinite Live Ticker - Moved Below Header */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll {
            animation: scroll 60s linear infinite;
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

      {/* Main Content Grid - Fixed Height for One-Screen View */}
      <main className="flex-1 p-4 lg:p-6 h-[calc(100vh-140px)] overflow-hidden">
        <div className="grid grid-cols-12 gap-6 h-full">
          
          {/* LEFT COLUMN: Status & Actions (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
             {/* Main Safety Status Banner (YOU ARE SAFE) */}
             {/* Passing alerts to enable 20km radius check */}
             <SafetyStatus alerts={allAlerts} />

             {/* Safety Categories Grid */}
             <SafetyCategories />

             {/* Quick Actions Card (Moved from Right) */}
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
               <div className="space-y-3">
                 <Link to="/drills" className="block w-full py-3 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-center font-bold rounded-xl transition-colors shadow-lg shadow-slate-900/10">
                   Take Mock Drill
                 </Link>
                 <Link to="/training" className="block w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white text-center font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20">
                   Watch Safety Video
                 </Link>
                 <button className="block w-full py-3 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-center font-bold rounded-xl transition-colors">
                   View Emergency Contacts
                 </button>
               </div>
             </div>
          </div>

          {/* RIGHT COLUMN: Map & Alerts (8 cols) - Split View */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 h-full">
              
              {/* TOP: Disaster Map (~60% height) */}
              <div className="flex-grow bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden transition-colors duration-300 min-h-0">
                  <DisasterMap alerts={allAlerts} />
                  
                  {/* Overlay Stats on Map */}
                  <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-4 pointer-events-none">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg pointer-events-auto transition-colors duration-300">
                      <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Total Alerts</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">{allAlerts.length}</div>
                    </div>
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg pointer-events-auto transition-colors duration-300">
                      <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Safe Zones</div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-500">1,240</div>
                    </div>
                  </div>
              </div>

              {/* BOTTOM: Live Alerts Feed (~40% height) */}
              <div className="h-[40%] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col transition-colors duration-300 min-h-[200px]">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 shrink-0 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                     Live Alerts Feed
                  </h3>
                  <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                     {allAlerts.length > 0 ? (
                        allAlerts.map(alert => (
                          <div key={alert.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-l-4 border-l-red-500 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{alert.title}</h4>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{alert.description}</p>
                            <div className="mt-1.5 text-[10px] text-slate-400 font-mono text-right">
                              {new Date(alert.time).toLocaleTimeString()}
                            </div>
                          </div>
                        ))
                     ) : (
                        <div className="text-center py-6 text-slate-400 text-sm">
                           No active alerts in your network.
                        </div>
                     )}
                  </div>
              </div>

          </div>

        </div>
      </main>
    </div>
  );
};
