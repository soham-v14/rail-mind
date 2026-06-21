"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Home, Map, Bell, Camera, Bot,
  ChevronLeft, Menu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", mobileLabel: "Home", icon: Home },
  { href: "/dashboard", label: "Command Center", mobileLabel: "Center", icon: LayoutDashboard },
  { href: "/map", label: "Live Map", mobileLabel: "Map", icon: Map },
  { href: "/alerts", label: "Alerts", mobileLabel: "Alerts", icon: Bell },
  { href: "/cctv", label: "Surveillance", mobileLabel: "CCTV", icon: Camera },
  { href: "/assistant", label: "AI Assistant", mobileLabel: "AI", icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-700 bg-slate-900 px-1 py-1 md:hidden">
        <Link href="/" className="flex flex-col items-center gap-0 rounded-lg px-1 py-1">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600/20 ring-1 ring-blue-500/30 mb-0.5">
            <img src="/logo.svg" alt="RailMind" className="w-5 h-5" />
          </div>
          <span className="text-[8px] text-blue-400 font-semibold leading-tight">RailMind</span>
        </Link>
        {navItems.slice(1).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0 rounded-lg px-1 py-1 transition ${
                active ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] leading-tight">{item.mobileLabel}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop sidebar */}
      <aside
        className={`hidden ${
          collapsed ? "w-16" : "w-60"
        } bg-slate-900 border-r border-slate-700 flex-col transition-all duration-200 flex-shrink-0 md:flex`}
      >
        <div className="flex items-center justify-between px-3 h-16 border-b border-slate-700">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20">
                <img src="/logo.svg" alt="RailMind" className="w-8 h-8" />
              </div>
              <div>
                <span className="block text-white text-base font-bold leading-tight">RailMind</span>
                <span className="block text-[10px] text-blue-400/60 font-mono tracking-wider">v3.0 LIVE</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-full flex justify-center">
              <Link href="/">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/20 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20">
                  <img src="/logo.svg" alt="RailMind" className="w-7 h-7" />
                </div>
              </Link>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white transition p-1"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 py-3 space-y-1 px-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
