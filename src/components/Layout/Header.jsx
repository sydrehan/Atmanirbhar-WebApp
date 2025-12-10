import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1 flex justify-end items-center space-x-4">
        <ThemeToggle />
        
        <button className="p-2 text-slate-500 hover:text-disaster-red dark:text-slate-400 dark:hover:text-disaster-red transition-colors relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-disaster-red rounded-full animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.displayName || 'Admin User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || 'Tower Manager'}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-white">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
