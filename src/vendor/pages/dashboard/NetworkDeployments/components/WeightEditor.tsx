
import type {
  DeploymentWanConfig,
} from "../types/networkDeployment";


interface WeightEditorProps {
  wans: DeploymentWanConfig[];

  onChange: (
    wans: DeploymentWanConfig[],
  ) => void;

  disabled?: boolean;
}


/* ================================================== */
/* Weight Editor                                      */
/* ================================================== */

export default function WeightEditor({
  wans,
  onChange,
  disabled = false,
}: WeightEditorProps) {

  if (wans.length === 0) {

    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-gray-900">
          WAN Weights
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Select WAN interfaces before assigning
          weights.
        </p>

      </section>
    );
  }


  const totalWeight =
    wans.reduce(
      (
        total,
        wan,
      ) =>
        total +
        (wan.weight ?? 0),
      0,
    );


  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div>

        <h2 className="text-lg font-semibold text-gray-900">
          WAN Weights
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Assign relative traffic weights to each
          selected WAN interface.
        </p>

      </div>


      {/* ========================================== */}
      {/* WAN List                                   */}
      {/* ========================================== */}

      <div className="mt-5 space-y-3">

        {wans.map(
          (
            wan,
            index,
          ) => (

            <WeightRow
              key={
                `${wan.interface}-${index}`
              }
              wan={wan}
              disabled={disabled}
              onChange={
                nextWeight => {

                  const updated =
                    wans.map(
                      (
                        item,
                        itemIndex,
                      ) =>
                        itemIndex ===
                        index
                          ? {
                              ...item,
                              weight:
                                nextWeight,
                            }
                          : item,
                    );

                  onChange(
                    updated,
                  );
                }
              }
            />

          ),
        )}

      </div>


      {/* ========================================== */}
      {/* Total                                      */}
      {/* ========================================== */}

      <div className="mt-5 flex flex-col gap-2 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-sm font-medium text-gray-900">
            Total weight
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Weights are relative; they do not need to
            add up to a fixed percentage.
          </p>

        </div>

        <span
          className={`text-lg font-semibold ${
            totalWeight > 0
              ? "text-gray-900"
              : "text-red-700"
          }`}
        >
          {totalWeight}
        </span>

      </div>

    </section>
  );
}


/* ================================================== */
/* Weight Row                                         */
/* ================================================== */

function WeightRow({
  wan,
  disabled,
  onChange,
}: {
  wan: DeploymentWanConfig;

  disabled: boolean;

  onChange: (
    weight: number,
  ) => void;
}) {

  const weight =
    wan.weight ?? 0;


  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">

      {/* ======================================== */}
      {/* Interface                               */}
      {/* ======================================== */}

      <div className="min-w-0">

        <p className="font-medium text-gray-900">
          {wan.interface}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Relative PCC weight
        </p>

      </div>


      {/* ======================================== */}
      {/* Weight                                  */}
      {/* ======================================== */}

      <div className="flex items-center gap-3">

        <button
          type="button"
          disabled={
            disabled ||
            weight <= 1
          }
          onClick={() =>
            onChange(
              Math.max(
                1,
                weight - 1,
              ),
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Decrease weight for ${wan.interface}`}
        >
          −
        </button>


        <input
          type="number"
          min={1}
          step={1}
          value={weight}
          disabled={disabled}
          onChange={event => {

            const parsed =
              Number(
                event.target.value,
              );


            if (
              !Number.isFinite(
                parsed,
              )
            ) {
              return;
            }


            onChange(
              Math.max(
                1,
                Math.floor(
                  parsed,
                ),
              ),
            );

          }}
          className="h-9 w-20 rounded-lg border px-3 text-center text-sm font-medium text-gray-900 outline-none focus:border-gray-500 disabled:bg-gray-100"
          aria-label={`Weight for ${wan.interface}`}
        />


        <button
          type="button"
          disabled={
            disabled
          }
          onClick={() =>
            onChange(
              weight + 1,
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Increase weight for ${wan.interface}`}
        >
          +
        </button>

      </div>

    </div>
  );
}
