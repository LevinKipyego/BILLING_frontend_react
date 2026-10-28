import { CheckBadgeIcon, CommandLineIcon, GlobeAltIcon, LinkIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { MpesaConfig } from "../types/mpesa";

interface Props {
  configs: MpesaConfig[];
  registeringC2B: boolean;
  onRegisterC2B: () => void;
  onTest: (config: MpesaConfig) => void;
  onEdit: (config: MpesaConfig) => void;
  onDelete: () => void;
}

export default function MpesaConfigList({ configs, registeringC2B, onRegisterC2B, onTest, onEdit, onDelete }: Props) {
  if (!configs.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-gray-900"><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No M-Pesa gateway configured</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Add a configuration to enable gateway integration.</p></div>;

  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-gray-900">
    <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
      {configs.map((config, index) => <article key={config.id ?? config.business_shortcode ?? index} className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Shortcode / initiator</p><p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">{config.business_shortcode}</p><p className="text-xs text-slate-500">{config.initiator_name || "No initiator"}</p></div><EnvironmentBadge environment={config.environment} /></div>
        <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Callback URL</p><p className="mt-1 break-all rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{config.callback_url || "Not configured"}</p></div>
        <C2BStatus registered={Boolean(config.is_url_registered)} registering={registeringC2B} onRegister={onRegisterC2B} />
        <Actions config={config} onTest={onTest} onEdit={onEdit} onDelete={onDelete} />
      </article>)}
    </div>
    <div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-400"><tr><th className="px-4 py-3">Shortcode / Initiator</th><th className="px-4 py-3">Environment</th><th className="px-4 py-3">Callback URL</th><th className="px-4 py-3">C2B status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{configs.map((config, index) => <tr key={config.id ?? config.business_shortcode ?? index} className="hover:bg-sky-50/40 dark:hover:bg-slate-800/40"><td className="px-4 py-3"><p className="font-mono font-semibold text-slate-900 dark:text-white">{config.business_shortcode}</p><p className="mt-0.5 text-xs text-slate-500">{config.initiator_name || "No initiator"}</p></td><td className="px-4 py-3"><EnvironmentBadge environment={config.environment} /></td><td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-slate-500">{config.callback_url || "—"}</td><td className="px-4 py-3"><C2BStatus registered={Boolean(config.is_url_registered)} registering={registeringC2B} onRegister={onRegisterC2B} /></td><td className="px-4 py-3"><Actions config={config} onTest={onTest} onEdit={onEdit} onDelete={onDelete} /></td></tr>)}</tbody></table></div>
  </section>;
}

function EnvironmentBadge({ environment }: { environment?: string }) {
  const production = (environment || "").toUpperCase() === "PRODUCTION";
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${production ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300" : "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300"}`}><GlobeAltIcon className="h-3 w-3" />{environment || "SANDBOX"}</span>;
}
function C2BStatus({ registered, registering, onRegister }: { registered: boolean; registering: boolean; onRegister: () => void }) {
  return <div className="flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${registered ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"}`}><CheckBadgeIcon className="h-3.5 w-3.5" />{registered ? "Registered" : "Unregistered"}</span>{!registered && <button type="button" onClick={onRegister} disabled={registering} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold text-white disabled:opacity-60"><LinkIcon className="h-3 w-3" />{registering ? "Registering…" : "Register C2B"}</button>}</div>;
}
function Actions({ config, onTest, onEdit, onDelete }: { config: MpesaConfig; onTest: (config: MpesaConfig) => void; onEdit: (config: MpesaConfig) => void; onDelete: () => void }) {
  return <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-2 text-xs dark:border-slate-800 md:border-0 md:pt-0"><button type="button" onClick={() => onTest(config)} className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline dark:text-emerald-300"><CommandLineIcon className="h-3.5 w-3.5" />Test STK</button><button type="button" onClick={() => onEdit(config)} className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:underline dark:text-sky-300"><PencilSquareIcon className="h-3.5 w-3.5" />Edit</button><button type="button" onClick={onDelete} className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:underline dark:text-rose-300"><TrashIcon className="h-3.5 w-3.5" />Delete</button></div>;
}
