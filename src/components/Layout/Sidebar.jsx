import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Network, 
  Radio, 
 
  TowerControl, 
  Siren, 
  History, 
  MonitorPlay, 
  Map as MapIcon, 
  BookOpen,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Mesh Network', path: '/admin/mesh-network', icon: Network },
    { name: 'LoRa Gateway', path: '/admin/lora-gateway', icon: Radio },

    { name: 'Tower Monitor', path: '/admin/tower-monitor', icon: TowerControl },
    { name: 'Emergency Broadcast', path: '/admin/broadcast', icon: Siren },
    { name: 'Alert History', path: '/admin/alerts', icon: History },
    { name: 'Public Display', path: '/', icon: MonitorPlay },
    { name: 'QR Route Viewer', path: '/admin/routes', icon: MapIcon },
    { name: 'Training Center', path: '/admin/training', icon: BookOpen },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-[2000] w-64 bg-panel-bg border-r border-slate-700 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-center h-20 border-b border-slate-700">
        <h1 className="text-3xl font-black tracking-tighter text-white">
          RES<span className="text-red-500">Q</span>
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-disaster-red/10 text-disaster-red border-l-4 border-disaster-red'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
