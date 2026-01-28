import React, { useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { formatDate, getMonthsLeft } from '../utils/helpers';

export default function Members({ members, currency, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => onEdit(null)}>
          <Plus size={18} /> Add Member
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscription Ends</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map(member => {
                 const monthsLeft = getMonthsLeft(member.subscriptionEndDate);
                 const isExpired = !member.subscriptionEndDate || new Date(member.subscriptionEndDate) < new Date();
                 
                 return (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.age} years old</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{member.phone}</div>
                    <div className="text-xs text-gray-400">{member.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {isExpired ? (
                             <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        ) : monthsLeft <= 1 ? (
                             <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        ) : (
                             <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        )}
                        <span className="text-sm font-medium text-gray-700">
                            {formatDate(member.subscriptionEndDate)}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      type="button"
                      onClick={() => onEdit(member)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium cursor-pointer"
                    >
                      Renew / Edit
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDelete(member.id); }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer"
                      title="Delete Member"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}