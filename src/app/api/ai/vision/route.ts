/**
 * POST /api/ai/vision
 *
 * Analyze an image using ToAPIs Vision models.
 * Body: { image_url: string, prompt?: string }
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://toapis.com";
const API_KEY = "sk-SMPC5C3tS33Izox40EDzKxb4PnszE6D9WiENtiFgm4F81ztY";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image_url, prompt } = body;

    const res = await fetch(`${API_BASE}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash-official",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: prompt || "请详细描述这张图片的视觉风格、色彩、构图、服装搭配特点，以及适合的电商营销策略。" },
            { type: "image_url", image_url: { url: image_url } },
          ],
        }],
        max_tokens: 500,
      }),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}
