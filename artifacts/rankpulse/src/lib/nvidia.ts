/**
 * NVIDIA NIM AI client — calls the NVIDIA API directly from the browser.
 * Uses the Mistral model as specified in the user config.
 */

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "mistralai/mistral-small-4-119b-2603";

function getApiKey(): string {
  return import.meta.env.VITE_NVIDIA_API_KEY ?? "";
}

export function hasAiKey(): boolean {
  return !!getApiKey();
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Non-streaming completion — returns the full text response.
 */
export async function aiComplete(messages: Message[]): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error("NVIDIA API key not configured");

  const res = await fetch(NVIDIA_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 1.0,
      stream: false,
    }),
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
  onChunk: (text: string) => void
): Promise<void> {
  const key = getApiKey();
  if (!key) throw new Error("NVIDIA API key not configured");

  const res = await fetch(NVIDIA_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 1.0,
      stream: true,
    }),
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
