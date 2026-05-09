export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
  if (!NVIDIA_API_KEY) return new Response(JSON.stringify({ error: 'NVIDIA API Key not configured' }), { status: 500 });

  try {
    const body = await req.json();
    const { action, messages, text, imageUrl, prompt, reasoning_effort, stream } = body;

    let endpoint = 'https://integrate.api.nvidia.com/v1/chat/completions';
    let payload = {};

    if (action === 'chat') {
      payload = {
        model: "mistralai/mistral-small-4-119b-2603",
        messages: messages,
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1024,
      };
      if (reasoning_effort) {
        payload.model = "deepseek-ai/deepseek-v4-flash"; // Use faster reasoning model
      }
    } else if (action === 'safety') {
      payload = {
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: "You are a content safety filter. Evaluate the following text for harmful content, hate speech, or explicit material. Reply ONLY with the word 'safe' or 'unsafe'." },
          ...messages
        ],
        temperature: 0.1,
        max_tokens: 10
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
    } else if (action === 'vision') {
      payload = {
        model: "meta/llama-3.2-90b-vision-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      };
    } else {
      return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
    }

    payload.stream = stream || false;

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

    if (stream) {
      return new Response(res.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
