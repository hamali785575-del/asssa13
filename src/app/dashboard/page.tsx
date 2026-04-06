'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import HistoryCard from '@/components/HistoryCard';
import ResultCard from '@/components/ResultCard';

export default function Dashboard() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; isRoasted: boolean } | null>(null);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState<any>(null);
  const [usesRemaining, setUsesRemaining] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
      
      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('uses_remaining')
        .eq('id', user.id)
        .single();
      
      const currentUses = profile?.uses_remaining ?? 0;
      setUsesRemaining(currentUses);

      // Fetch History
      const res = await fetch('/api/user/history');
      const histData = await res.json();
      const userHistory = histData.submissions || [];
      setHistory(userHistory);

      // Banner logic: 4 uses and no history = new user
      if (currentUses === 4 && userHistory.length === 0) {
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 4000);
      }

      setIsInitialLoad(false);
    };

    initDashboard();
  }, []);

  const wordCount = idea.trim().split(/\s+/).filter(Boolean).length;
  const isReady = wordCount >= 100;

  const handleSubmit = async () => {
    if (!isReady || loading || usesRemaining <= 0) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaText: idea, isAnon: false }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setResult({ text: data.response, isRoasted: data.isRoasted });
      setUsesRemaining(data.usesRemaining);
      
      // Refresh history to include the new one
      const histRes = await fetch('/api/user/history');
      const histData = await histRes.json();
      setHistory(histData.submissions || []);

      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      setError('Connection failed. Is the server roasting itself?');
    } finally {
      setLoading(false);
    }
  };

  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono uppercase tracking-widest text-xl animate-pulse">
        SYNCING INTELLIGENCE...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24">
      <DashboardHeader userEmail={user?.email || ''} usesRemaining={usesRemaining} />

      {/* Slide-down Banner */}
      <div className={`fixed top-20 left-0 w-full bg-black z-40 transition-transform duration-500 ease-in-out transform ${
        showBanner ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="py-2 text-center">
          <span className="font-bebas text-[#F5F500] text-3xl tracking-widest uppercase">
            YOU HAVE 4 SHOTS. MAKE THEM COUNT.
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Workspace Label */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-mono text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">
            SUBMIT YOUR IDEA
          </h2>
          <div className="h-[2px] w-full bg-black"></div>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white border-3 border-black p-6 md:p-8 neo-brutal-card shadow-[6px_6px_0px_#000] relative">
          <div className="flex justify-between items-center mb-4">
             <label className="font-mono text-xs font-black uppercase">YOUR IDEA:</label>
             <div className={`font-mono text-[10px] font-bold px-2 py-0.5 border-2 border-black ${
               wordCount >= 100 ? 'bg-[#00C853] text-black' : 
               wordCount >= 70 ? 'bg-[#FF8C00] text-black' : 
               'bg-[#F5F500] text-black'
             } shadow-[2px_2px_0px_#000]`}>
               {wordCount}/100 WORDS
             </div>
          </div>

          <textarea 
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your game-changing idea in detail (at least 100 words)..."
            className="w-full min-h-[220px] bg-[#FFFFF0] border-2 border-black p-4 font-mono text-sm focus:outline-none focus:border-[#FF3B3B] focus:shadow-[3px_3px_0px_#FF3B3B] transition-all"
          />

          {/* Progress Bar */}
          <div className="w-full h-4 bg-white border-2 border-black mt-4 overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-300 ${
                wordCount >= 100 ? 'bg-[#00C853]' : 
                wordCount >= 70 ? 'bg-[#FF8C00]' : 
                'bg-black'
              }`}
              style={{ width: `${Math.min((wordCount / 100) * 100, 100)}%` }}
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!isReady || loading || usesRemaining === 0}
            className="w-full mt-8 bg-[#F5F500] border-3 border-black py-4 font-bebas text-3xl tracking-wide shadow-[5px_5px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'ANALYZING...' : 'WILL IT GO VIRAL?'}
          </button>

          {usesRemaining === 0 && !loading && (
            <p className="font-mono text-[10px] font-black uppercase text-[#FF3B3B] text-center mt-4">
              YOU'VE USED ALL YOUR SHOTS. COME BACK TOMORROW.
            </p>
          )}

          {error && (
            <div className="mt-6 p-4 bg-[#FF3B3B] text-white border-2 border-black font-mono text-xs font-bold animate-verdict-in">
              {error.toUpperCase()}
            </div>
          )}

          {/* AI Response Area */}
          <div ref={resultRef}>
            {result && (
              <ResultCard text={result.text} isRoasted={result.isRoasted} />
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="my-20 h-[3px] bg-black w-full"></div>

        {/* History Panel */}
        <div className="mb-8">
           <div className="flex items-center gap-4 mb-8">
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">
              YOUR PREVIOUS IDEAS
            </h2>
            <div className="h-[2px] w-full bg-black"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.length > 0 ? (
              history.map((item) => (
                <HistoryCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full border-2 border-black border-dashed h-32 flex items-center justify-center font-mono text-xs text-gray-400 font-bold uppercase tracking-widest">
                YOUR FIRST IDEA WILL APPEAR HERE
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
