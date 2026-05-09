export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
  if (!NVIDIA_API_KEY) return new Response(JSON.stringify({ error: 'NVIDIA API Key not configured' }), { status: 500 });

  try {
    const body = await req.json();
    const { action, messages, text, imageUrl, reasoning_effort } = body;

    let endpoint = 'https://integrate.api.nvidia.com/v1/chat/completions';
    let payload = {};

    if (action === 'chat') {
      payload = {
        model: "mistralai/mistral-small-24b-instruct-2501",
        messages: messages,
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1024,
      };
      if (reasoning_effort) {
        payload.model = "deepseek-ai/deepseek-r1"; // Use reasoning model if requested
      }
    } else if (action === 'safety') {
      payload = {
        model: "nvidia/nemotron-4-340b-reward",
        messages: messages
      };
    } else if (action === 'embed') {
      endpoint = 'https://integrate.api.nvidia.com/v1/embeddings';
      payload = {
        model: "nvidia/nv-embedqa-e5-v5",
        input: [text],
        input_type: "query",
        truncate: "NONE"
      };
    } else if (action === 'ocr') {
      payload = {
        model: "meta/llama-3.2-90b-vision-instruct",
        messages: [
          { role: "user", content: `Extract all text from this image exactly as it appears. Image: ${imageUrl}` }
        ],
        temperature: 0.2,
        max_tokens: 512
      };
    } else {
      return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      return new Response(JSON.stringify({ error: `NVIDIA API Error: ${res.status}`, details: errorText }), { status: res.status });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
