
import React, { useState } from 'react';
import { Search, Bell, Camera, X } from 'lucide-react';
import { VisionScanner } from './VisionScanner';
import { searchBookByTitle } from '../lib/gemini';
import { GlassCard } from './GlassCard';
import { BookInfoDisplay } from './BookInfoDisplay';

export const Header: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearching(true);
      setShowResult(true);
      try {
        const data = await searchBookByTitle(searchQuery);
        setSearchResult(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const closeResult = () => {
    setShowResult(false);
    setSearchResult(null);
    setIsSearching(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full px-4 md:px-8 py-2 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-end pointer-events-auto">
          {/* Unified Action Bar */}
          <div className="flex items-center overflow-hidden rounded-2xl border border-white/10 bg-[#1F6E8C]/20 backdrop-blur-xl shadow-2xl">
            {/* Search Module */}
            <div className="relative group border-r border-white/10">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#2E8A99] transition-colors w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none w-32 md:w-64 transition-all"
              />
            </div>

            {/* Vision Scanner Module */}
            <button 
              onClick={() => setShowScanner(true)}
              className="p-2.5 border-r border-white/10 text-[#2E8A99] hover:text-[#84A7A1] hover:bg-white/5 transition-all group"
              title="Scan Artifact"
            >
              <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Notifications Module */}
            <button className="p-2.5 border-r border-white/10 text-white/30 hover:text-[#2E8A99] hover:bg-white/5 transition-all" title="Notifications">
              <Bell className="w-5 h-5" />
            </button>

            {/* Identity Module */}
            <div className="w-10 h-10 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center bg-white/5 overflow-hidden">
              <img 
                src="https://picsum.photos/seed/alex/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Vision Scanner Modal */}
      {showScanner && <VisionScanner onClose={() => setShowScanner(false)} />}

      {/* Search Result Modal */}
      {showResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0E2954]/90 backdrop-blur-2xl">
          <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar" hoverable={false} accent="aqua">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Search className="text-[#2E8A99]" />
                <h2 className="text-2xl font-black text-white">Archive Retrieval</h2>
              </div>
              <button onClick={closeResult} className="p-2 hover:bg-white/10 rounded-xl text-white/40">
                <X />
              </button>
            </div>
            
            <BookInfoDisplay result={searchResult} isAnalyzing={isSearching} />

            {!isSearching && searchResult && (
              <button 
                onClick={closeResult}
                className="w-full mt-6 py-4 rounded-2xl bg-[#2E8A99] text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-[#2E8A99]/20 hover:brightness-110 transition-all"
              >
                Close Connection
              </button>
            )}
          </GlassCard>
        </div>
      )}
    </>
  );
};
