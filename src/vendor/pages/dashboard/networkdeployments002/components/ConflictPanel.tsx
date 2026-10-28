
import type {
  DeploymentConflicts,
  DeploymentConflict,
  DeploymentConflictCheck,
} from "../types/networkDeployment";


interface ConflictPanelProps {
  conflicts: DeploymentConflicts | null;
}


/* ================================================== */
/* Conflict Panel                                     */
/* ================================================== */

export default function ConflictPanel({
  conflicts,
}: ConflictPanelProps) {

  if (!conflicts) {

    return (
      <section className="rounded-xl border bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20">

        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">
          Conflict Analysis
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
          No conflict analysis is currently available.
        </p>

      </section>
    );
  }


  const safe =
    conflicts.safe;


  const summary =
    conflicts.summary;


  const checks =
    conflicts.checks || [];


  const blockingConflicts =
    conflicts.conflicts || [];


  const warnings =
    conflicts.warnings || [];


  return (
    <section className="rounded-xl border bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">
            Conflict Analysis
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
            Validation performed against the router's
            current configuration.
          </p>

        </div>


        <StatusBadge
          safe={safe}
        />

      </div>


      {/* ========================================== */}
      {/* Summary                                    */}
      {/* ========================================== */}

      {summary && (

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            label="Checks"
            value={summary.checks}
          />

          <SummaryCard
            label="Conflicts"
            value={summary.conflicts}
            danger={
              summary.conflicts > 0
            }
          />

          <SummaryCard
            label="Warnings"
            value={summary.warnings}
          />

          <SummaryCard
            label="Blocking"
            value={summary.blocking}
            danger={
              summary.blocking > 0
            }
          />

        </div>

      )}


      {/* ========================================== */}
      {/* Blocking conflicts                        */}
      {/* ========================================== */}

      {blockingConflicts.length > 0 && (

        <div className="mt-6">

          <SectionHeading>
            Blocking Conflicts
          </SectionHeading>

          <div className="mt-3 space-y-3">

            {blockingConflicts.map(
              (
                conflict,
                index,
              ) => (

                <ConflictRow
                  key={index}
                  conflict={conflict}
                  variant="danger"
                />

              ),
            )}

          </div>

        </div>

      )}


      {/* ========================================== */}
      {/* Warnings                                   */}
      {/* ========================================== */}

      {warnings.length > 0 && (

        <div className="mt-6">

          <SectionHeading>
            Warnings
          </SectionHeading>

          <div className="mt-3 space-y-3">

            {warnings.map(
              (
                warning,
                index,
              ) => (

                <ConflictRow
                  key={index}
                  conflict={warning}
                  variant="warning"
                />

              ),
            )}

          </div>

        </div>

      )}


      {/* ========================================== */}
      {/* Validation checks                         */}
      {/* ========================================== */}

      {checks.length > 0 && (

        <div className="mt-6">

          <SectionHeading>
            Validation Checks
          </SectionHeading>

          <div className="mt-3 divide-y rounded-lg border">

            {checks.map(
              (
                check,
                index,
              ) => (

                <CheckRow
                  key={index}
                  check={check}
                />

              ),
            )}

          </div>

        </div>

      )}


      {/* ========================================== */}
      {/* Safe message                              */}
      {/* ========================================== */}

      {safe &&
        blockingConflicts.length === 0 && (

          <div className="mt-6 rounded-lg bg-sky-50 dark:bg-gray-800 p-3 sm:p-4">

            <div className="flex items-start gap-3">

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-emerald-600 dark:bg-gray-800 dark:bg-none text-xs sm:text-sm font-semibold text-white">
                ✓
              </span>

              <div>

                <p className="font-medium text-slate-800 dark:text-gray-100">
                  No blocking conflicts detected
                </p>

                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-gray-300 dark:text-gray-300">
                  The deployment can proceed based on the
                  current conflict analysis.
                </p>

              </div>

            </div>

          </div>

        )}

    </section>
  );
}


/* ================================================== */
/* Status Badge                                       */
/* ================================================== */

