'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AuthModalProps {
  message?: string;
  onClose: () => void;
}

export default function AuthModal({ message, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="neo-brutal-card bg-white p-8 w-full max-w-md relative animate-fade-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#FF3B3B] text-white w-9 h-9 flex items-center justify-center font-black border-3 border-black neo-brutal-btn hover:-translate-y-1 transition-transform z-10"
        >
          X
        </button>

        <h2 className="text-4xl font-bebas uppercase mb-3 leading-none tracking-tight">
          {isLogin ? 'Welcome Back' : 'Get More Shots'}
        </h2>
        
        {message && (
          <p className="bg-[#F5F500] p-3 border-2 border-black mb-6 font-mono font-bold text-[11px] uppercase tracking-wider">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[11px] font-black uppercase mb-1.5 tracking-widest text-[#888]">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-3 border-black p-3 focus:outline-none focus:ring-4 focus:ring-[#F5F500] font-mono text-sm bg-[#FFFFF0] transition-shadow placeholder:opacity-30"
              placeholder="you@viral.com"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] font-black uppercase mb-1.5 tracking-widest text-[#888]">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-3 border-black p-3 focus:outline-none focus:ring-4 focus:ring-[#F5F500] font-mono text-sm bg-[#FFFFF0] transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-white font-mono font-bold text-[10px] bg-[#FF3B3B] p-2 border-2 border-black uppercase tracking-wider">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#00C853] text-black font-bebas text-2xl uppercase py-3.5 neo-brutal-btn mt-2 disabled:bg-gray-300 disabled:shadow-[4px_4px_0px_#888]"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-black border-dashed"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black font-mono">
            <span className="bg-white px-4 text-black">Or use fast track</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-bebas text-2xl uppercase py-3 border-3 border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center font-mono font-bold text-[11px] uppercase tracking-wide text-gray-500">
          {isLogin ? "Don't have an account?" : "Already requested your roast?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="underline text-black hover:text-[#FF3B3B] transition-colors"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
