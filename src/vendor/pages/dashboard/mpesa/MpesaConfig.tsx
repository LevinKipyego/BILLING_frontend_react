import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowPathIcon, FunnelIcon, PlusIcon, ShieldCheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { createGateway, deleteGateway, fetchMpesaConfig, registerC2bUrls, runStkTest, updateGateway } from "./api/mpesaConfigApi";
import MpesaConfigFormAccordion from "./components/MpesaConfigFormAccordion";
import MpesaConfigList from "./components/MpesaConfigList";
import StkTestModal from "./components/StkTestModal";
import { createEmptyMpesaForm, type MpesaConfig, type MpesaConfigFormValues, type StkTestPayload } from "./types/mpesa";
import type { MpesaConfigPayload } from "../../../api/mpesa";

export default function Mpesa() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configs, setConfigs] = useState<MpesaConfig[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<MpesaConfigFormValues>(createEmptyMpesaForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [envFilter, setEnvFilter] = useState("ALL");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [registeringC2B, setRegisteringC2B] = useState(false);
  const [testConfig, setTestConfig] = useState<MpesaConfig | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<unknown>(null);
  const [testError, setTestError] = useState("");

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMpesaConfig();
      if (data?.business_shortcode) {
        const config = data as MpesaConfig;
        setConfigs([config]);
        setForm({
          ...createEmptyMpesaForm(),
          business_shortcode: config.business_shortcode || "",
          initiator_name: config.initiator_name || "",
          callback_url: config.callback_url || "",
          environment: config.environment || "SANDBOX",
          b2c_security_credential: "",
          is_url_registered: Boolean(config.is_url_registered),
        });
      } else {
        setConfigs([]);
        setFormOpen(true);
      }
    } catch (err) {
      setConfigs([]);
      setError(err instanceof Error ? err.message : "Could not load M-Pesa configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadConfig(); }, [loadConfig]);

  const filteredConfigs = useMemo(() => configs.filter((config) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [config.business_shortcode, config.callback_url, config.initiator_name].some((value) => String(value ?? "").toLowerCase().includes(query));
    const matchesEnvironment = envFilter === "ALL" || String(config.environment).toUpperCase() === envFilter;
    return matchesSearch && matchesEnvironment;
  }), [configs, searchTerm, envFilter]);

  const openCreate = () => { setForm(createEmptyMpesaForm()); setFormOpen(true); };
  const openEdit = (config: MpesaConfig) => {
    setForm({
      ...createEmptyMpesaForm(),
      business_shortcode: config.business_shortcode || "",
      initiator_name: config.initiator_name || "",
      callback_url: config.callback_url || "",
      environment: config.environment || "SANDBOX",
      is_url_registered: Boolean(config.is_url_registered),
    });
    setFormOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true); setError(null); setSuccess(null);
    try {
      const payload = form as MpesaConfigPayload;
      if (configs.length) await updateGateway(payload);
      else await createGateway(payload);
      setFormOpen(false);
      setSuccess("M-Pesa configuration saved successfully.");
      await loadConfig();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the M-Pesa configuration.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this M-Pesa configuration? Automated M-Pesa operations may stop.")) return;
    setError(null); setSuccess(null);
    try { await deleteGateway(); setConfigs([]); setForm(createEmptyMpesaForm()); setFormOpen(true); setSuccess("M-Pesa configuration deleted."); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to delete configuration."); }
  };

  const handleRegisterC2B = async () => {
    setRegisteringC2B(true); setError(null); setSuccess(null);
    try { await registerC2bUrls(); setSuccess("C2B URLs registered successfully."); await loadConfig(); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to register C2B URLs."); }
    finally { setRegisteringC2B(false); }
  };

  const handleRunTest = async (payload: StkTestPayload) => {
    setTestLoading(true); setTestResult(null); setTestError("");
    try { setTestResult(await runStkTest(payload)); }
    catch (err) { setTestError(err instanceof Error ? err.message : "STK test request failed."); }
    finally { setTestLoading(false); }
  };

  if (loading) return <div className="flex min-h-[300px] items-center justify-center gap-3 text-sm text-slate-500 dark:bg-gray-900 dark:text-slate-400"><span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />Loading M-Pesa gateway…</div>;

  return <main className="mx-auto max-w-[1600px] space-y-4 p-3 text-slate-800 sm:space-y-5 sm:p-5 lg:p-6 dark:text-slate-200">
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-slate-700 dark:bg-gray-900">
      <div className="flex items-center gap-3"><span className="rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 p-3 text-sky-700 dark:from-sky-950 dark:to-emerald-950 dark:text-sky-300"><ShieldCheckIcon className="h-6 w-6" /></span><div><h1 className="text-lg font-extrabold text-slate-900 dark:text-white sm:text-xl">M-Pesa Gateway</h1><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Manage Daraja credentials, callback endpoints, C2B registration and STK diagnostics.</p></div></div>
      <div className="flex gap-2"><button type="button" onClick={() => void loadConfig()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>{configs.length === 0 && <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white"><PlusIcon className="h-4 w-4" />Add configuration</button>}</div>
    </header>

    {error && <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"><span>{error}</span><button type="button" onClick={() => setError(null)} className="text-xs font-semibold underline">Dismiss</button></div>}
    {success && <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"><span>{success}</span><button type="button" onClick={() => setSuccess(null)} className="text-xs font-semibold underline">Dismiss</button></div>}

    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-gray-900">
      <label className="relative min-w-0 flex-1"><MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search shortcode, initiator or callback…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-gray-800 dark:text-white" /></label>
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-700"><FunnelIcon className="h-4 w-4 text-slate-400" /><select value={envFilter} onChange={(e) => setEnvFilter(e.target.value)} className="min-w-0 bg-transparent text-xs font-semibold outline-none dark:text-slate-200"><option value="ALL">All environments</option><option value="SANDBOX">Sandbox</option><option value="PRODUCTION">Production</option></select></label>
      <span className="text-xs text-slate-500 dark:text-slate-400">{filteredConfigs.length} gateway record(s)</span>
    </section>

    <MpesaConfigList configs={filteredConfigs} registeringC2B={registeringC2B} onRegisterC2B={() => void handleRegisterC2B()} onTest={(config) => { setTestConfig(config); setTestResult(null); setTestError(""); }} onEdit={openEdit} onDelete={() => void handleDelete()} />

    <MpesaConfigFormAccordion open={formOpen} existing={configs.length > 0} form={form} saving={saving} onChange={setForm} onClose={() => setFormOpen(false)} onSubmit={(event) => void handleSubmit(event)} />
    <StkTestModal config={testConfig} loading={testLoading} result={testResult} error={testError} onClose={() => setTestConfig(null)} onRun={handleRunTest} />
  </main>;
}
