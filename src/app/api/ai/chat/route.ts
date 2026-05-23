/**
 * POST /api/ai/chat
 *
 * Proxies chat requests to ToAPIs.
 * Body: { messages: [...], tool?: string }
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://toapis.com";
const API_KEY = "sk-SMPC5C3tS33Izox40EDzKxb4PnszE6D9WiENtiFgm4F81ztY";

const TOOL_SYSTEM_PROMPTS: Record<string, string> = {
  tryon: "你是一个男装电商AI助手，帮用户进行虚拟试衣、生成模特试穿效果的建议。",
  video: "你是一个视频创意专家，帮用户规划带货视频脚本、分镜和拍摄建议。",
  copy: "你是一个电商文案专家，帮用户生成商品标题、卖点文案、详情页描述。",
  analyze: "你是一个数据分析师，帮用户分析竞品爆款视频特征、提取有效策略。",
  compose: "你是一个图片处理专家，帮用户进行商品图精修、场景合成建议。",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], tool } = body;

    const systemPrompt = TOOL_SYSTEM_PROMPTS[tool as string] || TOOL_SYSTEM_PROMPTS.copy;

    const res = await fetch(`${API_BASE}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-v4-pro",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
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
