
import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Flame, BookOpen, Brain, Clock, Zap, BookMarked, Quote, Star, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { LibraryScout } from '../components/LibraryScout';

const attentionData = [
  { name: 'Analytical', value: 45, color: '#2E8A99' },
  { name: 'Creative', value: 25, color: '#84A7A1' },
  { name: 'Focused', value: 30, color: '#1F6E8C' },
];

const intensityData = [
  { name: 'Mon', intensity: 45 },
  { name: 'Tue', intensity: 30 },
  { name: 'Wed', intensity: 85 },
  { name: 'Thu', intensity: 55 },
  { name: 'Fri', intensity: 40 },
  { name: 'Sat', intensity: 100 },
  { name: 'Sun', intensity: 90 },
];

export const ReaderDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-6xl mx-auto">
      <div className="flex flex-col gap-8">
        <div className="w-full">
          <GlassCard className="bg-gradient-to-br from-[#1F6E8C]/40 to-[#0E2954]/40 border-white/5 p-10 md:p-14" accent="none" hoverable={false}>
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="mb-12">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-tight">The Oceanic Deep</h2>
                <p className="text-white/60 text-xl md:text-2xl font-light">Your reading depth is <span className="text-[#2E8A99] font-bold">82% Immersive</span>.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
                <div className="p-8 rounded-[2.5rem] bg-[#1F6E8C]/10 border border-white/5 group hover:border-[#2E8A99]/30 transition-all flex flex-col items-center justify-center">
                  <Brain className="text-[#2E8A99] mb-4 w-10 h-10" />
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em] mb-2">Neural Load</p>
                  <p className="text-4xl font-black text-white">Advanced</p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-[#1F6E8C]/10 border border-white/5 group hover:border-[#84A7A1]/30 transition-all flex flex-col items-center justify-center">
                  <Clock className="text-[#84A7A1] mb-4 w-10 h-10" />
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em] mb-2">Ideal Cycle</p>
                  <p className="text-4xl font-black text-white">Midnight</p>
                </div>
              </div>

              <div className="w-full flex flex-col lg:flex-row items-center gap-12 mt-4">
                <div className="h-64 flex-1 w-full bg-white/5 rounded-[3rem] p-8 border border-white/5">
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mb-6 text-left">Cognitive Flux Cycle</p>
                  <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={intensityData}>
                      <defs>
                        <linearGradient id="glowAqua" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E8A99" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#2E8A99" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="intensity" stroke="#2E8A99" strokeWidth={5} fill="url(#glowAqua)" animationDuration={2000} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full lg:w-80 flex flex-col items-center">
                  <div className="relative w-56 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attentionData}
                          innerRadius={70}
                          outerRadius={95}
                          paddingAngle={10}
                          dataKey="value"
                          stroke="none"
                        >
                          {attentionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <Sparkles className="text-[#2E8A99] w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Aura</span>
                    </div>
                  </div>
                  <div className="mt-8 space-y-3 w-full max-w-[240px]">
                     {attentionData.map(item => (
                       <div key={item.name} className="flex justify-between items-center text-sm">
                         <span className="text-white/60 font-medium">{item.name}</span>
                         <span className="font-black" style={{ color: item.color }}>{item.value}%</span>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LibraryScout />
          
          <div className="grid grid-cols-1 gap-6">
            <GlassCard title="Atmospheric Score" subtitle="Node Tier Status" className="flex flex-col justify-center items-center py-10">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 border-[16px] border-white/5 rounded-full" />
                <div className="absolute inset-0 border-[16px] border-t-[#2E8A99] border-l-[#2E8A99] border-r-transparent border-b-transparent rounded-full rotate-[45deg] shadow-[0_0_25px_rgba(46,138,153,0.3)]" />
                <div className="text-center z-10">
                  <p className="text-6xl font-black text-white">92</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-black">Stable Link</p>
                </div>
              </div>
              
              <div className="w-full max-w-sm mt-10 space-y-4 px-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black text-white/40 uppercase mb-3 tracking-widest">
                    <span>Active Usage</span>
                    <span className="text-[#2E8A99]">9 / 12 Artifacts</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#1F6E8C] to-[#2E8A99] shadow-[0_0_10px_rgba(46,138,153,0.5)]" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="bg-[#2E8A99]/5 border-[#2E8A99]/20 flex items-center justify-center py-10">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-[2rem] bg-[#2E8A99] flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500 shadow-2xl shadow-[#2E8A99]/30">
                    <Flame className="text-white w-10 h-10 fill-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-[#0E2954] text-xs font-black flex items-center justify-center shadow-lg">
                    12
                  </div>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">12 Cycle Blaze</h4>
                  <p className="text-sm text-white/50 font-medium">Node Sync Rank: Alpha-2</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};
