// src/components/tables/RouterTable.tsx
import RouterRow from "./RouterRow";
import type { Router } from "../../types/network";
import { 
  ServerStackIcon, 
  CircleStackIcon, 
  CpuChipIcon, 
  InboxIcon 
} from "@heroicons/react/24/outline";

interface RouterTableProps {
  routers: Router[];
}

export default function RouterTable({ routers }: RouterTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-md border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left min-w-[700px] md:min-w-full">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <ServerStackIcon className="w-3 h-3" />
                  Infrastructure Node
                </div>
              </th>
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Status</th>
              {/* Desktop Only Columns for cleaner mobile view if needed */}
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1.5">
                  <CpuChipIcon className="w-3 h-3" /> Load
                </div>
              </th>
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1.5">
                  <CircleStackIcon className="w-3 h-3" /> Memory
                </div>
              </th>
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Thermal</th>
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Latency</th>
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Sessions</th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-white/5">
            {Array.isArray(routers) && routers.length > 0 ? (
              routers.map((router: Router) => (
                <RouterRow key={router.id} router={router} />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-20">
                  <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                    <InboxIcon className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">
                      No matching infrastructure found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}