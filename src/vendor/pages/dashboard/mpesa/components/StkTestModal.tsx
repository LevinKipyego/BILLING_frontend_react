import { useState, type FormEvent } from "react";
import { CommandLineIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { MpesaConfig, StkTestPayload } from "../types/mpesa";

interface Props {
  config: MpesaConfig | null;
  loading: boolean;
  result: unknown;
  error: string;
  onClose: () => void;
  onRun: (payload: StkTestPayload) => Promise<void>;
}

export default function StkTestModal({ config, loading, result, error, onClose, onRun }: Props) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("1");
  const [sandbox, setSandbox] = useState((config?.environment ?? "SANDBOX") !== "PRODUCTION");

  if (!config) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onRun({ business_shortcode: config.business_shortcode, phone_number: phone.trim(), amount: amount.trim(), is_sandbox: sandbox });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="stk-test-title" className="w-full max-w-lg overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl dark:border-slate-700 dark:bg-gray-900">
        <header className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center gap-3"><span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><CommandLineIcon className="h-5 w-5" /></span><div><h2 id="stk-test-title" className="text-sm font-bold text-slate-900 dark:text-white">STK Push diagnostic</h2><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Shortcode {config.business_shortcode}</p></div></div><button type="button" onClick={onClose} aria-label="Close test" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><XMarkIcon className="h-5 w-5" /></button></header>
        <form onSubmit={submit} className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Environment</span><select value={sandbox ? "SANDBOX" : "PRODUCTION"} onChange={(e) => setSandbox(e.target.value === "SANDBOX")} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold dark:border-slate-600 dark:bg-slate-900 dark:text-white"><option value="SANDBOX">Sandbox</option><option value="PRODUCTION">Production</option></select></div>
          <label className="block space-y-1.5"><span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Phone number</span><input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="2547XXXXXXXX" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></label>
          <label className="block space-y-1.5"><span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Amount (KES)</span><input type="number" min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></label>
          {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
          {result != null && <pre className="max-h-48 overflow-auto rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">{JSON.stringify(result, null, 2)}</pre>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? "Submitting test…" : "Trigger STK Push"}</button>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Production tests may initiate a real payment prompt. Confirm the selected environment before submitting.</p>
        </form>
      </section>
    </div>
  );
}
