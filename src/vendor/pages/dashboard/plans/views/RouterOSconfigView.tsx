import { useMemo, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline";

import RouterToolbar from "../RouterToolbar";
import RouterScriptCard from "../RouterScriptCard";
import { exportRSC, exportTXT } from "../utils/download";

import type { Plan } from "../types/plan";
import CodeEditor from "../monaco/CodeEditor";
interface RouterConfigViewProps {
  plans: Plan[];
  generateMikrotikScript: (plan: Plan) => string;
  onCopy: (key: string, text: string) => void;
  copiedId: string | number | null;
}

export default function RouterConfigView({
  plans,
  generateMikrotikScript,
  onCopy,
  copiedId,
}: RouterConfigViewProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const q = search.toLowerCase();

      return (
        plan.name.toLowerCase().includes(q) ||
        (plan.mikrotik_profile || "")
          .toLowerCase()
          .includes(q) ||
        (plan.rate_limit || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [plans, search]);

  const combinedScript = useMemo(() => {
    return filteredPlans
      .map((plan) => generateMikrotikScript(plan))
      .join("\n\n");
  }, [filteredPlans, generateMikrotikScript]);

  return (
    <div className="space-y-6">
      {/* Hero */}

      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white">

        <div className="flex items-center gap-3">

          <ServerStackIcon className="h-8 w-8 text-green-400" />

          <div>

            <h2 className="text-2xl font-bold">

              RouterOS Configuration Generator

            </h2>

            <p className="mt-1 text-sm text-slate-300">

              Generate MikroTik profiles, export RouterOS
              scripts, and import directly into your routers.

            </p>

          </div>

        </div>

      </div>

      {/* Toolbar */}

      <RouterToolbar
        search={search}
        onSearch={setSearch}
        copied={copiedId === "router_all"}
        onCopyAll={() =>
          onCopy("router_all", combinedScript)
        }
        onExportRsc={() =>
          exportRSC(combinedScript)
        }
        onExportTxt={() =>
          exportTXT(combinedScript)
        }
      />

      {/* Combined Script */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between bg-slate-100 px-5 py-4 dark:bg-slate-800"
        >
          <div className="flex items-center gap-2">

            <ServerStackIcon className="h-5 w-5 text-green-500" />

            <span className="font-semibold">

              Combined RouterOS Script

            </span>

          </div>

          {expanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>

        {expanded && (
          <div className="bg-slate-950 p-5">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-xs uppercase tracking-widest text-slate-400">

                Ready for Import

              </span>

              <button
                onClick={() =>
                  onCopy(
                    "router_all",
                    combinedScript
                  )
                }
                className="text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                {copiedId === "router_all"
                  ? "Copied"
                  : "Copy"}
              </button>

            </div>

            <CodeEditor
                  language="shell"
                  title="RouterOS Script"
                  value={combinedScript || "# No RouterOS configuration generated"}
                  copied={copiedId === "router_all"}
                  onCopy={() => onCopy("router_all", combinedScript)}
              />

          </div>
        )}
      </div>

      {/* Cards */}

      <div className="grid gap-5">

        {filteredPlans.map((plan) => (

          <RouterScriptCard
            key={plan.id}
            plan={plan}
            script={generateMikrotikScript(plan)}
            copied={
              copiedId === `ros_${plan.id}`
            }
            onCopy={() =>
              onCopy(
                `ros_${plan.id}`,
                generateMikrotikScript(plan)
              )
            }
          />

        ))}

      </div>

      {/* Empty */}

      {filteredPlans.length === 0 && (

        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">

          <ServerStackIcon className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 text-lg font-semibold">

            No RouterOS profiles found

          </h3>

          <p className="mt-2 text-slate-500">

            Try a different search term.

          </p>

        </div>

      )}
    </div>
  );
}