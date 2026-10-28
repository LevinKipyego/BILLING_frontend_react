


/* ================================================== */
/* Deployment Step Status                             */
/* ================================================== */

/*
 * Must match the backend DeploymentStepStatus
 * exactly.
 */

export type DeploymentStepStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "rolled_back"
  | "skipped";


/* ================================================== */
/* Deployment Step Item                               */
/* ================================================== */

export interface DeploymentStepItem {
  key: string;

  label: string;

  status: DeploymentStepStatus;

  message?: string | null;

  sequence?: number;
}


/* ================================================== */
/* Props                                              */
/* ================================================== */

interface DeploymentStepsProps {
  steps: DeploymentStepItem[];

  currentStep?: string | null;

  compact?: boolean;
}


/* ================================================== */
/* Default Deployment Sequence                       */
/* ================================================== */

/*
 * This sequence mirrors the backend
 * DeploymentStepManager.STEP_DEFINITIONS.
 */

export const DEFAULT_DEPLOYMENT_STEPS:
  DeploymentStepItem[] = [

  {
    key: "api_connection",

    label: "API connection",

    status: "pending",

    sequence: 1,
  },

  {
    key: "discovery",

    label: "Discovery",

    status: "pending",

    sequence: 2,
  },

  {
    key: "wan_discovery",

    label: "WAN discovery",

    status: "pending",

    sequence: 3,
  },

  {
    key: "route_tables",

    label: "Route tables",

    status: "pending",

    sequence: 4,
  },

  {
    key: "pcc",

    label: "PCC",

    status: "pending",

    sequence: 5,
  },

  {
    key: "nat",

    label: "NAT",

    status: "pending",

    sequence: 6,
  },

  {
    key: "verification",

    label: "Verification",

    status: "pending",

    sequence: 7,
  },

  {
    key: "rollback",

    label: "Rollback",

    status: "pending",

    sequence: 8,
  },
];


/* ================================================== */
/* Component                                          */
/* ================================================== */

export default function DeploymentSteps({

  steps,

  currentStep = null,

  compact = false,

}: DeploymentStepsProps) {

  /*
   * Defensive handling.
   *
   * Prevents the component from crashing if the
   * backend temporarily returns no steps.
   */

  const orderedSteps =
    [...(steps ?? [])].sort(
      (
        a,
        b,
      ) =>
        (a.sequence ?? 0) -
        (b.sequence ?? 0),
    );


  /*
   * Nothing to display.
   */

  if (
    orderedSteps.length === 0
  ) {

    return (
      <div className="rounded-lg border bg-sky-50 dark:bg-gray-800 p-3 sm:p-4">

        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
          No deployment steps are available.
        </p>

      </div>
    );
  }


  return (
    <div
      className={
        compact
          ? "space-y-1"
          : "space-y-2"
      }
    >

      {orderedSteps.map(
        (
          step,
          index,
        ) => {

          const isLast =
            index ===
            orderedSteps.length - 1;


          const isCurrent =
            currentStep ===
            step.key;


          return (
            <StepRow
              key={
                `${step.key}-${step.sequence ?? index}`
              }

              step={
                step
              }

              isCurrent={
                isCurrent
              }

              isLast={
                isLast
              }

              compact={
                compact
              }
            />
          );
        },
      )}

    </div>
  );
}


/* ================================================== */
/* Step Row                                           */
/* ================================================== */

