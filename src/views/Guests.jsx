import React, { useState } from 'react';
import { UserCheck, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { addDoc, collection } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { formatCurrency } from '../utils/helpers';

export default function Guests({ transactions, currency, onDeleteTransaction }) {
  const [formData, setFormData] = useState({ name: '', amount: '', note: '' });

  const guestTransactions = transactions.filter(t => t.type === 'guest');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    try {
      await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'transactions'), {
        type: 'guest',
        description: `Guest: ${formData.name}`,
        amount: Number(formData.amount),
        date: new Date().toISOString(),
        note: formData.note
      });
      setFormData({ name: '', amount: '', note: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 h-fit">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Register Walk-in Guest</h3>
        <form onSubmit={handleSubmit}>
          <Input 
            label="Guest Name" 
            placeholder="John Doe" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required
          />
          <Input 
            label={`Amount Paid (${currency})`} 
            type="number" 
            placeholder="15.00" 
            value={formData.amount} 
            onChange={e => setFormData({...formData, amount: e.target.value})} 
            required
          />
          <Input 
            label="Notes (Optional)" 
            placeholder="Referred by..." 
            value={formData.note} 
            onChange={e => setFormData({...formData, note: e.target.value})} 
          />
          <Button type="submit" className="w-full mt-2">
            <UserCheck size={18} /> Check In Guest
          </Button>
        </form>
      </Card>

      <Card className="lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Guest History</h3>
        <div className="overflow-y-auto max-h-[500px] space-y-3">
          {guestTransactions.map(t => (
            <div key={t.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  G
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t.description}</p>
                  <p className="text-xs text-gray-500">{new Date(t.date).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-bold text-gray-900">{formatCurrency(t.amount, currency)}</p>
                  {t.note && <p className="text-xs text-gray-500 italic">{t.note}</p>}
                </div>
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDeleteTransaction(t.id); }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                    title="Delete Record"
                >
                    <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {guestTransactions.length === 0 && <p className="text-center text-gray-400 py-10">No guest history yet.</p>}
        </div>
      </Card>
    </div>
  );
}