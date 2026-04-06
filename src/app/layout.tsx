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
        className={`${spaceGrotesk.variable} ${dmMono.variable} ${bebasNeue.variable} antialiased min-h-screen bg-[#FFFFFF] text-black`}
      >
        {children}
      </body>
    </html>
  );
}
