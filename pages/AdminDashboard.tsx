
import React, { useState, useMemo, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  TrendingUp, Users, Activity, Search, Plus, Archive, RotateCcw, UserCheck, 
  Cpu, Layers, ClipboardList, Settings, CheckCircle2, XCircle, Trash2,
  AlertCircle, RefreshCw, Bookmark, User as UserIcon, X, Calendar, MapPin, Edit3, History, CreditCard, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { INITIAL_BOOKS, INITIAL_COPIES, INITIAL_REQUESTS, INITIAL_STUDENTS, generateLibraryId } from '../lib/db';
import { Book, BookCopy, UserRequest, Transaction, UserProfile, Rule } from '../types';

type AdminTab = 'overview' | 'inventory' | 'circulation' | 'users' | 'requests' | 'policy';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [copies, setCopies] = useState<BookCopy[]>(INITIAL_COPIES);
  const [requests, setRequests] = useState<UserRequest[]>(INITIAL_REQUESTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [members, setMembers] = useState<UserProfile[]>(INITIAL_STUDENTS);

  const navItems: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Intelligence', icon: Activity },
    { id: 'inventory', label: 'Vault', icon: Layers },
    { id: 'circulation', label: 'Circulation', icon: RotateCcw },
    { id: 'users', label: 'Member Core', icon: Users },
    { id: 'requests', label: 'Queue', icon: ClipboardList },
    { id: 'policy', label: 'Logic Layers', icon: Cpu },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-700">
      {/* Ocean Sub-Nav */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-[#1F6E8C]/20 backdrop-blur-xl border border-white/5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
              ${activeTab === item.id 
                ? 'bg-[#2E8A99] text-white shadow-lg shadow-[#2E8A99]/20' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="min-h-[650px]">
        {activeTab === 'overview' && <OverviewTab copies={copies} />}
        {activeTab === 'inventory' && <InventoryTab books={books} copies={copies} setCopies={setCopies} setBooks={setBooks} transactions={transactions} />}
        {activeTab === 'circulation' && <CirculationTab copies={copies} setCopies={setCopies} transactions={transactions} setTransactions={setTransactions} books={books} />}
        {activeTab === 'users' && <UserInsightsTab transactions={transactions} members={members} setMembers={setMembers} />}
        {activeTab === 'requests' && <RequestQueueTab requests={requests} setRequests={setRequests} />}
        {activeTab === 'policy' && <PolicyTab />}
      </div>
    </div>
  );
};

// --- SHARED MODALS ---

const TransactionDetailModal = ({ tx, onClose }: { tx: Transaction, onClose: () => void }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0E2954]/90 backdrop-blur-2xl">
    <GlassCard className="w-full max-w-lg p-10" accent="none" hoverable={false}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-black text-white">Transaction Log</h2>
          <p className="text-xs text-[#2E8A99] font-mono mt-1 tracking-widest">{tx.id}</p>
        </div>
        <button onClick={onClose} className="p-2 text-white/20 hover:text-white"><X /></button>
      </div>
      
      <div className="space-y-5">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
           <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Artifact Identification</p>
           <p className="font-bold text-lg">{tx.bookTitle}</p>
           <p className="text-xs text-white/40 font-mono mt-1">{tx.bookCopyId}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
             <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Executor</p>
             <p className="text-sm font-bold">{tx.userId}</p>
           </div>
           <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
             <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Status</p>
             <p className={`text-sm font-bold uppercase ${tx.status === 'active' ? 'text-cyan-400' : 'text-green-400'}`}>{tx.status}</p>
           </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
           <div className="flex justify-between items-center">
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Timestamp</p>
               <p className="text-xs font-mono">{new Date(tx.timestamp).toLocaleString()}</p>
             </div>
             {tx.dueDate && (
               <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Neural Deadline</p>
                 <p className="text-xs font-mono text-[#2E8A99]">{new Date(tx.dueDate).toLocaleDateString()}</p>
               </div>
             )}
           </div>
        </div>
      </div>
      <button onClick={onClose} className="w-full mt-8 py-4 rounded-2xl bg-[#2E8A99] text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#2E8A99]/20">Close Manifest</button>
    </GlassCard>
  </div>
);

// --- TABS ---

const OverviewTab = ({ copies }: { copies: BookCopy[] }) => {
  const [shelfData, setShelfData] = useState(Array.from({length: 25}).map((_, i) => ({ id: i, rack: `S${Math.floor(i/5)}-R${i%5}`, load: 20 + Math.random() * 70 })));
  const [selectedShelf, setSelectedShelf] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Neural Throughput', val: '92%', icon: TrendingUp, color: '#2E8A99' },
          { label: 'Member Nodes', val: '2.0k', icon: Users, color: '#84A7A1' },
          { label: 'Artifact Leakage', val: '0.04%', icon: AlertCircle, color: '#fbbf24' },
          { label: 'System Uptime', val: '99.9%', icon: Cpu, color: '#1F6E8C' }
        ].map(kpi => (
          <GlassCard key={kpi.label} hoverable={true}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.2em] mb-1">{kpi.label}</p>
                <h4 className="text-2xl font-black text-white">{kpi.val}</h4>
              </div>
              <kpi.icon className="w-5 h-5 opacity-40" style={{ color: kpi.color }} />
            </div>
          </GlassCard>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard title="Atmospheric Usage" subtitle="Real-time Prediction" className="lg:col-span-2">
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { t: '08:00', v: 400 }, { t: '12:00', v: 1100 }, { t: '16:00', v: 850 }, { t: '20:00', v: 1400 }, { t: '00:00', v: 450 }
              ]}>
                <defs>
                  <linearGradient id="gTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E8A99" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2E8A99" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#2E8A99" fill="url(#gTeal)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard title="Vault Density Map" subtitle="Physical Topology">
          <div className="grid grid-cols-5 gap-2 mt-6">
             {shelfData.map((shelf, i) => (
               <div 
                 key={i} 
                 onClick={() => setSelectedShelf(i)}
                 className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 relative group overflow-hidden ${shelf.load > 75 ? 'bg-[#2E8A99]' : shelf.load > 40 ? 'bg-[#1F6E8C]/60' : 'bg-white/5'}`}
               >
                 {shelf.load > 75 && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-lg">
                   <Edit3 className="w-3 h-3 text-white" />
                 </div>
               </div>
             ))}
          </div>
          {selectedShelf !== null && (
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 animate-in fade-in zoom-in">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] font-black uppercase text-[#2E8A99] tracking-widest">{shelfData[selectedShelf].rack}</p>
                <button onClick={() => setSelectedShelf(null)} className="text-white/20 hover:text-white"><X size={12} /></button>
              </div>
              <p className="text-[10px] text-white/40 mb-2">Occupancy Gradient: {Math.round(shelfData[selectedShelf].load)}%</p>
              <input 
                type="range" 
                value={shelfData[selectedShelf].load}
                onChange={(e) => {
                  const newData = [...shelfData];
                  newData[selectedShelf].load = parseInt(e.target.value);
                  setShelfData(newData);
                }}
                className="w-full accent-[#2E8A99]"
              />
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

const InventoryTab = ({ books, copies, setCopies, transactions }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingArtifact, setViewingArtifact] = useState<BookCopy | null>(null);

  const filteredCopies = useMemo(() => {
    const s = searchTerm.toLowerCase();
    if (!s) return copies.slice(0, 50); // Show slice for performance
    return copies.filter((c: any) => {
      const book = books.find((b: any) => b.id === c.bookId);
      return c.id.toLowerCase().includes(s) || (book?.title.toLowerCase().includes(s));
    }).slice(0, 100);
  }, [searchTerm, copies, books]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
          <input 
            placeholder="Search Vault Archive (6,000+ entries)..."
            className="w-full bg-[#1F6E8C]/20 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:border-[#2E8A99] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#2E8A99] text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#2E8A99]/20">
          <Plus className="w-4 h-4" /> Inject Artifact
        </button>
      </div>

      <GlassCard title="Vault Records" subtitle="Master Inventory Manifest" noPadding={true}>
        <div className="overflow-x-auto custom-scrollbar max-h-[500px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1F6E8C]/10 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4">Artifact / ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Physical Node</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCopies.map((copy: any) => {
                const book = books.find((b: any) => b.id === copy.bookId);
                return (
                  <tr key={copy.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setViewingArtifact(copy)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-14 bg-[#1F6E8C]/20 rounded-lg overflow-hidden shrink-0 border border-white/5">
                          <img src={book?.cover} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-[#2E8A99] transition-colors">{book?.title}</p>
                          <p className="text-[10px] font-mono text-[#2E8A99]">{copy.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest
                        ${copy.status === 'available' ? 'text-green-400 border-green-500/30 bg-green-500/5' : 'text-[#2E8A99] border-[#2E8A99]/30 bg-[#2E8A99]/5'}`}>
                        {copy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-white/40">{copy.shelfLocation}</td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2.5 hover:bg-[#2E8A99]/20 rounded-xl text-white/20 hover:text-[#2E8A99] transition-all"><Settings size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Book Detail Modal Implementation */}
      {viewingArtifact && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0E2954]/90 backdrop-blur-2xl">
          <GlassCard className="w-full max-w-2xl p-8" accent="none" hoverable={false}>
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-6">
                 <div className="w-24 h-32 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                    <img src={books.find((b: any) => b.id === viewingArtifact.bookId)?.cover} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-white">{books.find((b: any) => b.id === viewingArtifact.bookId)?.title}</h2>
                    <p className="text-[#2E8A99] font-mono text-xs mt-1 uppercase tracking-widest">{viewingArtifact.id} • {viewingArtifact.shelfLocation}</p>
                    <div className="flex gap-2 mt-4">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">{viewingArtifact.condition.toUpperCase()} Condition</span>
                      <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${viewingArtifact.status === 'available' ? 'border-green-500/30 text-green-400' : 'border-[#2E8A99]/30 text-[#2E8A99]'}`}>{viewingArtifact.status}</span>
                    </div>
                 </div>
              </div>
              <button onClick={() => setViewingArtifact(null)} className="p-2 text-white/30 hover:text-white"><X /></button>
            </div>
            
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <History size={12} /> Neural Transaction Ledger
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
               {transactions.filter((t: any) => t.bookCopyId === viewingArtifact.id).length > 0 ? (
                 transactions.filter((t: any) => t.bookCopyId === viewingArtifact.id).map((h: any) => (
                   <div key={h.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center group hover:border-[#2E8A99]/40 transition-all">
                      <div>
                        <p className="text-xs font-bold uppercase text-[#2E8A99] tracking-widest">{h.type}</p>
                        <p className="text-[10px] text-white/40 mt-1">Executor: {h.userId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-mono opacity-50">{new Date(h.timestamp).toLocaleDateString()}</p>
                        <p className="text-[8px] font-black uppercase tracking-tighter text-white/20 mt-1">LOG_ID: {h.id.slice(-6)}</p>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-16 text-center opacity-10 font-black uppercase tracking-widest text-[10px]">No historical data found in sector</div>
               )}
            </div>
          </GlassCard>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0E2954]/95 backdrop-blur-3xl">
          <GlassCard className="w-full max-w-lg p-10" accent="none" hoverable={false}>
             <div className="flex justify-between items-center mb-10">
               <div>
                 <h2 className="text-3xl font-black text-white">Inject Artifact</h2>
                 <p className="text-xs text-[#2E8A99] font-black uppercase tracking-widest mt-1">Vault Registration Protocol</p>
               </div>
               <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-white/20 hover:text-white"><X /></button>
             </div>
             <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">Global Standard ISBN</label>
                  <input placeholder="978-X-XXXX-XXXX-X" className="w-full bg-[#1F6E8C]/10 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#2E8A99] outline-none" required />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">Artifact Designation</label>
                  <input placeholder="Core Title..." className="w-full bg-[#1F6E8C]/10 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#2E8A99] outline-none" required />
               </div>
               <div className="grid grid-cols-2 gap-5">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">Shelf Node</label>
                    <input placeholder="S1-R1" className="w-full bg-[#1F6E8C]/10 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#2E8A99] outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">Neural Copies</label>
                    <input placeholder="1" type="number" className="w-full bg-[#1F6E8C]/10 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#2E8A99] outline-none" />
                 </div>
               </div>
               <button className="w-full py-5 bg-[#2E8A99] text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl mt-6 shadow-2xl shadow-[#2E8A99]/30 hover:scale-[1.02] transition-all">Execute Registration</button>
             </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

const CirculationTab = ({ copies, setCopies, transactions, setTransactions, books }: any) => {
  const [mode, setMode] = useState<'issue' | 'return'>('issue');
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const handleExecute = async () => {
    if (!bookId || (mode === 'issue' && !userId)) return;
    setIsProcessing(true);
    setFeedback(null);
    await new Promise(r => setTimeout(r, 1000));

    if (mode === 'issue') {
      const copy = copies.find((c: any) => c.id === bookId);
      if (!copy || copy.status !== 'available') {
        setFeedback({ type: 'error', msg: 'Artifact node locked or occupied' });
      } else {
        const book = books.find((b: any) => b.id === copy.bookId);
        const newTx: Transaction = {
          id: `TXN-${Math.floor(Math.random() * 900000 + 100000)}`,
          userId,
          bookCopyId: bookId,
          bookTitle: book?.title || 'Classified Artifact',
          type: 'issue',
          timestamp: new Date().toISOString(),
          dueDate: new Date(Date.now() + 14*24*60*60*1000).toISOString(),
          status: 'active',
          handledBy: 'Admin'
        };
        setTransactions([newTx, ...transactions]);
        setCopies(copies.map((c: any) => c.id === bookId ? { ...c, status: 'issued', lastHandledBy: userId } : c));
        setFeedback({ type: 'success', msg: 'Neural handshake established. Dispatched.' });
      }
    } else {
      const copy = copies.find((c: any) => c.id === bookId);
      if (!copy || copy.status !== 'issued') {
        setFeedback({ type: 'error', msg: 'Artifact not identified in circulation' });
      } else {
        const book = books.find((b: any) => b.id === copy.bookId);
        const newTx: Transaction = {
          id: `TXN-${Math.floor(Math.random() * 900000 + 100000)}`,
          userId: copy.lastHandledBy || 'External Node',
          bookCopyId: bookId,
          bookTitle: book?.title || 'Classified Artifact',
          type: 'return',
          timestamp: new Date().toISOString(),
          status: 'completed',
          handledBy: 'Admin'
        };
        setTransactions([newTx, ...transactions]);
        setCopies(copies.map((c: any) => c.id === bookId ? { ...c, status: 'available', lastHandledBy: undefined } : c));
        setFeedback({ type: 'success', msg: 'Artifact synced and returned to Vault' });
      }
    }
    setIsProcessing(false);
    setBookId('');
    setUserId('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard title="Atmospheric Logistics" subtitle="Neural Distribution Engine" accent="none">
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-8">
           <button onClick={() => setMode('issue')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'issue' ? 'bg-[#2E8A99] text-white shadow-lg shadow-[#2E8A99]/20' : 'text-white/30 hover:text-white'}`}>Issue Manifest</button>
           <button onClick={() => setMode('return')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'return' ? 'bg-[#84A7A1] text-white shadow-lg shadow-[#84A7A1]/20' : 'text-white/30 hover:text-white'}`}>Return Sync</button>
        </div>

        <div className="space-y-6">
           {mode === 'issue' && (
             <div className="space-y-2">
               <label className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">Destination Member ID</label>
               <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="LIB-2024-STU-XXXXX" className="w-full bg-[#1F6E8C]/10 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#2E8A99] outline-none" />
             </div>
           )}
           <div className="space-y-2">
             <label className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">Artifact Node ID</label>
             <input value={bookId} onChange={e => setBookId(e.target.value)} placeholder="ACC-XXXXX" className="w-full bg-[#1F6E8C]/10 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#2E8A99] outline-none" />
           </div>

           {feedback && (
             <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in ${feedback.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span className="text-[10px] font-black uppercase tracking-widest">{feedback.msg}</span>
             </div>
           )}

           <button 
             onClick={handleExecute} 
             disabled={isProcessing}
             className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 shadow-2xl
               ${mode === 'issue' ? 'bg-[#2E8A99] text-white shadow-[#2E8A99]/20' : 'bg-[#84A7A1] text-white shadow-[#84A7A1]/20'}`}
           >
             {isProcessing ? <RefreshCw className="animate-spin" /> : `Execute Neural ${mode.toUpperCase()}`}
           </button>
        </div>
      </GlassCard>

      <GlassCard title="Circulation Stream" subtitle="Active Manifest Ledger">
         <div className="space-y-4 max-h-[480px] overflow-y-auto custom-scrollbar pr-2">
           {transactions.length > 0 ? transactions.map((tx: Transaction) => (
             <div key={tx.id} onClick={() => setSelectedTx(tx)} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center group hover:border-[#2E8A99]/50 cursor-pointer transition-all">
                <div className="flex gap-4 items-center">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 ${tx.type === 'issue' ? 'bg-[#2E8A99]/20 text-[#2E8A99]' : 'bg-green-500/20 text-green-400'}`}>
                      {tx.type === 'issue' ? <RotateCcw size={18} /> : <CheckCircle2 size={18} />}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white group-hover:text-[#2E8A99] transition-colors truncate max-w-[160px]">{tx.bookTitle}</p>
                     <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{tx.userId}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-mono opacity-40">{new Date(tx.timestamp).toLocaleDateString()}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-[#2E8A99] mt-1">{tx.id}</p>
                </div>
             </div>
           )) : (
             <div className="py-24 text-center opacity-10 font-black uppercase tracking-[0.3em] text-[10px]">No active circulation stream detected</div>
           )}
         </div>
      </GlassCard>

      {selectedTx && <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  );
};

const UserInsightsTab = ({ transactions, members, setMembers }: any) => {
  const [searchId, setSearchId] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', dept: 'Quantum Engineering', libraryId: '' });

  const foundUser = useMemo(() => {
    return members.find((m: any) => m.libraryId?.toLowerCase().includes(searchId.toLowerCase()) || m.name.toLowerCase().includes(searchId.toLowerCase()));
  }, [searchId, members]);

  const generateId = () => {
    setNewMember({ ...newMember, libraryId: generateLibraryId('STU') });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
          <input 
            placeholder="Search Member Core (2,000+ nodes)..." 
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            className="w-full bg-[#1F6E8C]/20 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-sm focus:border-[#2E8A99] outline-none"
          />
        </div>
        <button onClick={() => setIsRegistering(true)} className="px-8 bg-[#2E8A99] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-[#2E8A99]/20">Initialize Member</button>
      </div>

      {foundUser ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <GlassCard title="Identity Snapshot" subtitle="Verified Neural Signature" accent="none">
             <div className="flex flex-col items-center py-6">
                <div className="w-24 h-24 rounded-3xl bg-[#1F6E8C]/20 p-1 mb-6 border border-white/10">
                   <img src={`https://picsum.photos/seed/${foundUser.libraryId}/100/100`} className="w-full h-full object-cover rounded-2xl opacity-60" />
                </div>
                <h3 className="text-2xl font-black text-white">{foundUser.name}</h3>
                <p className="text-xs text-[#2E8A99] font-black uppercase tracking-widest mb-6">{foundUser.libraryId}</p>
                <div className="w-full space-y-3">
                   <div className="flex justify-between p-3.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest border border-white/5">
                      <span className="text-white/30">Neural Reliability</span>
                      <span className="text-[#84A7A1]">{foundUser.reliabilityScore}%</span>
                   </div>
                   <div className="flex justify-between p-3.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest border border-white/5">
                      <span className="text-white/30">Node Status</span>
                      <span className={foundUser.status === 'active' ? 'text-cyan-400' : 'text-red-400'}>{foundUser.status.toUpperCase()}</span>
                   </div>
                   <div className="flex justify-between p-3.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest border border-white/5">
                      <span className="text-white/30">Sector</span>
                      <span className="text-white/60">{foundUser.department}</span>
                   </div>
                </div>
             </div>
          </GlassCard>
          <GlassCard title="Active Flux" subtitle="Sector Borrowing Ledger" className="lg:col-span-2">
             <div className="space-y-4 mt-4">
                {transactions.filter((t: any) => t.userId === foundUser.libraryId || t.userId === foundUser.username).length > 0 ? (
                  transactions.filter((t: any) => t.userId === foundUser.libraryId || t.userId === foundUser.username).map((t: any) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center hover:border-[#2E8A99]/30 transition-all">
                       <div>
                         <p className="text-xs font-bold text-white uppercase tracking-tight">{t.bookTitle}</p>
                         <p className="text-[9px] text-white/30 uppercase mt-1 tracking-widest">{t.type} Manifest • {t.id}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-mono opacity-50">Deadline: {t.dueDate?.split('T')[0] || 'SYNCED'}</p>
                         <div className="flex justify-end mt-1">
                           <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[8px] font-black uppercase border border-cyan-500/20">{t.status}</span>
                         </div>
                       </div>
                    </div>
                  ))
                ) : (
                   <div className="py-24 text-center opacity-10 font-black uppercase tracking-[0.4em] text-[10px]">No active flux detected for this node</div>
                )}
             </div>
          </GlassCard>
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center opacity-10 scale-90">
          <UserIcon className="w-16 h-16 mb-4" />
          <p className="font-black uppercase tracking-[0.5em] text-xs">Waiting for Neural Identity Stream</p>
        </div>
      )}

      {isRegistering && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0E2954]/95 backdrop-blur-3xl">
           <GlassCard className="w-full max-w-lg p-10" accent="none" hoverable={false}>
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h2 className="text-3xl font-black text-white">Member Initialization</h2>
                    <p className="text-xs text-[#2E8A99] font-black uppercase tracking-widest mt-1">Identity Construction Protocol</p>
                 </div>
                 <button onClick={() => setIsRegistering(false)} className="p-2 text-white/20 hover:text-white"><X /></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">Full Signature (Name)</label>
                    <input placeholder="Member Name..." value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full bg-[#1F6E8C]/10 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#2E8A99] outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">Knowledge Sector</label>
                    <select value={newMember.dept} onChange={e => setNewMember({...newMember, dept: e.target.value})} className="w-full bg-[#1F6E8C]/10 border border-white/10 rounded-2xl p-4 text-sm text-white/60 focus:border-[#2E8A99] outline-none">
                       <option>Quantum Engineering</option>
                       <option>Neural Arts</option>
                       <option>Digital Philosophy</option>
                       <option>Ethical AI</option>
                    </select>
                 </div>
                 <div className="p-5 rounded-2xl bg-[#2E8A99]/10 border border-[#2E8A99]/20 flex justify-between items-center group">
                    <div>
                       <p className="text-[10px] font-black text-[#2E8A99] uppercase tracking-widest mb-1">Assigned Neural ID</p>
                       <p className="text-2xl font-mono font-bold text-white tracking-tighter">{newMember.libraryId || 'ID_NOT_GENERATED'}</p>
                    </div>
                    <button onClick={generateId} className="p-3 rounded-xl bg-[#2E8A99] text-white hover:scale-110 transition-all shadow-lg shadow-[#2E8A99]/30" title="Generate ID">
                       <RefreshCw size={18} />
                    </button>
                 </div>
                 <button onClick={() => {
                    if (newMember.name && newMember.libraryId) {
                      setMembers([...members, { ...newMember, role: 'student', username: `member_${Math.random()}`, status: 'active', tier: 'normal', reliabilityScore: 90 }]);
                      setIsRegistering(false);
                      setNewMember({ name: '', dept: 'Quantum Engineering', libraryId: '' });
                    }
                 }} className="w-full py-5 bg-[#2E8A99] text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl mt-6 shadow-2xl shadow-[#2E8A99]/30 hover:scale-[1.02] transition-all">Execute Enrollment</button>
              </div>
           </GlassCard>
        </div>
      )}
    </div>
  );
};

