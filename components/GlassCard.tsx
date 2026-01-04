
import React from 'react';
import { GLASS_CLASSES } from '../constants';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  hoverable?: boolean;
  /* Added 'peach' to allow matching the Library Scout's warm color palette */
  accent?: 'aqua' | 'sage' | 'peach' | 'none';
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  title, 
  subtitle,
  hoverable = true,
  accent = 'none',
  noPadding = false
}) => {
  /* Added peach styling configuration using the specific hex used in components */
  const accentClasses = {
    aqua: 'border-[#2E8A99]/30 shadow-[0_0_20px_rgba(46,138,153,0.1)]',
    sage: 'border-[#84A7A1]/30 shadow-[0_0_20px_rgba(132,167,161,0.1)]',
    peach: 'border-[#EAB2A0]/30 shadow-[0_0_20px_rgba(234,178,160,0.1)]',
    none: 'border-white/10'
  };

  return (
    <div className={`
      ${GLASS_CLASSES} 
      ${noPadding ? 'p-0' : 'p-6'} 
      relative 
      overflow-hidden
      group
      ${hoverable ? 'hover:bg-white/5 hover:scale-[1.01] hover:shadow-2xl' : ''} 
      ${accentClasses[accent] || accentClasses.none}
      ${className}
    `}>
      {/* Inner reflection effect */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {(title || subtitle) && (
        <div className="mb-6 relative z-10 px-6 pt-6">
          {title && <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>}
          {subtitle && <p className="text-[10px] font-black text-[#84A7A1] uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={`relative z-10 h-full flex flex-col`}>
        {children}
      </div>
    </div>
  );
};
