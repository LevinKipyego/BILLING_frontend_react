import { useState } from "react";
import {
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ServerStackIcon,
  CubeIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import type { Plan } from "./types/plan";

interface RouterScriptCardProps {
  plan: Plan;
  script: string;
  copied: boolean;
  onCopy: () => void;
}

export default function RouterScriptCard({
  plan,
  script,
  copied,
  onCopy,
}: RouterScriptCardProps) {
  const [expanded, setExpanded] = useState(false);

  const profile =
    plan.mikrotik_profile ||
    plan.name.replace(/\s+/g, "_").toLowerCase();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-lg">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-slate-800 dark:text-white">
              {plan.name}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                RouterOS
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Script Ready
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {expanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Summary */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CubeIcon className="h-4 w-4" />
              Profile
            </div>

            <div className="mt-1 truncate font-semibold">
              {profile}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <SignalIcon className="h-4 w-4" />
              Speed
            </div>

            <div className="mt-1 truncate font-semibold">
              {plan.rate_limit || "Unlimited"}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ServerStackIcon className="h-4 w-4" />
              Service
            </div>

            <div className="mt-1 truncate font-semibold uppercase">
              {plan.service_type || "HOTSPOT"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={onCopy}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <div className="flex items-center justify-center gap-2">
              {copied ? (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  Copied
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="h-5 w-5" />
                  Copy Script
                </>
              )}
            </div>
          </button>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {expanded ? "Hide Script" : "View Script"}
          </button>
        </div>
      </div>

      {/* Expandable Script */}
      <div
        className={`transition-all duration-300 ${
          expanded ? "max-h-[700px]" : "max-h-0"
        } overflow-hidden`}
      >
        <div className="border-t border-slate-700 bg-slate-950 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              RouterOS Script
            </span>

            <button
              onClick={onCopy}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Copy
            </button>
          </div>

          <pre className="overflow-auto rounded-xl bg-black p-4 text-sm text-green-400">
            <code>{script}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}