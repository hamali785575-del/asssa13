'use client';

import { useState } from 'react';
import ResultCard from './ResultCard';

interface HistoryCardProps {
  item: {
    id: string;
    idea_text: string;
    ai_response: string;
    virality_score: number;
    is_roasted: boolean;
    created_at: string;
  };
}

export default function HistoryCard({ item }: HistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedText = item.idea_text.length > 60 
    ? item.idea_text.substring(0, 60) + '...' 
    : item.idea_text;

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'bg-[#F5F500] text-black';
    if (score < 40) return 'bg-[#FF3B3B] text-white';
    return 'bg-white text-black';
  };

  const getVerdict = (score: number, isRoasted: boolean) => {
    if (isRoasted) return 'ROASTED';
    if (score >= 60) return 'VIRAL';
    if (score < 40) return 'FLOP';
    return 'MEH';
  };

  const dateStr = new Date(item.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      className={`bg-white border-2 border-black p-4 neo-brutal-card shadow-[3px_3px_0px_#000] cursor-pointer transition-all ${
        isExpanded ? 'scale-[1.01]' : 'hover:-translate-y-1'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Compact View */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full md:w-auto">
          <p className="font-mono text-[12px] font-bold text-gray-400 line-clamp-1 uppercase italic">
            {truncatedText}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Score Badge */}
          <div className={`font-bebas text-2xl px-3 py-0.5 border-2 border-black min-w-[50px] text-center shadow-[2px_2px_0px_#000] ${getScoreColor(item.virality_score)}`}>
            {item.virality_score}
          </div>

          {/* Verdict Tag */}
          <div className="font-mono text-[10px] font-black uppercase tracking-tighter bg-black text-white px-2 py-1">
            {getVerdict(item.virality_score, item.is_roasted)}
          </div>

          <div className="font-mono text-[10px] text-gray-400 font-bold hidden sm:block">
            {dateStr}
          </div>
        </div>
      </div>

      {/* Expanded View */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-[2000px] opacity-100 mt-6 pt-6 border-t-2 border-black border-dashed' : 'max-h-0 opacity-0'
      }`}>
        {isExpanded && (
          <div className="animate-fade-in">
             <div className="mb-6">
                <h4 className="font-bebas text-xl uppercase mb-2">Original Idea:</h4>
                <p className="font-mono text-sm leading-relaxed border-l-3 border-black pl-4 py-2 bg-[#FFFFF0]">
                  {item.idea_text}
                </p>
             </div>
             <ResultCard text={item.ai_response} isRoasted={item.is_roasted} isExpanded={true} />
          </div>
        )}
      </div>
      
      {/* Date for Mobile */}
      <div className="font-mono text-[9px] text-gray-400 font-bold mt-4 md:hidden text-right">
        {dateStr}
      </div>
    </div>
  );
}
