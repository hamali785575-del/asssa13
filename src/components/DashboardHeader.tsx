'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  userEmail: string;
  usesRemaining: number;
}

export default function DashboardHeader({ userEmail, usesRemaining }: DashboardHeaderProps) {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const userName = userEmail.split('@')[0].toUpperCase();
  const totalDots = 4;

  return (
    <header className="w-full border-b-3 border-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="font-bebas text-3xl tracking-tight cursor-pointer" onClick={() => router.push('/')}>
          VIRAL<span className="text-[#FF3B3B]">?</span>
        </div>

        {/* Center: Greeting (Desktop only) */}
        <div className="hidden md:block font-mono text-xs font-black uppercase tracking-widest">
          WELCOME BACK, <span className="text-[#FF3B3B]">{userName}</span>
        </div>

        {/* Right: Quota & Sign Out */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* Dot Indicator */}
            <div className="flex gap-1.5">
              {[...Array(totalDots)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 border-2 border-black ${
                    i < usesRemaining ? 'bg-[#F5F500]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className={`font-mono text-[10px] font-black uppercase tracking-widest ${
              usesRemaining === 0 ? 'text-[#FF3B3B]' : 'text-black'
            }`}>
              {usesRemaining === 0 ? 'NO USES LEFT' : `${usesRemaining} USES REMAINING`}
            </span>
          </div>

          <button 
            onClick={handleSignOut}
            className="font-mono text-[10px] font-black uppercase tracking-widest bg-white border-2 border-black px-4 py-1.5 shadow-[2px_2px_0px_#000] hover:bg-black hover:text-[#F5F500] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all"
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </header>
  );
}
