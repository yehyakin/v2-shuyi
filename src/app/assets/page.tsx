"use client";

import { useState, useEffect, useCallback } from "react";

const API = "/api";

interface Asset {
  id: string; filename?: string; task_id?: string; asset_type?: string;
  status?: string; processed?: boolean; created_at: string;
  url?: string; thumbnail_url?: string;
}

function Pill({ tone, label }: { tone: string; label: string }) {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    green:  { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
    violet: { bg: "#F5F3FF", text: "#5B21B6", dot: "#8B5CF6" },
    cyan:   { bg: "#ECFEFF", text: "#155E75", dot: "#06B6D4" },
    amber:  { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
    slate:  { bg: "#F8FAFC", text: "#475569", dot: "#94A3B8" },
      red:  { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  };
  const c = colors[tone] ?? colors.slate;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.dot}20` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />{label}
    </span>
  );
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("all");

  const fetchAssets = useCallback(async () => {
    try {
      const resp = await fetch(`${API}/assets?limit=50`, { cache: "no-store" });
      const json = await resp.json();
      setAssets(Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);
  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const types = [...new Set(assets.map(a => a.asset_type || "unknown"))];
  const filtered = tab === "all" ? assets : assets.filter(a => a.asset_type === tab);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-[3px] border-slate-200 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-4 max-w-[1200px] mx-auto w-full">
      <div>
        <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight m-0">素材库</h1>
        <p className="text-sm text-slate-500 mt-0.5">{assets.length} 个素材</p>
      </div>
      {/* Type tabs */}
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={() => setTab("all")}
          className={`px-3 py-1.5 rounded-[10px] text-xs font-medium border-0 cursor-pointer transition-all ${tab === "all" ? "bg-white text-slate-900 shadow-sm" : "bg-slate-100 text-slate-500"}`}>
          全部 ({assets.length})
        </button>
        {types.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-medium border-0 cursor-pointer transition-all ${tab === t ? "bg-white text-slate-900 shadow-sm" : "bg-slate-100 text-slate-500"}`}>
            {t} ({assets.filter(a => a.asset_type === t).length})
          </button>
        ))}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(a => (
          <div key={a.id} className="panel p-3 flex flex-col gap-2">
            <div className="aspect-video rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden text-2xl">
              {a.thumbnail_url ? <img src={a.thumbnail_url} alt="" className="w-full h-full object-cover" /> : "📁"}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Pill tone="cyan" label={a.asset_type || "unknown"} />
              {a.processed ? <Pill tone="green" label="已处理" /> : <Pill tone="amber" label="待处理" />}
            </div>
            <span className="text-[11px] text-slate-500 truncate">{a.filename || a.id}</span>
            {a.task_id && <code className="text-[10px] font-mono text-slate-400 truncate">{a.task_id}</code>}
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-slate-400 py-8">暂无素材</p>}
    </div>
  );
}
