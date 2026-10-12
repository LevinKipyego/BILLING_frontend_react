
import { ShieldAlert, Terminal, Search, Hash } from "lucide-react";

interface IdlePortsProps {
  ports: string[];
}

const IdlePorts = ({ ports }: IdlePortsProps) => {
  if (!ports || ports.length === 0) return null;

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors dark:border-slate-700 dark:bg-gray-800 sm:p-4">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-amber-600 dark:border-slate-700 dark:text-amber-400">
            <ShieldAlert size={16} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Idle Ports
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active interfaces with no traffic
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
          {ports.length} detected
        </span>
      </header>

      {/* Description */}
      <div className="flex items-start gap-2 py-3">
        <Terminal
          size={14}
          className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500"
        />
        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
          The following ports are active but currently reporting no traffic.
        </p>
      </div>

      {/* Port list */}
      <div className="flex flex-wrap gap-2">
        {ports.map((port) => (
          <div
            key={port}
            className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2 transition-colors hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
          >
            <Hash
              size={13}
              className="shrink-0 text-slate-400 dark:text-slate-500"
            />
            <span className="break-all font-mono text-xs font-medium text-slate-700 dark:text-slate-200">
              {port}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 pt-3 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Search size={14} className="shrink-0" />
          <span>
            Review interface traffic and connection history.
          </span>
        </div>
      </footer>
    </section>
  );
};

export default IdlePorts;
