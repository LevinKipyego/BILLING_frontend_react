
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
      <section className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-gray-900">
          Conflict Analysis
        </h2>

        <p className="mt-2 text-sm text-gray-500">
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
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Conflict Analysis
          </h2>

          <p className="mt-1 text-sm text-gray-500">
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

          <div className="mt-6 rounded-lg bg-gray-50 p-4">

            <div className="flex items-start gap-3">

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                ✓
              </span>

              <div>

                <p className="font-medium text-gray-900">
                  No blocking conflicts detected
                </p>

                <p className="mt-1 text-sm text-gray-600">
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
      className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${
        safe
          ? "bg-gray-100 text-gray-800"
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
      className={`rounded-lg border p-4 ${
        danger && value > 0
          ? "border-red-200 bg-red-50"
          : "bg-gray-50"
      }`}
    >

      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p
        className={`mt-1 text-2xl font-semibold ${
          danger && value > 0
            ? "text-red-700"
            : "text-gray-900"
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
    <h3 className="text-sm font-semibold text-gray-900">
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
      className={`rounded-lg border p-4 ${
        danger
          ? "border-red-200 bg-red-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >

      <div className="flex items-start gap-3">

        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            danger
              ? "bg-red-100 text-red-700"
              : "bg-gray-200 text-gray-700"
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
                : "text-gray-800"
            }`}
          >
            {message}
          </p>


          {resource && (

            <p className="mt-1 text-sm text-gray-600">
              Resource:{" "}
              {resource}
            </p>

          )}


          {severity && (

            <p className="mt-1 text-xs capitalize text-gray-500">
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
    <div className="flex items-start gap-3 p-4">

      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          passed
            ? "bg-gray-100 text-gray-800"
            : failed
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-500"
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

          <p className="font-medium text-gray-900">
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

          <p className="mt-1 text-sm text-gray-600">
            {check.message}
          </p>

        )}

      </div>

    </div>
  );
}
