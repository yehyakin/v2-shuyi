"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── NAV (Clipcat exact structure) ── */

const NAV_SECTIONS = [
  {
    label: "创作",
    items: [
      { label: "视频营销Agent", href: "/", icon: "house" },
      { label: "爆款社区", href: "/inspiration", icon: "compass" },
      { label: "AI工具", href: "/ai-tools", icon: "sparkles" },
    ],
  },
  {
    label: "管理",
    items: [
      { label: "我的资产", href: "/assets", icon: "folder" },
      { label: "我的角色", href: "/agents", icon: "user" },
      { label: "全部任务", href: "/tasks", icon: "list-todo" },
    ],
  },
];

/* ── SVG Icons ── */

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "house": return <svg {...s}><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
    case "compass": return <svg {...s}><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></svg>;
    case "sparkles": return <svg {...s}><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>;
    case "folder": return <svg {...s}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>;
    case "user": return <svg {...s}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "list-todo": return <svg {...s}><path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><rect x="3" y="4" width="6" height="6" rx="1"/></svg>;
    case "search": return <svg {...s}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
    case "chevron-left": return <svg {...s}><path d="m15 18-6-6 6-6"/></svg>;
    case "menu": return <svg {...s}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
    case "globe": return <svg {...s}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/></svg>;
    case "file-text": return <svg {...s}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>;
    case "zap": return <svg {...s}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;
    default: return <span>{name}</span>;
  }
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fn = () => setT(new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }));
    fn(); const id = setInterval(fn, 30000); return () => clearInterval(id);
  }, []);
  return <span className="text-[11px] text-gray-400 font-mono">{t || "--:--"}</span>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const [previousPathname, setPreviousPathname] = useState(pathname);
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setMobileOpen(false);
  }

  const activeLabel = NAV_SECTIONS.flatMap(s => s.items).find(i => isActive(pathname, i.href))?.label ?? "视频营销Agent";

  return (
    <div ref={shellRef} className="flex h-screen overflow-hidden bg-white">
      {/* ═══ Sidebar ═══ */}
      <aside className={`${collapsed ? "w-0 md:w-[68px]" : "w-[256px]"} ${mobileOpen ? "fixed inset-y-0 left-0 z-40 w-[256px]" : "hidden md:flex"} flex-col bg-gray-50 border-r border-gray-100 transition-all duration-300 shrink-0`}>
        {/* Logo */}
        <div className={`h-16 flex items-center px-5 shrink-0 ${collapsed && !mobileOpen ? "justify-center" : ""}`}>
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ background: "linear-gradient(135deg, #0891b2 0%, #6366f1 100%)" }}>S</div>
            {(!collapsed || mobileOpen) && <span className="text-[15px] font-bold text-gray-900 whitespace-nowrap">SUPERCOLOR</span>}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 pt-4 pb-2 space-y-6">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              {(!collapsed || mobileOpen) && (
                <div className="px-3 mb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider select-none">{section.label}</div>
              )}
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium no-underline transition-all duration-150 group
                        ${active ? "bg-white text-gray-900 shadow-sm border border-gray-200/60" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"}`}
                      title={collapsed ? item.label : undefined}>
                      <span className={`shrink-0 transition-transform group-hover:scale-110 ${active ? "text-cyan-600" : ""}`}><Icon name={item.icon} size={20} /></span>
                      {(!collapsed || mobileOpen) && <span className="truncate whitespace-nowrap">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse */}
        <div className="px-3 pt-2 pb-4">
          <button onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-full items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-200/50 hover:text-gray-600 transition-all border-0 bg-transparent cursor-pointer">
            <Icon name="chevron-left" size={18} />
            {!collapsed && <span className="text-[13px] font-medium">收起导航</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="md:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />}

      {/* ═══ Main ═══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 px-4 md:px-8 flex items-center justify-between shrink-0 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 border-0 bg-transparent cursor-pointer"><Icon name="menu" size={20} /></button>
            <div className="hidden md:flex items-center gap-1.5 text-[13px] text-gray-400 min-w-[200px]">
              <span>SUPERCOLOR</span><span>/</span><strong className="text-gray-900 font-semibold">{activeLabel}</strong>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors"><Icon name="file-text" size={16} />使用文档</a>
            <div className="w-px h-4 bg-gray-200 hidden md:block" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />在线</span>
            <Clock />
            <button className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-gray-100 border-0 bg-transparent cursor-pointer tracking-wide"><Icon name="globe" size={16} />ZH</button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
