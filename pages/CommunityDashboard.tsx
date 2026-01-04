
import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Users, Trophy, GraduationCap, Github, ArrowUpRight, Heart, Share2, Sparkles, Map } from 'lucide-react';

export const CommunityDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-6 duration-1000">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-2 px-2">
             <h2 className="text-3xl font-black text-white tracking-tight">Neural Reading Hubs</h2>
             <button className="px-5 py-2.5 rounded-2xl bg-[#1F6E8C]/20 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-[#2E8A99]/20 hover:text-[#2E8A99] transition-all">Explore Sectors</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Quantum Minds', count: 124, topic: 'Theoretical Physics', color: '#2E8A99' },
              { name: 'The Stoic Den', count: 89, topic: 'Digital Ethics', color: '#84A7A1' },
              { name: 'Abyssal Colony', count: 210, topic: 'Deep Sea Research', color: '#1F6E8C' }
            ].map(circle => (
              <GlassCard key={circle.name} className="relative group overflow-hidden border-white/5">
                <div className="absolute -top-10 -right-10 w-32 h-32 blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity rounded-full" style={{ background: circle.color }} />
                
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-16 h-16 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-lg" style={{ backgroundColor: `${circle.color}20` }}>
                     <Users className="w-8 h-8" style={{ color: circle.color }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-white group-hover:text-[#2E8A99] transition-colors">{circle.name}</h4>
                    <p className="text-xs font-medium text-white/40 uppercase tracking-widest mt-1">{circle.topic}</p>
                    <div className="flex items-center gap-3 mt-4">
                       <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{circle.count} Active Nodes</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
            <GlassCard className="border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-8 bg-transparent hover:bg-white/5 transition-all cursor-pointer group">
               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#2E8A99]/20 transition-all mb-3">
                 <span className="text-2xl font-light text-white/40 group-hover:text-[#2E8A99]">+</span>
               </div>
               <span className="text-[10px] font-black text-white/30 group-hover:text-[#2E8A99] uppercase tracking-widest">Found New Sector</span>
            </GlassCard>
          </div>

          <GlassCard className="bg-gradient-to-br from-[#1F6E8C]/30 via-transparent to-transparent border-white/10" title="The Global Bookathon" subtitle="Time-Locked Event">
            <div className="flex flex-col md:flex-row gap-8 items-center mt-4">
               <div className="relative">
                 <div className="w-32 h-32 rounded-[3rem] bg-gradient-to-tr from-[#1F6E8C] to-[#2E8A99] flex items-center justify-center shadow-2xl shadow-[#2E8A99]/20 animate-pulse">
                    <Trophy className="w-14 h-14 text-white" />
                 </div>
               </div>
               <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-black text-white mb-2 leading-tight uppercase tracking-tighter">Deep Abyss Sprint 2024</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">Process 1,200 pages from the 'Marine Technology' archive to unlock Alpha status.</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                     <div className="text-center">
                       <p className="text-xl font-black text-[#2E8A99]">4.2k</p>
                       <p className="text-[9px] text-white/30 uppercase tracking-widest">Active Links</p>
                     </div>
                     <div className="text-center">
                       <p className="text-xl font-black text-[#84A7A1]">3d 12h</p>
                       <p className="text-[9px] text-white/30 uppercase tracking-widest">Sync Window</p>
                     </div>
                     <button className="ml-auto px-10 py-3.5 rounded-2xl bg-[#2E8A99] text-white font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl shadow-[#2E8A99]/20 transition-all">
                       ENTER SECTOR
                     </button>
                  </div>
               </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
