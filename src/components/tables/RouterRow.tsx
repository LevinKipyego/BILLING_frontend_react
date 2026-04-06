// src/components/tables/RouterRow.tsx
import { useNavigate } from "react-router-dom";
import { 
  ChevronRightIcon, 
  CpuChipIcon, 
  HashtagIcon, 
  GlobeAltIcon 
} from "@heroicons/react/24/outline";
import HealthBadge from "../badges/HealthBadge";
import type { Router, RouterStatus } from "../../types/network";

interface RouterRowProps {
  router: Router;
}

export default function RouterRow({ router }: RouterRowProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/dashboard/routers/${router.id}`);
  };

  // Helper to colorize metrics based on load
  const getMetricColor = (val: number, threshold: number) => {
    if (val >= threshold) return "text-rose-500 dark:text-rose-400 font-black";
    if (val >= threshold * 0.7) return "text-amber-500 dark:text-amber-400 font-bold";
    return "text-slate-700 dark:text-slate-300 font-black";
  };

  return (
    <tr
      onClick={handleNavigate}
      className="group border-b border-slate-50 dark:border-white/5 hover:bg-blue-50/30 dark:hover:bg-white/[0.02] cursor-pointer transition-all duration-200"
    >
      {/* ROUTER IDENTITY */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
            <CpuChipIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] md:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-1">
              {router.router_name || "Unknown Node"}
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-blue-500/80">
              <GlobeAltIcon className="w-2.5 h-2.5" />
              {router.ip || "0.0.0.0"}
            </div>
          </div>
        </div>
      </td>

      {/* STATUS BADGE */}
      <td className="px-4 py-4">
        <HealthBadge status={router.status as RouterStatus} />
      </td>

      {/* CPU LOAD */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-400 font-black uppercase mb-0.5">CPU</span>
          <span className={`text-[11px] md:text-sm italic ${getMetricColor(router.cpu, 80)}`}>
            {router.cpu}<span className="text-[9px] opacity-50 not-italic ml-0.5">%</span>
          </span>
        </div>
      </td>

      {/* MEMORY */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-400 font-black uppercase mb-0.5">RAM</span>
          <span className={`text-[11px] md:text-sm italic ${getMetricColor(router.memory, 90)}`}>
            {router.memory}<span className="text-[9px] opacity-50 not-italic ml-0.5">%</span>
          </span>
        </div>
      </td>

      {/* TEMPERATURE */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-400 font-black uppercase mb-0.5">Temp</span>
          <span className={`text-[11px] md:text-sm italic ${getMetricColor(router.temperature, 65)}`}>
            {router.temperature}<span className="text-[9px] opacity-50 not-italic ml-0.5">°C</span>
          </span>
        </div>
      </td>

      {/* LATENCY */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-400 font-black uppercase mb-0.5">Ping</span>
          <span className="text-[11px] md:text-sm font-black text-slate-700 dark:text-slate-300 italic">
            {router.latency === 0 ? "—" : `${router.latency}ms`}
          </span>
        </div>
      </td>

      {/* ACTIVE SESSIONS */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <HashtagIcon className="w-3 h-3 text-slate-400" />
          <span className="text-[11px] md:text-sm font-black text-slate-900 dark:text-white">
            {router.pppoe_sessions}
          </span>
        </div>
      </td>

      {/* ACTION CHEVRON */}
      <td className="px-4 py-4 text-right">
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="p-1.5 rounded-md text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}