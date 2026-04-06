'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface VerdictEntry {
  id: number;
  text: string;
  score: number;
}

const VERDICT_POOL: VerdictEntry[] = [
  { id: 1, text: "Ghost Airbnb for attics...", score: 74 },
  { id: 2, text: "AI lawyer for parking...", score: 88 },
  { id: 3, text: "Uber but for librarians...", score: 31 },
  { id: 4, text: "LinkedIn but anonymous...", score: 61 },
  { id: 5, text: "App to rate your exes...", score: 92 },
  { id: 6, text: "Blockchain for pets...", score: 11 },
  { id: 7, text: "Netflix for homework...", score: 57 },
  { id: 8, text: "Dating app for introverts...", score: 83 },
  { id: 9, text: "Crypto gym membership...", score: 22 },
  { id: 10, text: "AI therapist for founders...", score: 79 },
];

const RecentVerdictsFeed: React.FC = () => {
  // We keep track of the pool index that will be next to enter the visible list
  const [poolStartIndex, setPoolStartIndex] = useState(0);
  // Current visible items (4 items)
  const [visibleItems, setVisibleItems] = useState<VerdictEntry[]>([]);
  const [isMounting, setIsMounting] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [enteringId, setEnteringId] = useState<number | null>(null);

  // Initial load
  useEffect(() => {
    // Take first 4 from pool
    setVisibleItems(VERDICT_POOL.slice(0, 4));
    setPoolStartIndex(4);
    
    // Clear mounting state after all staggered initial animations finish
    const timer = setTimeout(() => setIsMounting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Cycling logic
  useEffect(() => {
    if (isMounting) return;

    const interval = setInterval(() => {
      setIsRotating(true);
      
      // Phase 1: Top item starts animating out (300ms)
      setTimeout(() => {
        const nextItem = VERDICT_POOL[poolStartIndex % VERDICT_POOL.length];
        
        setVisibleItems(prev => {
          const newItems = [...prev.slice(1), nextItem];
          return newItems;
        });
        
        setEnteringId(nextItem.id);
        setPoolStartIndex(prev => (prev + 1) % VERDICT_POOL.length);
        setIsRotating(false);

        // Phase 2: After new item is added, let it animate in
        setTimeout(() => {
          setEnteringId(null);
        }, 300);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, [isMounting, poolStartIndex]);

  const getVerdictData = (score: number) => {
    if (score > 60) return { label: '🚀 VIRAL', color: 'text-[#00C853]' };
    if (score < 40) return { label: '☠️ FLOP', color: 'text-[#FF3B3B]' };
    return { label: '⚠️ MEH', color: 'text-[#FF8C00]' };
  };

  const getScoreStyles = (score: number) => {
    if (score > 60) return "bg-[#F5F500] text-black";
    if (score < 40) return "bg-[#FF3B3B] text-white";
    return "bg-white text-black border-2 border-black";
  };

  return (
    <div className="hidden md:flex flex-col w-full max-w-[420px] animate-fade-up">
      {/* Live Label */}
      <div className="flex items-center gap-3 mb-6 ml-1">
        <div className="w-2.5 h-2.5 bg-[#FF3B3B] rounded-full animate-blink" />
        <span className="font-mono text-xs font-black tracking-[0.2em] text-black">
          RECENT VERDICTS
        </span>
      </div>

      {/* Cards Stack */}
      <div className="flex flex-col gap-4 relative overflow-visible">
        {visibleItems.map((item, idx) => {
          const { label, color } = getVerdictData(item.score);
          const scoreStyle = getScoreStyles(item.score);
          
          // Animation state logic
          const isTopExiting = isRotating && idx === 0;
          const isBottomEntering = item.id === enteringId;

          return (
            <div
              key={item.id}
              className={`
                bg-white border-3 border-black p-4 flex items-center justify-between gap-4 transition-all duration-300
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                ${isTopExiting ? 'animate-verdict-out opacity-0' : ''}
                ${isBottomEntering ? 'animate-verdict-in' : ''}
                ${isMounting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
              `}
              style={{
                animationDelay: isMounting ? `${0.8 + idx * 0.15}s` : '0s',
                animationFillMode: 'forwards'
              }}
            >
              {/* Idea Snippet */}
              <span className="font-mono text-[12px] text-[#666666] flex-1 truncate max-w-[150px] md:max-w-[180px]">
                {item.text}
              </span>

              {/* Score Badge */}
              <div className={`w-12 h-10 flex items-center justify-center font-bebas text-2xl border-2 border-black shrink-0 ${scoreStyle}`}>
                {item.score}
              </div>

              {/* Verdict Label */}
              <div className={`font-mono text-[10px] font-black w-14 text-right shrink-0 ${color}`}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentVerdictsFeed;
