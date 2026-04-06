'use client';

import React from 'react';

interface StickyAuthPromptProps {
  onOpenAuth: () => void;
  onClose: () => void;
}

const StickyAuthPrompt: React.FC<StickyAuthPromptProps> = ({ onOpenAuth, onClose }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[90] animate-slide-in-right">
      <div className="neo-brutal-card bg-[#F5F500] p-6 max-w-[320px] relative">
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-black w-7 h-7 flex items-center justify-center font-black border-2 border-black neo-brutal-btn hover:bg-[#FF3B3B] hover:text-white transition-colors text-xs"
        >
          ✕
        </button>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <span className="text-3xl">🗳️</span>
             <h4 className="font-bebas text-2xl uppercase leading-none mt-1">SAVED!</h4>
          </div>
          
          <p className="font-mono text-[11px] font-bold leading-relaxed uppercase tracking-wider text-black">
            Your first roast is ready. Sign up now to save it to your history and get 4 more shots!
          </p>
          
          <button 
            onClick={onOpenAuth}
            className="w-full bg-black text-white font-bebas text-xl py-2 px-4 neo-brutal-btn hover:bg-white hover:text-black transition-all uppercase tracking-widest"
          >
            Claim 4 more shots
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyAuthPrompt;
