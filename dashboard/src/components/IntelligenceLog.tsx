"use client";

import { useEffect, useRef, useState } from "react";
import type { IntelligenceLog, SuggestedAction } from "@/lib/types";

interface IntelligenceLogPanelProps {
  logs: IntelligenceLog[];
  suggestedAction: SuggestedAction;
  streamLogs?: IntelligenceLog[];
}

function logMessageClass(type: IntelligenceLog["type"]): string {
  switch (type) {
    case "system":
      return "text-primary-fixed-dim";
    case "anomaly":
      return "border-l-2 border-error bg-error/10 px-2 py-1 text-error";
    case "recommendation":
      return "text-primary";
    case "info":
      return "text-on-surface";
  }
}

export default function IntelligenceLogPanel({ logs, suggestedAction, streamLogs = [] }: IntelligenceLogPanelProps) {
  const [visibleLogs, setVisibleLogs] = useState<IntelligenceLog[]>(logs);
  const [streamIndex, setStreamIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streamIndex >= streamLogs.length) return;

    const delay = 3000 + Math.floor(Math.random() * 5000);
    const timer = window.setTimeout(() => {
      setVisibleLogs((prev) => [...prev, streamLogs[streamIndex]]);
      setStreamIndex((prev) => prev + 1);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [streamIndex, streamLogs]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleLogs]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-container-lowest">
      <div className="border-b border-outline-variant/30 px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">auto_awesome</span>
          <h2 className="font-headline-md text-headline-md text-white">Intelligence Log</h2>
        </div>
        <p className="mt-1 font-label-caps text-label-caps text-on-surface-variant">
          RAG-Agent Analysis | Active
        </p>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 font-data-mono text-data-mono">
        {visibleLogs.map((log, index) => {
          const isLast = index === visibleLogs.length - 1;
          const messageClass = logMessageClass(log.type);
          const isBlock = log.type === "anomaly";

          return (
            <div
              key={`${log.timestamp}-${log.message}-${index}`}
              className={`transition-opacity duration-500 ${isLast ? "typing-cursor opacity-100" : "opacity-90"}`}
            >
              <span className="text-outline">[{log.timestamp}]</span>{" "}
              {isBlock ? (
                <span className={messageClass}>{log.message}</span>
              ) : (
                <span className={messageClass}>{log.message}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-outline-variant/30 p-4">
        <div className="glass-card rounded-lg p-4">
          <span className="mb-2 block font-label-caps text-label-caps text-primary">Suggested Action</span>
          <p className="mb-4 text-body-sm text-on-surface-variant">{suggestedAction.description}</p>
          {suggestedAction.canAuthorize && (
            <button
              type="button"
              className="w-full rounded bg-primary px-4 py-2 font-label-caps text-label-caps text-on-primary transition-colors hover:brightness-110"
            >
              Authorize AI Intervention
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
