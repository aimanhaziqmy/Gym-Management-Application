import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { auth, db, APP_ID } from '../../config/firebase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export default function AuthScreen({ systemInitialized }) {
  const [setupMode, setSetupMode] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (email === 'admin' && password === 'admin') {
      if (systemInitialized) {
        setError('Setup already complete. Login with your admin email.');
        return;
      }
      setSetupMode(true);
      setError('');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Invalid credentials.');
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      
      const sysRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'system');
      await setDoc(sysRef, { initialized: true });

      await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'staff'), {
          email: newEmail,
          role: 'Admin',
          addedAt: new Date().toISOString()
      });

    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className={`p-8 text-center transition-colors ${setupMode ? 'bg-indigo-800' : 'bg-indigo-600'}`}>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            {setupMode ? <Lock size={32} className="text-white" /> : <TrendingUp size={32} className="text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-white">GymOS Admin</h1>
          <p className="text-indigo-200 mt-2">{setupMode ? 'First Time Setup' : 'Management Portal'}</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mb-4 flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {!setupMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                label="Email / Username" 
                type="text" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="e.g. admin@gym.com"
              />
              <Input 
                label="Password" 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <Button type="submit" className="w-full" variant="primary">
                Sign In
              </Button>
              {!systemInitialized && (
                <p className="text-xs text-center text-gray-400 mt-4">
                  First time? Log in with <strong>admin / admin</strong> to set up.
                </p>
              )}
            </form>
          ) : (
            <form onSubmit={handleSetup} className="space-y-4">
              <div className="bg-indigo-50 text-indigo-800 p-3 rounded text-xs mb-2">
                <strong>Setup New Admin:</strong> Please create your permanent administrator credentials below.
              </div>
              <Input 
                label="New Admin Email" 
                type="email" 
                required 
                value={newEmail} 
                onChange={e => setNewEmail(e.target.value)} 
              />
              <Input 
                label="New Password" 
                type="password" 
                required 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
              />
              <Input 
                label="Confirm Password" 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
              />
              <Button type="submit" className="w-full" variant="primary">
                Create Admin Account
              </Button>
              <button 
                type="button" 
                onClick={() => setSetupMode(false)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
