'use client';

import { useState, useEffect, useRef } from 'react';

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

  const TypewriterBlock = ({ text, delay = 0, className = "", cursorColor = "#FF3B3B" }: { text: string; delay?: number; className?: string; cursorColor?: string }) => {
    const [display, setDisplay] = useState(isExpanded ? text : '');
    const [isFinished, setIsFinished] = useState(isExpanded);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const idxRef = useRef(0);
    
    useEffect(() => {
      if (isExpanded) return;
      
      const startTypewriter = () => {
        const type = () => {
          if (idxRef.current < text.length) {
            idxRef.current++;
            setDisplay(text.slice(0, idxRef.current));
            
            // Natural acceleration: 30ms for first 20, 8ms thereafter
            const speed = idxRef.current <= 20 ? 30 : 8;
            timerRef.current = setTimeout(type, speed);
          } else {
            setIsFinished(true);
          }
        };
        type();
      };

      const delayTimer = setTimeout(startTypewriter, delay);
      
      return () => {
        clearTimeout(delayTimer);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [text, delay]);

    return (
      <div className={className}>
        {display}
        {!isFinished && (
          <span 
            className="inline-block w-[10px] h-[1.2em] translate-y-[0.2em] ml-1 animate-blink"
            style={{ backgroundColor: cursorColor }}
          />
        )}
      </div>
    );
  };

  if (isRoasted) {
    return (
      <div className={`space-y-6 ${!isExpanded ? 'animate-fade-up mt-12' : 'mt-4'}`}>
        <div className="neo-brutal-card bg-[#FF3B3B] p-8 border-3 border-black shadow-[6px_6px_0px_#000]">
          <h3 className="text-5xl font-bebas uppercase text-white tracking-widest">
            🔥 ROAST MODE ACTIVATED
          </h3>
        </div>
        
        <div className="relative font-mono text-base md:text-lg leading-relaxed font-bold bg-[#FF3B3B] text-white p-8 border-3 border-black shadow-[8px_8px_0px_#000]">
           <TypewriterBlock text={data.roastText} cursorColor="white" />
        </div>

        {data.exampleText && (
          <div className="bg-[#FFFFF0] border-3 border-black p-8 neo-brutal-card animate-fade-up">
            <h4 className="font-bebas text-3xl uppercase tracking-wider mb-4 flex items-center gap-3">
              <span className="text-3xl">💡</span> THE BRUTAL STANDARD
            </h4>
            <p className="font-mono text-[10px] text-black/50 font-black uppercase tracking-[0.2em] mb-4">Here's what a real idea looks like:</p>
            <TypewriterBlock 
                delay={isExpanded ? 0 : 1500} 
                text={data.exampleText} 
                className="font-mono text-base md:text-lg leading-relaxed text-black italic border-l-4 border-black pl-6" 
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${!isExpanded ? 'animate-fade-up mt-12' : 'mt-4'}`}>
      {/* Score Header */}
      <div className="neo-brutal-card bg-[#FFFFF0] p-10 relative overflow-visible">
        <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 bg-[#F5F500] text-black font-bebas text-7xl md:text-8xl border-4 border-black w-28 h-28 md:w-36 md:h-36 flex items-center justify-center rotate-6 shadow-[8px_8px_0px_#000] z-20">
          {data.score}
        </div>
        <h3 className="text-5xl font-bebas uppercase tracking-wider mb-4">🚀 Virality Analysis</h3>
        <div className="inline-block bg-black text-[#F5F500] px-3 py-1 font-mono text-xs font-black uppercase tracking-widest">
          Idea Quality Score / 100
        </div>
      </div>

      {/* Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.dimensions.map((dim, i) => (
          <div 
            key={dim.name} 
            className="bg-white border-3 border-black p-6 neo-brutal-card animate-fade-up"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
              <h4 className="font-bebas text-3xl uppercase tracking-wider">{dim.name}</h4>
              <span className="bg-black text-white px-3 py-1 font-mono text-sm font-black">{dim.score}/25</span>
            </div>
            <TypewriterBlock 
              text={dim.text} 
              delay={isExpanded ? 0 : i * 250 + 500} 
              className="font-mono text-sm md:text-base leading-relaxed text-black/80" 
            />
          </div>
        ))}
      </div>

      {/* Verdict Card */}
      <div className="bg-black text-white p-8 neo-brutal-card border-3 border-black shadow-[8px_8px_0px_#F5F500] animate-fade-up">
        <h4 className="font-bebas text-4xl uppercase tracking-widest mb-4 text-[#F5F500] italic">THE OFFICIAL VERDICT</h4>
        <TypewriterBlock 
          text={data.verdict} 
          delay={isExpanded ? 0 : 1500} 
          className="font-mono text-lg leading-relaxed font-bold border-l-4 border-[#F5F500] pl-6" 
          cursorColor="#F5F500"
        />
      </div>

      {/* Switches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#FF3B3B] text-white p-8 neo-brutal-card border-3 border-black shadow-[6px_6px_0px_#000] animate-fade-up">
          <h4 className="font-bebas text-3xl uppercase tracking-wider mb-4 border-b-2 border-white/20 pb-2">☠️ KILL SWITCH</h4>
          <TypewriterBlock 
            text={data.killSwitch} 
            delay={isExpanded ? 0 : 2000} 
            className="font-mono text-sm md:text-base leading-relaxed" 
            cursorColor="white"
          />
        </div>
        <div className="bg-[#00C853] text-black p-8 neo-brutal-card border-3 border-black shadow-[6px_6px_0px_#000] animate-fade-up">
          <h4 className="font-bebas text-3xl uppercase tracking-wider mb-4 border-b-2 border-black/10 pb-2">⚡ ROCKET FUEL</h4>
          <TypewriterBlock 
            text={data.rocketFuel} 
            delay={isExpanded ? 0 : 2000} 
            className="font-mono text-sm md:text-base leading-relaxed font-bold" 
            cursorColor="black"
          />
        </div>
      </div>
    </div>
  );
}
