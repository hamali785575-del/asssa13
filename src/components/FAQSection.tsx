'use client';

import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How 'High IQ' is this AI actually?",
    answer: "We use a proprietary high-performance model tuned specifically for brutal honesty and viral trend analysis. It's built to see through fluff and give you the raw potential of your idea without the corporate sugarcoating."
  },
  {
    question: "Why was the AI so mean to my idea?",
    answer: "The AI is designed to be savage because the internet is savage. A mediocre idea won't just fail; it will be ignored. We'd rather you get roasted here for free than spend your life savings on a flop."
  },
  {
    question: "Is my idea data safe with you?",
    answer: "We store your submissions for your personal history, but we don't sell your data to VCs or use it to build our own competitors. Your secrets are safe, though the AI will definitely remember how bad your first draft was."
  },
  {
    question: "Can I really trust a 'Virality Score'?",
    answer: "The score is based on pattern matching against thousands of current and historical viral trends across social platforms. It's a high-probability prediction, not a crystal ball. If you get a 12/100, maybe don't quit your day job yet."
  },
  {
    question: "How many ideas can I roast for free?",
    answer: "Every anonymous user gets 1 free shot. If you want more, just sign up (it's free) and we'll grant you 4 additional high-intensity roasts. We value your ambition, but server GPU time isn't free."
  },
  {
    question: "What happens if I get a 100/100?",
    answer: "If the AI gives you a perfect score, you should probably stop reading this FAQ and start building immediately. You've officially found the glitch in the matrix."
  },
  {
    question: "Who is responsible for this madness?",
    answer: "This tool was built by Hammad Zaheer for the bold, the creative, and the ones who aren't afraid to be told their 'Uber for cat hats' idea is a disaster."
  }
];

const FAQSection: React.FC = () => {
  return (
    <section className="py-24 max-w-4xl mx-auto px-6">
      <div className="text-center mb-16 px-4">
        <h2 className="font-bebas text-5xl sm:text-7xl lg:text-8xl font-black uppercase leading-tight tracking-tight text-black flex flex-col items-center">
          <span className="bg-[#FF3B3B] text-white px-4 py-2 -rotate-1 inline-block mb-4">FREQUENTLY ASKED</span>
          <span className="bg-[#F5F500] text-black px-4 py-2 rotate-1 inline-block">BRUTAL TRUTHS</span>
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {FAQS.map((faq, index) => (
          <div 
            key={index}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="group bg-white border-3 border-black p-6 sm:p-8 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-up opacity-0 fill-mode-forwards"
          >
            <h3 className="font-bold text-xl sm:text-2xl font-space mb-4 text-black uppercase tracking-tight flex items-start gap-4">
              <span className="font-bebas text-3xl opacity-20 hidden sm:block">Q{index + 1}</span>
              {faq.question}
            </h3>
            <p className="font-mono text-sm sm:text-base text-gray-700 leading-relaxed pl-0 sm:pl-12 border-l-3 border-[#F5F500] sm:border-none">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <p className="font-mono text-xs uppercase font-black tracking-widest text-[#888888]">
          END OF THE LINE • STILL HAVE QUESTIONS? ROAST AN IDEA ABOVE.
        </p>
      </div>
    </section>
  );
};

export default FAQSection;
