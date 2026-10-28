
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
      <section className="rounded-xl border bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20">

        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">
          Planned Changes
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
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
    <section className="rounded-xl border bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div>

        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">
          Planned Changes
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
          Changes that will be applied to the selected
          MikroTik router.
        </p>

      </div>


      {/* ========================================== */}
      {/* Total                                      */}
      {/* ========================================== */}

      <div className="mt-5 rounded-xl bg-sky-50 dark:bg-gray-800 p-5">

        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
          Total planned changes
        </p>

        <p className="mt-1 text-xl sm:text-3xl font-semibold text-slate-800 dark:text-gray-100">
          {totalChanges}
        </p>

      </div>


      {/* ========================================== */}
      {/* Breakdown                                  */}
      {/* ========================================== */}

      <div className="mt-5 grid gap-3 sm:gap-4 sm:grid-cols-3">

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
    <div className="rounded-xl border bg-white dark:bg-gray-900 p-5">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-gray-100">
            {label}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-gray-400 dark:text-gray-400">
            {description}
          </p>

        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 dark:bg-gray-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-gray-100">
          {value}
        </span>

      </div>

    </div>
  );
}
