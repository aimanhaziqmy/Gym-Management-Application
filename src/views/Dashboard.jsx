import React from 'react';
import { DollarSign, Users, UserCheck, CreditCard, UserPlus, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/helpers';

const StatsCard = ({ title, value, icon, trend, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-xs text-gray-400 mt-2">{trend}</p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
  </div>
);

export default function Dashboard({ stats, currency, transactions, onAddMember, onDeleteTransaction }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Monthly Revenue" 
          value={formatCurrency(stats.revenue, currency)} 
          icon={<DollarSign className="text-emerald-600" size={24} />} 
          trend="Current month total"
          color="bg-emerald-50"
        />
        <StatsCard 
          title="Active Subscriptions" 
          value={stats.activeMembers} 
          icon={<Users className="text-blue-600" size={24} />} 
          trend="Members with valid dates"
          color="bg-blue-50"
        />
        <StatsCard 
          title="Guests Today" 
          value={stats.guestsToday} 
          icon={<UserCheck className="text-indigo-600" size={24} />} 
          trend="Daily walk-ins"
          color="bg-indigo-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard size={18} /> Recent Transactions
          </h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 group hover:bg-gray-100 transition-colors">
                <div className="overflow-hidden">
                  <p className="font-medium text-gray-900 truncate">{t.description}</p>
                  <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold shrink-0 ${t.type === 'subscription' ? 'text-blue-600' : 'text-emerald-600'}`}>
                    +{formatCurrency(t.amount, currency)}
                  </span>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDeleteTransaction(t.id); }}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Transaction"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No recent transactions</p>}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white border-none">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <p className="text-indigo-200 text-sm mb-6">Manage your gym operations efficiently.</p>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={onAddMember} className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition text-left">
              <UserPlus size={20} className="mb-2" />
              <span className="text-sm font-medium">Add Member</span>
            </button>
            <button onClick={() => document.getElementById('guest-tab-btn')?.click()} className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition text-left opacity-50 cursor-not-allowed">
              <UserCheck size={20} className="mb-2" />
              <span className="text-sm font-medium">Log Guest (Use Tab)</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
