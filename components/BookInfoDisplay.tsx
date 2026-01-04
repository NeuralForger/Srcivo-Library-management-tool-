
import React from 'react';
import { Star, Info, Loader2 } from 'lucide-react';

interface BookInfoDisplayProps {
  result: any;
  image?: string | null;
  isAnalyzing: boolean;
}

export const BookInfoDisplay: React.FC<BookInfoDisplayProps> = ({ result, image, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#2E8A99] mb-4" />
        <p className="text-[#2E8A99] font-black uppercase tracking-widest text-xs">Syncing with Deep Archive...</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
      <div className="flex gap-8 flex-col md:flex-row">
        {image && (
          <div className="w-full md:w-1/3 aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-2xl">
            <img src={image} alt="Book cover" className="w-full h-full object-cover opacity-80" />
          </div>
        )}
        <div className="flex-1">
          <div className="mb-6">
            <h3 className="text-3xl font-black text-white tracking-tight">{result.title}</h3>
            <div className="flex items-center gap-1.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(result.rating) ? 'text-cyan-400 fill-cyan-400' : 'text-white/10'}`} />
              ))}
              <span className="text-xs font-black text-white/30 ml-2 tracking-widest uppercase">{result.rating}/5 Rank</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#1F6E8C]/10 border border-white/5 mb-5">
            <p className="text-[10px] font-black text-[#2E8A99] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <Info className="w-3 h-3" /> Core Abstract
            </p>
            <p className="text-sm text-white/80 leading-relaxed font-medium">{result.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl glass-base border border-white/5">
              <p className="text-[10px] font-black text-[#84A7A1] uppercase tracking-[0.2em] mb-2">Preface Manifest</p>
              <p className="text-xs text-white/50 italic leading-relaxed">{result.preface}</p>
            </div>
            <div className="p-5 rounded-2xl glass-base border border-white/5">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-2">Neural Analysis</p>
              <p className="text-xs text-white/50 leading-relaxed">{result.review}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
