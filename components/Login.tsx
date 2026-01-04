
import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { PenTool, Shield, User, Lock, Loader2, AlertCircle, Info } from 'lucide-react';
import { UserProfile } from '../types';
import { authenticateUser } from '../lib/db';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userProfile = await authenticateUser(username, password);
      if (userProfile) {
        onLogin(userProfile);
      } else {
        setError('Authentication Failed: Verify Security Credentials.');
      }
    } catch (err) {
      setError('System core communication failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E2954] p-4">
      {/* Ocean Orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#1F6E8C]/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#2E8A99]/20 blur-[150px] rounded-full pointer-events-none" />

      <GlassCard className="w-full max-w-md p-10 relative border-white/10" hoverable={false} accent="none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#2E8A99] to-transparent opacity-40 animate-[scan_3s_linear_infinite]" />

        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#1F6E8C] to-[#2E8A99] flex items-center justify-center shadow-2xl shadow-[#2E8A99]/30 mx-auto mb-6">
            <PenTool className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-[0.2em] mb-2">SCRIVO</h1>
          <p className="text-[#84A7A1] text-[10px] font-black uppercase tracking-[0.4em]">Integrated Intelligence OS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#2E8A99] transition-colors w-5 h-5" />
              <input 
                type="text" 
                placeholder="USERNAME"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#2E8A99]/50 transition-all font-bold text-sm tracking-widest uppercase"
                required
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#2E8A99] transition-colors w-5 h-5" />
              <input 
                type="password" 
                placeholder="PASSWORD"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#2E8A99]/50 transition-all font-bold text-sm tracking-widest uppercase"
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-[#2E8A99] text-white font-black uppercase tracking-widest hover:scale-[1.02] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#2E8A99]/20 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>INITIALIZE SESSION <Shield className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/5">
           <div className="flex items-start gap-3">
             <Info className="w-4 h-4 text-white/20 mt-0.5" />
             <p className="text-[9px] text-white/30 uppercase font-bold leading-relaxed tracking-wider">
               Admin: Admin / Admin | Members: student_01 / 1710
             </p>
           </div>
        </div>
      </GlassCard>
    </div>
  );
};
