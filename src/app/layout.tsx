import type { Metadata } from 'next';
import { Space_Grotesk, DM_Mono, Bebas_Neue } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
});

const dmMono = DM_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Idea Validator | Will It Go Viral?',
  description: "Paste your idea. Get a brutal honest score. No BS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${dmMono.variable} ${bebasNeue.variable} antialiased min-h-screen bg-[#FFFFFF] text-black pt-0 pb-0 px-0`}
      >
        <header className="fixed top-0 left-0 w-full bg-white z-50 animate-slide-down border-b-3 border-black">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-medium font-mono uppercase tracking-widest text-[#000000]">
              Made by <span className="text-[#FF3B3B] font-bold">Hammad Zaheer</span>
            </h2>
            
            <div className="bg-[#F5F500] border-2 border-black px-3 py-1 neo-brutal-btn -rotate-1 hidden sm:block">
              <span className="font-mono text-[10px] font-black uppercase text-black">
                AI Idea Validator · Free
              </span>
            </div>
          </div>
        </header>

        <div className="pt-20 pb-16">
          {children}
        </div>

        <footer className="w-full bg-[#000000] border-t-3 border-black text-white py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
            <h3 className="font-mono uppercase text-[#F5F500] text-sm font-bold tracking-widest">
              Made by Hammad Zaheer
            </h3>
            <p className="font-mono text-xs text-[#888888] font-medium tracking-wide uppercase">
              Built with Proprietary AI + Supabase
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
