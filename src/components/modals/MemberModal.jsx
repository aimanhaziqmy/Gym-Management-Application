import React, { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db, APP_ID } from '../../config/firebase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatDate, toInputDate } from '../../utils/helpers';

export default function MemberModal({ isOpen, onClose, member, currency }) {
  const [form, setForm] = useState({
    name: member?.name || '',
    phone: member?.phone || '',
    email: member?.email || '',
    age: member?.age || '',
    address: member?.address || '',
    paymentAmount: '', 
    durationMonths: '1',
    startDate: member?.subscriptionStartDate || new Date().toISOString(),
    endDate: member?.subscriptionEndDate || '',
  });

  useEffect(() => {
    if (form.paymentAmount && Number(form.paymentAmount) > 0) {
      const monthsToAdd = parseInt(form.durationMonths) || 1;
      const now = new Date();
      
      let startDateObj = new Date();
      if (member?.subscriptionEndDate && new Date(member.subscriptionEndDate) > now) {
          startDateObj = new Date(member.subscriptionEndDate); 
      }

      const endDateObj = new Date(startDateObj);
      endDateObj.setMonth(endDateObj.getMonth() + monthsToAdd);

      setForm(prev => ({
        ...prev,
        startDate: startDateObj.toISOString(),
        endDate: endDateObj.toISOString()
      }));
    }
  }, [form.paymentAmount, form.durationMonths, member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("Error: Subscription End Date cannot be earlier than Start Date.");
      return;
    }

    try {
      const memberRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'members', form.phone);
      
      const memberData = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        age: form.age,
        address: form.address,
        status: 'active',
        joinDate: member?.joinDate || new Date().toISOString(),
        subscriptionStartDate: form.startDate,
        subscriptionEndDate: form.endDate || new Date().toISOString()
      };

      await setDoc(memberRef, memberData, { merge: true });

      if (form.paymentAmount && Number(form.paymentAmount) > 0) {
        const startStr = formatDate(form.startDate);
        const endStr = formatDate(form.endDate);
        
        await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'transactions'), {
          type: 'subscription',
          description: `Subscription: ${form.name} (${startStr} - ${endStr})`,
          amount: Number(form.paymentAmount),
          date: new Date().toISOString(),
          memberPhone: form.phone
        });
      }
      onClose();
    } catch (error) {
      alert("Error saving member: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">{member ? 'Edit / Renew Member' : 'New Member Registration'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone (ID)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required disabled={!!member} placeholder="e.g. 555-0123" />
            <Input label="Age" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <Input label="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <CreditCard size={16} className="text-indigo-600"/>
                <h4 className="font-semibold text-indigo-900">Payment & Subscription</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-indigo-800 mb-1">Amount ({currency})</label>
                    <input type="number" className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="0.00" value={form.paymentAmount} onChange={e => setForm({...form, paymentAmount: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-indigo-800 mb-1">Duration (Months)</label>
                    <input type="number" min="1" className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={form.durationMonths} onChange={e => setForm({...form, durationMonths: e.target.value})} disabled={!form.paymentAmount} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-indigo-200">
               <div>
                  <label className="block text-xs font-medium text-indigo-800 mb-1">Subscription Start</label>
                  <input type="date" className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm bg-white" value={toInputDate(form.startDate)} onChange={e => setForm({...form, startDate: new Date(e.target.value).toISOString()})} />
               </div>
               <div>
                  <label className="block text-xs font-medium text-indigo-800 mb-1">Subscription End</label>
                  <input type="date" className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm bg-white" value={toInputDate(form.endDate)} onChange={e => setForm({...form, endDate: new Date(e.target.value).toISOString()})} />
               </div>
            </div>
            <p className="text-xs text-indigo-600 mt-2">Tip: You can manually change the dates above if the auto-calculation is incorrect.</p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
