"use client";

import { useState, useEffect, useCallback } from "react";

const API = "/api";
const norm = (v?: string | null) => (v || "").toLowerCase();

interface Risk {
  id: string; task_id?: string; source: string; risk_level: string;
  risk_reason?: string; status: string; original_message?: string;
  created_at?: string;
}

const TONES: Record<string, { bg: string; text: string; dot: string }> = {
  red:    { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  amber:  { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
  green:  { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  slate:  { bg: "#F8FAFC", text: "#475569", dot: "#94A3B8" },
};

function riskTone(lvl: string): string {
  if (norm(lvl) === "high" || norm(lvl) === "critical") return "red";
  if (norm(lvl) === "medium") return "amber";
  if (norm(lvl) === "low") return "green";
  return "slate";
}

function riskLabel(lvl: string): string {
  const m: Record<string, string> = { high: "高风险", critical: "严重", medium: "中风险", low: "低风险" };
  return m[norm(lvl)] ?? lvl;
}

function Pill({ tone, label }: { tone: string; label: string }) {
  const c = TONES[tone] ?? TONES.slate;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.dot}20` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />{label}
    </span>
  );
}

export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRisks = useCallback(() => {
    return fetch(`${API}/risks`, { cache: "no-store" })
      .then(res => res.json())
      .then(json => {
        setRisks(Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetchRisks(); const id = setInterval(fetchRisks, 10000); return () => clearInterval(id); }, [fetchRisks]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-[3px] border-slate-200 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-4 max-w-[1000px] mx-auto w-full">
      <div>
        <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight m-0">风险确认</h1>
        <p className="text-sm text-slate-500 mt-0.5">{risks.length} 条风险</p>
      </div>
      <div className="flex flex-col gap-2">
        {risks.map(r => (
          <div key={r.id} className="panel p-4 flex items-start gap-4">
            <Pill tone={riskTone(r.risk_level)} label={riskLabel(r.risk_level)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[11px] font-mono text-slate-400">{r.source}</span>
                {r.task_id && <code className="text-[11px] font-mono text-cyan-600">{r.task_id}</code>}
              </div>
              {r.risk_reason && <p className="text-[13px] text-slate-700 m-0">{r.risk_reason}</p>}
              {r.original_message && <p className="text-[12px] text-slate-500 m-0 mt-1 italic">{r.original_message}</p>}
            </div>
            <Pill tone={r.status === "pending" ? "amber" : r.status === "confirmed" ? "green" : "slate"}
              label={r.status === "pending" ? "待确认" : r.status === "confirmed" ? "已确认" : r.status} />
          </div>
        ))}
      </div>
      {risks.length === 0 && <p className="text-center text-sm text-slate-400 py-8">无待处理风险</p>}
    </div>
  );
}
