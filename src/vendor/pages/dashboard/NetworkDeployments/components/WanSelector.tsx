
import type {
  DeploymentWanConfig,
} from "../types/networkDeployment";


interface WanSelectorProps {
  interfaces: string[];

  value: DeploymentWanConfig[];

  onChange: (
    wans: DeploymentWanConfig[],
  ) => void;

  disabled?: boolean;

  weighted?: boolean;
}


/* ================================================== */
/* WAN Selector                                       */
/* ================================================== */

export default function WanSelector({
  interfaces,
  value,
  onChange,
  disabled = false,
  weighted = false,
}: WanSelectorProps) {

  const selectedInterfaces =
    new Set(
      value.map(
        wan => wan.interface,
      ),
    );


  function toggleInterface(
    interfaceName: string,
  ) {

    const exists =
      selectedInterfaces.has(
        interfaceName,
      );


    if (exists) {

      onChange(
        value.filter(
          wan =>
            wan.interface !==
            interfaceName,
        ),
      );

      return;
    }


    /*
     * New WANs receive a default relative
     * weight of 1.
     *
     * The parent can later adjust this
     * through WeightEditor.
     */
    onChange([
      ...value,
      {
        interface:
          interfaceName,
        weight: 1,
      },
    ]);
  }


  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div>

        <h2 className="text-lg font-semibold text-gray-900">
          WAN Interfaces
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select the WAN interfaces that should
          participate in PCC load balancing.
        </p>

      </div>


      {/* ========================================== */}
      {/* No interfaces                             */}
      {/* ========================================== */}

      {interfaces.length === 0 ? (

        <div className="mt-5 rounded-lg bg-gray-50 p-4">

          <p className="text-sm font-medium text-gray-700">
            No WAN interfaces available
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Router discovery must identify at least
            two eligible WAN interfaces before
            load balancing can be configured.
          </p>

        </div>

      ) : (

        <div className="mt-5 space-y-3">

          {interfaces.map(
            interfaceName => {

              const selected =
                selectedInterfaces.has(
                  interfaceName,
                );


              const selectedWan =
                value.find(
                  wan =>
                    wan.interface ===
                    interfaceName,
                );


              return (

                <label
                  key={interfaceName}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    selected
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-400"
                  } ${
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >

                  {/* ------------------------------ */}
                  {/* Checkbox                        */}
                  {/* ------------------------------ */}

                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={disabled}
                    onChange={() =>
                      toggleInterface(
                        interfaceName,
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />


                  {/* ------------------------------ */}
                  {/* Interface                       */}
                  {/* ------------------------------ */}

                  <div className="min-w-0 flex-1">

                    <p className="font-medium text-gray-900">
                      {interfaceName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {selected
                        ? "Selected for load balancing"
                        : "Available WAN interface"}
                    </p>

                  </div>


                  {/* ------------------------------ */}
                  {/* Weight                          */}
                  {/* ------------------------------ */}

                  {weighted &&
                    selectedWan && (

                    <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Weight{" "}
                      {selectedWan.weight ??
                        1}
                    </span>

                  )}

                </label>

              );
            },
          )}

        </div>

      )}


      {/* ========================================== */}
      {/* Selection summary                          */}
      {/* ========================================== */}

      <div className="mt-5 flex flex-col gap-2 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-sm font-medium text-gray-900">
            Selected WANs
          </p>

          <p className="mt-1 text-xs text-gray-500">
            At least two WAN interfaces are required
            for PCC load balancing.
          </p>

        </div>


        <span
          className={`text-lg font-semibold ${
            value.length >= 2
              ? "text-gray-900"
              : "text-red-700"
          }`}
        >
          {value.length}
        </span>

      </div>


      {/* ========================================== */}
      {/* Validation                                 */}
      {/* ========================================== */}

      {value.length === 1 && (

        <p className="mt-3 text-sm text-red-600">
          Select at least one more WAN interface.
        </p>

      )}

    </section>
  );
}
