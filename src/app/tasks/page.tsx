"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const API = "/api";
const norm = (v?: string | null) => (v || "").toLowerCase();

const STATUS_CFG: Record<string, { tone: string; label: string }> = {
  completed: { tone: "green", label: "已完成" },
  running: { tone: "cyan", label: "运行中" },
  external_polling: { tone: "cyan", label: "轮询中" },
  pending: { tone: "amber", label: "等待中" },
  failed: { tone: "red", label: "失败" },
  external_failed: { tone: "red", label: "外部失败" },
  needs_codex_review: { tone: "violet", label: "待复核" },
  cancelled: { tone: "slate", label: "已取消" },
};

function Pill({ tone, label }: { tone: string; label: string }) {
  const colors: Record<string, string> = {
    green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    cyan:   "bg-cyan-50 text-cyan-700 border-cyan-200",
    amber:  "bg-amber-50 text-amber-700 border-amber-200",
    red:    "bg-red-50 text-red-700 border-red-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    slate:  "bg-gray-100 text-gray-600 border-gray-200",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colors[tone] || colors.slate}`}>{label}</span>;
}

interface Task {
  id: string; task_id?: string; status: string; risk_level?: string;
  priority?: string; task_type?: string; assigned_agent?: string;
  project?: string; created_at: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");

  const fetchTasks = useCallback(() => {
    return fetch(`${API}/tasks?limit=100`, { cache: "no-store" })
      .then(res => res.json())
      .then(json => {
        setTasks(Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetchTasks(); const id = setInterval(fetchTasks, 10000); return () => clearInterval(id); }, [fetchTasks]);

  const filtered = tasks.filter(t => {
    if (filterStatus !== "all" && norm(t.status) !== filterStatus) return false;
    if (filterRisk !== "all" && norm(t.risk_level) !== filterRisk) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-3 mb-5">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight m-0">全部任务</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">{tasks.length} 个任务</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap mb-4">
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100">
          {["all", "running", "pending", "completed", "failed"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-medium border-0 cursor-pointer transition-all
                ${filterStatus === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 bg-transparent hover:text-gray-700"}`}>
              {s === "all" ? "全部" : STATUS_CFG[s]?.label ?? s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100">
          {["all", "high", "medium", "low"].map(r => (
            <button key={r} onClick={() => setFilterRisk(r)}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-medium border-0 cursor-pointer transition-all
                ${filterRisk === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 bg-transparent hover:text-gray-700"}`}>
              {r === "all" ? "全部风险" : r === "high" ? "高风险" : r === "medium" ? "中风险" : "低风险"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="panel">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-gray-400">无匹配任务</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">任务 ID</th>
                <th className="text-left p-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">状态</th>
                <th className="text-left p-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">风险</th>
                <th className="text-left p-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">类型</th>
                <th className="text-left p-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">智能体</th>
                <th className="text-left p-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">时间</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const sc = STATUS_CFG[norm(t.status)] ?? { tone: "slate", label: t.status };
                const riskTone = norm(t.risk_level) === "high" || norm(t.risk_level) === "critical" ? "red"
                  : norm(t.risk_level) === "medium" ? "amber" : norm(t.risk_level) === "low" ? "green" : "slate";
                return (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3">
                      <Link href={`/tasks/${t.task_id || t.id}`} className="text-[12px] font-mono text-gray-900 no-underline hover:text-cyan-600">
                        {(t.task_id || t.id).slice(0, 28)}{(t.task_id || t.id).length > 28 ? "…" : ""}
                      </Link>
                    </td>
                    <td className="p-3"><Pill tone={sc.tone} label={sc.label} /></td>
                    <td className="p-3"><Pill tone={riskTone} label={t.risk_level || "—"} /></td>
                    <td className="p-3 text-[12px] text-gray-500">{t.task_type || "—"}</td>
                    <td className="p-3 text-[12px] text-gray-500">{t.assigned_agent || "—"}</td>
                    <td className="p-3 text-[11px] text-gray-400 font-mono whitespace-nowrap">
                      {new Date(t.created_at).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
