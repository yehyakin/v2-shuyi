"use client";

import { useState, useEffect, useCallback } from "react";

const API = "/api";

interface LogEntry {
  id: string; level?: string; message?: string; source?: string;
  task_id?: string; created_at: string;
}

function Pill({ tone, label }: { tone: string; label: string }) {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    red:    { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
    amber:  { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
    cyan:   { bg: "#ECFEFF", text: "#155E75", dot: "#06B6D4" },
    green:  { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
    slate:  { bg: "#F8FAFC", text: "#475569", dot: "#94A3B8" },
  };
  const c = colors[tone] ?? colors.slate;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.dot}20` }}>
      {label}
    </span>
  );
}

function levelTone(lv?: string): string {
  switch (lv?.toLowerCase()) {
    case "error": case "critical": return "red";
    case "warning": return "amber";
    case "info": return "cyan";
    case "success": return "green";
    default: return "slate";
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`${API}/tasks?limit=100`, { cache: "no-store" }); // fallback — no dedicated /logs endpoint visible
      const json = await res.json();
      const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      // Adapt task list as log entries
      setLogs(data.map((t: Record<string, unknown>) => ({
        id: t.id as string,
        level: t.status as string || "info",
        message: (t.task_id as string) || (t.id as string),
        task_id: t.task_id as string,
        created_at: t.created_at as string,
      })));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);
  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-[3px] border-slate-200 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-4 max-w-[1200px] mx-auto w-full">
      <div>
        <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight m-0">系统日志</h1>
        <p className="text-sm text-slate-500 mt-0.5">{logs.length} 条记录</p>
      </div>
      <div className="panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/60">
              <th className="text-left p-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">时间</th>
              <th className="text-left p-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">级别</th>
              <th className="text-left p-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">来源</th>
              <th className="text-left p-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">消息</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-b border-slate-100/80 hover:bg-slate-50/50 transition-colors">
                <td className="p-3 text-[11px] font-mono text-slate-400 whitespace-nowrap">{new Date(l.created_at).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</td>
                <td className="p-3"><Pill tone={levelTone(l.level)} label={l.level || "info"} /></td>
                <td className="p-3 text-[11px] text-slate-500">{l.source || "—"}</td>
                <td className="p-3 text-[12px] text-slate-700 font-mono max-w-[400px] truncate">{l.message || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="text-center text-sm text-slate-400 py-8">无日志</p>}
      </div>
    </div>
  );
}
