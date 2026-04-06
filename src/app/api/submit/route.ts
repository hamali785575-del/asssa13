import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGroqClient } from '@/lib/groq';

const SYSTEM_PROMPT = `You are a brutally honest, witty startup and content idea analyst. 
Your job is to evaluate whether an idea would go viral.

FIRST, determine if the input is a genuine idea or nonsense/gibberish/trolling.

IF IT IS NONSENSE (random words, joke input, gibberish, off-topic rambling, or clearly not an idea):
- Do NOT give a virality score
- ROAST the user hard. Be savage, funny, and specific about why their input is garbage
- Tell them exactly what a REAL idea submission looks like
- End with one line of encouragement to try again properly
- Use this format:
  🔥 ROAST MODE ACTIVATED
  [roast here]
  💡 Here's what a real idea looks like: [1-sentence example]

IF IT IS A REAL IDEA:
- Give a virality score from 0 to 100
- Break it down across 4 dimensions: Novelty, Relatability, Shareability, Timing
- Give each dimension a score out of 25 and a 1-2 sentence explanation
- Give an overall verdict in 2-3 punchy sentences
- Flag 1 thing that could kill its virality
- Flag 1 thing that could make it explode
- Use this format:
  🚀 VIRALITY SCORE: [X]/100
  
  NOVELTY [X/25]: ...
  RELATABILITY [X/25]: ...
  SHAREABILITY [X/25]: ...
  TIMING [X/25]: ...
  
  VERDICT: ...
  
  ☠️ KILL SWITCH: ...
  ⚡ ROCKET FUEL: ...

Be direct. No corporate speak. No padding. Maximum 800 tokens.`;

export async function POST(req: Request) {
  try {
    const { ideaText, isAnon, fingerprint } = await req.json();

    const wordCount = ideaText.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 100) {
      return NextResponse.json({ error: 'Idea must be at least 100 words.' }, { status: 400 });
    }

    const supabase = await createClient();

    let usesRemaining = 0;

    if (isAnon) {
      if (!fingerprint) {
         return NextResponse.json({ error: 'Fingerprint required for anonymous use.' }, { status: 400 });
      }
      // Check if finger print exists
      const { data, error } = await supabase
        .from('anon_uses')
        .select('*')
        .eq('fingerprint', fingerprint)
        .single();
      
      if (data) {
        return NextResponse.json({ error: 'Free use already spent', code: 'FREE_USED' }, { status: 403 });
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('uses_remaining')
        .eq('id', user.id)
        .single();

      if (!profile || profile.uses_remaining <= 0) {
        return NextResponse.json({ error: 'No uses remaining', code: 'OUT_OF_QUOTA' }, { status: 403 });
      }
    }

    // Call Groq API
    const groq = getGroqClient();
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Evaluate this idea for virality:\n\n"${ideaText}"` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.85,
      max_tokens: 800,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || 'No response generated.';

    // After success, deduct/record uses
    if (isAnon) {
      await supabase.from('anon_uses').insert([{ fingerprint }]);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // decrement
        await supabase.rpc('decrement_use_count');
        // fetch remaining
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('uses_remaining')
          .eq('id', user.id)
          .single();
        usesRemaining = updatedProfile?.uses_remaining || 0;

        // Optionally log submission
        // Parse virality score for the dashboard history
        let viralityScore = 0;
        const scoreMatch = aiResponse.match(/VIRALITY SCORE:\s*(\d+)/i);
        if (scoreMatch) viralityScore = parseInt(scoreMatch[1]);

        await supabase.from('submissions').insert([{
           user_id: user.id,
           idea_text: ideaText,
           ai_response: aiResponse,
           virality_score: viralityScore,
           is_roasted: aiResponse.includes('🔥 ROAST MODE ACTIVATED'),
        }]);
      }
    }

    return NextResponse.json({ response: aiResponse, usesRemaining, isRoasted: aiResponse.includes('🔥 ROAST MODE ACTIVATED') });

  } catch (error: any) {
    console.error('Submit API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