function StatusBadge({
  safe,
}: {
  safe: boolean;
}) {

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs sm:text-sm font-medium ${
        safe
          ? "bg-sky-50 dark:bg-gray-800 text-slate-800 dark:text-gray-200"
          : "bg-red-100 text-red-700"
      }`}
    >
      {safe
        ? "Safe to Proceed"
        : "Action Required"}
    </span>
  );
}


/* ================================================== */
/* Summary Card                                       */
/* ================================================== */

function SummaryCard({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {

  return (
    <div
      className={`rounded-lg border p-3 sm:p-4 ${
        danger && value > 0
          ? "border-red-200 bg-red-50"
          : "bg-sky-50 dark:bg-gray-800"
      }`}
    >

      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-gray-400 dark:text-gray-400">
        {label}
      </p>

      <p
        className={`mt-1 text-lg sm:text-2xl font-semibold ${
          danger && value > 0
            ? "text-red-700"
            : "text-slate-800 dark:text-gray-100"
        }`}
      >
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
/* Conflict Row                                       */
/* ================================================== */

function ConflictRow({
  conflict,
  variant,
}: {
  conflict: DeploymentConflict | DeploymentConflictCheck;
  variant: "danger" | "warning";
}) {

  const danger =
    variant === "danger";

  const message =
    "message" in conflict && conflict.message
      ? conflict.message
      : "code" in conflict && conflict.code
        ? conflict.code
        : "type" in conflict && conflict.type
          ? conflict.type
          : "Deployment issue detected";

  const resource =
    "resource" in conflict
      ? conflict.resource
      : undefined;

  const severity =
    "severity" in conflict
      ? conflict.severity
      : undefined;


  return (
    <div
      className={`rounded-lg border p-3 sm:p-4 ${
        danger
          ? "border-red-200 bg-red-50"
          : "border-sky-100 dark:border-gray-700 bg-sky-50 dark:bg-gray-800"
      }`}
    >

      <div className="flex items-start gap-3">

        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-semibold ${
            danger
              ? "bg-red-100 text-red-700"
              : "bg-emerald-50 dark:bg-gray-800 text-slate-700 dark:text-gray-200 dark:text-gray-200"
          }`}
        >
          {danger
            ? "!"
            : "⚠"}
        </span>


        <div className="min-w-0">

          <p
            className={`font-medium ${
              danger
                ? "text-red-800"
                : "text-slate-800 dark:text-gray-200"
            }`}
          >
            {message}
          </p>


          {resource && (

            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-gray-300 dark:text-gray-300">
              Resource:{" "}
              {resource}
            </p>

          )}


          {severity && (

            <p className="mt-1 text-xs capitalize text-slate-500 dark:text-gray-400 dark:text-gray-400">
              Severity:{" "}
              {severity}
            </p>

          )}

        </div>

      </div>

    </div>
  );
}


/* ================================================== */
/* Check Row                                          */
/* ================================================== */

function CheckRow({
  check,
}: {
  check: DeploymentConflictCheck;
}) {

  const status =
    String(
      check.status ||
      "",
    ).toLowerCase();


  const passed =
    status === "pass" ||
    status === "passed" ||
    status === "ok" ||
    status === "success";


  const failed =
    status === "fail" ||
    status === "failed" ||
    status === "error";


  return (
    <div className="flex items-start gap-3 p-3 sm:p-4">

      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          passed
            ? "bg-sky-50 dark:bg-gray-800 text-slate-800 dark:text-gray-200"
            : failed
              ? "bg-red-100 text-red-700"
              : "bg-sky-50 dark:bg-gray-800 text-slate-500 dark:text-gray-400 dark:text-gray-400"
        }`}
      >
        {passed
          ? "✓"
          : failed
            ? "!"
            : "•"}
      </span>


      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center justify-between gap-2">

          <p className="font-medium text-slate-800 dark:text-gray-100">
            {check.code ||
              "Validation check"}
          </p>

          {status && (

            <span className="text-xs capitalize text-gray-400">
              {status}
            </span>

          )}

        </div>


        {check.message && (

          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-gray-300 dark:text-gray-300">
            {check.message}
          </p>

        )}

      </div>

    </div>
  );
}
