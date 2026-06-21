"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useHomeInteractions } from "@/hooks/useHomeInteractions";
import { fetchDashboardSummary } from "@/lib/api";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBeSiXGDRy9YN0B8YFkC1Ik96cbOueSlfrc3BD9QJPCzVGAHqKSEpDo9z-ngP9V_vm3I3lqoUsDSaFQPi4jy_bin3NeUMG3EOeGhuLyXIP3lERQKnUdGKwOA04vyRjVYZql8pL8yg2glFSfLA7o5a1M8pIAoUSoWqJBkk3L2G8HaWolrXu9CwYo-qalZ3LTM36IJsNPo-gC5Qczb6WJobkTIhkvb6J2L9FgdWMMSjmMmG43ZS6gzOzM32fW3bsy22KtjcHNEXUnRSl";

export default function Home() {
  const { heroSectionRef, heroImgRef } = useHomeInteractions();
  const [liveStats, setLiveStats] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDashboardSummary()
      .then((data) => {
        if (data) {
          setLiveStats({
            trains: String(data.total_trains ?? "—"),
            alerts: String(data.active_alerts ?? "—"),
            riskScore: String(data.average_risk_score ?? "—"),
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-grid-animate" />

      <main className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-3 md:p-6">
        {/* Hero Section */}
        <section
          ref={heroSectionRef}
          className="perspective-1000 stagger-reveal group relative mb-8 h-[300px] overflow-hidden rounded-xl border border-outline-variant/20 shadow-2xl md:h-[480px]"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={heroImgRef}
              src={HERO_IMAGE}
              alt="RailMind Hero Visual"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
          <div className="relative z-10 flex h-full max-w-3xl flex-col justify-end p-4 md:p-10">
            <div className="float-anim [animation-delay:0.1s]">
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-primary backdrop-blur-sm">
                <span className="led-dot led-pulse bg-primary" />
                <span className="font-label-caps text-label-caps">PHASE 3 LIVE SYSTEM</span>
              </div>
            </div>
            <h1 className="float-anim mb-4 font-display-lg text-[28px] leading-[32px] text-white drop-shadow-lg md:text-[48px] md:leading-[52px] [animation-delay:0.3s]">
              Command the Future of Rail Operations
            </h1>
            <p className="float-anim max-w-xl font-normal text-headline-md text-on-surface-variant [animation-delay:0.5s]">
              Orchestrating high-speed networks through AI-driven logistics, real-time telemetry, and
              proactive risk mitigation.
            </p>
            <div className="float-anim mt-6 flex flex-col gap-3 md:mt-8 md:flex-row md:gap-4 [animation-delay:0.7s]">
              <Link
                href="/dashboard"
                className="magnetic rounded-lg bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:brightness-110"
              >
                Launch Console
              </Link>
              <Link
                href="/map"
                className="magnetic rounded-lg border border-outline-variant bg-surface/40 px-8 py-3 font-bold backdrop-blur-md transition-all hover:bg-surface"
              >
                View Network
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="stagger-reveal mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 [animation-delay:0.2s]">
          <div className="tilt-card flex cursor-default flex-col gap-1 rounded-xl border border-outline-variant/30 bg-surface-container p-5 transition-colors hover:border-primary/50">
            <span className="glitch-hover font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
              Active Trains
            </span>
            <div className="flex items-end justify-between">
              <span className="font-data-mono font-display-lg text-[24px] text-white md:text-[32px]">{liveStats.trains || "1,402"}</span>
              <span className="material-symbols-outlined text-primary">train</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full w-[82%] bg-primary" />
            </div>
          </div>
          <div className="tilt-card flex cursor-default flex-col gap-1 rounded-xl border border-outline-variant/30 bg-surface-container p-5 transition-colors hover:border-primary/50">
            <span className="glitch-hover font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
              Stations
            </span>
            <div className="flex items-end justify-between">
              <span className="font-data-mono font-display-lg text-[24px] text-white md:text-[32px]">847</span>
              <span className="material-symbols-outlined text-secondary">location_on</span>
            </div>
          </div>
          <div className="alert-rings tilt-card group flex cursor-default flex-col gap-1 rounded-xl border border-error/50 bg-surface-container p-5">
            <span className="glitch-hover font-label-caps text-label-caps uppercase tracking-widest text-error">
              Active Alerts
            </span>
            <div className="flex items-end justify-between">
              <span className="font-data-mono font-display-lg text-[24px] text-error md:text-[32px]">{liveStats.alerts || "12"}</span>
              <span className="material-symbols-outlined led-pulse text-error">warning</span>
            </div>
          </div>
          <div className="tilt-card flex cursor-default flex-col gap-1 rounded-xl border border-outline-variant/30 bg-surface-container p-5 transition-colors hover:border-tertiary/50">
            <span className="glitch-hover font-label-caps text-label-caps uppercase tracking-widest text-tertiary">
              Risk Zones
            </span>
            <div className="flex items-end justify-between">
              <span className="font-data-mono font-display-lg text-[24px] text-tertiary md:text-[32px]">05</span>
              <span className="material-symbols-outlined text-tertiary">dangerous</span>
            </div>
          </div>
        </section>

        {/* Dashboard Area */}
        <div className="stagger-reveal mb-8 grid grid-cols-12 gap-6 [animation-delay:0.4s]">
          <div className="relative col-span-12 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container p-4 lg:col-span-8 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-white">System Status Dashboard</h3>
              <Link
                href="/dashboard"
                className="magnetic flex items-center gap-1 font-label-caps text-label-caps text-primary transition-all hover:gap-2"
              >
                VIEW FULL REPORT
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4 text-center">
                <span className="block font-data-mono text-[36px] font-black text-primary">94%</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">On-Time Reliability</span>
              </div>
              <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4 text-center">
                <span className="block font-data-mono text-[36px] font-black text-tertiary">4%</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Minor Delays</span>
              </div>
              <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4 text-center">
                <span className="block font-data-mono text-[36px] font-black text-error">2%</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Critical Status</span>
              </div>
            </div>
            <div className="mt-6 border-t border-outline-variant/20 pt-6">
              <span className="mb-4 block font-label-caps text-label-caps text-on-surface-variant">
                HIGH RISK ZONE SUMMARY
              </span>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-error/20 bg-error/10 p-2">
                  <div className="flex items-center gap-3">
                    <span className="led-dot led-pulse bg-error" />
                    <span className="font-data-mono text-on-background">
                      ZONE_77: Thermal Anomaly detected at Junction Alpha
                    </span>
                  </div>
                  <span className="font-label-caps text-error">IMMEDIATE ACTION</span>
                </div>
                <div className="flex items-center justify-between rounded border border-tertiary/20 bg-tertiary/10 p-2">
                  <div className="flex items-center gap-3">
                    <span className="led-dot bg-tertiary" />
                    <span className="font-data-mono text-on-background">
                      ZONE_12: Track Maintenance Delay (+12min)
                    </span>
                  </div>
                  <span className="font-label-caps text-tertiary">MONITORING</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col rounded-xl border border-outline-variant/30 bg-surface-container p-6 lg:col-span-4">
            <h3 className="mb-4 font-headline-md text-headline-md text-white">Railway News</h3>
            <div className="max-h-[300px] flex-grow space-y-4 overflow-y-auto pr-2">
              <div className="cursor-pointer border-l-2 border-primary py-1 pl-4 transition-colors hover:bg-primary/5">
                <span className="font-label-caps text-label-caps text-primary">TECH UPDATE</span>
                <p className="mt-1 font-body-sm text-on-background">
                  Autonomous shunting trials complete in Sector 4.
                </p>
                <span className="font-data-mono text-[10px] text-on-surface-variant">2H AGO</span>
              </div>
              <div className="cursor-pointer border-l-2 border-outline-variant py-1 pl-4 transition-colors hover:bg-surface-container-high">
                <span className="font-label-caps text-label-caps text-on-surface-variant">INFRASTRUCTURE</span>
                <p className="mt-1 font-body-sm text-on-background">
                  Expansion of high-speed maglev lines approved.
                </p>
                <span className="font-data-mono text-[10px] text-on-surface-variant">5H AGO</span>
              </div>
              <div className="cursor-pointer border-l-2 border-outline-variant py-1 pl-4 transition-colors hover:bg-surface-container-high">
                <span className="font-label-caps text-label-caps text-on-surface-variant">PERSONNEL</span>
                <p className="mt-1 font-body-sm text-on-background">
                  New shift protocol for automated dispatch centers.
                </p>
                <span className="font-data-mono text-[10px] text-on-surface-variant">YESTERDAY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Critical Incidents */}
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-white">Recent Critical Incidents</h3>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border border-outline-variant p-2 transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                className="rounded border border-outline-variant p-2 transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
            <div className="flex min-w-[300px] flex-col gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-high p-4">
              <span className="font-label-caps text-label-caps text-error">INC_4092</span>
              <p className="font-medium text-white">Brake System Failure (Train 102)</p>
              <div className="mt-auto flex justify-between font-data-mono text-[10px] text-on-surface-variant">
                <span>COORDINATES: 45.2, -12.4</span>
                <span>14:32:01</span>
              </div>
            </div>
            <div className="flex min-w-[300px] flex-col gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-high p-4">
              <span className="font-label-caps text-label-caps text-tertiary">INC_3812</span>
              <p className="font-medium text-white">Platform Obstruction (Station Epsilon)</p>
              <div className="mt-auto flex justify-between font-data-mono text-[10px] text-on-surface-variant">
                <span>COORDINATES: 48.1, -11.9</span>
                <span>14:15:45</span>
              </div>
            </div>
            <div className="flex min-w-[300px] flex-col gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-high p-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">INC_4011</span>
              <p className="font-medium text-white">Signal Sync Latency (+200ms)</p>
              <div className="mt-auto flex justify-between font-data-mono text-[10px] text-on-surface-variant">
                <span>COORDINATES: 44.0, -13.1</span>
                <span>13:55:12</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="perspective-1000 stagger-reveal grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-5 [animation-delay:0.6s]">
          <Link
            href="/dashboard"
            className="tilt-card preserve-3d group flex h-full cursor-pointer flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6"
          >
            <span className="material-symbols-outlined mb-4 text-[40px] text-primary transition-transform group-hover:scale-110">
              terminal
            </span>
            <h4 className="mb-2 font-headline-md text-headline-md text-white">Command Center</h4>
            <p className="flex-grow text-body-sm text-on-surface-variant">
              Advanced control terminal for manual intervention and automated overrides.
            </p>
            <div className="mt-4 border-t border-outline-variant/20 pt-4">
              <span className="inline-block font-label-caps text-label-caps text-primary transition-transform group-hover:translate-x-1">
                GO TO CONSOLE →
              </span>
            </div>
          </Link>
          <Link
            href="/map"
            className="tilt-card preserve-3d group flex h-full cursor-pointer flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6"
          >
            <span className="material-symbols-outlined mb-4 text-[40px] text-secondary transition-transform group-hover:scale-110">
              map
            </span>
            <h4 className="mb-2 font-headline-md text-headline-md text-white">Network Map</h4>
            <p className="flex-grow text-body-sm text-on-surface-variant">
              Interactive real-time topology showing every node and mobile asset.
            </p>
            <div className="mt-4 border-t border-outline-variant/20 pt-4">
              <span className="inline-block font-label-caps text-label-caps text-secondary transition-transform group-hover:translate-x-1">
                LAUNCH MAP →
              </span>
            </div>
          </Link>
          <Link
            href="/alerts"
            className="tilt-card preserve-3d group flex h-full cursor-pointer flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6"
          >
            <span className="material-symbols-outlined mb-4 text-[40px] text-error transition-transform group-hover:scale-110">
              troubleshoot
            </span>
            <h4 className="mb-2 font-headline-md text-headline-md text-white">Incidents</h4>
            <p className="flex-grow text-body-sm text-on-surface-variant">
              Historical analysis and real-time tracking of all system disturbances.
            </p>
            <div className="mt-4 border-t border-outline-variant/20 pt-4">
              <span className="inline-block font-label-caps text-label-caps text-error transition-transform group-hover:translate-x-1">
                VIEW LOGS →
              </span>
            </div>
          </Link>
          <Link
            href="/cctv"
            className="tilt-card preserve-3d group flex h-full cursor-pointer flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6"
          >
            <span className="material-symbols-outlined mb-4 text-[40px] text-tertiary transition-transform group-hover:scale-110">
              videocam
            </span>
            <h4 className="mb-2 font-headline-md text-headline-md text-white">CCTV Live</h4>
            <p className="flex-grow text-body-sm text-on-surface-variant">
              AI-powered surveillance feed with automatic anomaly detection.
            </p>
            <div className="mt-4 border-t border-outline-variant/20 pt-4">
              <span className="inline-block font-label-caps text-label-caps text-tertiary transition-transform group-hover:translate-x-1">
                OPEN FEEDS →
              </span>
            </div>
          </Link>
          <Link
            href="/assistant"
            className="tilt-card preserve-3d group flex h-full cursor-pointer flex-col rounded-xl bg-primary p-6 text-on-primary shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined material-symbols-fill mb-4 text-[40px] transition-transform group-hover:rotate-12">
              psychology
            </span>
            <h4 className="mb-2 font-headline-md text-headline-md">AI Assistant</h4>
            <p className="flex-grow text-body-sm text-on-primary/80">
              Natural language interface for deep system queries and RAG-based intelligence.
            </p>
            <div className="mt-4 border-t border-on-primary/20 pt-4">
              <span className="inline-block font-label-caps text-label-caps transition-transform group-hover:translate-x-1">
                START CHAT →
              </span>
            </div>
          </Link>
        </section>

        {/* Command Bar Footer */}
        <footer className="stagger-reveal mt-8 flex items-center gap-4 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-3 md:mt-16 [animation-delay:0.8s]">
          <span className="material-symbols-outlined text-on-surface-variant">keyboard_command_key</span>
          <input
            className="flex-grow border-none bg-transparent font-data-mono text-data-mono text-on-background placeholder:text-on-surface-variant/40 focus:ring-0"
            placeholder="Type a command (e.g., /reroute T-102 or /status sector-4)..."
            type="text"
          />
          <div className="flex gap-2">
            <kbd className="rounded bg-surface-container px-2 py-1 font-data-mono text-[10px] text-on-surface-variant">
              ALT
            </kbd>
            <kbd className="rounded bg-surface-container px-2 py-1 font-data-mono text-[10px] text-on-surface-variant">
              K
            </kbd>
          </div>
        </footer>
      </main>

      {/* Floating Atmosphere Elements */}
      <div className="pointer-events-none fixed left-0 top-0 z-[-2] h-full w-full overflow-hidden opacity-30">
        <div className="absolute -left-64 -top-64 h-[600px] w-[600px] animate-pulse rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] animate-pulse rounded-full bg-secondary/10 blur-[120px] [animation-delay:1.5s]" />
      </div>
    </>
  );
}
