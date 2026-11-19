/**
 * POST /api/ai/video
 *
 * Proxies video generation requests to ToAPIs (doubao-seedance-1-0-pro-quality)
 * Body: {
 *   model?: string,
 *   prompt: string,
 *   image_urls: string[],
 *   duration?: number,
 *   aspect_ratio?: string,
 *   resolution?: string
 * }
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://toapis.com";
const API_KEY = process.env.TOAPIS_API_KEY || "sk-SMP...1ztY";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model, prompt, image_urls, duration, aspect_ratio, resolution } = body;

    if (!image_urls || !Array.isArray(image_urls) || image_urls.length === 0) {
      return NextResponse.json({ error: "image_urls is required" }, { status: 400 });
    }

    const toapisBody: Record<string, unknown> = {
      model: model || "doubao-seedance-1-0-pro-quality",
      prompt: prompt || "",
      image_urls,
      duration: duration || 5,
      aspect_ratio: aspect_ratio || "9:16",
      resolution: resolution || "720p",
    };

    const res = await fetch(`${API_BASE}/v1/videos/generations`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toapisBody),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}