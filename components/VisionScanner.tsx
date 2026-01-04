
import React, { useState, useRef } from 'react';
import { Camera, X, BookOpen } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { analyzeBookImage } from '../lib/gemini';
import { BookInfoDisplay } from './BookInfoDisplay';

export const VisionScanner: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setImage(reader.result as string);
      setIsAnalyzing(true);
      try {
        const data = await analyzeBookImage(base64);
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2D4356]/80 backdrop-blur-xl">
      <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar" hoverable={false}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Camera className="text-[#EAB2A0]" />
            <h2 className="text-2xl font-black">Vision Scan</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
            <X />
          </button>
        </div>

        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center cursor-pointer hover:border-[#EAB2A0]/50 hover:bg-white/5 transition-all group"
          >
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4 group-hover:text-[#EAB2A0] transition-colors" />
            <p className="text-white/60 mb-2">Upload a photo of a book cover or page</p>
            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Supports JPEG, PNG</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        ) : (
          <div className="space-y-6">
            <BookInfoDisplay result={result} image={image} isAnalyzing={isAnalyzing} />
            
            {!isAnalyzing && (
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="w-full py-4 rounded-2xl bg-[#EAB2A0] text-[#2D4356] font-black uppercase tracking-widest"
              >
                Scan Another Artifact
              </button>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
