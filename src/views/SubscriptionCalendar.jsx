import React, { useState } from 'react';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { getMonthsLeft, formatDate } from '../utils/helpers';

export default function SubscriptionCalendar({ members, onEdit, onDelete }) {
  const [filter, setFilter] = useState('all'); 

  const sortedMembers = [...members].sort((a, b) => {
    return new Date(a.subscriptionEndDate || 0) - new Date(b.subscriptionEndDate || 0);
  });

  const getStatusColor = (monthsLeft, endDate) => {
    if (!endDate || new Date(endDate) < new Date()) return 'bg-orange-50 border-orange-200 text-orange-900'; 
    if (monthsLeft <= 1) return 'bg-yellow-50 border-yellow-200 text-yellow-900'; 
    return 'bg-white border-gray-200 text-gray-700'; 
  };

  const getStatusBadge = (monthsLeft, endDate) => {
    if (!endDate || new Date(endDate) < new Date()) {
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">0 Months Left (Expired)</span>;
    }
    if (monthsLeft <= 1) {
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">1 Month Left</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">{monthsLeft} Months Left</span>;
  };

  const filteredList = sortedMembers.filter(m => {
    const months = getMonthsLeft(m.subscriptionEndDate);
    const isExpired = !m.subscriptionEndDate || new Date(m.subscriptionEndDate) < new Date();
    
    if (filter === 'expired') return isExpired;
    if (filter === 'warning') return !isExpired && months <= 1;
    if (filter === 'active') return !isExpired && months > 1;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h3 className="text-lg font-bold text-gray-800">Subscription Status</h3>
           <p className="text-gray-500 text-sm">Monitor member expiry dates and renewals.</p>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>All</button>
            <button onClick={() => setFilter('active')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${filter === 'active' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>Active</button>
            <button onClick={() => setFilter('warning')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${filter === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-500 hover:text-gray-700'}`}>1 Month Left</button>
            <button onClick={() => setFilter('expired')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${filter === 'expired' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700'}`}>Expired</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredList.map(member => {
            const monthsLeft = getMonthsLeft(member.subscriptionEndDate);
            return (
                <div key={member.id} className={`rounded-xl p-5 border shadow-sm transition-all hover:shadow-md ${getStatusColor(monthsLeft, member.subscriptionEndDate)}`}>
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-full bg-white/50 border border-gray-100 flex items-center justify-center font-bold text-lg uppercase">
                            {member.name[0]}
                        </div>
                        {getStatusBadge(monthsLeft, member.subscriptionEndDate)}
                    </div>
                    
                    <h4 className="font-bold text-lg truncate">{member.name}</h4>
                    <p className="text-sm opacity-80 mb-4">{member.phone}</p>
                    
                    <div className="space-y-2 text-sm border-t border-black/5 pt-2">
                        <div className="flex justify-between">
                            <span className="opacity-70">Start:</span>
                            <span className="font-medium">{formatDate(member.subscriptionStartDate)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-70">Ends:</span>
                            <span className="font-bold">{formatDate(member.subscriptionEndDate)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-black/5">
                        <button 
                            type="button"
                            onClick={() => onEdit(member)}
                            className="flex-1 py-1.5 text-xs font-semibold bg-white/50 hover:bg-white rounded border border-gray-300 text-gray-700 cursor-pointer"
                        >
                            Edit / Renew
                        </button>
                        <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onDelete(member.id); }}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded border border-transparent cursor-pointer"
                            title="Delete Member"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            );
        })}
        {filteredList.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                <CalendarIcon size={48} className="mx-auto mb-3 opacity-20" />
                <p>No subscriptions found for this filter.</p>
            </div>
        )}
      </div>
    </div>
  );
}
