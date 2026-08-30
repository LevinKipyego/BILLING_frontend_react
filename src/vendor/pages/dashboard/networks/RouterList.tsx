// components/RouterList.tsx
import React from 'react';
import type { RouterApiResponse } from './types';
import { RouterCard } from './RouterCard';

interface RouterListProps {
  data: RouterApiResponse;
}

export const RouterList: React.FC<RouterListProps> = ({ data }) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Managed Edge Routers
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time telemetry and hardware status across all active Mikrotik nodes.
          </p>
        </div>
        <div className="rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-xs text-slate-300 font-mono">
          Total Routers: <span className="text-sky-400 font-bold">{data.results.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.results.map((router) => (
          <RouterCard key={router.id} router={router} />
        ))}
      </div>
    </div>
  );
};