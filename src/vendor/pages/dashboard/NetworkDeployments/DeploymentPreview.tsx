import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useNetworkDeployment,
} from "./hooks/useNetworkDeployment";

import {
  previewDeployment,
} from "./api/networkDeploymentApi";

import type {
  DeploymentPreview as DeploymentPreviewData,
  PreviewDeploymentResponse,
} from "./types/networkDeployment";

import type {
  DeploymentStepItem,
} from "./components/DeploymentSteps";

/* -------------------------------------------------- */
/* Reusable Components                                */
/* -------------------------------------------------- */

import DeploymentSummary from "./components/DeploymentSummary";
import DiscoveryPanel from "./components/DiscoveryPanel";
import ChangesPanel from "./components/ChangesPanel";
import DeploymentSteps from "./components/DeploymentSteps";
import ConflictPanel from "./components/ConflictPanel";


/* ================================================== */
/* Deployment Preview                                 */
/* ================================================== */

export default function DeploymentPreview() {

  const navigate =
    useNavigate();


  const {
    deploymentId,
  } = useParams<{
    deploymentId: string;
  }>();


  const {
    //apply,

    applying,
    previewing,
    rollback,
    rollingBack,
    
  } = useNetworkDeployment();


  /* -------------------------------------------------- */
  /* State                                              */
  /* -------------------------------------------------- */

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


  const [
    previewData,
    setPreviewData,
  ] = useState<DeploymentPreviewData | null>(
    null,
  );


  /* -------------------------------------------------- */
  /* Load Preview                                       */
  /* -------------------------------------------------- */

  useEffect(() => {

    if (!deploymentId) {

      setError(
        "Deployment ID is missing.",
      );

      setLoading(false);

      return;
    }


    const validDeploymentId =
      deploymentId;


    let mounted = true;


    async function loadPreview() {

      setLoading(true);

      setError(null);


      try {

        /*
         * Preview is the source of truth for this page.
         */

        const response:
          PreviewDeploymentResponse =
          await previewDeployment(
            validDeploymentId,
          );


        if (
          response.status !==
          "success"
        ) {

          throw new Error(
            response.message ||
            "Unable to generate deployment preview.",
          );
        }


        if (
          !response.preview
        ) {

          throw new Error(
            "The server returned an empty deployment preview.",
          );
        }


        if (!mounted) {
          return;
        }


        setPreviewData(
          response.preview,
        );

      } catch (err) {

        if (!mounted) {
          return;
        }


        setError(
          err instanceof Error
            ? err.message
            : "Unable to load deployment preview.",
        );

      } finally {

        if (mounted) {
          setLoading(false);
        }
      }
    }


    loadPreview();


    return () => {
      mounted = false;
    };

  }, [
    deploymentId,
  ]);


  /* -------------------------------------------------- */
  /* Apply                                              */
  /* -------------------------------------------------- */

  async function handleApply() {

    console.log("coming soon")

    /*if (!deploymentId) {
      return;
    }


    if (!canExecute) {
      return;
    }


    setError(null);


    try {

      await apply(
        deploymentId,
      );


      /*
       * Only navigate after the backend has
       * accepted and started the deployment.
       

      navigate(
        `/dashboard/network-deployments/${deploymentId}/progress`,
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to apply deployment.",
      );
    }*/
  } 


  /* -------------------------------------------------- */
  /* Rollback                                           */
  /* -------------------------------------------------- */

  async function handleRollback() {

    if (!deploymentId) {
      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to rollback this deployment?",
      );


    if (!confirmed) {
      return;
    }


    setError(null);


    try {

      await rollback(
        deploymentId,
      );


      navigate(
        `/dashboard/network-deployments/${deploymentId}/progress`,
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Rollback failed.",
      );
    }
  }


  /* ================================================== */
  /* Loading                                             */
  /* ================================================== */

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <div className="mx-auto max-w-6xl">

          <div className="rounded-xl border bg-white p-8 text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />

            <p className="text-sm text-gray-600">
              Loading deployment preview...
            </p>

          </div>

        </div>

      </div>
    );
  }


  /* ================================================== */
  /* Error                                               */
  /* ================================================== */

  if (error && !previewData) {

    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <div className="mx-auto max-w-6xl">

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">

            <h2 className="font-semibold text-red-800">
              Unable to load preview
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <div className="mt-5 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
              >
                Retry
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }


  /* ================================================== */
  /* Missing Preview                                     */
  /* ================================================== */

  if (!previewData) {

    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <div className="mx-auto max-w-6xl">

          <div className="rounded-xl border bg-white p-6">

            <h2 className="font-semibold text-gray-900">
              Preview unavailable
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              This deployment does not currently have
              a preview loaded.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="mt-5 rounded-lg border px-4 py-2 text-sm font-medium"
            >
              Return to Configuration
            </button>

          </div>

        </div>

      </div>
    );
  }


  /* -------------------------------------------------- */
  /* Preview data                                       */
  /* -------------------------------------------------- */

  const {
    
    discovery,
    
    conflicts,
    changes,
    can_execute,
    rollback_supported,
  } = previewData;


  /*
   * Keep this local alias so the Apply handler above
   * can safely use the same execution capability.
   */



  

  //const canExecute =
    //can_execute === true;





  /* -------------------------------------------------- */
  /* Preview Steps                                      */
  /* -------------------------------------------------- */

  const previewSteps:
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
      status: "success",
      sequence: 2,
      message:
        "Router configuration has been discovered.",
    },

    {
      key: "wan_discovery",
      label: "WAN discovery",
      status: "success",
      sequence: 3,
      message:
        `${
          discovery.wans?.length ?? 0
        } eligible WAN interface(s) discovered.`,
    },

    {
      key: "route_tables",
      label: "Route tables",
      status: "pending",
      sequence: 4,
      message:
        `${
          changes.route_tables
        } route table change(s) planned.`,
    },

    {
      key: "pcc",
      label: "PCC",
      status: "pending",
      sequence: 5,
      message:
        `${
          changes.pcc_rules
        } PCC rule(s) planned.`,
    },

    {
      key: "nat",
      label: "NAT",
      status: "pending",
      sequence: 6,
      message:
        `${
          changes.nat_rules
        } NAT rule(s) planned.`,
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
      message:
        rollback_supported
          ? "Rollback is supported for this deployment."
          : "Rollback is unavailable for this deployment.",
    },
  ];


  /* ================================================== */
  /* Render                                             */
  /* ================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto max-w-6xl space-y-6">

        {/* ========================================== */}
        {/* Header                                     */}
        {/* ========================================== */}

        <div>

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-sm text-gray-500">
                Network Deployment
              </p>

              <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                Deployment Preview
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review the planned MikroTik changes
                before applying them.
              </p>

            </div>

            <div
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                can_execute
                  ? "bg-gray-100 text-gray-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {can_execute
                ? "Ready to Apply"
                : "Conflicts Detected"}
            </div>

          </div>

        </div>


        {/* ========================================== */}
        {/* Operation Error                            */}
        {/* ========================================== */}

        {error && (

          <section className="rounded-xl border border-red-200 bg-red-50 p-4">

            <div className="flex gap-3">

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-700">
                !
              </span>

              <div className="min-w-0">

                <p className="font-medium text-red-800">
                  Deployment operation failed
                </p>

                <p className="mt-1 break-words text-sm text-red-700">
                  {error}
                </p>

              </div>

            </div>

          </section>

        )}


        {/* ========================================== */}
        {/* Deployment Summary                         */}
        {/* ========================================== */}

        <DeploymentSummary
          preview={
            previewData
          }
        />


        {/* ========================================== */}
        {/* Discovery                                  */}
        {/* ========================================== */}

        <DiscoveryPanel
          discovery={
            discovery
          }
        />


        {/* ========================================== */}
        {/* Planned Changes                            */}
        {/* ========================================== */}

        <ChangesPanel
          changes={
            changes
          }
        />


        {/* ========================================== */}
        {/* Deployment Steps                           */}
        {/* ========================================== */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-gray-900">
              Deployment Steps
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Planned execution sequence for this
              deployment.
            </p>

          </div>

          <DeploymentSteps
            steps={
              previewSteps
            }
          />

        </section>


        {/* ========================================== */}
        {/* Conflict Analysis                          */}
        {/* ========================================== */}

        <ConflictPanel
          conflicts={
            conflicts
          }
        />


        {/* ========================================== */}
        {/* Rollback Protection                        */}
        {/* ========================================== */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            Rollback Protection
          </h2>

          <div className="mt-4 flex items-center gap-3">

            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                rollback_supported
                  ? "bg-gray-100 text-gray-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {rollback_supported
                ? "✓"
                : "!"}
            </span>

            <div>

              <p className="font-medium text-gray-900">
                {rollback_supported
                  ? "Rollback supported"
                  : "Rollback unavailable"}
              </p>

              <p className="text-sm text-gray-500">
                Deployment changes can be tracked
                and reversed when supported.
              </p>

            </div>

          </div>

        </section>


        {/* ========================================== */}
        {/* Actions                                    */}
        {/* ========================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

          {/* -------------------------------------- */}
          {/* Back                                   */}
          {/* -------------------------------------- */}

          <button
            type="button"
            disabled={
              applying ||
              rollingBack
            }
            onClick={() =>
              navigate(-1)
            }
            className="rounded-lg border bg-white px-5 py-3 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>


          <div className="flex flex-col gap-3 sm:flex-row">

            {/* ---------------------------------- */}
            {/* Rollback                           */}
            {/* ---------------------------------- */}

            {rollback_supported && (

              <button
                type="button"
                disabled={
                  rollingBack ||
                  applying ||
                  previewing
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


            {/* ---------------------------------- */}
            {/* Apply                              */}
            {/* ---------------------------------- */}

            <button
              type="button"
              disabled={
                !can_execute ||
                applying ||
                previewing ||
                rollingBack
              }
              onClick={
                handleApply
              }
              className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applying
                ? "Applying Deployment..."
                : "Apply Deployment"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}