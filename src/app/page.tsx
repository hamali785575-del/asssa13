'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import StickyAuthPrompt from '@/components/StickyAuthPrompt';
import ResultCard from '@/components/ResultCard';

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

      // Scroll to result
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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full border-b-3 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-bebas text-3xl tracking-tight">
            VIRAL<span className="text-[#FF3B3B]">?</span>
          </div>
          <button 
            onClick={() => setShowAuthModal(true)}
            className="font-mono text-[10px] font-black uppercase tracking-widest bg-[#F5F500] border-2 border-black px-6 py-2 shadow-[3px_3px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all"
          >
            SIGN IN / UP
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-block bg-black text-white px-4 py-1 font-mono text-xs font-black rotate-[-2deg] mb-8 animate-fade-up">
           BETA ACCESS: NOW OPEN
        </div>
        <h1 className="text-6xl md:text-9xl font-bebas leading-[0.85] tracking-tight uppercase mb-12 animate-fade-up">
          WILL YOUR IDEA <br/>
          <span className="text-[#FF3B3B] inline-block hover:scale-110 transition-transform cursor-pointer">GO VIRAL?</span>
        </h1>
        <p className="max-w-2xl mx-auto font-mono text-lg md:text-xl font-bold leading-normal mb-16 animate-fade-up delay-100">
          The brutally honest AI startup validator. <br className="hidden md:block" />
          No sugar-coating. Just data, wit, and a 100-word reality check.
        </p>

        {/* The Main Tool */}
        <div id="validator" className="max-w-3xl mx-auto mt-20 text-left animate-fade-up delay-200">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">START YOUR ROAST</h2>
            <div className="h-[2px] w-full bg-black"></div>
          </div>

          <div className="bg-white border-3 border-black p-6 md:p-10 neo-brutal-card shadow-[8px_8px_0px_#000]">
            <div className="flex justify-between items-center mb-4">
               <label className="font-mono text-[10px] font-black uppercase tracking-widest text-gray-400">Describe your concept:</label>
               <div className={`font-mono text-[10px] font-black px-2 py-0.5 border-2 border-black ${
                 wordCount >= 100 ? 'bg-[#00C853]' : 
                 wordCount >= 70 ? 'bg-[#FF8C00]' : 
                 'bg-[#F5F500]'
               } shadow-[3px_3px_0px_#000]`}>
                 {wordCount}/100 WORDS
               </div>
            </div>

            <textarea 
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Enter your startup, content, or product idea here... Be detailed. The AI is hungry."
              className="w-full h-48 md:h-64 bg-[#FFFFF0] border-3 border-black p-6 font-mono text-base focus:outline-none focus:border-[#FF3B3B] focus:shadow-[4px_4px_0px_#FF3B3B] transition-all resize-none"
            />

            {/* Neo-Brutalist Progress Bar */}
            <div className="w-full h-6 border-3 border-black mt-6 relative overflow-hidden bg-white">
              <div 
                className={`h-full transition-all duration-300 ${
                  wordCount >= 100 ? 'bg-[#00C853]' : 
                  wordCount >= 70 ? 'bg-[#FF8C00]' : 
                  'bg-black'
                }`}
                style={{ width: `${Math.min((wordCount / 100) * 100, 100)}%` }}
              ></div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!isReady || loading}
              className="w-full mt-10 bg-[#F5F500] border-3 border-black py-5 font-bebas text-4xl tracking-wide shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'ANALYZING...' : 'FORCE THE VERDICT'}
            </button>

            {error && (
              <div className="mt-8 p-6 bg-[#FF3B3B] text-white border-3 border-black font-mono font-bold text-center animate-verdict-in">
                {error.toUpperCase()}
              </div>
            )}

            <div ref={resultRef}>
              {result && (
                <ResultCard text={result.text} isRoasted={result.isRoasted} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Social */}
      <footer className="w-full border-t-3 border-black bg-black py-20 text-[#F5F500] px-6 text-center">
        <div className="font-bebas text-6xl md:text-8xl mb-8">
           BUILD. <span className="text-white">ROAST.</span> REPEAT.
        </div>
        <p className="font-mono text-sm max-w-lg mx-auto opacity-80 mb-12">
          An experimental engine designed to separate visionaries from daydreamers. 
          Powered by brute force logic and elite-tier AI model llama-3.
        </p>
        <div className="font-mono text-[10px] font-black tracking-widest border-t border-white/20 pt-10">
          DESIGNED FOR THOSE WHO ACT. © 2024 VIRAL?
        </div>
      </footer>

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
