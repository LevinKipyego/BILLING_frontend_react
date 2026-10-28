import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useNetworkDeployment } from "./hooks/useNetworkDeployment";
import { previewDeployment } from "./api/networkDeploymentApi";

import type {
  DeploymentPreview as DeploymentPreviewData,
  PreviewDeploymentResponse,
} from "./types/networkDeployment";

import type { DeploymentStepItem } from "./components/DeploymentSteps";

/* -------------------------------------------------- */
/* Reusable Components                                */
/* -------------------------------------------------- */

import DeploymentSummary from "./components/DeploymentSummary";
import DiscoveryPanel from "./components/DiscoveryPanel";
import ChangesPanel from "./components/ChangesPanel";
import DeploymentSteps from "./components/DeploymentSteps";
import ConflictPanel from "./components/ConflictPanel";

/* ================================================== */
/* Deployment Preview Component                       */
/* ================================================== */

export default function DeploymentPreview() {
  const navigate = useNavigate();
  const { deploymentId } = useParams<{ deploymentId: string }>();

  const { apply, applying, previewing, rollback, rollingBack } =
    useNetworkDeployment();

  /* -------------------------------------------------- */
  /* State                                              */
  /* -------------------------------------------------- */

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<DeploymentPreviewData | null>(
    null
  );
  const [applyAcknowledged, setApplyAcknowledged] = useState(false);

  /* -------------------------------------------------- */
  /* Load Preview                                       */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (!deploymentId) {
      setError("Deployment ID is missing.");
      setLoading(false);
      return;
    }

    const validDeploymentId = deploymentId;
    let mounted = true;

    async function loadPreview() {
      setLoading(true);
      setError(null);
      setApplyAcknowledged(false);

      try {
        const response: PreviewDeploymentResponse = await previewDeployment(
          validDeploymentId
        );

        if (response.status !== "success") {
          throw new Error(
            response.message || "Unable to generate deployment preview."
          );
        }

        if (!response.preview) {
          throw new Error("The server returned an empty deployment preview.");
        }

        if (!mounted) return;

        setPreviewData(response.preview);
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load deployment preview."
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
  }, [deploymentId]);

  /* -------------------------------------------------- */
  /* Apply Execution Logic                              */
  /* -------------------------------------------------- */

  async function handleApply() {
    if (!deploymentId) return;
    if (!previewData?.can_execute) return;
    if (
      !previewData.plan?.lan?.interfaces?.length ||
      !previewData.plan?.lan?.networks?.length
    ) {
      setError("Apply is blocked because the preview does not contain resolved LAN interfaces and subnets. Refresh the backend preview and verify LAN detection first.");
      return;
    }
    if (!applyAcknowledged) {
      setError("Confirm that you reviewed the LAN interfaces, WAN gateways, and service-impact warning before applying.");
      return;
    }

    setError(null);

    try {
      await apply(deploymentId);

      // Only navigate after the backend has accepted and started deployment
      navigate(`/dashboard/network-deployments/${deploymentId}/progress`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to apply deployment specifications."
      );
    }
  }

  /* -------------------------------------------------- */
  /* Rollback Handler                                   */
  /* -------------------------------------------------- */

  async function handleRollback() {
    if (!deploymentId) return;

    const confirmed = window.confirm(
      "Are you sure you want to rollback this deployment?"
    );

    if (!confirmed) return;

    setError(null);

    try {
      await rollback(deploymentId);

      navigate(`/dashboard/network-deployments/${deploymentId}/progress`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rollback execution failed.");
    }
  }

  /* ================================================== */
  /* Loading Screen                                     */
  /* ================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-2 sm:p-5 lg:p-7 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:p-5 text-center shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-700 dark:text-gray-200 dark:text-gray-300">
            Generating network deployment preview...
          </p>
        </div>
      </div>
    );
  }

  /* ================================================== */
  /* Error Screen                                       */
  /* ================================================== */

  if (error && !previewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-2 sm:p-5 lg:p-7 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 sm:p-6 dark:border-rose-500/20 dark:bg-rose-950/20">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-rose-800 dark:text-rose-400">
              Unable to load preview
            </h2>
            <p className="mt-1.5 text-xs text-rose-700 dark:text-rose-300 leading-normal">
              {error}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg border border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-slate-700/50"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition"
              >
                Retry Load
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================== */
  /* Missing Preview                                    */
  /* ================================================== */

  if (!previewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-2 sm:p-5 lg:p-7 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6 dark:border-slate-800 dark:bg-gray-900">
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-100 dark:text-white uppercase tracking-wide">
              Preview Unavailable
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-gray-400 dark:text-gray-400">
              This deployment does not currently have a preview state loaded.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-4 rounded-lg border border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              Return to Configuration
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------- */
  /* Destructure Preview Data                           */
  /* -------------------------------------------------- */

  const { discovery, conflicts, changes, can_execute, rollback_supported } =
    previewData;

  const lanReady = Boolean(
    previewData.plan?.lan?.interfaces?.length &&
    previewData.plan?.lan?.networks?.length
  );
  const canApply = can_execute && lanReady;

  /* -------------------------------------------------- */
  /* Preview Step Definitions                           */
  /* -------------------------------------------------- */

  const previewSteps: DeploymentStepItem[] = [
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
      message: "Router configuration discovered.",
    },
    {
      key: "wan_discovery",
      label: "WAN discovery",
      status: "success",
      sequence: 3,
      message: `${
        discovery.wans?.length ?? 0
      } eligible WAN interface(s) discovered.`,
    },
    {
      key: "route_tables",
      label: "Route tables",
      status: "pending",
      sequence: 4,
      message: `${changes.route_tables} route table change(s) planned.`,
    },
    {
      key: "pcc",
      label: "PCC",
      status: "pending",
      sequence: 5,
      message: `${changes.pcc_rules} PCC rule(s) planned.`,
    },
    {
      key: "nat",
      label: "NAT",
      status: "pending",
      sequence: 6,
      message: `${changes.nat_rules} NAT rule(s) planned.`,
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
      message: rollback_supported
        ? "Rollback supported for this deployment."
        : "Rollback unavailable for this deployment.",
    },
  ];

  /* ================================================== */
  /* Main Render View                                   */
  /* ================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-2 sm:p-5 lg:p-7 space-y-3 sm:space-y-5 max-w-[1600px] mx-auto text-slate-800 dark:text-gray-200 transition-colors duration-300 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="space-y-3 sm:space-y-6">
        
        {/* Header Section */}
        <section className="relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-3.5 sm:p-5 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
          
          <div className="relative flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Network Infrastructure
              </p>
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-800 dark:text-gray-100 dark:text-white">
                Deployment Preview
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-400 dark:text-gray-400 mt-0.5">
                Review planned MikroTik RouterOS mutations before committing.
              </p>
            </div>

            <div className="self-start sm:self-auto">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                  canApply
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-400"
                }`}
              >
                {!lanReady ? "LAN Detection Required" : canApply ? "Ready to Apply" : "Conflicts Detected"}
              </span>
            </div>
          </div>
        </section>

        {/* Operational Error Alert */}
        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 flex items-center justify-between gap-2 shadow-xs">
            <span className="truncate">{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-[10px] font-bold uppercase tracking-wider underline hover:text-rose-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Deployment Summary */}
        <DeploymentSummary preview={previewData} />

        {!lanReady && (
          <section className="rounded-xl border border-amber-300 bg-amber-50 p-3 sm:p-4 dark:border-amber-800 dark:bg-amber-950/20">
            <h2 className="text-xs sm:text-sm font-semibold text-amber-950 dark:text-amber-100">
              Apply blocked: LAN detection is incomplete
            </h2>
            <p className="mt-1 text-xs leading-5 text-amber-900 dark:text-amber-200 sm:text-sm">
              The preview must include at least one resolved LAN interface and one LAN subnet.
              Refresh the preview after updating the backend; do not apply PCC rules without these values.
            </p>
          </section>
        )}

        {/* Discovery Details */}
        <DiscoveryPanel discovery={discovery} />

        {/* Planned Changes Matrix */}
        <ChangesPanel changes={changes} />

        {/* Deployment Execution Sequence */}
        <section className="rounded-2xl border border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-3.5 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-gray-900">
          <div className="mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-100 dark:text-white uppercase tracking-wide">
              Deployment Sequence
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 dark:text-gray-400 mt-0.5">
              Automated workflow steps staged for execution.
            </p>
          </div>

          <DeploymentSteps steps={previewSteps} />
        </section>

        {/* Conflict Analysis Panel */}
        <ConflictPanel conflicts={conflicts} />

        {/* Rollback Status Panel */}
        <section className="rounded-2xl border border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-3.5 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-gray-900">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-100 dark:text-white uppercase tracking-wide">
            Rollback Safety Protocol
          </h2>

          <div className="mt-2.5 flex items-center gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                rollback_supported
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-400"
              }`}
            >
              {rollback_supported ? "✓" : "!"}
            </span>

            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-gray-100 dark:text-white">
                {rollback_supported
                  ? "Rollback Engine Active"
                  : "Rollback Engine Unavailable"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 dark:text-gray-400">
                Configurations are captured for single-click reversion when active.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-amber-300 bg-amber-50 p-3 sm:p-4 dark:border-amber-800 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <input
              id="apply-deployment-acknowledgement"
              type="checkbox"
              checked={applyAcknowledged}
              onChange={(event) => setApplyAcknowledged(event.target.checked)}
              disabled={applying || previewing || rollingBack}
              className="mt-1 h-4 w-4 rounded border-amber-400"
            />
            <label htmlFor="apply-deployment-acknowledgement" className="text-xs leading-5 text-amber-950 dark:text-amber-100 sm:text-sm">
              <span className="block font-semibold">I reviewed the deployment and understand the service risk.</span>
              <span className="mt-1 block">
                Applying PCC rules can interrupt router management or client internet access if the
                discovered LAN, WAN gateways, routes, or rule ordering are incorrect. A preview is
                not an end-to-end connectivity test, and rollback may not fully restore the prior
                configuration. Apply only when you have a recovery path and maintenance window.
              </span>
            </label>
          </div>
        </section>

        {/* Footer Action Controls */}
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between pt-2">
          <button
            type="button"
            disabled={applying || rollingBack}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-900 border border-sky-200 dark:border-gray-700 dark:border-gray-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-gray-200 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-gray-800 dark:hover:bg-slate-700 disabled:opacity-50 transition cursor-pointer"
          >
            Back
          </button>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            {rollback_supported && (
              <button
                type="button"
                disabled={rollingBack || applying || previewing}
                onClick={handleRollback}
                className="w-full sm:w-auto px-4 py-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/30 disabled:opacity-50 transition cursor-pointer"
              >
                {rollingBack ? "Rolling Back..." : "Rollback Deployment"}
              </button>
            )}

            <button
              type="button"
              disabled={
                !canApply ||
                !applyAcknowledged ||
                applying ||
                previewing ||
                rollingBack
              }
              onClick={handleApply}
              className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-2"
            >
              {applying ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Applying Changes...</span>
                </>
              ) : (
                <span>Apply Deployment</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}