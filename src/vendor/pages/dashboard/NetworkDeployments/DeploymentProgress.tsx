
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


import {
  useNetworkDeployment,
} from "./hooks/useNetworkDeployment";


import type {
  DeploymentStatus,
} from "./types/networkDeployment";


import {
  DEFAULT_DEPLOYMENT_STEPS,
} from "./components/DeploymentSteps";


import type {
  DeploymentStepItem,
} from "./components/DeploymentSteps";


import DeploymentSteps from "./components/DeploymentSteps";


/* ================================================== */
/* Backend Response Types                             */
/* ================================================== */

interface DeploymentStatusStep {

  id?: string;

  step?: string;

  key?: string;

  name?: string;

  label?: string;

  status?:
    | "pending"
    | "running"
    | "success"
    | "failed"
    | "rolled_back"
    | "skipped";

  message?: string | null;

  started_at?: string | null;

  completed_at?: string | null;

  sequence?: number;

  [key: string]: unknown;
}


interface DeploymentStatusResponse {

  status?: DeploymentStatus;

  deployment?: {
    id?: string;

    status?: DeploymentStatus;

    error?: string | null;

    [key: string]: unknown;
  };

  steps?: DeploymentStatusStep[];

  current_step?: DeploymentStatusStep | null;

  error?: string | null;

  message?: string;

  [key: string]: unknown;
}


/* ================================================== */
/* Deployment Logs                                    */
/* ================================================== */

interface DeploymentLog {

  id?: string;

  level?: string;

  message?: string;

  created_at?: string;

  timestamp?: string;

  [key: string]: unknown;
}


interface DeploymentLogsResponse {

  logs?: DeploymentLog[];

  results?: DeploymentLog[];

  [key: string]: unknown;
}


/* ================================================== */
/* Terminal Deployment Statuses                      */
/* ================================================== */

const TERMINAL_STATUSES:
  DeploymentStatus[] = [

  "success",

  "failed",

  "rolled_back",
];


/* ================================================== */
/* Component                                          */
/* ================================================== */

