import type { RouterStatus } from "../types";

// We now use inline SVGs as data URIs to bypass hotlink protection.
// Alternatively, download the images to your public/ folder and reference them as '/images/rb951.png'
export const getRouterImage = (model: string): string => {
  const normalized = model.trim().toLowerCase();
  
  // Minimalist SVG representations of routers encoded as data URIs
  if (normalized.includes('rb951g')) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" fill="none"><rect x="20" y="30" width="160" height="40" rx="4" fill="%231e293b" stroke="%23334155" stroke-width="2"/><circle cx="40" cy="50" r="3" fill="%234ade80"/><circle cx="55" cy="50" r="3" fill="%234ade80"/><circle cx="70" cy="50" r="3" fill="%234ade80"/><rect x="130" y="42" width="12" height="16" rx="1" fill="%230f172a"/><rect x="150" y="42" width="12" height="16" rx="1" fill="%230f172a"/></svg>';
  }
  
  if (normalized.includes('haplite') || normalized.includes('hap lite')) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" fill="none"><rect x="30" y="10" width="40" height="80" rx="6" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><circle cx="50" cy="25" r="4" fill="%2338bdf8"/><circle cx="50" cy="40" r="2" fill="%234ade80"/><circle cx="50" cy="50" r="2" fill="%234ade80"/></svg>';
  }
  
  // Generic Switch/Router Box fallback
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" fill="none"><rect x="10" y="35" width="180" height="30" rx="2" fill="%23334155"/><rect x="15" y="45" width="10" height="10" fill="%23f87171"/><rect x="35" y="45" width="10" height="10" fill="%234ade80"/><rect x="55" y="45" width="10" height="10" fill="%234ade80"/></svg>';
};

export const getStatusBadge = (status: RouterStatus) => {
  switch (status) {
    case 'healthy':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
    case 'down':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.3)]';
    default:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }
};