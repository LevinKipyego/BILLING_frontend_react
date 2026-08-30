
import type {
  DeploymentChanges,
} from "../types/networkDeployment";


interface ChangesPanelProps {
  changes: DeploymentChanges | null;
}


/* ================================================== */
/* Changes Panel                                      */
/* ================================================== */

export default function ChangesPanel({
  changes,
}: ChangesPanelProps) {

  if (!changes) {

    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-gray-900">
          Planned Changes
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          No change information is currently available.
        </p>

      </section>
    );
  }


  const totalChanges =
    changes.route_tables +
    changes.pcc_rules +
    changes.nat_rules;


  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div>

        <h2 className="text-lg font-semibold text-gray-900">
          Planned Changes
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Changes that will be applied to the selected
          MikroTik router.
        </p>

      </div>


      {/* ========================================== */}
      {/* Total                                      */}
      {/* ========================================== */}

      <div className="mt-5 rounded-xl bg-gray-50 p-5">

        <p className="text-sm text-gray-500">
          Total planned changes
        </p>

        <p className="mt-1 text-3xl font-semibold text-gray-900">
          {totalChanges}
        </p>

      </div>


      {/* ========================================== */}
      {/* Breakdown                                  */}
      {/* ========================================== */}

      <div className="mt-5 grid gap-4 sm:grid-cols-3">

        <ChangeCard
          label="Routing Tables"
          value={changes.route_tables}
          description="New PCC routing tables"
        />

        <ChangeCard
          label="PCC Rules"
          value={changes.pcc_rules}
          description="Mangle/PCC rules"
        />

        <ChangeCard
          label="NAT Rules"
          value={changes.nat_rules}
          description="Masquerade rules"
        />

      </div>

    </section>
  );
}


/* ================================================== */
/* Change Card                                        */
/* ================================================== */

function ChangeCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {

  return (
    <div className="rounded-xl border bg-white p-5">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-sm font-medium text-gray-900">
            {label}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>

        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-900">
          {value}
        </span>

      </div>

    </div>
  );
}