function StepRow({

  step,

  isCurrent,

  isLast,

  compact,

}: {

  step: DeploymentStepItem;

  isCurrent: boolean;

  isLast: boolean;

  compact: boolean;

}) {

  const status =
    step.status;


  const success =
    status === "success";


  const running =
    status === "running";


  const failed =
    status === "failed";


  const rolledBack =
    status === "rolled_back";


  const skipped =
    status === "skipped";


  return (
    <div className="flex gap-3">

      {/* ========================================== */}
      {/* Timeline                                   */}
      {/* ========================================== */}

      <div className="flex flex-col items-center">

        <StepIndicator
          status={
            status
          }
        />


        {!isLast && (

          <div
            className={`mt-1 w-px flex-1 ${
              success
                ? "bg-gray-400"
                : "bg-emerald-50 dark:bg-gray-800"
            }`}
          />

        )}

      </div>


      {/* ========================================== */}
      {/* Content                                    */}
      {/* ========================================== */}

      <div
        className={`min-w-0 flex-1 ${
          compact
            ? "pb-3"
            : "pb-5"
        }`}
      >

        <div className="flex items-center justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <p
                className={`font-medium ${
                  skipped
                    ? "text-gray-400"
                    : failed
                      ? "text-red-700"
                      : running ||
                          isCurrent
                        ? "text-slate-800 dark:text-gray-100"
                        : rolledBack
                          ? "text-slate-600 dark:text-gray-300 dark:text-gray-300"
                          : "text-slate-800 dark:text-gray-200"
                }`}
              >
                {step.label}
              </p>


              {isCurrent && (
                <span className="rounded-full bg-sky-50 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:text-gray-300 dark:text-gray-300">
                  Current
                </span>
              )}

            </div>

          </div>


          <StepStatusLabel
            status={
              status
            }
          />

        </div>


        {step.message && (

          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
            {step.message}
          </p>

        )}

      </div>

    </div>
  );
}


/* ================================================== */
/* Step Indicator                                     */
/* ================================================== */

function StepIndicator({

  status,

}: {

  status: DeploymentStepStatus;

}) {

  const base =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold";


  /* ---------------------------------------------- */
  /* Success                                        */
  /* ---------------------------------------------- */

  if (
    status === "success"
  ) {

    return (
      <div
        className={`${base} bg-gradient-to-r from-sky-600 to-emerald-600 dark:bg-gray-800 dark:bg-none text-white`}
      >
        ✓
      </div>
    );
  }


  /* ---------------------------------------------- */
  /* Running                                        */
  /* ---------------------------------------------- */

  if (
    status === "running"
  ) {

    return (
      <div
        className={`${base} bg-emerald-50 dark:bg-gray-800 text-slate-800 dark:text-gray-100`}
      >

        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-400 border-t-gray-900" />

      </div>
    );
  }


  /* ---------------------------------------------- */
  /* Failed                                         */
  /* ---------------------------------------------- */

  if (
    status === "failed"
  ) {

    return (
      <div
        className={`${base} bg-red-100 text-red-700`}
      >
        !
      </div>
    );
  }


  /* ---------------------------------------------- */
  /* Rolled Back                                    */
  /* ---------------------------------------------- */

  if (
    status === "rolled_back"
  ) {

    return (
      <div
        className={`${base} bg-emerald-50 dark:bg-gray-800 text-slate-700 dark:text-gray-200 dark:text-gray-200`}
      >
        ↶
      </div>
    );
  }


  /* ---------------------------------------------- */
  /* Skipped                                        */
  /* ---------------------------------------------- */

  if (
    status === "skipped"
  ) {

    return (
      <div
        className={`${base} bg-sky-50 dark:bg-gray-800 text-gray-400`}
      >
        –
      </div>
    );
  }


  /* ---------------------------------------------- */
  /* Pending                                        */
  /* ---------------------------------------------- */

  return (
    <div
      className={`${base} bg-sky-50 dark:bg-gray-800 text-gray-400`}
    >
      •
    </div>
  );
}


/* ================================================== */
/* Status Label                                       */
/* ================================================== */

function StepStatusLabel({

  status,

}: {

  status: DeploymentStepStatus;

}) {

  const labels:
    Record<
      DeploymentStepStatus,
      string
    > = {

      pending:
        "Pending",

      running:
        "Running",

      success:
        "Success",

      failed:
        "Failed",

      rolled_back:
        "Rolled back",

      skipped:
        "Skipped",
    };


  return (
    <span
      className={`shrink-0 text-xs font-medium ${
        status ===
        "failed"

          ? "text-red-600"

          : status ===
              "running"

            ? "text-slate-800 dark:text-gray-100"

            : status ===
                "success"

              ? "text-slate-700 dark:text-gray-200 dark:text-gray-200"

              : status ===
                  "rolled_back"

                ? "text-slate-600 dark:text-gray-300 dark:text-gray-300"

                : "text-gray-400"
      }`}
    >
      {
        labels[
          status
        ]
      }
    </span>
  );
}

