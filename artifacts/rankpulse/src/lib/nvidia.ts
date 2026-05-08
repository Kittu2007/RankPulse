/**
 * NVIDIA NIM AI client — calls the NVIDIA API directly from the browser.
 * Uses the Mistral model as specified in the user config.
 */

const IS_PROD = import.meta.env.PROD;
const NVIDIA_URL = IS_PROD ? "/api/ai" : "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "mistralai/mistral-small-4-119b-2603";

function getApiKey(): string {
  // In production, the key is handled by the /api/ai proxy for security.
  if (IS_PROD) return "PROXY_MANAGED";
  return import.meta.env.VITE_NVIDIA_API_KEY ?? "";
}

export function hasAiKey(): boolean {
  return IS_PROD || !!import.meta.env.VITE_NVIDIA_API_KEY;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AIOptions {
  reasoning_effort?: "none" | "low" | "medium" | "high";
}

/**
 * Non-streaming completion — returns the full text response.
 */
export async function aiComplete(messages: Message[], options?: AIOptions): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error("NVIDIA API key not configured");

  const body: any = {
    model: MODEL,
    messages,
    max_tokens: 4096,
    temperature: 0.7,
    top_p: 1.0,
    stream: false,
  };

  if (options?.reasoning_effort) {
    body.reasoning_effort = options.reasoning_effort;
  }

  const res = await fetch(NVIDIA_URL, {
    method: "POST",
    headers: {
      ...(IS_PROD ? {} : { Authorization: `Bearer ${key}` }),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NVIDIA API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

/**
 * Streaming completion — yields text chunks via a callback.
 */
export async function aiStream(
  messages: Message[],
  onChunk: (text: string) => void,
  options?: AIOptions
): Promise<void> {
  const key = getApiKey();
  if (!key) throw new Error("NVIDIA API key not configured");

  const body: any = {
    model: MODEL,
    messages,
    max_tokens: 4096,
    temperature: 0.7,
    top_p: 1.0,
    stream: true,
  };

  if (options?.reasoning_effort) {
    body.reasoning_effort = options.reasoning_effort;
  }

  const res = await fetch(NVIDIA_URL, {
    method: "POST",
    headers: {
      ...(IS_PROD ? {} : { Authorization: `Bearer ${key}` }),
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NVIDIA API error ${res.status}: ${err}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const payload = trimmed.slice(6);
      if (payload === "[DONE]") return;
      try {
        const json = JSON.parse(payload);
        const text = json.choices?.[0]?.delta?.content ?? "";
        if (text) onChunk(text);
      } catch {
        // skip malformed chunks
      }
    }
  }
}

/**
 * Vision completion — analyzes an image and returns text.
 */
export async function aiVision(prompt: string, base64Image: string): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error("NVIDIA API key not configured");

  const VISION_MODEL = "meta/llama-3.2-90b-vision-instruct";

  const body = {
    model: VISION_MODEL,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: base64Image } }
        ]
      }
    ],
    max_tokens: 1024,
    temperature: 0.7,
    top_p: 1.0,
    stream: false,
  };

  const res = await fetch(NVIDIA_URL, {
    method: "POST",
    headers: {
      ...(IS_PROD ? {} : { Authorization: `Bearer ${key}` }),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NVIDIA Vision API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
