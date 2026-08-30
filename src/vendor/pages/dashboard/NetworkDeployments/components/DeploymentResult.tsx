
import type {
  DeploymentStatus,
} from "../types/networkDeployment";


/* ================================================== */
/* Props                                              */
/* ================================================== */

interface DeploymentResultProps {

  status:
    DeploymentStatus |
    null;

  deploymentId?:
    string |
    null;

  message?:
    string |
    null;

  canRollback?:
    boolean;

  onRollback?:
    () => void;

  rollingBack?:
    boolean;

  onDone?:
    () => void;

  onRetry?:
    () => void;
}


/* ================================================== */
/* Deployment Result                                  */
/* ================================================== */

export default function DeploymentResult({

  status,

  deploymentId,

  message,

  canRollback = false,

  onRollback,

  rollingBack = false,

  onDone,

  onRetry,

}: DeploymentResultProps) {

  const resolvedStatus:
    DeploymentStatus =
    status ||
    "draft";


  /* -------------------------------------------------- */
  /* Success                                             */
  /* -------------------------------------------------- */

  if (
    resolvedStatus ===
    "success"
  ) {

    return (
      <ResultCard

        title="Deployment Successful"

        message={
          message ||
          "The PCC load-balancing configuration was successfully applied and verified."
        }

        type="success"
      >

        <ResultDetails
          deploymentId={
            deploymentId
          }
        />


        <ActionButtons>

          {onDone && (

            <button
              type="button"

              onClick={
                onDone
              }

              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white"
            >
              Done
            </button>

          )}

        </ActionButtons>

      </ResultCard>
    );
  }


  /* -------------------------------------------------- */
  /* Failed                                             */
  /* -------------------------------------------------- */

  if (
    resolvedStatus ===
    "failed"
  ) {

    return (
      <ResultCard

        title="Deployment Failed"

        message={
          message ||
          "The deployment could not be completed."
        }

        type="error"
      >

        <ResultDetails
          deploymentId={
            deploymentId
          }
        />


        <div className="mt-4 rounded-lg bg-red-50 p-4">

          <p className="text-sm text-red-700">
            The router may contain partial changes.
            Review the deployment logs before taking
            further action.
          </p>

        </div>


        <ActionButtons>

          {canRollback &&
            onRollback && (

            <button
              type="button"

              disabled={
                rollingBack
              }

              onClick={
                onRollback
              }

              className="rounded-lg border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {rollingBack
                ? "Rolling Back..."
                : "Rollback"}
            </button>

          )}


          {onRetry && (

            <button
              type="button"

              onClick={
                onRetry
              }

              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white"
            >
              Try Again
            </button>

          )}

        </ActionButtons>

      </ResultCard>
    );
  }


  /* -------------------------------------------------- */
  /* Rolled Back                                        */
  /* -------------------------------------------------- */

  if (
    resolvedStatus ===
    "rolled_back"
  ) {

    return (
      <ResultCard

        title="Deployment Rolled Back"

        message={
          message ||
          "The deployment changes were rolled back successfully."
        }

        type="rollback"
      >

        <ResultDetails
          deploymentId={
            deploymentId
          }
        />


        <ActionButtons>

          {onDone && (

            <button
              type="button"

              onClick={
                onDone
              }

              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white"
            >
              Done
            </button>

          )}

        </ActionButtons>

      </ResultCard>
    );
  }


  /* -------------------------------------------------- */
  /* Rolling Back                                       */
  /* -------------------------------------------------- */

  if (
    resolvedStatus ===
    "rolling_back"
  ) {

    return (
      <ResultCard

        title="Rolling Back Deployment"

        message={
          message ||
          "The deployment changes are being removed from the router."
        }

        type="rollback"
      >

        <ResultDetails
          deploymentId={
            deploymentId
          }
        />


        <div className="mt-6 flex items-center gap-3">

          <Spinner />

          <span className="text-sm text-gray-600">
            Waiting for rollback to complete...
          </span>

        </div>

      </ResultCard>
    );
  }


  /* -------------------------------------------------- */
  /* Running                                             */
  /* -------------------------------------------------- */

  if (
    resolvedStatus ===
    "running"
  ) {

    return (
      <ResultCard

        title="Applying Deployment"

        message={
          message ||
          "The configuration is being applied to the router."
        }

        type="progress"
      >

        <ResultDetails
          deploymentId={
            deploymentId
          }
        />


        <div className="mt-6 flex items-center gap-3">

          <Spinner />

          <span className="text-sm text-gray-600">
            Applying configuration...
          </span>

        </div>

      </ResultCard>
    );
  }


  /* -------------------------------------------------- */
  /* Verifying                                           */
  /* -------------------------------------------------- */

  if (
    resolvedStatus ===
    "verifying"
  ) {

    return (
      <ResultCard

        title="Verifying Deployment"

        message={
          message ||
          "The router configuration is being verified."
        }

        type="progress"
      >

        <ResultDetails
          deploymentId={
            deploymentId
          }
        />


        <div className="mt-6 flex items-center gap-3">

          <Spinner />

          <span className="text-sm text-gray-600">
            Verifying router configuration...
          </span>

        </div>

      </ResultCard>
    );
  }


  /* -------------------------------------------------- */
  /* Discovering                                         */
  /* -------------------------------------------------- */

  if (
    resolvedStatus ===
    "discovering"
  ) {

    return (
      <ResultCard

        title="Discovering Router"

        message={
          message ||
          "The router configuration is being discovered."
        }

        type="progress"
      >

        <ResultDetails
          deploymentId={
            deploymentId
          }
        />


        <div className="mt-6 flex items-center gap-3">

          <Spinner />

          <span className="text-sm text-gray-600">
            Discovering router configuration...
          </span>

        </div>

      </ResultCard>
    );
  }


  /* -------------------------------------------------- */
  /* Discovered                                          */
  /* -------------------------------------------------- */

  if (
    resolvedStatus ===
    "discovered"
  ) {

    return (
      <ResultCard

        title="Router Discovered"

        message={
          message ||
          "Router discovery completed successfully."
        }

        type="neutral"
      >

        <ResultDetails
          deploymentId={
            deploymentId
          }
        />

      </ResultCard>
    );
  }


  /* -------------------------------------------------- */
  /* Preview                                             */
  /* -------------------------------------------------- */

  if (
    resolvedStatus ===
    "preview"
  ) {

    return (
      <ResultCard

        title="Deployment Preview"

        message={
          message ||
          "The deployment preview is ready for review."
        }

        type="neutral"
      >

        <ResultDetails
          deploymentId={
            deploymentId
          }
        />

      </ResultCard>
    );
  }


  /* -------------------------------------------------- */
  /* Draft                                               */
  /* -------------------------------------------------- */

  return (
    <ResultCard

      title="Deployment"

      message={
        message ||
        "The deployment has not reached a terminal state."
      }

      type="neutral"
    >

      <ResultDetails
        deploymentId={
          deploymentId
        }
      />

    </ResultCard>
  );
}


