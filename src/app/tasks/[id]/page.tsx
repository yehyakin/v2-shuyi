"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API = "/api";
const norm = (v?: string | null) => (v || "").toLowerCase();

/* ── Config ── */
const STATUS_CFG: Record<string, { tone: string; label: string }> = {
  completed: { tone: "green", label: "已完成" },
  running: { tone: "cyan", label: "运行中" },
  external_polling: { tone: "cyan", label: "轮询中" },
  pending: { tone: "amber", label: "等待中" },
  waiting_for_agent: { tone: "amber", label: "等待智能体" },
  pending_confirmation: { tone: "amber", label: "待确认" },
  failed: { tone: "red", label: "失败" },
  external_failed: { tone: "red", label: "外部失败" },
  needs_codex_review: { tone: "violet", label: "待复核" },
  cancelled: { tone: "slate", label: "已取消" },
  dry_run_pending: { tone: "amber", label: "Dry Run 待确认" },
};

const TONES: Record<string, { bg: string; text: string; dot: string }> = {
  green:  { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  cyan:   { bg: "#ECFEFF", text: "#155E75", dot: "#06B6D4" },
  amber:  { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
  red:    { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  violet: { bg: "#F5F3FF", text: "#5B21B6", dot: "#8B5CF6" },
  slate:  { bg: "#F8FAFC", text: "#475569", dot: "#94A3B8" },
};

function Pill({ tone, label }: { tone: string; label: string }) {
  const c = TONES[tone] ?? TONES.slate;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.dot}20` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
      {label}
    </span>
  );
}

/* ── Info Row ── */
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100/80 last:border-b-0">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="text-[13px] text-slate-700 text-right max-w-[60%]">{children}</div>
    </div>
  );
}

/* ── Types ── */
interface Task {
  id: string; task_id?: string; status: string; risk_level?: string;
  priority?: string; task_type?: string; source?: string; sender?: string;
  assigned_agent?: string; project?: string;
  created_at?: string; started_at?: string; completed_at?: string;
  payload?: Record<string, unknown>;
  result?: Record<string, unknown>;
  error_message?: string;
  idempotency_key?: string;
  monitor_url?: string;
  billing_risk_level?: string;
}

interface TaskEvent {
  event_type: string; message: string; created_at: string;
}

function getDataObject<T>(json: unknown): T | null {
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    if (obj.data && typeof obj.data === "object") return obj.data as T;
    if (obj.id || obj.task_id) return json as T;
  }
  return null;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

/* ── Page ── */
export default function TaskDetailPage() {
  const params = useParams();
  const taskId = decodeURIComponent(Array.isArray(params.id) ? params.id[0] : params.id ?? "");

  const [task, setTask] = useState<Task | null>(null);
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const [tRes, eRes] = await Promise.allSettled([
      fetch(`${API}/tasks/${encodeURIComponent(taskId)}`, { cache: "no-store" }),
      fetch(`${API}/tasks/${encodeURIComponent(taskId)}/events`, { cache: "no-store" }),
    ]);
    if (tRes.status === "fulfilled" && tRes.value.ok) {
      const json = await tRes.value.json();
      const t = getDataObject<Task>(json);
      if (t) setTask(t); else setError("任务不存在");
    } else setError("加载任务失败");
    if (eRes.status === "fulfilled" && eRes.value.ok) {
      const json = await eRes.value.json();
      setEvents(Array.isArray(json?.events) ? json.events : Array.isArray(json) ? json : []);
    }
    setLoading(false);
  }, [taskId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="flex flex-col items-center gap-3"><div className="w-8 h-8 border-[3px] border-slate-200 border-t-cyan-500 rounded-full animate-spin" /><span className="text-sm text-slate-500">加载中…</span></div></div>;
  }
  if (error || !task) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="panel p-6 text-center max-w-[360px]">
          <div className="text-2xl mb-3">⚠️</div>
          <div className="text-sm text-red-600 mb-4">{error || "任务不存在"}</div>
          <button onClick={fetchAll} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-semibold cursor-pointer">重试</button>
        </div>
      </div>
    );
  }

  const sc = STATUS_CFG[norm(task.status)] ?? { tone: "slate", label: task.status };
  const riskTone = norm(task.risk_level) === "high" || norm(task.risk_level) === "critical" ? "red"
    : norm(task.risk_level) === "medium" ? "amber" : norm(task.risk_level) === "low" ? "green" : "slate";

  return (
    <div className="flex flex-col gap-4 max-w-[1200px] mx-auto w-full">
      {/* Top Bar */}
      <div className="panel-chrome flex items-center justify-between flex-wrap gap-3 px-5 py-3.5" style={{ borderRadius: 14 }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <Link href="/tasks" className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 no-underline shrink-0">← 任务列表</Link>
          <Pill tone={sc.tone} label={sc.label} />
          <code className="text-[12px] font-mono text-cyan-600 truncate">{task.task_id || task.id}</code>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          {task.assigned_agent && <Pill tone="violet" label={task.assigned_agent} />}
          {task.project && <span className="text-[11px] text-slate-400">{task.project}</span>}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
        {/* Left */}
        <div className="flex flex-col gap-4">
          {/* Overview */}
          <div className="panel p-0">
            <div className="px-4 py-3 border-b border-slate-200/60">
              <span className="text-[12px] font-semibold text-slate-900 tracking-wide">基本信息</span>
            </div>
            <div className="px-4 py-1">
              <InfoRow label="任务 ID"><code className="text-[11px] font-mono text-cyan-600">{task.task_id || task.id}</code></InfoRow>
              {task.project && <InfoRow label="项目">{task.project}</InfoRow>}
              <InfoRow label="状态"><Pill tone={sc.tone} label={sc.label} /></InfoRow>
              <InfoRow label="风险等级"><Pill tone={riskTone} label={task.risk_level || "—"} /></InfoRow>
              <InfoRow label="优先级">{task.priority || "—"}</InfoRow>
              <InfoRow label="任务类型">{task.task_type || "—"}</InfoRow>
              <InfoRow label="来源">{task.source || "—"}</InfoRow>
              {task.sender && <InfoRow label="发送者">{task.sender}</InfoRow>}
              <InfoRow label="创建时间">{formatDate(task.created_at)}</InfoRow>
              <InfoRow label="开始时间">{formatDate(task.started_at)}</InfoRow>
              <InfoRow label="完成时间">{formatDate(task.completed_at)}</InfoRow>
            </div>
          </div>

          {/* Error Message */}
          {task.error_message && (
            <div className="panel p-4" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
              <div className="flex items-center gap-2 mb-2"><span className="text-base">❌</span><span className="text-[12px] font-semibold text-red-600">错误信息</span></div>
              <pre className="text-[11px] font-mono text-red-700 whitespace-pre-wrap m-0 max-h-40 overflow-y-auto">{task.error_message}</pre>
            </div>
          )}

          {/* Result */}
          {task.result && (
            <div className="panel p-0">
              <div className="px-4 py-3 border-b border-slate-200/60"><span className="text-[12px] font-semibold text-slate-900 tracking-wide">任务结果</span></div>
              <div className="p-4 max-h-48 overflow-y-auto">
                <pre className="text-[11px] font-mono text-slate-600 whitespace-pre-wrap m-0">{JSON.stringify(task.result, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Events Timeline */}
          <div className="panel p-0">
            <div className="px-4 py-3 border-b border-slate-200/60"><span className="text-[12px] font-semibold text-slate-900 tracking-wide">事件时间线</span></div>
            <div className="px-4 py-2 max-h-64 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">暂无事件</p>
              ) : (
                events.map((ev, i) => {
                  const icons: Record<string, string> = {
                    task_created: "📋", risk_checked: "🔍", task_started: "▶️",
                    external_completed: "✅", asset_registered: "🗂️",
                    task_completed: "🎉", task_failed: "❌",
                  };
                  return (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100/80 last:border-b-0">
                      <span className="text-lg shrink-0">{icons[ev.event_type] || "📌"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-slate-700 m-0">{ev.message}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{formatDate(ev.created_at)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-[82px]">
          {/* Actions */}
          <div className="panel p-0">
            <div className="px-4 py-3 border-b border-slate-200/60"><span className="text-[12px] font-semibold text-slate-900 tracking-wide">操作</span></div>
            <div className="p-3 flex flex-col gap-2">
              <button onClick={fetchAll} className="w-full px-4 py-2.5 rounded-[10px] border-0 bg-slate-100 text-slate-700 text-[13px] font-semibold cursor-pointer hover:bg-slate-200 transition-colors">🔄 刷新</button>
              <button onClick={() => window.print()} className="w-full px-4 py-2.5 rounded-[10px] border-0 bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold cursor-pointer hover:bg-slate-50 transition-colors">🖨 打印</button>
            </div>
          </div>

          {/* Billing Risk */}
          {task.billing_risk_level && (
            <div className="panel p-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">计费风险</div>
              <Pill tone={task.billing_risk_level === "high" ? "red" : task.billing_risk_level === "medium" ? "amber" : "green"} label={task.billing_risk_level} />
            </div>
          )}

          {/* Idempotency */}
          {task.idempotency_key && (
            <div className="panel p-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">幂等键</div>
              <code className="text-[11px] font-mono text-slate-500 break-all">{task.idempotency_key}</code>
            </div>
          )}

          {/* Monitor URL */}
          {task.monitor_url && (
            <div className="panel p-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">监控</div>
              <a href={task.monitor_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-cyan-600 break-all hover:underline">{task.monitor_url}</a>
            </div>
          )}

          {/* Raw Metadata */}
          <details className="panel p-0 cursor-pointer">
            <summary className="px-4 py-3 text-[12px] font-semibold text-slate-900 tracking-wide list-none select-none">📋 原始数据</summary>
            <div className="p-4 max-h-48 overflow-y-auto border-t border-slate-200/60">
              <pre className="text-[10px] font-mono text-slate-500 whitespace-pre-wrap m-0">{JSON.stringify(task, null, 2)}</pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
