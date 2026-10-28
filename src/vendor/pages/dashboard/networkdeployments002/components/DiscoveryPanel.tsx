
import type {
  DeploymentDiscovery,
} from "../types/networkDeployment";


interface DiscoveryPanelProps {
  discovery: DeploymentDiscovery | null;

  loading?: boolean;
}


/* ================================================== */
/* Discovery Panel                                    */
/* ================================================== */

export default function DiscoveryPanel({
  discovery,
  loading = false,
}: DiscoveryPanelProps) {

  if (loading) {

    return (
      <section className="rounded-xl border bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20">

        <div className="flex items-center gap-3">

          <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 dark:border-gray-700 border-t-gray-900" />

          <div>

            <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">
              Router Discovery
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
              Inspecting the selected MikroTik router...
            </p>

          </div>

        </div>

      </section>
    );
  }


  if (!discovery) {

    return (
      <section className="rounded-xl border bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20">

        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">
          Router Discovery
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
          No discovery information is currently available.
        </p>

      </section>
    );
  }


  const interfaces =
    discovery.interfaces || [];

  const addresses =
    discovery.ip_addresses || [];

  const dhcpClients =
    discovery.dhcp_clients || [];

  const routes =
    discovery.routes || [];

  const hotspots = discovery.hotspots || [];
  const bridgePorts = discovery.bridge_ports || [];
  const interfaceListMembers = discovery.interface_list_members || [];

  const wan =
    discovery.wans;


  return (
    <section className="rounded-xl border bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div>

        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">
          Router Discovery
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
          Current configuration discovered from the
          selected MikroTik router.
        </p>

      </div>


      {/* ========================================== */}
      {/* Discovery Metrics                          */}
      {/* ========================================== */}

      <div className="mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <MetricCard
          label="Interfaces"
          value={interfaces.length}
        />

        <MetricCard
          label="Addresses"
          value={addresses.length}
        />

        <MetricCard
          label="DHCP Clients"
          value={dhcpClients.length}
        />

        <MetricCard
          label="Routes"
          value={routes.length}
        />

      </div>


      {/* ========================================== */}
      {/* WAN Discovery                              */}
      {/* ========================================== */}

      <div className="mt-6">

        <SectionHeading>
          WAN Discovery
        </SectionHeading>

        <div className="mt-3">

          {wan ? (

            <DataBlock
              value={wan}
            />

          ) : (

            <EmptyBlock>
              No WAN discovery information was returned.
            </EmptyBlock>

          )}

        </div>

      </div>


      {/* ========================================== */}
      {/* Interfaces                                */}
      {/* ========================================== */}

      <DataSection
        title="Interfaces"
        items={interfaces}
      />


      {/* ========================================== */}
      {/* Addresses                                 */}
      {/* ========================================== */}

      <DataSection
        title="IP Addresses"
        items={addresses}
      />


      {/* ========================================== */}
      {/* DHCP Clients                              */}
      {/* ========================================== */}

      <DataSection
        title="DHCP Clients"
        items={dhcpClients}
      />


      {/* ========================================== */}
      {/* Routes                                    */}
      {/* ========================================== */}

      <DataSection
        title="Routes"
        items={routes}
      />

      <DataSection
        title="Hotspot Configuration"
        items={hotspots}
      />

      <DataSection
        title="Bridge Ports"
        items={bridgePorts}
      />

      <DataSection
        title="Interface List Members"
        items={interfaceListMembers}
      />

    </section>
  );
}


/* ================================================== */
/* Metric Card                                        */
/* ================================================== */

function MetricCard({
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
/* Section Heading                                    */
/* ================================================== */

function SectionHeading({
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
/* Data Section                                       */
/* ================================================== */

function DataSection({
  title,
  items,
}: {
  title: string;
  items: unknown[];
}) {

  return (
    <div className="mt-6">

      <SectionHeading>
        {title}
      </SectionHeading>


      <div className="mt-3">

        {items.length > 0 ? (

          <div className="space-y-2">

            {items.map(
              (
                item,
                index,
              ) => (

                <DataBlock
                  key={index}
                  value={item}
                />

              ),
            )}

          </div>

        ) : (

          <EmptyBlock>
            No {title.toLowerCase()} were discovered.
          </EmptyBlock>

        )}

      </div>

    </div>
  );
}


/* ================================================== */
/* Data Block                                         */
/* ================================================== */

function DataBlock({
  value,
}: {
  value: unknown;
}) {

  return (
    <div className="rounded-lg border bg-sky-50 dark:bg-gray-800 p-3 sm:p-4">

      {typeof value === "object" &&
      value !== null ? (

        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-slate-700 dark:text-gray-200 dark:text-gray-200">
          {JSON.stringify(
            value,
            null,
            2,
          )}
        </pre>

      ) : (

        <p className="break-words text-xs sm:text-sm text-slate-700 dark:text-gray-200 dark:text-gray-200">
          {String(value)}
        </p>

      )}

    </div>
  );
}


/* ================================================== */
/* Empty Block                                        */
/* ================================================== */

function EmptyBlock({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="rounded-lg border border-dashed bg-sky-50 dark:bg-gray-800 p-3 sm:p-4">

      <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
        {children}
      </p>

    </div>
  );
}

