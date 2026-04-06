'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface VerdictEntry {
  id: number;
  text: string;
  score: number;
}

const VERDIT_POOL: VerdictEntry[] = [
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
  const [startIndex, setStartIndex] = useState(0);
  const [exitingId, setExitingId] = useState<number | null>(null);

  // Derive the 4 visible items from the current startIndex
  const items = React.useMemo(() => {
    return [0, 1, 2, 3].map(offset => {
      const index = (startIndex + offset) % VERDIT_POOL.length;
      return VERDIT_POOL[index];
    });
  }, [startIndex]);

  const rotateItems = useCallback(() => {
    // 1. Mark the current top item as exiting
    setExitingId(items[0].id);

    // 2. After slide-out animation (300ms), shift the index
    setTimeout(() => {
      setStartIndex(prev => (prev + 1) % VERDIT_POOL.length);
      setExitingId(null);
    }, 300);
  }, [items]);

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
    const timer = setInterval(() => {
      rotateItems();
    }, 3000);
    return () => clearInterval(timer);
  }, [rotateItems]);

  const getVerdictLabel = (score: number) => {
    if (score > 60) return { label: '🚀 VIRAL', color: 'text-[#00C853]' };
    if (score < 40) return { label: '☠️ FLOP', color: 'text-[#FF3B3B]' };
    return { label: '⚠️ MEH', color: 'text-[#FF8C00]' };
  };

  const getScoreBadgeStyles = (score: number) => {
    if (score > 60) return "bg-[#F5F500] text-black border-2 border-black";
    if (score < 40) return "bg-[#FF3B3B] text-white border-2 border-black";
    return "bg-white text-black border-2 border-black";
  };

  return (
    <div className="hidden lg:flex flex-col items-center lg:items-end justify-center w-full h-full lg:pl-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
      <div className="w-full max-w-[400px]">
        {/* Label */}
        <div className="flex items-center gap-2 mb-6 ml-1">
          <div className="w-2.5 h-2.5 bg-[#FF3B3B] rounded-full animate-pulse shadow-[0_0_8px_#FF3B3B]" />
          <span className="font-mono text-xs font-black tracking-[0.2em] uppercase text-black">
            RECENT VERDICTS
          </span>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4 min-h-[360px]">
          {items.map((item, index) => {
            const isExiting = exitingId === item.id;
            const isEntering = index === 3 && !exitingId; // Newest at bottom
            const verdict = getVerdictLabel(item.score);
            
            return (
              <div
                key={item.id}
                className={`
                  bg-white border-3 border-black p-4 flex items-center justify-between gap-4 transition-all duration-300
                  hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  ${isExiting ? 'animate-verdict-out pointer-events-none' : ''}
                  ${isEntering ? 'animate-verdict-in' : ''}
                  ${!hasLoaded ? 'opacity-0 translate-y-4' : ''}
                `}
                style={{
                  // Only apply staggered delay on the very first render of the whole component
                  animationDelay: !hasLoaded ? `${0.8 + index * 0.15}s` : '0ms'
                }}
              >
                {/* Truncated Text */}
                <span className="font-mono text-xs text-[#666666] flex-1 truncate max-w-[180px]">
                  {item.text}
                </span>

                {/* Score Badge */}
                <div className={`w-12 h-10 flex items-center justify-center font-bebas text-2xl ${getScoreBadgeStyles(item.score)}`}>
                  {item.score}
                </div>

                {/* Verdict Tag */}
                <span className={`font-mono text-[10px] font-black w-14 text-right ${verdict.color}`}>
                  {verdict.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentVerdictsFeed;