export default function DeploymentProgress() {

  const navigate =
    useNavigate();


  const {
    deploymentId,
  } = useParams<{
    deploymentId: string;
  }>();


  const {
    deployment,

    getStatus,

    getLogs,

    rollback,

    rollingBack,
  } = useNetworkDeployment();


  /* -------------------------------------------------- */
  /* State                                              */
  /* -------------------------------------------------- */

  const [
    statusResponse,
    setStatusResponse,
  ] = useState<
    DeploymentStatusResponse | null
  >(null);


  const [
    logs,
    setLogs,
  ] = useState<
    DeploymentLog[]
  >([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );


  /* ================================================== */
  /* Fetch Status                                       */
  /* ================================================== */

  const loadStatus =
    useCallback(
      async (
        silent = false,
      ) => {

        if (!deploymentId) {

          setError(
            "Deployment ID is missing.",
          );

          setLoading(false);

          return;
        }


        if (!silent) {
          setLoading(true);
        }


        try {

          const response =
            await getStatus(
              deploymentId,
            ) as DeploymentStatusResponse;


          setStatusResponse(
            response,
          );


          setError(null);

        } catch (err) {

          setError(
            err instanceof Error
              ? err.message
              : "Unable to retrieve deployment status.",
          );

        } finally {

          if (!silent) {
            setLoading(false);
          }

        }

      },
      [
        deploymentId,
        getStatus,
      ],
    );


  /* ================================================== */
  /* Fetch Logs                                         */
  /* ================================================== */

  const loadLogs =
    useCallback(
      async () => {

        if (!deploymentId) {
          return;
        }


        try {

          const response =
            await getLogs(
              deploymentId,
            ) as DeploymentLogsResponse;


          const incomingLogs =
            response?.logs ??
            response?.results ??
            [];


          setLogs(
            incomingLogs,
          );

        } catch {

          /*
           * Logs are supplementary.
           *
           * A temporary logs failure must not
           * break the deployment progress screen.
           */

        }

      },
      [
        deploymentId,
        getLogs,
      ],
    );


  /* ================================================== */
  /* Initial Load                                       */
  /* ================================================== */

  useEffect(() => {

    loadStatus();

    loadLogs();

  }, [
    loadStatus,
    loadLogs,
  ]);


  /* ================================================== */
  /* Current Deployment Status                          */
  /* ================================================== */

  const currentStatus:
    DeploymentStatus =
      statusResponse?.status ||
      statusResponse?.deployment?.status ||
      deployment.status ||
      "draft";


  /* ================================================== */
  /* Polling                                             */
  /* ================================================== */

  useEffect(() => {

    if (!deploymentId) {
      return;
    }


    if (
      TERMINAL_STATUSES.includes(
        currentStatus,
      )
    ) {
      return;
    }


    const interval =
      window.setInterval(
        () => {

          loadStatus(true);

          loadLogs();

        },
        2000,
      );


    return () => {

      window.clearInterval(
        interval,
      );

    };

  }, [
    deploymentId,
    currentStatus,
    loadStatus,
    loadLogs,
  ]);


  /* ================================================== */
  /* Deployment Error                                   */
  /* ================================================== */

  const deploymentError =
    statusResponse?.error ||
    statusResponse?.deployment?.error ||
    statusResponse?.message ||
    deployment.error ||
    null;


  /* ================================================== */
  /* Backend Steps                                      */
  /* ================================================== */

  const backendSteps =
    statusResponse?.steps ??
    [];


  const currentBackendStep =
    statusResponse?.current_step ??
    null;


  /* ================================================== */
  /* Visual Steps                                       */
  /* ================================================== */

  const steps:
    DeploymentStepItem[] =
    useMemo(
      () => {

        /*
         * Prefer the structured steps returned
         * by DeploymentStatusView.
         */

        if (
          backendSteps.length > 0
        ) {

          return backendSteps
            .map(
              (
                step,
                index,
              ): DeploymentStepItem => {

                const key =
                  step.key ||
                  step.step ||
                  step.name ||
                  step.id ||
                  String(index);


                const label =
                  step.label ||
                  step.name ||
                  step.step ||
                  key;


                /*
                 * Backend and frontend now use
                 * the same status vocabulary.
                 */

                const status =
                  step.status ||
                  "pending";


                return {

                  key,

                  label,

                  status,

                  message:
                    step.message ??
                    null,

                  sequence:
                    step.sequence ??
                    index + 1,
                };

              },
            )
            .sort(
              (
                a,
                b,
              ) =>
                (a.sequence ?? 0) -
                (b.sequence ?? 0),
            );
        }


        /*
         * No structured steps yet.
         *
         * Use the canonical sequence from
         * DeploymentSteps.tsx.
         */

        return DEFAULT_DEPLOYMENT_STEPS.map(
          (
            step,
          ): DeploymentStepItem => ({

            ...step,

            status:
              getFallbackStepStatus(
                step.key,
                currentStatus,
                currentBackendStep,
              ),

          }),
        );

      },
      [
        backendSteps,
        currentStatus,
        currentBackendStep,
      ],
    );


  /* ================================================== */
  /* Current Step                                       */
  /* ================================================== */

  const currentStep =
    currentBackendStep?.key ||
    currentBackendStep?.step ||
    currentBackendStep?.name ||
    null;


  /* ================================================== */
  /* Rollback                                           */
  /* ================================================== */

  async function handleRollback() {

    if (!deploymentId) {
      return;
    }


    const confirmed =
      window.confirm(
        "Rollback this deployment?",
      );


    if (!confirmed) {
      return;
    }


    setError(null);


    try {

      await rollback(
        deploymentId,
      );


      /*
       * Rollback creates deployment activity,
       * so refresh both status and logs.
       */

      await loadLogs();

      await loadStatus();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Rollback failed.",
      );

    }

  }


  /* ================================================== */
  /* Loading                                            */
  /* ================================================== */

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <div className="mx-auto max-w-5xl">

          <div className="rounded-xl border bg-white p-8 text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />


            <p className="text-sm text-gray-600">
              Loading deployment status...
            </p>

          </div>

        </div>

      </div>
    );
  }


  /* ================================================== */
  /* Render                                             */
  /* ================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto max-w-5xl space-y-6">

        {/* ========================================== */}
        {/* Header                                     */}
        {/* ========================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Network Deployment
            </p>


            <h1 className="mt-1 text-2xl font-semibold text-gray-900">
              Deployment Progress
            </h1>


            <p className="mt-1 break-all text-sm text-gray-500">
              Deployment ID: {deploymentId}
            </p>

          </div>


          <StatusBadge
            status={
              currentStatus
            }
          />

        </div>


        {/* ========================================== */}
        {/* Error                                      */}
        {/* ========================================== */}

        {(
          error ||
          deploymentError
        ) && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">

            <p className="font-medium text-red-800">
              Deployment error
            </p>


            <p className="mt-1 text-sm text-red-700">
              {error ||
                deploymentError}
            </p>

          </div>

        )}


        {/* ========================================== */}
        {/* Progress                                   */}
        {/* ========================================== */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-gray-900">
              Deployment Steps
            </h2>


            <p className="mt-1 text-sm text-gray-500">
              Live deployment progress from the backend.
            </p>

          </div>


          <DeploymentSteps
            steps={
              steps
            }

            currentStep={
              currentStep
            }
          />

        </section>


        {/* ========================================== */}
        {/* Logs                                       */}
        {/* ========================================== */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between gap-4">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                Deployment Log
              </h2>


              <p className="mt-1 text-sm text-gray-500">
                Activity reported by the deployment backend.
              </p>

            </div>


            {!TERMINAL_STATUSES.includes(
              currentStatus,
            ) && (

              <span className="shrink-0 text-xs text-gray-400">
                Updating...
              </span>

            )}

          </div>


          {logs.length === 0 ? (

            <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
              No deployment logs yet.
            </div>

          ) : (

            <div className="mt-5 max-h-[420px] overflow-y-auto">

              <div className="space-y-3">

                {logs.map(
                  (
                    log,
                    index,
                  ) => (

                    <div
                      key={
                        log.id ||
                        index
                      }
                      className="rounded-lg bg-gray-50 p-4"
                    >

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium uppercase text-gray-600">
                          {log.level ||
                            "info"}
                        </span>


                        <span className="text-xs text-gray-400">
                          {
                            formatDate(
                              log.created_at ||
                              log.timestamp,
                            )
                          }
                        </span>

                      </div>


                      <p className="mt-2 text-sm text-gray-800">
                        {log.message ||
                          "Deployment event"}
                      </p>

                    </div>

                  ),
                )}

              </div>

            </div>

          )}

        </section>


        {/* ========================================== */}
        {/* Actions                                    */}
        {/* ========================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/dashboard/network-deployments/${deploymentId}/preview`,
              )
            }
            className="rounded-lg border bg-white px-5 py-3 text-sm font-medium text-gray-700"
          >
            Back to Preview
          </button>


          <div className="flex flex-col gap-3 sm:flex-row">

            {(
              currentStatus ===
                "failed" ||
              currentStatus ===
                "running" ||
              currentStatus ===
                "verifying"
            ) && (

              <button
                type="button"
                disabled={
                  rollingBack
                }
                onClick={
                  handleRollback
                }
                className="rounded-lg border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rollingBack
                  ? "Rolling Back..."
                  : "Rollback"}
              </button>

            )}


            {currentStatus ===
              "success" && (

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/network-deployments",
                  )
                }
                className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white"
              >
                Done
              </button>

            )}


            {currentStatus ===
              "rolled_back" && (

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/network-deployments",
                  )
                }
                className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white"
              >
                Done
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}


/* ================================================== */
/* Fallback Step Status                               */
/* ================================================== */

function getFallbackStepStatus(
  stepKey: string,
  currentStatus: DeploymentStatus,
  currentStep: DeploymentStatusStep | null,
): DeploymentStepItem["status"] {

  /*
   * Preview/draft means no execution has started.
   */

  if (
    currentStatus === "draft" ||
    currentStatus === "preview"
  ) {

    return "pending";
  }


  /*
   * If the backend exposes a current step,
   * use it to calculate the visual state.
   */

  const backendKey =
    currentStep?.key ||
    currentStep?.step ||
    currentStep?.name;


  const stepIndex =
    DEFAULT_DEPLOYMENT_STEPS.findIndex(
      step =>
        step.key ===
        stepKey,
    );


  const currentIndex =
    backendKey
      ? DEFAULT_DEPLOYMENT_STEPS.findIndex(
          step =>
            step.key ===
            backendKey,
        )
      : -1;


  /* ---------------------------------------------- */
  /* Running                                        */
  /* ---------------------------------------------- */

  if (
    currentStatus === "running"
  ) {

    if (
      currentIndex >= 0
    ) {

      if (
        stepIndex <
        currentIndex
      ) {
        return "success";
      }


      if (
        stepIndex ===
        currentIndex
      ) {
        return "running";
      }


      return "pending";
    }


    /*
     * No current step yet.
     *
     * API connection is the first step.
     */

    return stepIndex === 0
      ? "running"
      : "pending";
  }


  /* ---------------------------------------------- */
  /* Verifying                                      */
  /* ---------------------------------------------- */

  if (
    currentStatus === "verifying"
  ) {

    const verificationIndex =
      DEFAULT_DEPLOYMENT_STEPS.findIndex(
        step =>
          step.key ===
          "verification",
      );


    if (
      stepIndex <
      verificationIndex
    ) {
      return "success";
    }


    if (
      stepIndex ===
      verificationIndex
    ) {
      return "running";
    }


    return "pending";
  }


  /* ---------------------------------------------- */
  /* Success                                        */
  /* ---------------------------------------------- */

  if (
    currentStatus === "success"
  ) {

    if (
      stepKey ===
      "rollback"
    ) {
      return "skipped";
    }


    return "success";
  }


  /* ---------------------------------------------- */
  /* Failed                                         */
  /* ---------------------------------------------- */

  if (
    currentStatus === "failed"
  ) {

    if (
      currentIndex >= 0
    ) {

      if (
        stepIndex <
        currentIndex
      ) {
        return "success";
      }


      if (
        stepIndex ===
        currentIndex
      ) {
        return "failed";
      }


      return "pending";
    }


    /*
     * If no current step is available,
     * associate the failure with verification.
     */

    const verificationIndex =
      DEFAULT_DEPLOYMENT_STEPS.findIndex(
        step =>
          step.key ===
          "verification",
      );


    if (
      stepIndex <
      verificationIndex
    ) {
      return "success";
    }


    if (
      stepIndex ===
      verificationIndex
    ) {
      return "failed";
    }


    return "pending";
  }


  /* ---------------------------------------------- */
  /* Rolling Back                                   */
  /* ---------------------------------------------- */

  if (
    currentStatus ===
    "rolling_back"
  ) {

    const rollbackIndex =
      DEFAULT_DEPLOYMENT_STEPS.findIndex(
        step =>
          step.key ===
          "rollback",
      );


    if (
      stepIndex <
      rollbackIndex
    ) {
      return "success";
    }


    if (
      stepIndex ===
      rollbackIndex
    ) {
      return "running";
    }


    return "pending";
  }


  /* ---------------------------------------------- */
  /* Rolled Back                                    */
  /* ---------------------------------------------- */

  if (
    currentStatus ===
    "rolled_back"
  ) {

    const rollbackIndex =
      DEFAULT_DEPLOYMENT_STEPS.findIndex(
        step =>
          step.key ===
          "rollback",
      );


    if (
      stepIndex <
      rollbackIndex
    ) {
      return "rolled_back";
    }


    if (
      stepIndex ===
      rollbackIndex
    ) {
      return "success";
    }


    return "pending";
  }


  return "pending";
}


/* ================================================== */
/* Status Badge                                       */
/* ================================================== */

function StatusBadge({
  status,
}: {
  status:
    | DeploymentStatus
    | string;
}) {

  const normalized =
    status.toLowerCase();


  let label =
    normalized.replace(
      /_/g,
      " ",
    );


  let className =
    "bg-gray-100 text-gray-800";


  /* ---------------------------------------------- */
  /* Draft                                          */
  /* ---------------------------------------------- */

  if (
    normalized ===
    "draft"
  ) {

    label =
      "Draft";
  }


  /* ---------------------------------------------- */
  /* Preview                                        */
  /* ---------------------------------------------- */

  if (
    normalized ===
    "preview"
  ) {

    label =
      "Preview";
  }


  /* ---------------------------------------------- */
  /* Discovering                                    */
  /* ---------------------------------------------- */

  if (
    normalized ===
    "discovering"
  ) {

    label =
      "Discovering";

    className =
      "bg-gray-200 text-gray-800";
  }


  /* ---------------------------------------------- */
  /* Discovered                                     */
  /* ---------------------------------------------- */

  if (
    normalized ===
    "discovered"
  ) {

    label =
      "Discovered";

    className =
      "bg-gray-100 text-gray-800";
  }


  /* ---------------------------------------------- */
  /* Running                                        */
  /* ---------------------------------------------- */

  if (
    normalized ===
    "running"
  ) {

    label =
      "Running";

    className =
      "bg-gray-200 text-gray-900";
  }


  /* ---------------------------------------------- */
  /* Verifying                                      */
  /* ---------------------------------------------- */

  if (
    normalized ===
    "verifying"
  ) {

    label =
      "Verifying";

    className =
      "bg-gray-200 text-gray-800";
  }


  /* ---------------------------------------------- */
  /* Success                                        */
  /* ---------------------------------------------- */

  if (
    normalized ===
    "success"
  ) {

    label =
      "Success";

    className =
      "bg-gray-100 text-gray-800";
  }


  /* ---------------------------------------------- */
  /* Failed                                         */
  /* ---------------------------------------------- */

  if (
    normalized ===
    "failed"
  ) {

    label =
      "Failed";

    className =
      "bg-red-100 text-red-700";
  }


  /* ---------------------------------------------- */
  /* Rolling Back                                   */
  /* ---------------------------------------------- */

  if (
    normalized ===
    "rolling_back"
  ) {

    label =
      "Rolling Back";

    className =
      "bg-gray-200 text-gray-800";
  }


  /* ---------------------------------------------- */
  /* Rolled Back                                    */
  /* ---------------------------------------------- */

  if (
    normalized ===
    "rolled_back"
  ) {

    label =
      "Rolled Back";

    className =
      "bg-gray-200 text-gray-700";
  }


  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${className}`}
    >
      {label}
    </span>
  );
}


/* ================================================== */
/* Date Formatting                                    */
/* ================================================== */

function formatDate(
  value?: string,
) {

  if (!value) {
    return "";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {

    return value;
  }


  return date.toLocaleString();
}
