
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2, ExternalLink, Library } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { findNearbyLibraries } from '../lib/gemini';

export const LibraryScout: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ text: string, sources: any[] } | null>(null);

  const scoutNearby = async () => {
    setLoading(true);
    try {
      // Default to SF coordinates if geolocation fails
      let lat = 37.7749;
      let lng = -122.4194;

      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }

      const res = await findNearbyLibraries(lat, lng);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard title="Library Scout" subtitle="Nearby Knowledge Hubs" accent="peach">
      {!data && !loading ? (
        <div className="text-center py-6">
          <MapPin className="w-10 h-10 text-[#EAB2A0] mx-auto mb-4 opacity-50" />
          <p className="text-sm text-white/60 mb-6">Locate the finest physical library spaces in your vicinity.</p>
          <button 
            onClick={scoutNearby}
            className="px-8 py-3 rounded-2xl bg-[#EAB2A0] text-[#2D4356] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#EAB2A0]/20"
          >
            Find Nearby Spaces
          </button>
        </div>
      ) : loading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#EAB2A0] mb-4" />
          <p className="text-[10px] font-black text-[#EAB2A0] uppercase tracking-widest">Scanning Satellites...</p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="text-xs text-white/80 leading-relaxed max-h-40 overflow-y-auto custom-scrollbar pr-2 whitespace-pre-wrap">
            {data?.text}
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Verified Locations</p>
            {data?.sources.map((chunk, i) => (
              chunk.maps && (
                <a 
                  key={i} 
                  href={chunk.maps.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#EAB2A0]/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Library className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-[#EAB2A0]">{chunk.maps.title}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-[#EAB2A0]" />
                </a>
              )
            ))}
          </div>
          
          <button 
            onClick={() => setData(null)}
            className="w-full py-2 text-[10px] font-black text-[#EAB2A0] uppercase tracking-[0.2em] hover:text-white transition-colors"
          >
            Refresh Scout
          </button>
        </div>
      )}
    </GlassCard>
  );
};
