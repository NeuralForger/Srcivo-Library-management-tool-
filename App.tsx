
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView, UserProfile } from './types';
import { ReaderDashboard } from './pages/ReaderDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CommunityDashboard } from './pages/CommunityDashboard';
import { ActionsMode } from './pages/IssueMode';
import { ChatBot } from './components/ChatBot';
import { Login } from './components/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<DashboardView>('reader');

  // Check for existing session
  useEffect(() => {
    const saved = localStorage.getItem('scrivo_session');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('scrivo_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('scrivo_session');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'reader':
        return <ReaderDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'community':
        return <CommunityDashboard />;
      case 'actions':
        return <ActionsMode />;
      default:
        return <ReaderDashboard />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0E2954] text-white selection:bg-[#2E8A99]/30 selection:text-[#2E8A99]">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onLogout={handleLogout}
      />
      
      {/* Centered main content container */}
      <main className="transition-all duration-500 ease-in-out w-full flex justify-center">
        <div className="w-full max-w-7xl min-h-screen flex flex-col">
          {currentView !== 'actions' && <Header />}
          <div className="px-4 md:px-8 pb-4 md:pb-8 flex-1">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Floating Scrivo Guide */}
      <ChatBot />

      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1F6E8C]/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E8A99]/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
};

export default App;
