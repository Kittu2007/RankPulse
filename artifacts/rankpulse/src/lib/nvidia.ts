/**
 * NVIDIA NIM AI client — calls the NVIDIA API either via Edge Proxy (prod) or directly (dev).
 */

const IS_PROD = import.meta.env.PROD;
const PROXY_URL = "/api/ai";

export function hasAiKey(): boolean {
  return IS_PROD || !!import.meta.env.VITE_NVIDIA_API_KEY;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string | any[];
}

interface AIOptions {
  reasoning_effort?: "none" | "low" | "medium" | "high";
  action?: "chat" | "safety";
}

export async function aiComplete(messages: Message[], options?: AIOptions): Promise<string> {
  if (IS_PROD) {
    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: options?.action || "chat", messages, reasoning_effort: options?.reasoning_effort }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  } else {
    const key = import.meta.env.VITE_NVIDIA_API_KEY;
    let modelName = "mistralai/mistral-small-24b-instruct-2501";
    if (options?.action === "safety") {
      modelName = "nvidia/nemotron-4-340b-reward";
    } else if (options?.reasoning_effort) {
      modelName = "deepseek-ai/deepseek-r1";
    }
    
    const body: any = {
      model: modelName,
      messages,
      max_tokens: options?.action === "safety" ? 256 : 4096,
      temperature: 0.2,
      top_p: 0.7,
      stream: false,
    };
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }
}

export async function aiStream(messages: Message[], onChunk: (text: string) => void, options?: AIOptions): Promise<void> {
  if (IS_PROD) {
    throw new Error("Streaming not supported via standard proxy currently.");
  } else {
    const key = import.meta.env.VITE_NVIDIA_API_KEY;
    const body: any = {
      model: options?.reasoning_effort ? "deepseek-ai/deepseek-r1" : "mistralai/mistral-small-24b-instruct-2501",
      messages,
      max_tokens: 4096,
      temperature: 0.2,
      top_p: 0.7,
      stream: true,
    };
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    const reader = res.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim().startsWith("data: ")) continue;
        const payload = line.trim().slice(6);
        if (payload === "[DONE]") return;
        try {
          const json = JSON.parse(payload);
          const text = json.choices?.[0]?.delta?.content ?? "";
          if (text) onChunk(text);
        } catch {}
      }
    }
  }
}

export async function aiEmbed(text: string): Promise<number[]> {
  if (IS_PROD) {
    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "embed", text }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.data?.[0]?.embedding ?? [];
  } else {
    const key = import.meta.env.VITE_NVIDIA_API_KEY;
    const res = await fetch("https://integrate.api.nvidia.com/v1/embeddings", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "nvidia/nv-embedqa-e5-v5", input: [text], input_type: "query", truncate: "NONE" })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.data?.[0]?.embedding ?? [];
  }
}

export async function aiOcr(base64Image: string, mimeType: string): Promise<string> {
  const imageUrl = `data:${mimeType};base64,${base64Image}`;
  if (IS_PROD) {
    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ocr", imageUrl }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  } else {
    const key = import.meta.env.VITE_NVIDIA_API_KEY;
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta/llama-3.2-90b-vision-instruct",
        messages: [{ role: "user", content: `Extract all text from this image exactly as it appears. Image: ${imageUrl}` }],
        max_tokens: 512,
        temperature: 0.2
      })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }
}

export async function aiVision(prompt: string, base64Image: string): Promise<string> {
  const imageUrl = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`;
  
  if (IS_PROD) {
    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "vision", prompt, imageUrl }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  } else {
    const key = import.meta.env.VITE_NVIDIA_API_KEY;
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
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
        max_tokens: 1024,
        temperature: 0.7
      })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }
}
