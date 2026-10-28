import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import ConnectionsHeader from "./components/ConnectionsHeader";
import ConnectionFormAccordion from "./components/ConnectionFormAccordion";
import ConnectionsTable from "./components/ConnectionsTable";
import { createConnection, getMikrotikConnections, getMikrotikDevices, removeConnection, updateConnection } from "./api/mikrotikConnectionsApi";
import { createEmptyConnectionForm, type ExtendedMikrotikConnection, type ExtendedMikrotikConnectionCreate, type MikrotikDevice } from "./types/mikrotikConnections";
import { copyText } from "./utils/clipboard";

export default function MikrotikConnectionsPage() {
  const [connections, setConnections] = useState<ExtendedMikrotikConnection[]>([]);
  const [devices, setDevices] = useState<MikrotikDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<ExtendedMikrotikConnection | null>(null);
  const [form, setForm] = useState<ExtendedMikrotikConnectionCreate>(createEmptyConnectionForm);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try { const [conn, dev] = await Promise.all([getMikrotikConnections(), getMikrotikDevices()]); setConnections(conn); setDevices(dev); }
    catch { setError("Failed to fetch MikroTik configurations. Check the API connection and permissions."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadData(); }, [loadData]);

  const filteredConnections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return connections;
    return connections.filter(c => [c.management_ip, String(c.mikrotik), c.username, c.hotspot_login_url].some(v => String(v ?? "").toLowerCase().includes(q)));
  }, [connections, searchQuery]);

  const openCreateForm = () => { setEditingConnection(null); setForm(createEmptyConnectionForm()); setIsFormOpen(true); };
  const openEditForm = (c: ExtendedMikrotikConnection) => {
    setEditingConnection(c);
    setForm({ mikrotik: String(c.mikrotik ?? ""), management_ip: c.management_ip ?? "", port: c.port ?? 8728, username: c.username ?? "", password: "", hotspot_server: c.hotspot_server ?? "", hotspot_login_url: c.hotspot_login_url ?? "", use_ssl: Boolean(c.use_ssl), enabled: c.enabled ?? true });
    setIsFormOpen(true);
  };
  const closeForm = () => { setIsFormOpen(false); setEditingConnection(null); setForm(createEmptyConnectionForm()); };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError(null);
    try { if (editingConnection) await updateConnection(editingConnection.id, form); else await createConnection(form); closeForm(); await loadData(); }
    catch { setError("Could not save the connection. Verify the selected router, credentials and API permissions."); setLoading(false); }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this MikroTik API connection?")) return;
    setError(null);
    try { await removeConnection(id); setConnections(current => current.filter(c => c.id !== id)); if (editingConnection?.id === id) closeForm(); }
    catch { setError("Could not delete the connection."); }
  };
  const handleCopy = async (id: string, field: string, value: string) => {
    const key = `${id}-${field}`; const success = await copyText(value);
    if (!success) { setError("Could not copy to clipboard in this browser context."); return; }
    setCopiedKey(key); window.setTimeout(() => setCopiedKey(current => current === key ? null : current), 1600);
  };

  return <main className="space-y-4 sm:space-y-5">
    <ConnectionsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} loading={loading} onRefresh={() => void loadData()} onAdd={openCreateForm} />
    {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-300"><ShieldExclamationIcon className="mt-0.5 h-5 w-5 shrink-0" /><p>{error}</p><button type="button" onClick={() => setError(null)} className="ml-auto text-xs font-semibold underline">Dismiss</button></div>}
    <ConnectionsTable connections={filteredConnections} loading={loading} copiedKey={copiedKey} onCopy={(id, field, value) => void handleCopy(id, field, value)} onEdit={openEditForm} onDelete={id => void handleDelete(id)} />
    <ConnectionFormAccordion open={isFormOpen} editingConnection={editingConnection} form={form} devices={devices} loading={loading} onFormChange={setForm} onClose={closeForm} onSubmit={event => void handleSubmit(event)} />
  </main>;
}
