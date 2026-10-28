
import type {
  DeploymentPreview,
} from "../types/networkDeployment";


interface DeploymentSummaryProps {
  preview: DeploymentPreview | null;
}


/* ================================================== */
/* Deployment Summary                                 */
/* ================================================== */

export default function DeploymentSummary({
  preview,
}: DeploymentSummaryProps) {

  if (!preview) {

    return (
      <section className="rounded-xl border bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20">

        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">
          Deployment Summary
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
          No deployment preview is currently available.
        </p>

      </section>
    );
  }


  const router =
    preview.router;


  const discovery =
    preview.discovery;


  const changes =
    preview.changes;


  const conflicts =
    preview.conflicts;


  const wanCount =
    discovery?.wans?.length || 0;


  const routingTableCount =
    discovery?.routing_tables?.length || 0;


  const defaultRouteCount =
    discovery?.default_routes?.length || 0;


  return (
    <section className="rounded-xl border bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">
            Deployment Summary
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
            Review the selected router and planned
            load-balancing changes.
          </p>

        </div>


        <SafetyBadge
          safe={
            preview.can_execute &&
            conflicts.safe
          }
        />

      </div>


      {/* ========================================== */}
      {/* Router                                     */}
      {/* ========================================== */}

      <div className="mt-6">

        <SectionTitle>
          Router
        </SectionTitle>

        <div className="mt-3 rounded-lg border bg-sky-50 dark:bg-gray-800 p-3 sm:p-4">

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <InfoItem
              label="Identity"
              value={
                router.identity
              }
            />

            <InfoItem
              label="Management IP"
              value={
                router.management_ip
              }
            />

            <InfoItem
              label="RouterOS"
              value={
                router.router_version ||
                "Unknown"
              }
            />

            <InfoItem
              label="Router ID"
              value={
                router.id
              }
              monospace
            />

          </div>

        </div>

      </div>


      {/* ========================================== */}
      {/* Discovery                                  */}
      {/* ========================================== */}

      <div className="mt-6">

        <SectionTitle>
          Current Router Configuration
        </SectionTitle>

        <div className="mt-3 grid gap-3 sm:gap-4 sm:grid-cols-3">

          <Metric
            label="Discovered WANs"
            value={wanCount}
          />

          <Metric
            label="Routing Tables"
            value={routingTableCount}
          />

          <Metric
            label="Default Routes"
            value={defaultRouteCount}
          />

        </div>

      </div>


      {/* ========================================== */}
      {/* LAN interfaces used for PCC                */}
      {/* ========================================== */}

      <div className="mt-6">
        <SectionTitle>LAN Interfaces & Networks</SectionTitle>
        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/40 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-gray-100">
              {preview.plan?.lan?.selection_mode === "manual"
                ? "Manual override"
                : "Automatic detection"}
            </p>
            <span className="rounded-full bg-white dark:bg-gray-900 px-3 py-1 text-xs font-medium text-slate-700 dark:text-gray-200">
              {preview.plan?.lan?.interfaces?.length ?? 0} interface(s)
            </span>
          </div>

          {preview.plan?.lan?.interfaces?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {preview.plan.lan.interfaces.map((name) => (
                <span key={name} className="rounded-md border border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 font-mono text-xs sm:text-sm text-slate-800">
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs sm:text-sm text-amber-800">
              The backend did not include resolved LAN interfaces in this preview. Do not apply until this is understood.
            </p>
          )}

          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
            LAN subnets
          </p>
          {preview.plan?.lan?.networks?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {preview.plan.lan.networks.map((network) => (
                <span key={network} className="rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 font-mono text-xs sm:text-sm text-slate-700 dark:text-gray-200">
                  {network}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs sm:text-sm text-amber-800">
              No LAN subnets were resolved. Verify the router addressing before applying.
            </p>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* Planned Changes                            */}
      {/* ========================================== */}

      <div className="mt-6">

        <SectionTitle>
          Planned Changes
        </SectionTitle>

        <div className="mt-3 grid gap-3 sm:gap-4 sm:grid-cols-3">

          <Metric
            label="Route Tables"
            value={
              changes.route_tables
            }
          />

          <Metric
            label="PCC Rules"
            value={
              changes.pcc_rules
            }
          />

          <Metric
            label="NAT Rules"
            value={
              changes.nat_rules
            }
          />

        </div>

      </div>


      {/* ========================================== */}
      {/* Safety                                     */}
      {/* ========================================== */}

      <div className="mt-6 rounded-lg border p-3 sm:p-4">

        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="font-medium text-slate-800 dark:text-gray-100">
              Deployment Safety
            </p>

            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
              Conflict analysis determines whether
              this plan can safely be executed.
            </p>

          </div>


          <div className="flex flex-wrap gap-2">

            <CapabilityBadge
              label={
                preview.rollback_supported
                  ? "Rollback supported"
                  : "Rollback unavailable"
              }
              enabled={
                preview.rollback_supported
              }
            />

            <CapabilityBadge
              label={
                preview.can_execute
                  ? "Can execute"
                  : "Execution blocked"
              }
              enabled={
                preview.can_execute
              }
            />

          </div>

        </div>

      </div>

    </section>
  );
}


/* ================================================== */
/* Section Title                                      */
/* ================================================== */

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-gray-100">
      {children}
    </h3>
  );
}


/* ================================================== */
/* Information Item                                   */
/* ================================================== */

function InfoItem({
  label,
  value,
  monospace = false,
}: {
  label: string;
  value: unknown;
  monospace?: boolean;
}) {

  return (
    <div>

      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-gray-400 dark:text-gray-400">
        {label}
      </p>

      <p
        className={`mt-1 break-all text-xs sm:text-sm font-medium text-slate-800 dark:text-gray-100 ${
          monospace
            ? "font-mono"
            : ""
        }`}
      >
        {value === null ||
        value === undefined ||
        value === ""
          ? "—"
          : String(value)}
      </p>

    </div>
  );
}


/* ================================================== */
/* Metric                                             */
/* ================================================== */

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {

  return (
    <div className="rounded-lg border bg-sky-50 dark:bg-gray-800 p-3 sm:p-4">

      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-gray-400 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-lg sm:text-2xl font-semibold text-slate-800 dark:text-gray-100">
        {value}
      </p>

    </div>
  );
}


/* ================================================== */
/* Safety Badge                                       */
/* ================================================== */

function SafetyBadge({
  safe,
}: {
  safe: boolean;
}) {

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs sm:text-sm font-medium ${
        safe
          ? "bg-sky-50 dark:bg-gray-800 text-slate-800 dark:text-gray-200"
          : "bg-red-100 text-red-700"
      }`}
    >
      {safe
        ? "Ready to Execute"
        : "Execution Blocked"}
    </span>
  );
}


/* ================================================== */
/* Capability Badge                                   */
/* ================================================== */

function CapabilityBadge({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        enabled
          ? "bg-sky-50 dark:bg-gray-800 text-slate-800 dark:text-gray-200"
          : "bg-red-100 text-red-700"
      }`}
    >
      {label}
    </span>
  );
}
