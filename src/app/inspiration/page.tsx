"use client";

import { useState } from "react";

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "play": return <svg {...s}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
    case "eye": return <svg {...s}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "heart": return <svg {...s}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
    case "search": return <svg {...s}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
    case "sparkles": return <svg {...s}><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/></svg>;
    case "loader": return <svg {...s} className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
    case "copy": return <svg {...s}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
    default: return <span />;
  }
}

const CATEGORIES = ["全部", "T恤", "衬衫", "卫衣", "西装", "大衣", "牛仔", "POLO"];

const TRENDING = [
  { id: 1, title: "夏季轻奢T恤穿搭", thumb: "https://picsum.photos/seed/i1/400/600", views: "12.8万", likes: "3.2k", tags: ["T恤","夏季","轻奢"] },
  { id: 2, title: "商务衬衫一周搭配", thumb: "https://picsum.photos/seed/i2/400/600", views: "8.5万", likes: "2.1k", tags: ["衬衫","商务","通勤"] },
  { id: 3, title: "运动风卫衣3色对比", thumb: "https://picsum.photos/seed/i3/400/600", views: "15.2万", likes: "4.5k", tags: ["卫衣","运动","休闲"] },
  { id: 4, title: "秋冬大衣面料测评", thumb: "https://picsum.photos/seed/i4/400/600", views: "6.3万", likes: "1.8k", tags: ["大衣","秋冬","测评"] },
  { id: 5, title: "牛仔外套复古风", thumb: "https://picsum.photos/seed/i5/400/600", views: "9.1万", likes: "2.7k", tags: ["牛仔","复古","外套"] },
  { id: 6, title: "POLO衫职场穿搭", thumb: "https://picsum.photos/seed/i6/400/600", views: "7.4万", likes: "1.9k", tags: ["POLO","职场","休闲"] },
  { id: 7, title: "短裤搭配灵感合集", thumb: "https://picsum.photos/seed/i7/400/600", views: "11.2万", likes: "3.6k", tags: ["短裤","夏季","搭配"] },
  { id: 8, title: "西装外套轻商务", thumb: "https://picsum.photos/seed/i8/400/600", views: "5.8万", likes: "1.4k", tags: ["西装","轻商务","通勤"] },
  { id: 9, title: "针织开衫文艺范", thumb: "https://picsum.photos/seed/i9/400/600", views: "4.3万", likes: "1.2k", tags: ["针织","文艺","开衫"] },
  { id: 10, title: "运动夹克街头风", thumb: "https://picsum.photos/seed/i10/400/600", views: "6.7万", likes: "1.6k", tags: ["夹克","运动","街头"] },
  { id: 11, title: "羽绒马甲轻暖穿搭", thumb: "https://picsum.photos/seed/i11/400/600", views: "3.1万", likes: "890", tags: ["羽绒","马甲","保暖"] },
  { id: 12, title: "棉麻衬衫日系风", thumb: "https://picsum.photos/seed/i12/400/600", views: "5.2万", likes: "1.3k", tags: ["衬衫","棉麻","日系"] },
];

export default function InspirationPage() {
  const [category, setCategory] = useState("全部");
  const [search, setSearch] = useState("");
  const [analyzing, setAnalyzing] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<Record<number, string>>({});

  const filtered = TRENDING.filter(v =>
    (category === "全部" || v.tags.includes(category)) &&
    (search === "" || v.title.includes(search))
  );

  const handleAnalyze = async (id: number, thumb: string) => {
    setAnalyzing(id);
    try {
      const res = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: thumb,
          prompt: "用中文简短分析这张服装图片的搭配风格、色彩特点和适合的电商营销角度，控制在100字以内。",
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "分析失败";
      setAnalysis(prev => ({ ...prev, [id]: content }));
    } catch (e: any) {
      setAnalysis(prev => ({ ...prev, [id]: `分析失败: ${e.message}` }));
    }
    setAnalyzing(null);
  };

  const handleCopyStyle = (item: typeof TRENDING[0]) => {
    window.location.href = `/?prompt=${encodeURIComponent(`复刻爆款视频风格：${item.title}，标签：${item.tags.join("、")}`)}`;
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight m-0">爆款社区</h1>
        <p className="text-[13px] text-gray-500 mt-1">发现热门穿搭灵感，AI 分析爆款特征，一键复刻</p>
      </div>

      {/* Search + Category */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-[360px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索爆款视频…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border-0 cursor-pointer transition-all whitespace-nowrap
                ${category === c ? "bg-gray-900 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(v => (
          <div key={v.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all">
            <div className="aspect-[2/3] bg-gray-100 overflow-hidden relative group cursor-pointer">
              <img src={v.thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Icon name="play" size={10} />{v.views}
              </div>
            </div>
            <div className="p-3">
              <p className="text-[13px] font-medium text-gray-900 m-0 truncate">{v.title}</p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><Icon name="eye" size={12} />{v.views}</span>
                <span className="flex items-center gap-1"><Icon name="heart" size={12} />{v.likes}</span>
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {v.tags.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">{t}</span>)}
              </div>

              {/* AI Analysis */}
              {analysis[v.id] && (
                <div className="mt-2 p-2.5 rounded-lg bg-cyan-50 border border-cyan-100 text-[11px] text-cyan-800 leading-relaxed">
                  <span className="font-semibold">AI 分析：</span>{analysis[v.id]}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-2.5">
                <button onClick={() => handleAnalyze(v.id, v.thumb)} disabled={analyzing === v.id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 transition-colors cursor-pointer disabled:opacity-50">
                  {analyzing === v.id ? <Icon name="loader" size={12} /> : <Icon name="sparkles" size={12} />}
                  {analyzing === v.id ? "分析中…" : "AI 分析"}
                </button>
                <button onClick={() => handleCopyStyle(v)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium bg-gray-900 text-white border-0 hover:bg-gray-800 transition-colors cursor-pointer">
                  <Icon name="copy" size={12} />复刻风格
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-[13px] text-gray-400 py-12">未找到匹配内容</p>}
    </div>
  );
}
