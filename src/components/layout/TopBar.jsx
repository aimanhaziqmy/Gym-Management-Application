import React from 'react';
import { Menu } from 'lucide-react';

export const TopBar = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
      <button onClick={onMenuClick} className="lg:hidden text-gray-600">
        <Menu size={24} />
      </button>
      <h2 className="text-xl font-semibold text-gray-800 capitalize ml-2 lg:ml-0">
        {title === 'calendar' ? 'Subscription Calendar' : title}
      </h2>
      <div className="text-sm text-gray-500 hidden sm:block">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </header>
  );
};