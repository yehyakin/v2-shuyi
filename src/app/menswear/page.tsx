"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const API = "/api";
const norm = (v?: string | null) => (v || "").toLowerCase();

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "image": return <svg {...s}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
    case "upload": return <svg {...s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
    case "sparkles": return <svg {...s}><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/></svg>;
    case "loader": return <svg {...s} className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
    case "check": return <svg {...s}><path d="M20 6 9 17l-5-5"/></svg>;
    default: return <span />;
  }
}

function Pill({ tone, label }: { tone: string; label: string }) {
  const c: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    slate: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c[tone] || c.slate}`}>{label}</span>;
}

interface Asset { asset_id: string; filename: string; asset_type?: string; created_at: string; }
interface Workflow { workflow_id: string; status: string; idempotency_key?: string; result_asset?: { asset_id: string; url?: string; thumbnail_url?: string }; error?: string; created_at: string; }

export default function MenswearPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [workflowType, setWorkflowType] = useState("tryon");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingId, setPollingId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const fetchAssets = useCallback(() => {
    return fetch(`${API}/assets/list`, { cache: "no-store" })
      .then(res => res.json())
      .then(json => {
        setAssets(Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchWorkflows = useCallback(() => {
    return fetch(`${API}/workflow/monitor/menswear`)
      .then(res => res.json())
      .then(json => {
        setWorkflows(Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchAssets(); fetchWorkflows(); }, [fetchAssets, fetchWorkflows]);

  /* ── Poll ── */
  const pollWorkflow = useCallback(async (wid: string) => {
    try {
      const res = await fetch(`${API}/workflow/monitor/${wid}`);
      const json = await res.json();
      const wf = (json?.data || json) as Workflow;
      setWorkflows(prev => prev.map(w => w.workflow_id === wid ? wf : w));
      if (["completed","failed","cancelled","external_failed"].includes(norm(wf.status))) setPollingId(null);
    } catch { setPollingId(null); }
  }, []);

  useEffect(() => {
    if (!pollingId) return;
    const id = setInterval(() => pollWorkflow(pollingId), 3000);
    return () => clearInterval(id);
  }, [pollingId, pollWorkflow]);

  /* ── Upload ── */
  const handleUpload = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/assets/upload`, { method: "POST", body: form });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchAssets();
      if (fileInput.current) fileInput.current.value = "";
    } catch (e: unknown) { setError((e instanceof Error ? e.message : String(e))); }
    setUploading(false);
  };

  /* ── AI Analyze ── */
  const handleAnalyze = async () => {
    if (!selectedAsset) return;
    const asset = assets.find(a => a.asset_id === selectedAsset);
    const imageUrl = asset?.filename ? `https://picsum.photos/seed/${asset.asset_id}/600/800` : null;
    if (!imageUrl) return;
    setAnalyzing(true); setAiAnalysis(null);
    try {
      const res = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl, prompt: "分析这件服装的款式、面料、风格特点，以及适合搭配的方案，控制在150字以内。" }),
      });
      const data = await res.json();
      setAiAnalysis(data.choices?.[0]?.message?.content || "分析失败");
    } catch (e: unknown) { setAiAnalysis(`分析失败: ${(e instanceof Error ? e.message : String(e))}`); }
    setAnalyzing(false);
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!selectedAsset) return;
    setSubmitting(true); setError(null);
    const key = idempotencyKey.trim() || `ik-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    try {
      const res = await fetch(`${API}/workflow/generate-outfit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset_id: selectedAsset, workflow_type: workflowType, idempotency_key: key, dry_run: dryRun }),
      });
      const json = await res.json();
      const wf = (json?.data || json) as Workflow;
      if (wf.workflow_id) { setPollingId(wf.workflow_id); await fetchWorkflows(); }
      else setError(json?.error || "提交失败");
    } catch (e: unknown) { setError((e instanceof Error ? e.message : String(e))); }
    setSubmitting(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-5">
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight m-0">男装工作流</h1>
        <p className="text-[13px] text-gray-500 mt-1">上传商品图 → AI 视觉分析 → 生成穿搭方案</p>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600 flex items-center gap-2"><span>⚠️</span>{error}<button onClick={() => setError(null)} className="ml-auto text-[11px] text-red-400 hover:text-red-600 bg-transparent border-0 cursor-pointer">关闭</button></div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left */}
        <div className="space-y-4">
          {/* Upload */}
          <div className="p-5 rounded-xl bg-white border border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-900 mb-3">📤 上传商品图</h2>
            <div className="flex gap-2">
              <input ref={fileInput} type="file" accept="image/*" className="flex-1 text-[13px] text-gray-500 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-gray-900 file:text-white file:text-xs file:font-semibold file:cursor-pointer" />
              <button onClick={handleUpload} disabled={uploading}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold border-0 cursor-pointer hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-1.5">
                {uploading ? <Icon name="loader" size={14} /> : <Icon name="upload" size={14} />}
                {uploading ? "上传中…" : "上传"}
              </button>
            </div>
          </div>

          {/* Asset list */}
          <div className="p-5 rounded-xl bg-white border border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-900 mb-3">🖼 素材库 ({assets.length})</h2>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {assets.map(a => (
                <button key={a.asset_id} onClick={() => { setSelectedAsset(a.asset_id); setAiAnalysis(null); }}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all text-[11px] ${selectedAsset === a.asset_id ? "border-gray-900 bg-gray-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                  <div className="truncate font-mono text-gray-600">{a.filename || a.asset_id}</div>
                  <div className="text-gray-400 mt-0.5">{a.asset_type || "unknown"}</div>
                </button>
              ))}
              {assets.length === 0 && <p className="col-span-3 text-center text-[12px] text-gray-400 py-4">暂无素材，请上传</p>}
            </div>
          </div>

          {/* AI Analysis */}
          {selectedAsset && (
            <div className="p-5 rounded-xl bg-white border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-semibold text-gray-900 m-0">🔍 AI 视觉分析</h2>
                <button onClick={handleAnalyze} disabled={analyzing}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border-0 cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-1.5">
                  {analyzing ? <Icon name="loader" size={12} /> : <Icon name="sparkles" size={12} />}
                  {analyzing ? "分析中…" : "分析图片"}
                </button>
              </div>
              {aiAnalysis ? (
                <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-100 text-[13px] text-cyan-800 leading-relaxed">
                  <span className="font-semibold">AI：</span>{aiAnalysis}
                </div>
              ) : (
                <p className="text-[12px] text-gray-400">点击&quot;分析图片&quot;让 AI 识别服装特征并推荐搭配方案</p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="p-5 rounded-xl bg-white border border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-900 mb-3">⚡ 生成穿搭方案</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">工作流类型</label>
                <select value={workflowType} onChange={e => setWorkflowType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-700 bg-white">
                  <option value="tryon">虚拟试衣</option>
                  <option value="outfit">穿搭生成</option>
                  <option value="compose">图片合成</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">幂等键（可选）</label>
                <input value={idempotencyKey} onChange={e => setIdempotencyKey(e.target.value)}
                  placeholder="留空自动生成" className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] font-mono text-gray-500" />
              </div>
              <label className="flex items-center gap-2 text-[13px] text-gray-600 cursor-pointer">
                <input type="checkbox" checked={dryRun} onChange={e => setDryRun(e.target.checked)} className="rounded" />
                Dry Run 模式（不实际生成）
              </label>
              <button onClick={handleSubmit} disabled={!selectedAsset || submitting}
                className="w-full py-2.5 rounded-lg text-sm font-semibold border-0 cursor-pointer transition-colors bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50">
                {submitting ? "提交中…" : dryRun ? "Dry Run 提交" : "生成穿搭方案"}
              </button>
              {selectedAsset && <p className="text-[11px] text-gray-400 font-mono">选中: {selectedAsset}</p>}
            </div>
          </div>
        </div>

        {/* Right: Workflows */}
        <div className="p-5 rounded-xl bg-white border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[15px] font-semibold text-gray-900 m-0">📋 工作流记录 ({workflows.length})</h2>
            <button onClick={fetchWorkflows} className="text-[11px] text-cyan-600 font-semibold bg-transparent border-0 cursor-pointer hover:underline">刷新</button>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {workflows.map(wf => {
              const s = norm(wf.status);
              const tone = s === "completed" ? "green" : s === "running" || s === "external_polling" ? "cyan" : s === "pending" ? "amber" : s === "failed" ? "red" : "slate";
              const label: Record<string,string> = { completed:"已完成", running:"运行中", pending:"等待中", failed:"失败", cancelled:"已取消", external_polling:"轮询中" };
              return (
                <div key={wf.workflow_id} className="p-3 rounded-lg border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-[11px] font-mono text-gray-600">{wf.workflow_id.slice(0,24)}</code>
                    <Pill tone={tone} label={label[s] || wf.status} />
                  </div>
                  {wf.idempotency_key && <div className="text-[10px] text-gray-400 font-mono mb-1">幂等: {wf.idempotency_key}</div>}
                  {wf.error && <div className="text-[11px] text-red-500 mb-1">{wf.error}</div>}
                  {wf.result_asset && (
                    <div className="mt-2 rounded-lg overflow-hidden bg-gray-100 aspect-[3/2] flex items-center justify-center">
                      {wf.result_asset.thumbnail_url || wf.result_asset.url ? (
                        <img src={wf.result_asset.thumbnail_url || wf.result_asset.url} alt="Result" className="w-full h-full object-cover" />
                      ) : <span className="text-gray-400 text-sm">🖼 生成中…</span>}
                    </div>
                  )}
                </div>
              );
            })}
            {workflows.length === 0 && <p className="text-center text-[13px] text-gray-400 py-8">暂无工作流</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
