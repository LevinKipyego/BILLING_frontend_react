import React from 'react';
import { ShieldAlert, Terminal, Search, Hash } from 'lucide-react';

const IdlePorts = ({ ports }: { ports: string[] }) => {
  if (!ports || ports.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-white border border-amber-100 rounded-3xl shadow-[0_10px_30px_rgba(245,158,11,0.05)] transition-all hover:shadow-[0_15px_40px_rgba(245,158,11,0.1)]">
      
      {/* Top Alert Bar */}
      <div className="bg-amber-500 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <ShieldAlert size={18} className="animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-widest">Security Audit</h3>
        </div>
        <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
          {ports.length} Detected
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={14} className="text-slate-400" />
          <p className="text-slate-500 text-[11px] font-medium italic">
            "The following ports are active but showing no traffic."
          </p>
        </div>

        {/* The New Orientation: Horizontal Flex-Wrap Badges */}
        <div className="flex flex-wrap gap-2">
          {ports.map((p: string) => (
            <div 
              key={p} 
              className="group flex items-center gap-2 bg-slate-50 border border-slate-100 hover:border-amber-300 hover:bg-amber-50 rounded-xl px-3 py-2 transition-all duration-300 cursor-default"
            >
              <div className="bg-white p-1 rounded-md shadow-sm border border-slate-100 group-hover:border-amber-200">
                <Hash size={12} className="text-slate-400 group-hover:text-amber-500" />
              </div>
              <span className="text-sm font-mono font-bold text-slate-700 group-hover:text-amber-700">
                {p}
              </span>
            </div>
          ))}
        </div>

        {/* Call to Action / Footer */}
        <button className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          <Search size={14} />
          Investigate Connection History
        </button>
      </div>

      {/* Decorative Scan Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-300/50 to-transparent animate-[scan_3s_ease-in-out_infinite]" />
    </div>
  );
};

export default IdlePorts;