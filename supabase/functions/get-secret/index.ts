
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { secretName } = await req.json()

  // In a real-world scenario, implement proper authentication and security checks
  if (secretName === 'GEMINI_API_KEY') {
    return new Response(
      JSON.stringify({ 
        publicData: { 
          secret: Deno.env.get('GEMINI_API_KEY') 
        } 
      }),
      { 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }

  return new Response(JSON.stringify({ error: 'Invalid secret name' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  })
})
