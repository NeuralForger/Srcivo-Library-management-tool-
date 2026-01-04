
import React, { useState } from 'react';
import { DashboardView } from '../types';
import { ShieldCheck, Users, BookOpen, LogOut, PenTool, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'reader' as DashboardView, label: 'Reader', icon: BookOpen },
    { id: 'admin' as DashboardView, label: 'Librarian', icon: ShieldCheck },
    { id: 'community' as DashboardView, label: 'Community', icon: Users },
    { id: 'actions' as DashboardView, label: 'Actions', icon: Zap },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <aside 
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-500 ease-in-out
        ${isOpen 
          ? 'w-64 glass-base border-r border-white/10 shadow-2xl' 
          : 'w-20 md:w-24 bg-transparent border-transparent'
        }
      `}
    >
      {/* Brand & Toggle Logo */}
      <div className="p-5 flex flex-col items-center">
        <button 
          onClick={toggleMenu}
          className={`relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#1F6E8C] to-[#2E8A99] flex items-center justify-center shadow-lg shadow-[#2E8A99]/20 hover:scale-110 active:scale-95 transition-all duration-300 group`}
        >
          <PenTool className={`text-white w-6 h-6 md:w-8 md:h-8 transition-transform duration-500 ${isOpen ? 'rotate-[360deg]' : ''}`} />
          
          {/* Toggle indicator */}
          <div className="absolute -bottom-1 -right-1 bg-[#0E2954] rounded-full p-0.5 border border-white/10">
            {isOpen ? <ChevronUp className="w-3 h-3 text-[#2E8A99]" /> : <ChevronDown className="w-3 h-3 text-[#2E8A99]" />}
          </div>
        </button>
        
        <div className={`mt-4 transition-all duration-500 overflow-hidden whitespace-nowrap text-center ${isOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <span className="text-xl font-black tracking-[0.3em] text-white">SCRIVO</span>
          <p className="text-[8px] text-[#84A7A1] font-black uppercase tracking-widest mt-1">Cognitive OS</p>
        </div>
      </div>

      {/* Dropdown Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <nav className="px-4 py-8 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsOpen(false); 
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-[#2E8A99]/20 text-[#2E8A99] border border-[#2E8A99]/30 shadow-[0_0_15px_rgba(46,138,153,0.1)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                {isActive && (
                  <div className="absolute right-0 w-1 h-6 bg-[#2E8A99] rounded-l-full shadow-[0_0_10px_#2E8A99]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-white/20 hover:text-red-400 hover:bg-red-500/5 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm tracking-wide">Disconnect</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
