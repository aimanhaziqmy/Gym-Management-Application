import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, onSnapshot, query, orderBy, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db, APP_ID } from './config/firebase';

// Components
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import AuthScreen from './components/auth/AuthScreen';
import MemberModal from './components/modals/MemberModal';

// Views
import Dashboard from './views/Dashboard';
import Members from './views/Members';
import SubscriptionCalendar from './views/SubscriptionCalendar';
import Guests from './views/Guests';
import Reports from './views/Reports';
import SettingsView from './views/Settings';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data State
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [systemInitialized, setSystemInitialized] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // System Initialization Check
  useEffect(() => {
    const sysRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'system');
    const unsubscribe = onSnapshot(sysRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().initialized) {
        setSystemInitialized(true);
      } else {
        setSystemInitialized(false);
      }
    });
    return unsubscribe;
  }, []);

  // Data Listener
  useEffect(() => {
    if (!user) return;

    const membersRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'members');
    const unsubMembers = onSnapshot(membersRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(data);
    }, (error) => console.error("Members sync error:", error));

    const transRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'transactions');
    const qTrans = query(transRef, orderBy('date', 'desc'));
    const unsubTrans = onSnapshot(qTrans, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
    }, (error) => console.error("Transactions sync error:", error));

    const settingsRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'config');
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setCurrency(docSnap.data().currency || 'USD');
      }
    });

    return () => {
      unsubMembers();
      unsubTrans();
      unsubSettings();
    };
  }, [user]);

  // Derived Stats
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split('T')[0];

    const monthlyTrans = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const revenue = monthlyTrans.reduce((sum, t) => sum + Number(t.amount), 0);
    const guestsToday = transactions.filter(t => t.type === 'guest' && t.date.startsWith(today)).length;
    
    const now = new Date();
    const activeMembers = members.filter(m => m.subscriptionEndDate && new Date(m.subscriptionEndDate) > now).length;

    return { revenue, guestsToday, activeMembers };
  }, [transactions, members]);

  // Global Actions
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateCurrency = async (newCurrency) => {
    if (!user) return;
    try {
      const ref = doc(db, 'artifacts', APP_ID, 'public', 'data', 'settings', 'config');
      await setDoc(ref, { currency: newCurrency }, { merge: true });
    } catch (err) {
      console.error("Error updating currency", err);
    }
  };

  const openMemberModal = (member = null) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = async (memberId) => {
    if (!memberId) return;
    if (window.confirm("ARE YOU SURE? This will permanently delete the member and cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'members', memberId));
      } catch (err) {
        alert("Failed to delete member: " + err.message);
        console.error(err);
      }
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!transactionId) return;
    if (window.confirm("Delete this transaction? This will remove it from all revenue reports.")) {
      try {
        await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'transactions', transactionId));
      } catch (err) {
        alert("Failed to delete transaction: " + err.message);
        console.error(err);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600">Loading GymOS...</div>;

  if (!user) return <AuthScreen systemInitialized={systemInitialized} />;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        view={view} 
        setView={setView} 
        user={user} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 overflow-y-auto h-screen">
        <TopBar title={view} onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {view === 'dashboard' && (
            <Dashboard 
              stats={stats} 
              currency={currency} 
              transactions={transactions} 
              onAddMember={() => openMemberModal(null)} 
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
          {view === 'members' && (
            <Members 
              members={members} 
              currency={currency} 
              onEdit={openMemberModal} 
              onDelete={handleDeleteMember}
            />
          )}
          {view === 'calendar' && (
             <SubscriptionCalendar 
               members={members} 
               onEdit={openMemberModal}
               onDelete={handleDeleteMember}
             />
          )}
          {view === 'guests' && (
            <Guests 
              transactions={transactions} 
              currency={currency} 
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
          {view === 'reports' && <Reports transactions={transactions} currency={currency} />}
          {view === 'settings' && (
             <SettingsView 
               currency={currency} 
               setCurrency={updateCurrency} 
               currentUser={user}
             />
          )}
        </div>
      </main>

      {isModalOpen && (
        <MemberModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          member={editingMember} 
          currency={currency}
        />
      )}
    </div>
  );
}
