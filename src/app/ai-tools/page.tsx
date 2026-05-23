"use client";

import { useRouter } from "next/navigation";

/* ── Icons ── */
function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "image": return <svg {...s}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
    case "video": return <svg {...s}><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>;
    case "trending": return <svg {...s}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
    case "copy": return <svg {...s}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
    case "wand": return <svg {...s}><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>;
    case "palette": return <svg {...s}><circle cx="13.5" cy="6.5" r="2"/><circle cx="17.5" cy="10.5" r="2"/><circle cx="8.5" cy="7.5" r="2"/><circle cx="6.5" cy="12.5" r="2"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 2.648-.746 2.648-2.649 0-.68-.293-1.333-.293-1.333A1.5 1.5 0 0 1 15.5 16h1.07A5.44 5.44 0 0 0 22 10.57C22 5.86 17.53 2 12 2z"/></svg>;
    case "search": return <svg {...s}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
    case "zap": return <svg {...s}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;
    default: return <span />;
  }
}

const TOOLS = [
  {
    id: "tryon",
    title: "虚拟试衣",
    desc: "上传商品图，AI 生成模特试穿效果图，支持多体型多角度",
    icon: "image",
    color: "from-cyan-500 to-blue-500",
    action: "/",
  },
  {
    id: "video",
    title: "视频生成",
    desc: "商品图一键转带货短视频，自动配乐、字幕、转场",
    icon: "video",
    color: "from-violet-500 to-purple-500",
    action: "/",
  },
  {
    id: "copy",
    title: "文案生成",
    desc: "AI 生成商品标题、卖点文案、详情页描述，支持多语言",
    icon: "copy",
    color: "from-amber-500 to-orange-500",
    action: "/",
  },
  {
    id: "analyze",
    title: "爆款分析",
    desc: "分析竞品爆款视频特征，提取文案、BGM、画面风格",
    icon: "trending",
    color: "from-emerald-500 to-green-500",
    action: "/inspiration",
  },
  {
    id: "compose",
    title: "图片合成",
    desc: "商品图精修、去背景、场景合成，批量处理",
    icon: "wand",
    color: "from-rose-500 to-pink-500",
    action: "/",
  },
  {
    id: "palette",
    title: "风格迁移",
    desc: "将参考图的视觉风格迁移到你的商品图上",
    icon: "palette",
    color: "from-indigo-500 to-blue-500",
    action: "/",
  },
  {
    id: "search",
    title: "素材搜索",
    desc: "搜索海量免版权素材，直接用于视频创作",
    icon: "search",
    color: "from-gray-500 to-gray-700",
    action: "/assets",
  },
  {
    id: "zap",
    title: "批量处理",
    desc: "批量提交任务，AI 自动排队处理，支持优先级",
    icon: "zap",
    color: "from-cyan-500 to-emerald-500",
    action: "/tasks",
  },
];

export default function AIToolsPage() {
  const router = useRouter();

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight m-0">AI工具</h1>
        <p className="text-[13px] text-gray-500 mt-1">选择工具，开始创作</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TOOLS.map(tool => (
          <button key={tool.id} onClick={() => router.push(tool.action)}
            className="text-left p-5 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-3`}>
              <Icon name={tool.icon} size={20} />
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-1 m-0">{tool.title}</h3>
            <p className="text-[12px] text-gray-500 m-0 leading-relaxed">{tool.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
