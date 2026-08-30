// components/RouterCard.tsx
import React, { useState } from 'react';
import type { RouterData } from './types';
import { getRouterImage, getStatusBadge } from './utils/routerHelpers';

interface RouterCardProps {
  router: RouterData;
}

export const RouterCard: React.FC<RouterCardProps> = ({ router }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-500 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10"
      style={{ perspective: '1000px' }}
    >
      {/* 3D Rotating Image Showcase */}
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-950/50 p-4">
        {/* Subtle background glow */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-transparent to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
        
        <img
          src={getRouterImage(router.Model)}
          alt={router.Model}
          className="max-h-36 w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-110"
          style={{
            transform: isHovered
              ? 'rotateY(18deg) rotateX(8deg) translateZ(15px)'
              : 'rotateY(0deg) rotateX(0deg) translateZ(0px)',
            transformStyle: 'preserve-3d',
          }}
        />

        {/* Status Chip */}
        <span
          className={`absolute top-3 right-3 rounded-full border px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-md ${getStatusBadge(
            router.status
          )}`}
        >
          {router.status.toUpperCase()}
        </span>
      </div>

      {/* Title & Hardware Details */}
      <div className="mt-5 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
            {router.router_name}
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            {router.Model.trim()} • RouterOS v{router.OSversion}
          </p>
        </div>
        <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
          {router.ip}
        </span>
      </div>

      {/* System Metrics Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-800/40 p-2.5 border border-slate-800/60">
          <span className="text-xs text-slate-400 block">CPU Usage</span>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-semibold text-slate-200">{router.cpu}%</span>
            <div className="h-1.5 w-16 rounded-full bg-slate-700 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  router.cpu > 80 ? 'bg-rose-500' : 'bg-sky-400'
                }`}
                style={{ width: `${router.cpu}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-slate-800/40 p-2.5 border border-slate-800/60">
          <span className="text-xs text-slate-400 block">RAM Load</span>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-semibold text-slate-200">{router.memory}%</span>
            <div className="h-1.5 w-16 rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-indigo-400 transition-all duration-500"
                style={{ width: `${router.memory}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-slate-800/40 p-2.5 border border-slate-800/60">
          <span className="text-xs text-slate-400 block">Active PPPoE</span>
          <span className="font-semibold text-slate-200 mt-1 block">
            {router.pppoe_sessions} Sessions
          </span>
        </div>

        <div className="rounded-lg bg-slate-800/40 p-2.5 border border-slate-800/60">
          <span className="text-xs text-slate-400 block">Ping Latency</span>
          <span className="font-semibold text-slate-200 mt-1 block">
            {router.status === 'down' ? 'N/A' : `${router.latency} ms`}
          </span>
        </div>
      </div>
    </div>
  );
};