const RequestQueueTab = ({ requests, setRequests }: any) => {
  const resolve = (id: string, status: 'approved' | 'rejected') => {
    setRequests(requests.map((r: any) => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard title="Artifact Queue" subtitle="Atmospheric Acquisition Feed">
         <div className="space-y-4 max-h-[520px] overflow-y-auto custom-scrollbar pr-2">
            {requests.filter((r: any) => r.type === 'book_acquisition' && r.status === 'pending').map((req: any) => (
              <div key={req.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 animate-in slide-in-from-right-4 transition-all hover:border-[#2E8A99]/40 group">
                 <div className="flex justify-between items-start mb-5">
                   <div>
                     <p className="text-sm font-bold text-white group-hover:text-[#2E8A99] transition-colors">{req.requestData.title}</p>
                     <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">{req.id} • {req.priority.toUpperCase()} PRIORITY</p>
                   </div>
                   <div className="text-right">
                     <span className="text-[10px] font-mono text-white/20 block">{new Date(req.timestamp).toLocaleDateString()}</span>
                     <span className="text-[8px] font-black uppercase text-[#2E8A99] mt-1 block">USER: {req.userId || 'GENERIC'}</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => resolve(req.id, 'approved')} className="flex-1 py-3 rounded-xl bg-[#2E8A99]/10 text-[#2E8A99] text-[9px] font-black uppercase tracking-widest hover:bg-[#2E8A99]/20 transition-all border border-[#2E8A99]/20">Approve Purchase</button>
                   <button onClick={() => resolve(req.id, 'rejected')} className="flex-1 py-3 rounded-xl bg-white/5 text-white/20 text-[9px] font-black uppercase tracking-widest hover:text-red-400 hover:border-red-400/30 transition-all border border-transparent">Reject</button>
                 </div>
              </div>
            ))}
            {requests.filter((r: any) => r.type === 'book_acquisition' && r.status === 'pending').length === 0 && (
               <div className="py-24 text-center opacity-10 font-black uppercase tracking-[0.3em] text-[10px]">Vault Acquisition Feed Empty</div>
            )}
         </div>
      </GlassCard>

      <GlassCard title="Enrollment Hub" subtitle="Identity Validation Stream">
         <div className="space-y-4 max-h-[520px] overflow-y-auto custom-scrollbar pr-2">
            {requests.filter((r: any) => r.type === 'user_enrollment' && r.status === 'pending').map((req: any) => (
              <div key={req.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group animate-in slide-in-from-left-4 hover:border-[#2E8A99]/40 transition-all">
                 <div className="flex items-center gap-4">
                   <div className="w-11 h-11 rounded-2xl bg-[#1F6E8C]/10 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                     <UserCheck className="w-5 h-5 text-[#2E8A99]" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white">{req.requestData.name}</p>
                     <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{req.requestData.dept}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => resolve(req.id, 'approved')} className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:scale-110 transition-all"><CheckCircle2 size={16} /></button>
                   <button onClick={() => resolve(req.id, 'rejected')} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:scale-110 transition-all"><XCircle size={16} /></button>
                 </div>
              </div>
            ))}
             {requests.filter((r: any) => r.type === 'user_enrollment' && r.status === 'pending').length === 0 && (
               <div className="py-24 text-center opacity-10 font-black uppercase tracking-[0.3em] text-[10px]">Identity Validation Stream Clear</div>
            )}
         </div>
      </GlassCard>
    </div>
  );
};

const PolicyTab = () => {
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', condition: 'Demand > 300% / Sector', action: 'Sync: Restrict window to 2d', isActive: true },
    { id: '2', condition: 'Overdue Artifacts > 3', action: 'Lock Identity Node', isActive: true },
    { id: '3', condition: 'Unpaid Fines > $50', action: 'Restrict Access Hub', isActive: true },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRule, setNewRule] = useState({ condition: '', action: '' });

  const addRule = () => {
    if (newRule.condition && newRule.action) {
      setRules([...rules, { ...newRule, id: Date.now().toString(), isActive: true }]);
      setIsAdding(false);
      setNewRule({ condition: '', action: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2 px-1">
         <div>
            <h2 className="text-2xl font-black text-white">Neural Logic Sculptor</h2>
            <p className="text-[10px] text-[#2E8A99] font-black uppercase tracking-[0.2em] mt-1">Automated Policy Enforcement Layers</p>
         </div>
         <button onClick={() => setIsAdding(true)} className="px-8 py-3 rounded-2xl bg-[#2E8A99] text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-xl shadow-[#2E8A99]/20 transition-all">Inject Logic Node</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {rules.map(rule => (
           <GlassCard key={rule.id} accent="none" className="relative group border-[#1F6E8C]/30">
              <div className="flex justify-between items-start mb-8">
                 <div className={`p-4 rounded-2xl border ${rule.isActive ? 'border-[#2E8A99]/50 bg-[#2E8A99]/10 text-[#2E8A99]' : 'border-white/10 text-white/10'}`}>
                    <Cpu className="w-8 h-8" />
                 </div>
                 <button onClick={() => setRules(rules.filter(r => r.id !== rule.id))} className="p-2.5 text-white/10 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
              </div>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Trigger Vector</p>
              <p className="text-lg font-bold text-white mb-6 leading-tight uppercase tracking-tight">{rule.condition}</p>
              <p className="text-[9px] font-black text-[#2E8A99] uppercase tracking-[0.3em] mb-2">Applied Enforcement</p>
              <p className="text-sm font-medium text-white/70 bg-white/5 p-4 rounded-xl border border-white/5">{rule.action}</p>
           </GlassCard>
         ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0E2954]/95 backdrop-blur-3xl">
           <GlassCard className="w-full max-w-md p-10" accent="none" hoverable={false}>
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h2 className="text-3xl font-black text-white">Logic Construction</h2>
                    <p className="text-xs text-[#2E8A99] font-black uppercase tracking-widest mt-1">Deploy New Behavioral Rule</p>
                 </div>
                 <button onClick={() => setIsAdding(false)} className="p-2 text-white/20 hover:text-white"><X /></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">IF Vector (Trigger Condition)</label>
                    <input placeholder="Ex: Overdue Artifacts > 5" value={newRule.condition} onChange={e => setNewRule({...newRule, condition: e.target.value})} className="w-full bg-[#1F6E8C]/10 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#2E8A99] outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">THEN Execute (Enforcement Action)</label>
                    <input placeholder="Ex: Sync Restriction: Sector Hub" value={newRule.action} onChange={e => setNewRule({...newRule, action: e.target.value})} className="w-full bg-[#1F6E8C]/10 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#2E8A99] outline-none" />
                 </div>
                 <button onClick={addRule} className="w-full py-5 bg-[#2E8A99] text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl mt-6 shadow-2xl shadow-[#2E8A99]/30 hover:brightness-110 active:scale-95 transition-all">Deploy Logic Node</button>
              </div>
           </GlassCard>
        </div>
      )}
    </div>
  );
};
