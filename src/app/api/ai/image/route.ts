/**
 * POST /api/ai/image
 *
 * Proxies image generation to ToAPIs (gpt-image-2)
 * Body: {
 *   model?,          // default: gpt-image-2
 *   prompt: string,
 *   reference_images?: string[],  // array of URLs, NOT [{url}]
 *   size?: string,   // default: 576x1024
 *   n?: number
 * }
 *
 * POST /api/ai/video
 *
 * Proxies video generation to ToAPIs (doubao-seedance)
 * Body: {
 *   model?,          // default: doubao-seedance-1-0-pro-quality
 *   prompt: string,
 *   image_urls: string[],
 *   duration?: number,  // default: 5
 *   aspect_ratio?: string, // default: 9:16
 *   resolution?: string    // default: 720p
 * }
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://toapis.com";
const API_KEY = process.env.TOAPIS_API_KEY || "sk-SMP...1ztY";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model, prompt, reference_images, size, n } = body;

    // Build request body for ToAPIs image generation
    // ⚠️ reference_images must be ["url1", "url2", ...] NOT [{"url": "url1"}, ...]
    const toapisBody: Record<string, unknown> = {
      model: model || "gpt-image-2",
      prompt,
      size: size || "576x1024",
    };
    if (n) toapisBody.n = n;
    if (reference_images && Array.isArray(reference_images) && reference_images.length > 0) {
      toapisBody.reference_images = reference_images;
    }

    const res = await fetch(`${API_BASE}/v1/images/generations`, {
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
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}