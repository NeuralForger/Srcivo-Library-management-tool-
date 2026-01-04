
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { startLibrarianChat } from '../lib/gemini';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = startLibrarianChat();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text || '' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Neural bridge connection failed. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-[#2E8A99] text-white flex items-center justify-center shadow-2xl shadow-[#2E8A99]/40 hover:scale-110 active:scale-95 transition-all group"
        >
          <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        </button>
      ) : (
        <GlassCard 
          className="w-[380px] md:w-[450px] h-[600px] max-h-[85vh] flex flex-col overflow-hidden border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] bg-[#0E2954]/95" 
          hoverable={false}
          noPadding={true}
        >
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#1F6E8C]/40 backdrop-blur-2xl shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-[#2E8A99] flex items-center justify-center shadow-lg shadow-[#2E8A99]/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-[#0E2954]" />
              </div>
              <div>
                <p className="text-sm font-black text-white tracking-wide">Neural Guide</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <p className="text-[9px] text-[#2E8A99] font-black uppercase tracking-[0.1em]">Core Online</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-white/30 hover:text-white transition-all"><X className="w-5 h-5" /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-20 py-20">
                <Sparkles className="w-12 h-12 text-[#2E8A99] mb-4" />
                <h4 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Neural Interface Sync</h4>
                <p className="text-[10px] text-white/60 leading-relaxed font-black uppercase tracking-[0.2em]">Ready to analyze literary trends and research sectors.</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end pl-12' : 'justify-start pr-12'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`relative px-5 py-4 rounded-2xl text-sm leading-relaxed font-medium ${
                  msg.role === 'user' 
                    ? 'bg-[#2E8A99] text-white shadow-xl shadow-[#2E8A99]/10 rounded-tr-none' 
                    : 'glass-base border border-white/5 text-white/90 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="glass-base border border-white/5 px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2E8A99] animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2E8A99] animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2E8A99] animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-[#1F6E8C]/20 border-t border-white/5 shrink-0">
            <div className="flex gap-3 items-center">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query the sector..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#2E8A99]/50 transition-all font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 rounded-2xl bg-[#2E8A99] text-white flex items-center justify-center disabled:opacity-30 transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
