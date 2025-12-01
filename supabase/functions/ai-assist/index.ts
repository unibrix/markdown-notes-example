import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, content } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'generate':
        systemPrompt = 'You are a helpful writing assistant. Generate well-structured markdown content based on the user\'s request. Use proper markdown formatting with headers, lists, and emphasis where appropriate.';
        userPrompt = content;
        break;
      case 'expand':
        systemPrompt = 'You are a helpful writing assistant. Expand and elaborate on the given text while maintaining its core message. Add relevant details, examples, and context. Return the expanded version in markdown format.';
        userPrompt = `Expand this text:\n\n${content}`;
        break;
      case 'summarize':
        systemPrompt = 'You are a helpful writing assistant. Create a concise summary of the given text while preserving key points. Use markdown formatting for clarity.';
        userPrompt = `Summarize this text:\n\n${content}`;
        break;
      case 'improve':
        systemPrompt = 'You are a helpful writing assistant. Improve the given text by enhancing clarity, grammar, and style while maintaining the original meaning. Return the improved version in markdown format.';
        userPrompt = `Improve this text:\n\n${content}`;
        break;
      default:
        throw new Error('Invalid action');
    }

    console.log('Calling AI with action:', action);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      throw new Error('No content in AI response');
    }

    console.log('AI response successful');

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in ai-assist function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});