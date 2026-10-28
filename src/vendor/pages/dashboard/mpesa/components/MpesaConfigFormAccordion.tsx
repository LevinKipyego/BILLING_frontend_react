import { useState, type FormEvent } from "react";
import {
  ChevronDownIcon, EyeIcon, EyeSlashIcon, GlobeAltIcon, LinkIcon,
  LockClosedIcon, ServerIcon, XMarkIcon
} from "@heroicons/react/24/outline";
import type { MpesaConfigFormValues, MpesaEnvironment } from "../types/mpesa";

interface Props {
  open: boolean;
  existing: boolean;
  form: MpesaConfigFormValues;
  saving: boolean;
  onChange: (next: MpesaConfigFormValues) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:focus:ring-sky-950";

function AccordionSection({
  title, description, icon, defaultOpen = false, children,
}: {
  title: string; description: string; icon: React.ReactNode;
  defaultOpen?: boolean; children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/70">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-3.5 [&::-webkit-details-marker]:hidden sm:p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-700 dark:from-sky-950 dark:to-emerald-950 dark:text-sky-300">{icon}</span>
        <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-800 dark:text-white">{title}</span><span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{description}</span></span>
        <ChevronDownIcon className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-slate-100 p-3.5 sm:p-4 dark:border-slate-800">{children}</div>
    </details>
  );
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block min-w-0 space-y-1.5"><span className="block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}{required && <span className="ml-1 text-rose-500">*</span>}</span>{children}</label>;
}

export default function MpesaConfigFormAccordion({ open, existing, form, saving, onChange, onClose, onSubmit }: Props) {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  if (!open) return null;

  const update = (key: keyof MpesaConfigFormValues, value: string | boolean) => onChange({ ...form, [key]: value } as MpesaConfigFormValues);

  const secretFields: { key: "passkey" | "consumer_key" | "consumer_secret" | "b2c_security_credential"; label: string }[] = [
    { key: "passkey", label: "STK Passkey" },
    { key: "consumer_key", label: "Consumer key" },
    { key: "consumer_secret", label: "Consumer secret" },
    { key: "b2c_security_credential", label: "B2C security credential" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="mpesa-form-title" className="flex max-h-[96dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-slate-50 shadow-2xl sm:rounded-2xl dark:border-slate-700 dark:bg-gray-950">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 p-4 backdrop-blur dark:border-slate-700 dark:bg-gray-900/95">
          <div><p className="text-[10px] font-bold uppercase tracking-widest text-sky-700 dark:text-sky-300">{existing ? "Update gateway" : "New integration"}</p><h2 id="mpesa-form-title" className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">{existing ? "M-Pesa configuration" : "Configure M-Pesa gateway"}</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Expand a section to configure its settings.</p></div>
          <button type="button" onClick={onClose} aria-label="Close form" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><XMarkIcon className="h-5 w-5" /></button>
        </header>

        <form onSubmit={onSubmit} className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-5">
          <AccordionSection title="Business credentials" description="Shortcode, initiator and environment" icon={<ServerIcon className="h-5 w-5" />} defaultOpen>
            <Field label="Business shortcode" required><input value={form.business_shortcode} onChange={(e) => update("business_shortcode", e.target.value)} placeholder="e.g. 174379" required className={inputClass} /></Field>
            <Field label="Initiator name" required><input value={form.initiator_name} onChange={(e) => update("initiator_name", e.target.value)} placeholder="e.g. testapi" required className={inputClass} /></Field>
            <Field label="Environment" required><select value={form.environment} onChange={(e) => update("environment", e.target.value as MpesaEnvironment)} className={inputClass}><option value="SANDBOX">Sandbox — testing</option><option value="PRODUCTION">Production — live payments</option></select></Field>
          </AccordionSection>

          <AccordionSection title="API secrets and security" description="Credentials are masked by default" icon={<LockClosedIcon className="h-5 w-5" />}>
            {secretFields.map(({ key, label }) => (
              <Field key={key} label={label} required={!existing}>
                <div className="relative"><input type={visible[key] ? "text" : "password"} value={form[key]} onChange={(e) => update(key, e.target.value)} placeholder={existing ? "Leave blank to retain existing value" : "Enter secret"} required={!existing} autoComplete="new-password" className={`${inputClass} pr-11`} /><button type="button" aria-label={visible[key] ? `Hide ${label}` : `Show ${label}`} onClick={() => setVisible((v) => ({ ...v, [key]: !v[key] }))} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">{visible[key] ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}</button></div>
              </Field>
            ))}
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-300">Never share production credentials. Only enter secrets through your secured application.</p>
          </AccordionSection>

          <AccordionSection title="Callback and C2B" description="Callback endpoint used for payment notifications" icon={<LinkIcon className="h-5 w-5" />}>
            <Field label="Callback URL" required><input type="url" value={form.callback_url} onChange={(e) => update("callback_url", e.target.value)} placeholder="https://api.example.com/mpesa/callback" required className={inputClass} /></Field>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-sky-100 bg-sky-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/70"><div><p className="text-sm font-semibold text-slate-800 dark:text-slate-100">C2B URLs registered</p><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Status is reported by the backend.</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${form.is_url_registered ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`}>{form.is_url_registered ? "Registered" : "Not registered"}</span></div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><GlobeAltIcon className="h-4 w-4 shrink-0" />Use a publicly reachable HTTPS callback URL in production.</div>
          </AccordionSection>

          <div className="sticky bottom-0 flex gap-2 border-t border-slate-200 bg-slate-50/95 pt-3 backdrop-blur dark:border-slate-800 dark:bg-gray-950/95">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:brightness-105 disabled:opacity-60">{saving ? "Saving…" : existing ? "Save configuration" : "Create configuration"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
