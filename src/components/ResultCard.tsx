'use client';

import { useState, useEffect } from 'react';

interface ResultCardProps {
  text: string;
  isRoasted: boolean;
  isExpanded?: boolean;
}

export default function ResultCard({ text, isRoasted, isExpanded = false }: ResultCardProps) {
  const parseAIResponse = (raw: string) => {
    const scoreMatch = raw.match(/SCORE:\s*(\d+)/i) || raw.match(/(\d+)\s*\/\s*100/);
    const score = scoreMatch ? scoreMatch[1] : '?';

    const getDimension = (dim: string) => {
      const regex = new RegExp(`${dim}\\s*\\[?(\\d+)\/25\\]?:?\\s*([\\s\\S]*?)(?=(?:NOVELTY|RELATABILITY|SHAREABILITY|TIMING|VERDICT|☠️ KILL SWITCH|⚡ ROCKET FUEL|$))`, 'i');
      const match = raw.match(regex);
      return {
        name: dim,
        score: match ? match[1] : '0',
        text: match ? match[2].trim() : 'Analyzing...'
      };
    };

    const dimensions = [
      getDimension('NOVELTY'),
      getDimension('RELATABILITY'),
      getDimension('SHAREABILITY'),
      getDimension('TIMING')
    ];

    const verdictMatch = raw.match(/VERDICT:\s*([\s\S]*?)(?=(?:☠️ KILL SWITCH|⚡ ROCKET FUEL|$))/i);
    const verdict = verdictMatch ? verdictMatch[1].trim() : '';

    const killMatch = raw.match(/☠️ KILL SWITCH:\s*([\s\S]*?)(?=(?:⚡ ROCKET FUEL|$))/i);
    const killSwitch = killMatch ? killMatch[1].trim() : '';

    const rocketMatch = raw.match(/⚡ ROCKET FUEL:\s*([\s\S]*)$/i);
    const rocketFuel = rocketMatch ? rocketMatch[1].trim() : '';

    const roastMatch = raw.match(/ROAST MODE ACTIVATED\s*([\s\S]*?)(?=(?:💡|$))/i);
    const roastText = roastMatch ? roastMatch[1].trim() : raw;
    const exampleMatch = raw.match(/💡 (?:Here's what a real idea looks like:)?\s*([\s\S]*)$/i);
    const exampleText = exampleMatch ? exampleMatch[1].trim() : '';

    return { score, dimensions, verdict, killSwitch, rocketFuel, roastText, exampleText };
  };

  const data = parseAIResponse(text);

  const TypewriterBlock = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
    const [display, setDisplay] = useState(isExpanded ? text : '');
    
    useEffect(() => {
      if (isExpanded) return; // No typewriter on already-expanded history
      let idx = 0;
      let iv: ReturnType<typeof setInterval> | null = null;
      const t = setTimeout(() => {
        iv = setInterval(() => {
          if (idx < text.length) {
            idx++;
            setDisplay(text.slice(0, idx));
          } else {
            if (iv) clearInterval(iv);
          }
        }, 10);
      }, delay);
      return () => {
        clearTimeout(t);
        if (iv) clearInterval(iv);
      };
    }, [text, delay]);

    return <p className={className}>{display}</p>;
  };

  if (isRoasted) {
    return (
      <div className={`space-y-6 ${!isExpanded ? 'animate-fade-up mt-12' : 'mt-4'}`}>
        <div className="neo-brutal-card bg-[#FF3B3B] p-8 relative">
          <h3 className="text-4xl font-bebas uppercase text-white drop-shadow-[3px_3px_0px_#000] tracking-wider">
            🔥 ROAST MODE ACTIVATED
          </h3>
        </div>
        
        <div className="relative font-mono text-sm leading-relaxed font-bold bg-black text-white p-8 neo-brutal-card border-3 border-black shadow-[4px_4px_0px_#FF3B3B]">
           <TypewriterBlock text={data.roastText} />
        </div>

        {data.exampleText && (
          <div className="bg-[#FFFFF0] border-3 border-black p-6 neo-brutal-card shadow-[4px_4px_0px_#000] animate-fade-up">
            <h4 className="font-bebas text-2xl uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="text-2xl">💡</span> THE BRUTAL STANDARD
            </h4>
            <p className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Here's what a real idea looks like:</p>
            <TypewriterBlock delay={isExpanded ? 0 : 1500} text={data.exampleText} className="font-mono text-sm leading-relaxed text-black italic border-l-4 border-black pl-4" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${!isExpanded ? 'animate-fade-up mt-12' : 'mt-4'}`}>
      <div className="neo-brutal-card bg-[#FFFFF0] p-8 relative">
        <div className="absolute top-4 right-4 bg-[#F5F500] text-black font-bebas text-6xl border-3 border-black w-24 h-24 flex items-center justify-center rounded-sm rotate-6 shadow-[6px_6px_0px_#000] z-10">
          {data.score}
        </div>
        <h3 className="text-4xl font-bebas uppercase tracking-wider mb-2">🚀 Virality Analysis</h3>
        <p className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-widest">Idea Quality Score / 100</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.dimensions.map((dim, i) => (
          <div 
            key={dim.name} 
            className="bg-white border-3 border-black p-4 neo-brutal-card shadow-[3px_3px_0px_#000] animate-fade-up"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bebas text-2xl uppercase tracking-wider">{dim.name}</h4>
              <span className="bg-black text-white px-2 py-0.5 font-mono text-xs font-black">{dim.score}/25</span>
            </div>
            <TypewriterBlock 
              text={dim.text} 
              delay={isExpanded ? 0 : i * 200 + 400} 
              className="font-mono text-[13px] leading-relaxed text-black" 
            />
          </div>
        ))}
      </div>

      <div className="bg-black text-white p-6 neo-brutal-card border-3 border-black shadow-[3px_3px_0px_#000] animate-fade-up">
        <h4 className="font-bebas text-3xl uppercase tracking-wider mb-3 text-[#F5F500]">VERDICT</h4>
        <TypewriterBlock 
          text={data.verdict} 
          delay={isExpanded ? 0 : 1200} 
          className="font-mono text-[14px] leading-relaxed font-bold" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FF3B3B] text-white p-6 neo-brutal-card border-3 border-black shadow-[3px_3px_0px_#000] animate-fade-up">
          <h4 className="font-bebas text-2xl uppercase tracking-wider mb-3">☠️ KILL SWITCH</h4>
          <TypewriterBlock 
            text={data.killSwitch} 
            delay={isExpanded ? 0 : 1600} 
            className="font-mono text-[13px] leading-relaxed" 
          />
        </div>
        <div className="bg-[#00C853] text-black p-6 neo-brutal-card border-3 border-black shadow-[3px_3px_0px_#000] animate-fade-up">
          <h4 className="font-bebas text-2xl uppercase tracking-wider mb-3">⚡ ROCKET FUEL</h4>
          <TypewriterBlock 
            text={data.rocketFuel} 
            delay={isExpanded ? 0 : 1600} 
            className="font-mono text-[13px] leading-relaxed" 
          />
        </div>
      </div>
    </div>
  );
}
