import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-panel-bg border-b border-slate-700 flex items-center justify-between px-4 lg:px-8">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1 flex justify-end items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-disaster-red transition-colors relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-disaster-red rounded-full animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-slate-700 pl-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">{user?.displayName || 'Admin User'}</p>
            <p className="text-xs text-slate-400">{user?.role || 'Tower Manager'}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
