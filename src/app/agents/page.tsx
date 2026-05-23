"use client";

import { useState, useEffect, useCallback } from "react";

const API = "/api";

interface Agent {
  id: string; name?: string; status?: string; derived?: string;
  type?: string; endpoint?: string; worker_id?: string;
  last_heartbeat?: string; created_at: string;
}

const TONES: Record<string, { bg: string; text: string; dot: string }> = {
  green:  { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  cyan:   { bg: "#ECFEFF", text: "#155E75", dot: "#06B6D4" },
  violet:{ bg: "#F5F3FF", text: "#5B21B6", dot: "#8B5CF6" },
  amber:  { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
  red:    { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  slate:  { bg: "#F8FAFC", text: "#475569", dot: "#94A3B8" },
};

function deriveStatus(a: Agent): { tone: string; label: string } {
  const raw = a.derived || a.status || "";
  switch (raw) {
    case "online": return { tone: "green", label: "在线" };
    case "busy": return { tone: "violet", label: "忙碌" };
    case "stale": case "worker_stalled": return { tone: "amber", label: "延迟" };
    case "offline": case "worker_error": return { tone: "red", label: "离线" };
    default: return { tone: "slate", label: raw || "未知" };
  }
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

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch(`${API}/agents`, { cache: "no-store" });
      const json = await res.json();
      setAgents(Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);
  useEffect(() => { fetchAgents(); const id = setInterval(fetchAgents, 10000); return () => clearInterval(id); }, [fetchAgents]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-[3px] border-slate-200 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-4 max-w-[1000px] mx-auto w-full">
      <div>
        <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight m-0">智能体</h1>
        <p className="text-sm text-slate-500 mt-0.5">{agents.length} 个智能体</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {agents.map(a => {
          const s = deriveStatus(a);
          return (
            <div key={a.id} className="panel p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: TONES[s.tone].dot }} />
                  <span className="text-sm font-semibold text-slate-900">{a.name || a.id}</span>
                </div>
                <Pill tone={s.tone} label={s.label} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="text-slate-400">类型</span><p className="text-slate-700 m-0 mt-0.5">{a.type || "—"}</p></div>
                <div><span className="text-slate-400">Worker</span><p className="text-slate-700 m-0 mt-0.5 text-[11px] font-mono truncate">{a.worker_id || "—"}</p></div>
                {a.endpoint && <div className="col-span-2"><span className="text-slate-400">端点</span><p className="text-slate-700 m-0 mt-0.5 text-[11px] font-mono truncate">{a.endpoint}</p></div>}
              </div>
            </div>
          );
        })}
      </div>
      {agents.length === 0 && <p className="text-center text-sm text-slate-400 py-8">暂无智能体</p>}
    </div>
  );
}
