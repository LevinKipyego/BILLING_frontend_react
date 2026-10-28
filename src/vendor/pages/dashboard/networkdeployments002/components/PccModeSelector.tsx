
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
    <section className="rounded-xl border bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm shadow-sky-950/[0.04] dark:shadow-black/20">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div>

        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-gray-100">
          PCC Load-Balancing Mode
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400 dark:text-gray-400">
          Choose how traffic should be distributed
          between the selected WAN interfaces.
        </p>

      </div>


      {/* ========================================== */}
      {/* Options                                    */}
      {/* ========================================== */}

      <div className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-2">

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

      <div className="mt-5 rounded-lg bg-sky-50 dark:bg-gray-800 p-3 sm:p-4">

        {value === "regular" ? (

          <>

            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-gray-100">
              Regular PCC selected
            </p>

            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-gray-300 dark:text-gray-300">
              Each selected WAN will receive an equal
              share of PCC connections.
            </p>

          </>

        ) : (

          <>

            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-gray-100">
              Weighted PCC selected
            </p>

            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-gray-300 dark:text-gray-300">
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
      className={`w-full rounded-xl border border-sky-100 dark:border-gray-700 p-5 text-left transition ${
        selected
          ? "border-gray-900 bg-sky-50 dark:bg-gray-800"
          : "border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      }`}
    >

      <div className="flex items-start gap-3 sm:gap-4">

        {/* -------------------------------------- */}
        {/* Radio                                  */}
        {/* -------------------------------------- */}

        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            selected
              ? "border-gray-900"
              : "border-sky-200 dark:border-gray-700"
          }`}
        >

          {selected && (

            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-sky-600 to-emerald-600 dark:bg-gray-800 dark:bg-none" />

          )}

        </span>


        {/* -------------------------------------- */}
        {/* Content                                */}
        {/* -------------------------------------- */}

        <div className="min-w-0">

          <p className="font-medium text-slate-800 dark:text-gray-100">
            {title}
          </p>

          <p className="mt-1 text-xs sm:text-sm leading-5 text-slate-500 dark:text-gray-400 dark:text-gray-400">
            {description}
          </p>

        </div>

      </div>

    </button>
  );
}