/* ================================================== */
/* Result Card                                        */
/* ================================================== */

function ResultCard({

  title,

  message,

  type,

  children,

}: {

  title: string;

  message: string;

  type:
    | "success"
    | "error"
    | "rollback"
    | "progress"
    | "neutral";

  children?:
    React.ReactNode;

}) {

  const styles = {

    success: {

      container:
        "border-gray-200 bg-white",

      icon:
        "bg-gray-900 text-white",
    },


    error: {

      container:
        "border-red-200 bg-white",

      icon:
        "bg-red-100 text-red-700",
    },


    rollback: {

      container:
        "border-gray-200 bg-white",

      icon:
        "bg-gray-200 text-gray-700",
    },


    progress: {

      container:
        "border-gray-200 bg-white",

      icon:
        "bg-gray-200 text-gray-800",
    },


    neutral: {

      container:
        "border-gray-200 bg-white",

      icon:
        "bg-gray-100 text-gray-500",
    },

  }[type];


  return (
    <section
      className={`rounded-xl border p-6 shadow-sm ${styles.container}`}
    >

      <div className="flex items-start gap-4">

        <ResultIcon
          type={
            type
          }
        />


        <div className="min-w-0 flex-1">

          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>


          <p className="mt-1 text-sm text-gray-600">
            {message}
          </p>

        </div>

      </div>


      {children}

    </section>
  );
}


/* ================================================== */
/* Result Icon                                        */
/* ================================================== */

function ResultIcon({

  type,

}: {

  type:
    | "success"
    | "error"
    | "rollback"
    | "progress"
    | "neutral";

}) {

  if (
    type ===
    "success"
  ) {

    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
        ✓
      </div>
    );
  }


  if (
    type ===
    "error"
  ) {

    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 font-semibold text-red-700">
        !
      </div>
    );
  }


  if (
    type ===
    "rollback"
  ) {

    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
        ↶
      </div>
    );
  }


  if (
    type ===
    "progress"
  ) {

    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">

        <Spinner />

      </div>
    );
  }


  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
      •
    </div>
  );
}


/* ================================================== */
/* Result Details                                     */
/* ================================================== */

function ResultDetails({

  deploymentId,

}: {

  deploymentId?:
    string |
    null;

}) {

  if (!deploymentId) {
    return null;
  }


  return (
    <div className="mt-6 rounded-lg bg-gray-50 p-4">

      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Deployment ID
      </p>


      <p className="mt-1 break-all font-mono text-sm text-gray-800">
        {deploymentId}
      </p>

    </div>
  );
}


/* ================================================== */
/* Action Buttons                                     */
/* ================================================== */

function ActionButtons({

  children,

}: {

  children?:
    React.ReactNode;

}) {

  if (!children) {
    return null;
  }


  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

      {children}

    </div>
  );
}


/* ================================================== */
/* Spinner                                            */
/* ================================================== */

function Spinner() {

  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
  );
}

