'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import StickyAuthPrompt from '@/components/StickyAuthPrompt';
import ResultCard from '@/components/ResultCard';
import FAQSection from '@/components/FAQSection';
import TestimonialSlider from '@/components/TestimonialSlider';
import RecentVerdictsFeed from '@/components/RecentVerdictsFeed';

const TypewriterHeadline = () => {
  const words = ["VIRAL?", "FLOP?", "FAMOUS?"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [pause, setPause] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (pause) return;

    if (subIndex === words[index].length + 1 && !reverse) {
      setPause(true);
      setTimeout(() => {
        setPause(false);
        setReverse(true);
      }, 1800);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setPause(true);
      setTimeout(() => {
        setPause(false);
        setIndex((prev) => (prev + 1) % words.length);
      }, 300);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 60 : 110);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, pause]);

  return (
    <span className="relative inline-flex items-center">
      {words[index].substring(0, subIndex)}
      <span className="inline-block w-[12px] h-[0.85em] bg-[#FF3B3B] ml-1 animate-blink"></span>
    </span>
  );
};

export default function Home() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; isRoasted: boolean } | null>(null);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [showStickyAuth, setShowStickyAuth] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);

  // ... (keeping existing useEffect and handleSubmit logic)
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        router.push('/dashboard');
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        router.push('/dashboard');
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [router]);

  const getFingerprint = () => {
    let fp = localStorage.getItem('anon_fingerprint');
    if (!fp) {
      fp = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('anon_fingerprint', fp);
    }
    return fp;
  };

  const wordCount = idea.trim().split(/\s+/).filter(Boolean).length;
  const isReady = wordCount >= 100;

  const handleSubmit = async () => {
    if (!isReady || loading) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const fp = getFingerprint();

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaText: idea, isAnon: true, fingerprint: fp }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'FREE_USED' || res.status === 403) {
          setAuthMessage("YOU'VE USED YOUR FREE SHOT. SIGN UP FOR 4 MORE.");
          setShowStickyAuth(false);
          setShowAuthModal(true);
        } else {
          setError(data.error || 'Something went wrong.');
        }
        return;
      }

      setResult({ text: data.response, isRoasted: data.isRoasted });
      setShowStickyAuth(true);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      setError('Connection failed. Even the server can\'t handle this idea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white selection:bg-[#F5F500]">
      {/* Header - Stays fixed behind content is not correct, it slides in */}
      <header className="w-full border-b-3 border-black bg-white sticky top-0 z-50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-mono text-sm md:text-base font-black uppercase tracking-widest cursor-default">
            MADE BY <span className="text-[#FF3B3B]">HAMMAD ZAHEER</span>
          </div>
          <div 
            onClick={() => {
              setShowAuthModal(true);
              setAuthMessage("SIGN IN TO START VALIDATING FOR FREE");
            }}
            className="flex items-center cursor-pointer group"
          >
            <div className="bg-black border-2 border-black px-4 py-2 shadow-[4px_4px_0px_#F5F500] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#F5F500] transition-all">
               <span className="font-mono text-[10px] md:text-xs font-black uppercase tracking-widest text-[#F5F500]">
                 AI Idea Validator <span className="mx-1">·</span> Free
               </span>
            </div>
          </div>
        </div>
      </header>

      <section className="relative w-full pt-6 md:pt-12 pb-10 md:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Content */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            {/* Eyebrow Label */}
            <div className="inline-block relative mb-6 animate-fade-up [animation-delay:0.3s]">
              <div className="bg-[#FF3B3B] text-white px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] border-3 border-black relative z-10 shadow-[5px_5px_0px_#000]">
                BRUTALLY HONEST AI
              </div>
            </div>

            {/* Main Headline - Fluid Size */}
            <h1 className="font-bebas leading-[0.85] tracking-tight uppercase mb-8 animate-fade-up [animation-delay:0.4s] text-[clamp(48px,8vw,80px)] max-w-5xl">
              <span className="block mb-4">WILL YOUR IDEA</span>
              <div className="flex items-center justify-start flex-wrap gap-x-6">
                <div className="relative inline-block">
                  <div className="bg-black text-white px-6 py-2 relative z-10 border-3 border-black">
                    GO
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-full h-full bg-[#F5F500] border-3 border-black -z-10"></div>
                </div>
                <TypewriterHeadline />
              </div>
            </h1>

            {/* Subheading */}
            <div className="animate-fade-up [animation-delay:0.55s] max-w-xl text-left mb-10">
              <p className="font-space text-lg md:text-xl font-medium leading-tight border-l-4 border-[#FF3B3B] pl-4 md:pl-6 py-2 text-left bg-white/50 inline-block">
                Stop asking your mom. Our Proprietary High-Performance AI will tell you if your idea slaps or flops.
              </p>
            </div>

            {/* CTA Button Row */}
            <div className="flex flex-col items-start gap-6 animate-fade-up [animation-delay:0.65s]">
              <button 
                onClick={() => {
                  document.getElementById('validator-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="neo-brutal-btn bg-[#F5F500] px-10 py-5 font-bebas text-2xl md:text-3xl tracking-wide group"
              >
                TRY IT FREE
              </button>
              <div className="animate-bounce-y">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
                  <path d="M12 4V20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Live Feed */}
          <div className="hidden lg:block lg:col-span-5 lg:pl-8">
            <RecentVerdictsFeed />
          </div>
        </div>
      </section>

          {/* Scrolling Marquee Strip */}
      <div className="w-full bg-black border-y-3 border-black py-4 overflow-hidden whitespace-nowrap relative z-10">
        <div className="flex animate-marquee">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center shrink-0">
              {["WILL IT GO VIRAL", "ROAST MY IDEA", "BRUTALLY HONEST", "NO SUGAR COATING", "MADE BY HAMMAD ZAHEER", "GROQ POWERED"].map((text, idx) => (
                <div key={idx} className="flex items-center mx-4">
                  <span className="font-bebas text-2xl md:text-3xl text-[#F5F500] tracking-wider">{text}</span>
                  <span className="mx-6 text-[#FF3B3B] text-2xl">♦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Validator Section */}
      <section id="validator-section" className="py-24 md:py-32 bg-white relative">
        <div className="max-w-4xl mx-auto px-6">
          <div id="validator" className="animate-fade-up [animation-delay:0.9s]">
            <div className="bg-white neo-brutal-card relative overflow-hidden">
              {/* Tool Header */}
              <div className="border-b-3 border-black p-4 flex flex-wrap justify-between items-center bg-[#F5F5F5]">
                <label className="font-mono text-xs font-black uppercase tracking-widest text-black">ENTER YOUR IDEA BELOW:</label>
                <div className={`font-mono text-[10px] md:text-xs font-black px-4 py-1.5 border-2 border-black transition-colors duration-300 ${
                  wordCount >= 100 ? 'bg-[#00C853] text-black' : 
                  wordCount >= 70 ? 'bg-[#FF8C00] text-black' : 
                  'bg-black text-[#F5F500]'
                }`}>
                  {wordCount} / 100 WORDS MIN
                </div>
              </div>

              <div className="p-6 md:p-8 bg-[#FFFFF0]">
                <div className="relative mb-4">
                  <textarea 
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your project, product, or half-baked scheme..."
                    className="w-full h-72 md:h-96 bg-transparent border-3 border-black p-6 md:p-8 font-mono text-lg md:text-xl focus:outline-none focus:border-[#FF3B3B] transition-all resize-none placeholder:text-black/30"
                  />
                  
                  {/* Progress Bar Container */}
                  <div className="absolute left-0 right-0 -bottom-1 h-1 bg-black/10 mx-[3px] mb-[3px] border-[0.5px] border-black overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ease-out ${
                        wordCount >= 100 ? 'bg-[#00C853]' : 
                        wordCount >= 70 ? 'bg-[#FF8C00]' : 
                        'bg-black'
                      }`}
                      style={{ width: `${Math.min((wordCount / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={!isReady || loading}
                  className="w-full neo-brutal-btn bg-[#F5F500] py-6 mb-6 group disabled:bg-[#e0e0e0]"
                >
                  <span className="font-bebas text-3xl md:text-4xl tracking-wide">
                    {loading ? 'CRUNCHING DATA...' : 'VALIDATE MY IDEA'}
                  </span>
                </button>

                {/* Use Counter */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#F5F5F5] border-2 border-black">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((dot) => (
                      <div 
                        key={dot}
                        className={`w-[14px] h-[14px] border-2 border-black ${dot === 1 ? 'bg-[#F5F500]' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] md:text-xs font-black uppercase text-black/60">
                    1 FREE USE REMAINING — SIGN UP FOR 4 MORE
                  </span>
                </div>

                {error && (
                  <div className="mt-8 p-6 bg-[#FF3B3B] text-white border-3 border-black font-mono font-bold text-center shadow-[6px_6px_0px_#000] animate-fade-up">
                    {error.toUpperCase()}
                  </div>
                )}

                <div ref={resultRef} className="mt-12">
                  {result && (
                    <ResultCard text={result.text} isRoasted={result.isRoasted} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step Cards Section */}
      <section className="w-full bg-white border-y-3 border-black">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            { num: "01", label: "PITCH", title: "Submit Your Idea", sub: "100 words minimum" },
            { num: "02", label: "PROCESS", title: "AI Stress Test", sub: "Groq-Powered Analysis" },
            { num: "03", label: "RESULTS", title: "Brutal Verdict", sub: "Score or Roast" }
          ].map((step, idx) => (
            <div 
              key={idx} 
              className={`relative p-12 overflow-hidden group animate-fade-up border-b-3 md:border-b-0 md:border-r-3 border-black last:border-r-0`}
              style={{ animationDelay: `${1.0 + idx * 0.1}s` }}
            >
              {/* Hover Fill Sweep */}
              <div className="absolute inset-0 bg-[#F5F500] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out -z-10" />
              
              <div className="relative z-10">
                <div className="font-bebas text-5xl md:text-6xl mb-4">{step.num}</div>
                <div className="font-mono text-[10px] text-black/50 font-black uppercase tracking-widest mb-2">{step.label}</div>
                <div className="font-space text-lg md:text-xl font-bold uppercase">{step.title}</div>
                <div className="font-mono text-xs text-black/40 mt-2">{step.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ & Testimonials */}
      <TestimonialSlider />
      <FAQSection />

      {/* Footer */}
      <footer className="w-full bg-black border-t-3 border-black py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-mono text-sm md:text-base font-black uppercase text-[#F5F500] tracking-widest">
            MADE BY HAMMAD ZAHEER
          </div>
          <div className="font-mono text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
            BUILT WITH GROQ + SUPABASE
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal 
          message={authMessage} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}

      {showStickyAuth && !user && (
        <StickyAuthPrompt 
          onOpenAuth={() => {
            setShowStickyAuth(false);
            setShowAuthModal(true);
          }}
          onClose={() => setShowStickyAuth(false)}
        />
      )}
    </main>
  );
}
