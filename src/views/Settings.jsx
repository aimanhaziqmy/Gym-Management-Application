import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Trash2, UserPlus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { db, APP_ID, firebaseConfig } from '../config/firebase';
import { collection, onSnapshot, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export default function SettingsView({ currency, setCurrency, currentUser }) {
  const [staffList, setStaffList] = useState([]);

  // FETCH STAFF LIST
  useEffect(() => {
     const staffRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'staff');
     const unsubscribe = onSnapshot(staffRef, (snapshot) => {
         const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         setStaffList(list);
     });
     return unsubscribe;
  }, []);

  const handleDeleteStaff = async (id) => {
      if(window.confirm("Remove this staff member from the list? Note: This removes them from the staff directory but does not delete their login credentials due to browser limitations.")) {
          try {
            await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'staff', id));
          } catch(e) {
              alert("Error removing staff: " + e.message);
          }
      }
  };

  const AddUserForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState({ type: '', text: '' });

    const handleCreateUser = async (e) => {
      e.preventDefault();
      setMsg({ type: '', text: '' });

      try {
        // Create secondary app for user creation without logging out admin
        const secondaryApp = initializeApp(
            firebaseConfig, 
            `SecondaryApp-${Date.now()}`
          );
        
        const secondaryAuth = getAuth(secondaryApp);
        
        await createUserWithEmailAndPassword(secondaryAuth, email, password);
        await signOut(secondaryAuth);
        await deleteApp(secondaryApp);

        await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'staff'), {
            email: email,
            role: 'Staff',
            addedAt: new Date().toISOString()
        });

        setMsg({ type: 'success', text: 'User created successfully.' });
        setEmail('');
        setPassword('');
      } catch (err) {
        setMsg({ type: 'error', text: err.message });
      }
    };

    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <UserPlus size={16} /> Add New Staff Member
        </h4>
        <form onSubmit={handleCreateUser} className="space-y-3">
          <input 
            type="email" 
            placeholder="Staff Email" 
            className="w-full px-3 py-2 border rounded text-sm"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password (min 6 chars)" 
            className="w-full px-3 py-2 border rounded text-sm"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700 w-full">
            Create Account
          </button>
          {msg.text && (
            <p className={`text-xs ${msg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {msg.text}
            </p>
          )}
        </form>
      </div>
    );
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <SettingsIcon size={20} /> System Preferences
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Currency</label>
            <div className="grid grid-cols-3 gap-3">
              {['USD', 'EUR', 'GBP', 'INR', 'MYR', 'JPY'].map(curr => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    currency === curr 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' 
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This will update price formatting across the entire application for all users.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Shield size={20} /> Team Management
        </h3>
        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm mb-4">
          <p><strong>Current User:</strong> {currentUser?.email}</p>
        </div>
        
        <div className="mb-6 border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Role</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Added On</th>
                        <th className="px-4 py-3 font-medium text-gray-600 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {staffList.map(staff => (
                        <tr key={staff.id} className="bg-white">
                            <td className="px-4 py-3 text-gray-800">{staff.email}</td>
                            <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-bold text-gray-600 uppercase">{staff.role}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{staff.addedAt ? new Date(staff.addedAt).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-3 text-right">
                                <button 
                                    onClick={() => handleDeleteStaff(staff.id)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded"
                                    title="Remove from list"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {staffList.length === 0 && (
                        <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-gray-400 italic">No staff members found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        <AddUserForm />
      </Card>
    </div>
  );
}
