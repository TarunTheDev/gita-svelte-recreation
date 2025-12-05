// Server-side proxy to avoid CORS issues with Sanskrit.ie API
export async function GET({ params }) {
  const { chapter } = params;
  
  try {
    const response = await fetch(`https://sanskrit.ie/api/geeta.php?q=${chapter}`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'API request failed', status: response.status }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching from Sanskrit.ie:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
