
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  fetchMikrotiks,
} from "../../../api/devices";

import {
  useNetworkDeployment,
} from "./hooks/useNetworkDeployment";

import type {
  MikrotikDevice,
} from "../../../types/device";

import type {
  DeploymentCreatePayload,
  DeploymentDiscovery,
  DeploymentWanConfig,
  DiscoveredWan,
  
  PccMode,
} from "./types/networkDeployment";

import RouterSelector from "./components/RouterSelector";
import WanSelector from "./components/WanSelector";
import PccModeSelector from "./components/PccModeSelector";
import WeightEditor from "./components/WeightEditor";


/* ================================================== */
/* Deployment Create                                  */
/* ================================================== */

export default function DeploymentCreate() {

  const navigate =
    useNavigate();


  const {
    create,
    preview,
    loading,
    discovering,
    previewing,
    deployment,
    discover,
  } = useNetworkDeployment();


  /* -------------------------------------------------- */
  /* Router state                                       */
  /* -------------------------------------------------- */

  const [
    mikrotiks,
    setMikrotiks,
  ] = useState<MikrotikDevice[]>([]);


  const [
    loadingRouters,
    setLoadingRouters,
  ] = useState(true);


  const [
    routerError,
    setRouterError,
  ] = useState<string | null>(
    null,
  );


  const [
    selectedMikrotikId,
    setSelectedMikrotikId,
  ] = useState("");


  /* -------------------------------------------------- */
  /* Discovery state                                    */
  /* -------------------------------------------------- */

  const [
    discoveredWanInterfaces,
    setDiscoveredWanInterfaces,
  ] = useState<string[]>([]);


  const [
    discoveryData,
    setDiscoveryData,
  ] = useState<DeploymentDiscovery | null>(
    null,
  );


  const [
    discoveryError,
    setDiscoveryError,
  ] = useState<string | null>(
    null,
  );


  /* -------------------------------------------------- */
  /* WAN state                                          */
  /* -------------------------------------------------- */

  const [
    selectedWans,
    setSelectedWans,
  ] = useState<DeploymentWanConfig[]>(
    [],
  );


  /* -------------------------------------------------- */
  /* PCC mode                                           */
  /* -------------------------------------------------- */

  const [
    pccMode,
    setPccMode,
  ] = useState<PccMode>(
    "regular",
  );


  /* -------------------------------------------------- */
  /* Load MikroTiks                                     */
  /* -------------------------------------------------- */

  useEffect(() => {

    let mounted = true;


    async function loadRouters() {

      setLoadingRouters(true);
      setRouterError(null);


      try {

        const routers =
          await fetchMikrotiks();


        if (!mounted) {
          return;
        }


        setMikrotiks(
          routers.filter(
            router =>
              router.enabled !== false,
          ),
        );

      } catch (error) {

        if (!mounted) {
          return;
        }


        setRouterError(
          error instanceof Error
            ? error.message
            : "Unable to load MikroTik devices.",
        );

      } finally {

        if (mounted) {
          setLoadingRouters(false);
        }

      }

    }


    loadRouters();


    return () => {
      mounted = false;
    };

  }, []);


  /* -------------------------------------------------- */
  /* Router selection                                  */
  /* -------------------------------------------------- */

  function handleRouterChange(
    mikrotikId: string,
  ) {

    setSelectedMikrotikId(
      mikrotikId,
    );

    /*
     * A new router means the previous discovery
     * result is no longer valid.
     */

    setDiscoveredWanInterfaces(
      [],
    );

    setDiscoveryData(
      null,
    );

    setSelectedWans(
      [],
    );

    setDiscoveryError(
      null,
    );
  }


  /* -------------------------------------------------- */
  /* Discovery                                          */
  /* -------------------------------------------------- */

  async function handleDiscovery() {

    if (!selectedMikrotikId) {

      setDiscoveryError(
        "Select a MikroTik router first.",
      );

      return;
    }


    setDiscoveryError(null);

    setDiscoveredWanInterfaces([]);

    setSelectedWans([]);


    try {

      const response =
        await discover({
          mikrotik_id:
            selectedMikrotikId,
        });


      if (
        response.status !==
        "success"
      ) {

        throw new Error(
          response.message ||
          "Router discovery failed.",
        );
      }


      if (!response.discovery) {

        throw new Error(
          "Router discovery returned no discovery data.",
        );
      }


      /*
       * Store the complete discovery result.
       *
       * This includes:
       *
       *   interfaces
       *   addresses
       *   dhcp_clients
       *   routes
       *   wan
       *   wans
       *   routing_tables
       *   etc.
       */

      setDiscoveryData(
        response.discovery,
      );


      /*
       * IMPORTANT
       *
       * The backend returns two WAN-related
       * structures:
       *
       * discovery.wan
       *
       *     Raw WAN discovery information.
       *
       * discovery.wans
       *
       *     Normalized eligible WAN interfaces.
       *
       * The selector MUST use discovery.wans.
       */

      const wans: DiscoveredWan[] =
        response.discovery.wans ?? [];


      /*
       * Extract the actual interface names.
       */

      const interfaces =
        wans
          .map(
            wan =>
              wan.interface,
          )
          .filter(
            (
              name,
            ): name is string =>
              typeof name === "string" &&
              name.trim().length > 0,
          );


      /*
       * Remove duplicates while preserving
       * the order returned by the backend.
       */

      const uniqueInterfaces =
        Array.from(
          new Set(
            interfaces,
          ),
        );


      setDiscoveredWanInterfaces(
        uniqueInterfaces,
      );


      /*
       * A valid PCC deployment requires
       * at least two eligible WANs.
       */

      if (
        uniqueInterfaces.length <
        2
      ) {

        setDiscoveryError(
          "Router discovery found fewer than two eligible WAN interfaces.",
        );
      }

    } catch (error) {

      setDiscoveryData(null);

      setDiscoveredWanInterfaces([]);

      setSelectedWans([]);

      setDiscoveryError(
        error instanceof Error
          ? error.message
          : "Router discovery failed.",
      );

    }

  }


  /* -------------------------------------------------- */
  /* Weight validation                                  */
  /* -------------------------------------------------- */

  const totalWeight =
    selectedWans.reduce(
      (
        total,
        wan,
      ) =>
        total +
        Number(
          wan.weight || 0,
        ),
      0,
    );


  const weightsValid =
    pccMode === "regular" ||
    (
      selectedWans.length >= 2 &&
      selectedWans.every(
        wan =>
          Number(
            wan.weight || 0,
          ) > 0,
      ) &&
      totalWeight > 0
    );


  /* -------------------------------------------------- */
  /* Configuration validation                          */
  /* -------------------------------------------------- */

  const configurationValid =
    Boolean(
      selectedMikrotikId,
    ) &&
    Boolean(
      discoveryData,
    ) &&
    discoveredWanInterfaces.length >= 2 &&
    selectedWans.length >= 2 &&
    weightsValid;


  /* -------------------------------------------------- */
  /* Error                                             */
  /* -------------------------------------------------- */

  const error =
    deployment.error ||
    routerError ||
    discoveryError;


  /* -------------------------------------------------- */
  /* Submit                                             */
  /* -------------------------------------------------- */

  async function handleSubmit(
    event: React.FormEvent,
  ) {

    event.preventDefault();


    if (!configurationValid) {
      return;
    }


    const payload:
      DeploymentCreatePayload = {

      mikrotik_id:
        selectedMikrotikId,

      deployment_type:
        "load_balancing",

      mode:
        "pcc",

      pcc_type:
        pccMode,

      wan_interfaces:
        selectedWans.map(
          wan => ({
            interface:
              wan.interface,

            ...(pccMode === "weighted"
              ? {
                  weight:
                    wan.weight,
                }
              : {}),
          }),
        ),
    };


    try {

      const created =
        await create(
          payload,
        );


      if (
        !created?.deployment_id
      ) {

        throw new Error(
          "The server did not return a deployment ID.",
        );
      }


      await preview(
        created.deployment_id,
      );


      navigate(
        `/dashboard/network-deployments/${created.deployment_id}/preview`,
      );

    } catch {

      /*
       * useNetworkDeployment stores
       * the deployment error.
       */

    }

  }


  /* ================================================== */
  /* Render                                             */
  /* ================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto max-w-4xl">

        {/* ======================================== */}
        {/* Header                                   */}
        {/* ======================================== */}

        <div className="mb-8">

          <h1 className="text-2xl font-semibold text-gray-900">
            Network Deployment
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Configure MikroTik WAN load balancing.
          </p>

        </div>


        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >

          {/* ====================================== */}
          {/* Router                                */}
          {/* ====================================== */}

          <RouterSelector
            routers={
              mikrotiks
            }

            value={
              selectedMikrotikId
            }

            onChange={
              handleRouterChange
            }

            disabled={
              loading ||
              previewing ||
              discovering
            }

            loading={
              loadingRouters
            }

            error={
              routerError
            }
          />


          {/* ====================================== */}
          {/* Discovery                              */}
          {/* ====================================== */}

          {selectedMikrotikId && (

            <section className="rounded-xl border bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Router Discovery
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Discover the actual WAN interfaces
                    available on this MikroTik router.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={
                    handleDiscovery
                  }
                  disabled={
                    discovering ||
                    loading ||
                    previewing
                  }
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {discovering
                    ? "Discovering..."
                    : "Discover Router"}

                </button>

              </div>


              {discoveryError && (

                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {discoveryError}
                </div>

              )}


              {discoveryData && (

                <div className="mt-4 rounded-lg bg-gray-50 p-4">

                  <div className="grid gap-4 sm:grid-cols-4">

                    <div>

                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Interfaces
                      </p>

                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {
                          discoveryData.interfaces?.length ??
                          0
                        }
                      </p>

                    </div>


                    <div>

                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        DHCP Clients
                      </p>

                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {
                          discoveryData.dhcp_clients?.length ??
                          0
                        }
                      </p>

                    </div>


                    <div>

                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Routes
                      </p>

                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {
                          discoveryData.routes?.length ??
                          0
                        }
                      </p>

                    </div>


                    <div>

                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Eligible WANs
                      </p>

                      <p
                        className={`mt-1 text-lg font-semibold ${
                          discoveredWanInterfaces.length >= 2
                            ? "text-gray-900"
                            : "text-red-600"
                        }`}
                      >
                        {
                          discoveredWanInterfaces.length
                        }
                      </p>

                    </div>

                  </div>

                </div>

              )}

            </section>

          )}


          {/* ====================================== */}
          {/* WANs                                   */}
          {/* ====================================== */}

          <WanSelector
            interfaces={
              discoveredWanInterfaces
            }

            value={
              selectedWans
            }

            onChange={
              setSelectedWans
            }

            disabled={
              !discoveryData ||
              loading ||
              discovering ||
              previewing
            }

            weighted={
              pccMode === "weighted"
            }
          />


          {/* ====================================== */}
          {/* PCC Mode                               */}
          {/* ====================================== */}

          <PccModeSelector
            value={
              pccMode
            }

            onChange={
              setPccMode
            }

            disabled={
              loading ||
              discovering ||
              previewing
            }
          />


          {/* ====================================== */}
          {/* Weight Editor                          */}
          {/* ====================================== */}

          {pccMode === "weighted" && (

            <WeightEditor
              wans={
                selectedWans
              }

              onChange={
                setSelectedWans
              }

              disabled={
                loading ||
                discovering ||
                previewing
              }
            />

          )}


          {/* ====================================== */}
          {/* Configuration Summary                 */}
          {/* ====================================== */}

          <section className="rounded-xl border bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Configuration
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review the configuration before
                  generating the deployment preview.
                </p>

              </div>


              <div className="text-right">

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Selected WANs
                </p>

                <p
                  className={`text-2xl font-semibold ${
                    selectedWans.length >= 2
                      ? "text-gray-900"
                      : "text-red-600"
                  }`}
                >
                  {
                    selectedWans.length
                  }
                </p>

              </div>

            </div>


            {pccMode === "weighted" && (

              <div className="mt-5 rounded-lg bg-gray-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-600">
                    Total relative weight
                  </span>

                  <span
                    className={`font-semibold ${
                      totalWeight > 0
                        ? "text-gray-900"
                        : "text-red-600"
                    }`}
                  >
                    {totalWeight}
                  </span>

                </div>

              </div>

            )}


            {!discoveryData && (

              <p className="mt-4 text-sm text-gray-500">
                Discover the router before selecting
                WAN interfaces.
              </p>

            )}


            {discoveryData &&
              selectedWans.length < 2 && (

              <p className="mt-4 text-sm text-red-600">
                Select at least two WAN interfaces.
              </p>

            )}

          </section>


          {/* ====================================== */}
          {/* Error                                   */}
          {/* ====================================== */}

          {error && (

            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>

          )}


          {/* ====================================== */}
          {/* Actions                                 */}
          {/* ====================================== */}

          <div className="flex justify-end">

            <button
              type="submit"
              disabled={
                !configurationValid ||
                loading ||
                discovering ||
                previewing ||
                loadingRouters
              }
              className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ||
              previewing
                ? "Preparing Preview..."
                : "Generate Preview"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
