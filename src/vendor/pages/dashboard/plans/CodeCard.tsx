import { useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CodeBracketIcon,
  Square2StackIcon,
  CurrencyDollarIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import type { Plan } from "./types/plan";

interface CodeCardProps {
  plan: Plan;
  html: string;
  copied: boolean;
  onCopy: () => void;
}

export default function CodeCard({
  plan,
  html,
  copied,
  onCopy,
}: CodeCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-slate-800 dark:text-white">
              {plan.name}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {plan.service_type ?? "HOTSPOT"}
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                HTML Ready
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {expanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
            <div className="flex items-center gap-2 text-slate-500">
              <CurrencyDollarIcon className="h-4 w-4" />
              <span className="text-xs">Price</span>
            </div>

            <div className="mt-1 font-bold">
              KES {plan.price}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
            <div className="text-xs text-slate-500">
              Duration
            </div>

            <div className="mt-1 font-bold">
              {plan.duration_minutes} mins
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
            <div className="flex items-center gap-2 text-slate-500">
              <SignalIcon className="h-4 w-4" />
              <span className="text-xs">Speed</span>
            </div>

            <div className="mt-1 font-bold truncate">
              {plan.rate_limit || "Unlimited"}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCopy}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold transition hover:bg-blue-700"
          >
            <div className="flex items-center justify-center gap-2">
              {copied ? (
                <>
                  <CheckIcon className="h-5 w-5" />
                  Copied
                </>
              ) : (
                <>
                  <Square2StackIcon className="h-5 w-5" />
                  Copy HTML
                </>
              )}
            </div>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <CodeBracketIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Expandable Code */}
      <div
        className={`transition-all duration-300 ${
          expanded
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-950 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Generated HTML
            </span>

            <button
              onClick={onCopy}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Copy
            </button>
          </div>

          <pre className="overflow-auto rounded-xl bg-black p-4 text-sm text-emerald-400">
            <code>{html}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}