import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { businessName, industry, platforms, goals, targetAudience } = await req.json();
    
    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not found' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Create hashtag generation prompt
    const prompt = `Generate 15-20 relevant and trending hashtags for a ${industry} business called "${businessName}".

Business Context:
- Industry: ${industry}
- Target Audience: ${targetAudience}
- Platforms: ${platforms?.join(', ') || 'Social Media'}
- Goals: ${goals?.join(', ') || 'Brand awareness'}

Requirements:
- Mix of popular, niche, and branded hashtags
- Include industry-specific hashtags
- Add location-based hashtags if relevant
- Include trending and evergreen hashtags
- Format as a simple comma-separated list
- No explanations, just the hashtags with # symbol

Example format: #hashtag1, #hashtag2, #hashtag3`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to generate hashtags' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up the hashtags - split by comma and clean each hashtag
    const hashtags = generatedText
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

    return new Response(
      JSON.stringify({ hashtags }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in generate-hashtags function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})