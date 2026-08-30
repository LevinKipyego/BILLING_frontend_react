
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
      <section className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              Router Discovery
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Inspecting the selected MikroTik router...
            </p>

          </div>

        </div>

      </section>
    );
  }


  if (!discovery) {

    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-gray-900">
          Router Discovery
        </h2>

        <p className="mt-2 text-sm text-gray-500">
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

  const wan =
    discovery.wans;


  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div>

        <h2 className="text-lg font-semibold text-gray-900">
          Router Discovery
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current configuration discovered from the
          selected MikroTik router.
        </p>

      </div>


      {/* ========================================== */}
      {/* Discovery Metrics                          */}
      {/* ========================================== */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

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
/* Section Heading                                    */
/* ================================================== */

function SectionHeading({
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
    <div className="rounded-lg border bg-gray-50 p-4">

      {typeof value === "object" &&
      value !== null ? (

        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-gray-700">
          {JSON.stringify(
            value,
            null,
            2,
          )}
        </pre>

      ) : (

        <p className="break-words text-sm text-gray-700">
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
    <div className="rounded-lg border border-dashed bg-gray-50 p-4">

      <p className="text-sm text-gray-500">
        {children}
      </p>

    </div>
  );
}

