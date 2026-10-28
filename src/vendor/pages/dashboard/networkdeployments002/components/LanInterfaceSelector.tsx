import type {
  DeploymentDiscovery,
  DiscoveredAddress,
  DiscoveredDhcpClient,
  DiscoveredInterface,
} from "../types/networkDeployment";

export type LanSelectionMode = "automatic" | "manual";

interface LanInterfaceSelectorProps {
  discovery: DeploymentDiscovery | null;
  wanInterfaces: string[];
  mode: LanSelectionMode;
  value: string[];
  onModeChange: (mode: LanSelectionMode) => void;
  onChange: (interfaces: string[]) => void;
  disabled?: boolean;
}

const truthy = (value: unknown) =>
  value === true || value === "true" || value === "yes";

function getInterfaceName(item: Record<string, unknown>): string {
  return String(item.interface ?? item["actual-interface"] ?? item.name ?? "").trim();
}

export default function LanInterfaceSelector({
  discovery,
  wanInterfaces,
  mode,
  value,
  onModeChange,
  onChange,
  disabled = false,
}: LanInterfaceSelectorProps) {
  const interfaces = discovery?.interfaces ?? [];
  const addresses: DiscoveredAddress[] =
    discovery?.ip_addresses ?? discovery?.addresses ?? [];
  const dhcpClients: DiscoveredDhcpClient[] = discovery?.dhcp_clients ?? [];
  const hotspots = discovery?.hotspots ?? [];
  const bridgePorts = discovery?.bridge_ports ?? [];
  const wanSet = new Set(wanInterfaces);
  const dhcpSet = new Set(
    dhcpClients.map((client) => String(client.interface ?? "").trim()).filter(Boolean),
  );

  const names = new Set<string>();

  // Hotspot interfaces are the strongest LAN signal.
  hotspots.forEach((item) => {
    const name = getInterfaceName(item);
    if (name) names.add(name);
  });

  // Addressed bridges are common LAN interfaces on MikroTik routers.
  interfaces.forEach((item: DiscoveredInterface) => {
    const name = String(item.name ?? "").trim();
    if (name && String(item.type ?? "").toLowerCase() === "bridge") {
      if (addresses.some((address) =>
        String(address.interface ?? address["actual-interface"] ?? "") === name &&
        String(address.address ?? "").includes("/"),
      )) names.add(name);
    }
  });

  // Include addressed non-WAN interfaces as manual candidates.
  addresses.forEach((address) => {
    const name = String(address.interface ?? address["actual-interface"] ?? "").trim();
    if (name && String(address.address ?? "").includes("/")) names.add(name);
  });

  // A bridge port itself is not necessarily the routed LAN interface,
  // but its parent bridge can be useful context in discovery.
  bridgePorts.forEach((port) => {
    const name = String(port.bridge ?? "").trim();
    if (name) names.add(name);
  });

  const candidates = [...names]
    .filter((name) => !wanSet.has(name) && !dhcpSet.has(name))
    .filter((name) => {
      const item = interfaces.find((entry) => entry.name === name);
      return !item || !truthy(item.disabled);
    })
    .sort((a, b) => a.localeCompare(b));

  const addressFor = (name: string) =>
    addresses
      .filter((address) =>
        String(address.interface ?? address["actual-interface"] ?? "") === name,
      )
      .map((address) => String(address.address ?? "").trim())
      .filter(Boolean);

  return (
    <section className="rounded-xl border border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">LAN Interface Detection</h2>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-gray-400">
            PCC marking must be limited to LAN-originated traffic. Automatic detection is preferred;
            use manual override only when you have verified the router’s LAN topology.
          </p>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          mode === "automatic" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-800"
        }`}>
          {mode === "automatic" ? "Automatic" : "Manual override"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            onModeChange("automatic");
            onChange([]);
          }}
          className={`rounded-xl border border-sky-100 dark:border-gray-700 p-3 sm:p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
            mode === "automatic"
              ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-200"
              : "border-sky-100 dark:border-gray-700 hover:border-slate-300"
          }`}
        >
          <span className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-gray-100">Detect automatically</span>
          <span className="mt-1 block text-xs sm:text-sm text-slate-600 dark:text-gray-300">
            Let the backend inspect Hotspot interfaces, bridges, and IP addressing.
          </span>
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange("manual")}
          className={`rounded-xl border border-sky-100 dark:border-gray-700 p-3 sm:p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
            mode === "manual"
              ? "border-amber-500 bg-amber-50/60 ring-1 ring-amber-200"
              : "border-sky-100 dark:border-gray-700 hover:border-slate-300"
          }`}
        >
          <span className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-gray-100">Choose LAN interfaces</span>
          <span className="mt-1 block text-xs sm:text-sm text-slate-600 dark:text-gray-300">
            Explicitly select the interfaces that carry client traffic.
          </span>
        </button>
      </div>

      {mode === "automatic" ? (
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/50 p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-medium text-sky-900 dark:text-sky-200">Backend will determine the LAN</p>
          <p className="mt-1 text-xs sm:text-sm text-sky-800 dark:text-sky-300">
            The selected interfaces and associated subnets will appear in the deployment preview.
            If detection is ambiguous, the backend should reject the plan instead of guessing.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs sm:text-sm font-medium text-slate-800">Select one or more LAN interfaces</p>
            <span className="text-xs text-slate-500 dark:text-gray-400">{value.length} selected</span>
          </div>

          {candidates.length === 0 ? (
            <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-medium text-amber-900">No safe candidates identified</p>
              <p className="mt-1 text-xs sm:text-sm text-amber-800">
                Run discovery again or verify the router’s interfaces and IP addresses. Do not select
                a WAN interface as the LAN.
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {candidates.map((name) => {
                const checked = value.includes(name);
                const addressesForInterface = addressFor(name);
                return (
                  <label
                    key={name}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${
                      checked ? "border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-gray-800" : "border-sky-100 dark:border-gray-700"
                    } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-slate-400"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={(event) => {
                        onChange(
                          event.target.checked
                            ? [...value, name]
                            : value.filter((item) => item !== name),
                        );
                      }}
                      className="mt-1 h-4 w-4 rounded border-sky-200 dark:border-gray-700"
                    />
                    <span className="min-w-0">
                      <span className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-gray-100">{name}</span>
                      <span className="mt-1 block break-all text-xs text-slate-500 dark:text-gray-400">
                        {addressesForInterface.length
                          ? addressesForInterface.join(", ")
                          : "No IP prefix shown in discovery"}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs sm:text-sm text-amber-900">
            Manual selection overrides automatic detection. The backend still validates that the
            chosen interfaces are not selected WANs and are eligible for LAN use.
          </div>

          {value.length === 0 && (
            <p className="mt-2 text-xs sm:text-sm text-red-600">
              Select at least one LAN interface or switch back to automatic detection.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
