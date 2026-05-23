"use client";

import { useState, useEffect, useCallback } from "react";

const API = "/api";
const norm = (v?: string | null) => (v || "").toLowerCase();

interface CommMessage {
  id: string; sender?: string; status?: string; subject?: string;
  body?: string; created_at: string;
}

function Pill({ tone, label }: { tone: string; label: string }) {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    green:  { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
    violet: { bg: "#F5F3FF", text: "#5B21B6", dot: "#8B5CF6" },
    amber:  { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
    cyan:   { bg: "#ECFEFF", text: "#155E75", dot: "#06B6D4" },
    slate:  { bg: "#F8FAFC", text: "#475569", dot: "#94A3B8" },
  };
  const c = colors[tone] ?? colors.slate;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.dot}20` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />{label}
    </span>
  );
}

function commTone(status: string): string {
  switch (norm(status)) {
    case "needs_codex_review": return "violet";
    case "accepted": case "completed": return "green";
    case "in_progress": case "received": return "cyan";
    case "rejected": return "red";
    default: return "slate";
  }
}

function commLabel(status: string): string {
  const m: Record<string, string> = {
    needs_codex_review: "待复核", accepted: "已接受", rejected: "已拒绝",
    received: "已接收", in_progress: "处理中", sent: "已发送",
    completed: "已完成",
  };
  return m[norm(status)] ?? status;
}

export default function CodexHermesPage() {
  const [messages, setMessages] = useState<CommMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API}/comm/messages?limit=50`, { cache: "no-store" });
      const json = await res.json();
      setMessages(Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);
  useEffect(() => { fetchMessages(); const id = setInterval(fetchMessages, 10000); return () => clearInterval(id); }, [fetchMessages]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-[3px] border-slate-200 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-4 max-w-[900px] mx-auto w-full">
      <div>
        <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight m-0">Codex ↔ Hermes 通信</h1>
        <p className="text-sm text-slate-500 mt-0.5">{messages.length} 条消息</p>
      </div>
      <div className="flex flex-col gap-2">
        {messages.map(m => (
          <div key={m.id} className="panel p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {m.sender && <Pill tone="cyan" label={m.sender} />}
                <Pill tone={commTone(m.status || "")} label={commLabel(m.status || "")} />
                {m.subject && <span className="text-sm font-semibold text-slate-800">{m.subject}</span>}
              </div>
              {m.body && <p className="text-[13px] text-slate-600 m-0 whitespace-pre-wrap">{m.body.slice(0, 300)}{m.body.length > 300 ? "…" : ""}</p>}
            </div>
            <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">
              {new Date(m.created_at).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
      {messages.length === 0 && <p className="text-center text-sm text-slate-400 py-8">暂无消息</p>}
    </div>
  );
}
