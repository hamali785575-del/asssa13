'use client';

import React from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  status: string;
  statusColor: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Solo Founder",
    content: "The AI called my pitch a 'fancy spreadsheet with delusions'. I quit my job the next day. Best advice I ever got.",
    status: "ROASTED",
    statusColor: "bg-[#FF3B3B]"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Product Designer",
    content: "I thought my landing page was 'clean'. The AI said it looks like a 'whiteboard in a blackout'. Changed everything.",
    status: "HONEST",
    statusColor: "bg-[#F5F500]"
  },
  {
    id: 3,
    name: "Marcus Thorne",
    role: "Indie Hacker",
    content: "12/100 score. It hurt, but it was real. RIP 'Blockchain for Plants' startup. Saved me months of work.",
    status: "SAVED",
    statusColor: "bg-[#00C853]"
  },
  {
    id: 4,
    name: "Elena Vance",
    role: "Grad Student",
    content: "Used my last free shot on a cat-sitter app. Got roasted into another dimension. 5 stars, would cry again.",
    status: "BRUTAL",
    statusColor: "bg-[#FF8C00]"
  },
  {
    id: 5,
    name: "Jameson Lee",
    role: "Serial Entrepreneur",
    content: "Finally, an AI that Doesn't lie to me for money. The truth is ugly, but this tool is beautiful.",
    status: "RECOGNIZED",
    statusColor: "bg-black text-white"
  },
  {
    id: 6,
    name: "Priya Shah",
    role: "SaaS Dev",
    content: "Got a 92/100. I'm now officially too afraid to actually build it and fail. Best validation tool ever.",
    status: "VIRAL",
    statusColor: "bg-[#F5F500]"
  }
];

const TestimonialSlider: React.FC = () => {
  // Duplicate testimonials for seamless marquee
  const allTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-24 border-t-4 border-black overflow-hidden bg-white">
      <div className="mb-16 px-6 text-center">
        <h2 className="font-bebas text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-black">
          WHAT THE <span className="text-[#FF3B3B]">ROASTED</span> ARE SAYING
        </h2>
        <p className="font-mono text-sm uppercase font-bold tracking-widest mt-4 opacity-70">
          • REAL FEEDBACK FROM REAL DREAMS •
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        {/* First Set */}
        <div className="flex animate-marquee py-4 whitespace-nowrap group-hover:[animation-play-state:paused]">
          {allTestimonials.map((t, idx) => (
            <div 
              key={`${t.id}-${idx}`}
              className="inline-block w-[350px] sm:w-[450px] mx-4 bg-white border-3 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 font-bebas text-xl border-2 border-black uppercase tracking-wider ${t.statusColor}`}>
                  {t.status}
                </div>
                <div className="flex gap-1 text-black text-xl">★★★★★</div>
              </div>

              <p className="font-space font-medium text-lg leading-relaxed whitespace-normal text-black mb-8 italic italic-quote">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black border-2 border-black flex items-center justify-center text-white font-bebas text-2xl">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bebas text-xl leading-none uppercase">{t.name}</h4>
                  <p className="font-mono text-[10px] uppercase font-bold opacity-50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .italic-quote {
          quotes: "“" "”" "‘" "’";
        }
      `}</style>
    </section>
  );
};

export default TestimonialSlider;
