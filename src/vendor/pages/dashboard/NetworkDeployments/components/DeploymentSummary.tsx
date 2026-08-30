
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
      <section className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-gray-900">
          Deployment Summary
        </h2>

        <p className="mt-2 text-sm text-gray-500">
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
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Deployment Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
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

        <div className="mt-3 rounded-lg border bg-gray-50 p-4">

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

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

        <div className="mt-3 grid gap-4 sm:grid-cols-3">

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
      {/* Planned Changes                            */}
      {/* ========================================== */}

      <div className="mt-6">

        <SectionTitle>
          Planned Changes
        </SectionTitle>

        <div className="mt-3 grid gap-4 sm:grid-cols-3">

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

      <div className="mt-6 rounded-lg border p-4">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="font-medium text-gray-900">
              Deployment Safety
            </p>

            <p className="mt-1 text-sm text-gray-500">
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
    <h3 className="text-sm font-semibold text-gray-900">
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

      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p
        className={`mt-1 break-all text-sm font-medium text-gray-900 ${
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
    <div className="rounded-lg border bg-gray-50 p-4">

      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-gray-900">
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
      className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
        safe
          ? "bg-gray-100 text-gray-800"
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
          ? "bg-gray-100 text-gray-800"
          : "bg-red-100 text-red-700"
      }`}
    >
      {label}
    </span>
  );
}
