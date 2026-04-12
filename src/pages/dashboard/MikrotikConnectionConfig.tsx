import { useEffect, useState } from "react";
import {
  listMikrotikConnections,
  createMikrotikConnection,
  updateMikrotikConnection,
  deleteMikrotikConnection,
} from "../../api/mikrotikConfigurations";
import { apiFetch } from "../../api/client";
import type { MikrotikConnection } from "../../types/mikrotikConfiguration";

interface MikrotikDevice {
  id: string;
  name: string;
}


export default function MikrotikConnectionConfig() {
  const [connections, setConnections] = useState<MikrotikConnection[]>([]);
  const [devices, setDevices] = useState<MikrotikDevice[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    mikrotik: "",
    host: "",
    port: 8728,
    username: "",
    password: "",
    hotspot_server: "",
    use_ssl: false,
    enabled: true,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch devices
  async function fetchDevices() {
    const res = await apiFetch("/mikrotik/devices/");
    setDevices(res);
  }

  // Fetch connections
  async function fetchConnections() {
    setLoading(true);
    try {
      const res = await listMikrotikConnections();
      setConnections(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDevices();
    fetchConnections();
  }, []);

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMikrotikConnection(editingId, form);
      } else {
        await createMikrotikConnection(form);
      }

      resetForm();
      fetchConnections();
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(conn: MikrotikConnection) {
    setEditingId(conn.id);
    setForm({
      ...conn,
      password: "", // don't prefill password
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this connection?")) return;

    await deleteMikrotikConnection(id);
    fetchConnections();
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      mikrotik: "",
      host: "",
      port: 8728,
      username: "",
      password: "",
      hotspot_server: "",
      use_ssl: false,
      enabled: true,
    });
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Mikrotik Connection Config
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <select
          name="mikrotik"
          value={form.mikrotik}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        >
          <option value="">Select Mikrotik Device</option>
          {devices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          name="host"
          placeholder="Host"
          value={form.host}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="port"
          type="number"
          placeholder="Port"
          value={form.port}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="hotspot_server"
          placeholder="Hotspot Server"
          value={form.hotspot_server}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="use_ssl"
            checked={form.use_ssl}
            onChange={handleChange}
          />
          Use SSL
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="enabled"
            checked={form.enabled}
            onChange={handleChange}
          />
          Enabled
        </label>

        <button className="bg-blue-600 text-white px-4 py-2">
          {editingId ? "Update" : "Create"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-2 px-4 py-2 border"
          >
            Cancel
          </button>
        )}
      </form>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="border-b">
              <th>Host</th>
              <th>Port</th>
              <th>Username</th>
              <th>SSL</th>
              <th>Enabled</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {connections.map((c) => (
              <tr key={c.id} className="border-b">
                <td>{c.host}</td>
                <td>{c.port}</td>
                <td>{c.username}</td>
                <td>{c.use_ssl ? "Yes" : "No"}</td>
                <td>{c.enabled ? "Yes" : "No"}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}