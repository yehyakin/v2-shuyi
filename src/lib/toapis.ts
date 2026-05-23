/**
 * ToAPIs 统一代理 API
 *
 * 用法:
 *   POST /api/ai/chat      → https://toapis.com/v1/chat/completions
 *   POST /api/ai/image     → https://toapis.com/v1/images/generations
 *   GET  /api/ai/models    → https://toapis.com/v1/models
 *   POST /api/ai/vision    → https://toapis.com/v1/chat/completions (vision model)
 */

const API_BASE = "https://toapis.com";
const API_KEY = "sk-SMPC5C3tS33Izox40EDzKxb4PnszE6D9WiENtiFgm4F81ztY";

export async function toapisChat(messages: Array<{ role: string; content: string | unknown[] }>, options?: {
  model?: string;
  max_tokens?: number;
  temperature?: number;
}) {
  const res = await fetch(`${API_BASE}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options?.model ?? "deepseek-v4-pro",
      messages,
      max_tokens: options?.max_tokens ?? 500,
      temperature: options?.temperature ?? 0.7,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}

export async function toapisImage(prompt: string, options?: {
  model?: string;
  n?: number;
  size?: string;
}) {
  const res = await fetch(`${API_BASE}/v1/images/generations`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options?.model ?? "gpt-4o-image",
      prompt,
      n: options?.n ?? 1,
      size: options?.size ?? "1024x1024",
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}

export async function toapisVision(imageUrl: string, prompt: string, options?: {
  model?: string;
  max_tokens?: number;
}) {
  const res = await fetch(`${API_BASE}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options?.model ?? "gemini-2.5-flash-official",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      }],
      max_tokens: options?.max_tokens ?? 500,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}

export async function toapisBalance() {
  const res = await fetch(`${API_BASE}/v1/balance`, {
    headers: { "Authorization": `Bearer ${API_KEY}` },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
