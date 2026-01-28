import React from 'react';
import { LayoutDashboard, Users, Calendar as CalendarIcon, UserCheck, DollarSign, Settings, LogOut, TrendingUp, X } from 'lucide-react';

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      active 
        ? 'bg-indigo-800 text-white' 
        : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
    }`}
  >
    {icon}
    {label}
  </button>
);

export const Sidebar = ({ sidebarOpen, setSidebarOpen, view, setView, user, onLogout }) => {
  return (
    <aside className={`
      fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-indigo-900 text-white transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <TrendingUp size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">GymOS</h1>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
          <X size={20} />
        </button>
      </div>

      <nav className="mt-6 px-3 space-y-2">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={view === 'dashboard'} onClick={() => { setView('dashboard'); setSidebarOpen(false); }} />
        <NavItem icon={<Users size={20} />} label="Members" active={view === 'members'} onClick={() => { setView('members'); setSidebarOpen(false); }} />
        <NavItem icon={<CalendarIcon size={20} />} label="Subs Calendar" active={view === 'calendar'} onClick={() => { setView('calendar'); setSidebarOpen(false); }} />
        <NavItem icon={<UserCheck size={20} />} label="Guests" active={view === 'guests'} onClick={() => { setView('guests'); setSidebarOpen(false); }} />
        <NavItem icon={<DollarSign size={20} />} label="Revenue" active={view === 'reports'} onClick={() => { setView('reports'); setSidebarOpen(false); }} />
        <NavItem icon={<Settings size={20} />} label="Settings" active={view === 'settings'} onClick={() => { setView('settings'); setSidebarOpen(false); }} />
      </nav>

      <div className="absolute bottom-0 w-full p-6 border-t border-indigo-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-indigo-300">Admin</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-indigo-300 hover:text-white text-sm transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};
