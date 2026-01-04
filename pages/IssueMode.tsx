
import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Scan, Shield, Fingerprint, Camera, Wifi, BookOpen, User, ArrowLeft, Loader2 } from 'lucide-react';
import { VisionScanner } from '../components/VisionScanner';

export const ActionsMode: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = (id: string) => {
    setActiveAction(id);
    if (id === 'issue' || id === 'return') {
      setShowScanner(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center p-4">
      <div className="max-w-5xl w-full flex flex-col items-center">
        <GlassCard className="p-12 text-center overflow-hidden relative w-full mb-12" hoverable={false} accent="aqua">
          {/* Subtle Scanning Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2E8A99] to-transparent animate-[pulse_2s_infinite] opacity-50" />
          
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-3xl bg-[#2E8A99]/10 flex items-center justify-center border border-[#2E8A99]/20 mb-8 relative">
              <Camera className="w-12 h-12 text-[#2E8A99]" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#84A7A1] flex items-center justify-center border-4 border-[#0E2954] shadow-lg">
                 <Wifi className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-5xl font-black text-white mb-3 tracking-tighter">SCRIVO Terminal</h2>
              <p className="text-white/40 text-lg max-w-lg mx-auto leading-relaxed">Neural Hub is ready for biometric verification or physical scan.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
              <button 
                onClick={() => handleAction('issue')}
                className="flex flex-col items-center p-10 rounded-3xl glass-base border border-white/10 hover:border-[#2E8A99]/50 hover:bg-[#2E8A99]/5 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-[#2E8A99]/20">
                  <Scan className="w-8 h-8 text-[#2E8A99]" />
                </div>
                <p className="font-black text-white text-xs uppercase tracking-widest">Issue Artifact</p>
              </button>
              
              <button 
                onClick={() => handleAction('return')}
                className="flex flex-col items-center p-10 rounded-3xl glass-base border border-white/10 hover:border-[#84A7A1]/50 hover:bg-[#84A7A1]/5 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-[#84A7A1]/20">
                  <BookOpen className="w-8 h-8 text-[#84A7A1]" />
                </div>
                <p className="font-black text-white text-xs uppercase tracking-widest">Quick Return</p>
              </button>
              
              <button 
                onClick={() => handleAction('profile')}
                className="flex flex-col items-center p-10 rounded-3xl glass-base border border-white/10 hover:border-white/50 hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-white/20">
                  <Fingerprint className="w-8 h-8 text-white/40" />
                </div>
                <p className="font-black text-white text-xs uppercase tracking-widest">Verify Identity</p>
              </button>
            </div>
          </div>
        </GlassCard>
        
        <div className="flex justify-center gap-16 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#2E8A99]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Encrypted Core</span>
          </div>
          <div className="flex items-center gap-3">
            <Scan className="w-6 h-6 text-[#84A7A1]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Active Scan Sync</span>
          </div>
        </div>
      </div>

      {showScanner && <VisionScanner onClose={() => setShowScanner(false)} />}
      
      {activeAction === 'profile' && !showScanner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0E2954]/90 backdrop-blur-2xl">
           <GlassCard className="w-full max-w-md p-8 text-center" accent="aqua">
              <div className="w-20 h-20 rounded-full bg-[#1F6E8C]/20 mx-auto mb-6 flex items-center justify-center border border-white/10">
                <User className="w-10 h-10 text-white/40" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Identify Result</h3>
              <p className="text-white/40 text-sm mb-8">Access granted to node: 2482-STU</p>
              <button 
                onClick={() => setActiveAction(null)}
                className="w-full py-4 rounded-2xl bg-[#2E8A99] text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-[#2E8A99]/20"
              >
                Close Profile
              </button>
           </GlassCard>
        </div>
      )}
    </div>
  );
};
