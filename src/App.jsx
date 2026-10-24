import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import MyLists from './pages/MyLists';
import History from './pages/History';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import { Pencil, Heart } from 'lucide-react';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [hasActiveSession, setHasActiveSession] = useState(false);

  // Check active session periodically or when view changes
  useEffect(() => {
    if (!isAuthenticated) {
      setHasActiveSession(false);
      return;
    }

    checkActiveSession();
  }, [isAuthenticated, currentView]);

  const checkActiveSession = async () => {
    try {
      const res = await api.getActiveSession();
      setHasActiveSession(!!res.activeSession);
    } catch {
      setHasActiveSession(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        hasActiveSession={hasActiveSession}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <Dashboard setCurrentView={setCurrentView} />
        )}
        {currentView === 'practice' && (
          <Practice
            setCurrentView={setCurrentView}
            onSessionStateChange={(isActive) => setHasActiveSession(isActive)}
          />
        )}
        {currentView === 'lists' && (
          <MyLists setCurrentView={setCurrentView} />
        )}
        {currentView === 'history' && (
          <History />
        )}
        {currentView === 'leaderboard' && (
          <Leaderboard setCurrentView={setCurrentView} />
        )}
        {currentView === 'settings' && (
          <Settings />
        )}
      </main>

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F19] py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px]">
              <Pencil className="w-3 h-3 -rotate-45" />
            </div>
            <span className="font-bold text-slate-300 font-['Outfit']">DrawX</span>
            <span>— Minimal Object Drawing Practice Tracker</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by MongoDB Atlas & Google Gemini</span>
            <span>•</span>
            <span>Zero-Server Vercel Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
