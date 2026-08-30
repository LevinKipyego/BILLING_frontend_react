
import type { PccMode } from "../types/networkDeployment";


interface PccModeSelectorProps {
  value: PccMode;

  onChange: (
    value: PccMode,
  ) => void;

  disabled?: boolean;
}


/* ================================================== */
/* PCC Mode Selector                                  */
/* ================================================== */

export default function PccModeSelector({
  value,
  onChange,
  disabled = false,
}: PccModeSelectorProps) {

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div>

        <h2 className="text-lg font-semibold text-gray-900">
          PCC Load-Balancing Mode
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose how traffic should be distributed
          between the selected WAN interfaces.
        </p>

      </div>


      {/* ========================================== */}
      {/* Options                                    */}
      {/* ========================================== */}

      <div className="mt-5 grid gap-4 md:grid-cols-2">

        <ModeOption
          value="regular"
          selected={
            value === "regular"
          }
          disabled={disabled}
          onChange={onChange}
          title="Regular PCC"
          description="Distribute connections evenly between the selected WAN interfaces."
        />


        <ModeOption
          value="weighted"
          selected={
            value === "weighted"
          }
          disabled={disabled}
          onChange={onChange}
          title="Weighted PCC"
          description="Distribute connections according to the weight assigned to each WAN."
        />

      </div>


      {/* ========================================== */}
      {/* Selected explanation                       */}
      {/* ========================================== */}

      <div className="mt-5 rounded-lg bg-gray-50 p-4">

        {value === "regular" ? (

          <>

            <p className="text-sm font-medium text-gray-900">
              Regular PCC selected
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Each selected WAN will receive an equal
              share of PCC connections.
            </p>

          </>

        ) : (

          <>

            <p className="text-sm font-medium text-gray-900">
              Weighted PCC selected
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Traffic distribution will follow the
              weights assigned to the selected WANs.
            </p>

          </>

        )}

      </div>

    </section>
  );
}


/* ================================================== */
/* Mode Option                                        */
/* ================================================== */

function ModeOption({
  value,
  selected,
  disabled,
  onChange,
  title,
  description,
}: {
  value: PccMode;

  selected: boolean;

  disabled: boolean;

  onChange: (
    value: PccMode,
  ) => void;

  title: string;

  description: string;
}) {

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        onChange(value)
      }
      className={`w-full rounded-xl border p-5 text-left transition ${
        selected
          ? "border-gray-900 bg-gray-50"
          : "border-gray-200 bg-white hover:border-gray-400"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      }`}
    >

      <div className="flex items-start gap-4">

        {/* -------------------------------------- */}
        {/* Radio                                  */}
        {/* -------------------------------------- */}

        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            selected
              ? "border-gray-900"
              : "border-gray-300"
          }`}
        >

          {selected && (

            <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />

          )}

        </span>


        {/* -------------------------------------- */}
        {/* Content                                */}
        {/* -------------------------------------- */}

        <div className="min-w-0">

          <p className="font-medium text-gray-900">
            {title}
          </p>

          <p className="mt-1 text-sm leading-5 text-gray-500">
            {description}
          </p>

        </div>

      </div>

    </button>
  );
}
