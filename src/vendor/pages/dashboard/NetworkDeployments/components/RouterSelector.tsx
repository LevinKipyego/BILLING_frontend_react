
import type { MikrotikDevice } from "../../../../types/device";


interface RouterSelectorProps {
  routers: MikrotikDevice[];

  value: string;

  onChange: (
    mikrotikId: string,
  ) => void;

  disabled?: boolean;

  loading?: boolean;

  error?: string | null;
}


/* ================================================== */
/* Router Selector                                    */
/* ================================================== */

export default function RouterSelector({
  routers,
  value,
  onChange,
  disabled = false,
  loading = false,
  error = null,
}: RouterSelectorProps) {

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      {/* ========================================== */}
      {/* Header                                     */}
      {/* ========================================== */}

      <div>

        <h2 className="text-lg font-semibold text-gray-900">
          MikroTik Router
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select the MikroTik router that will receive
          the PCC load-balancing configuration.
        </p>

      </div>


      {/* ========================================== */}
      {/* Loading                                    */}
      {/* ========================================== */}

      {loading ? (

        <div className="mt-5 flex items-center gap-3 rounded-lg bg-gray-50 p-4">

          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />

          <span className="text-sm text-gray-600">
            Loading MikroTik routers...
          </span>

        </div>

      ) : (

        <div className="mt-5">

          <select
            value={value}
            disabled={
              disabled ||
              routers.length === 0
            }
            onChange={event =>
              onChange(
                event.target.value,
              )
            }
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-700 disabled:cursor-not-allowed disabled:bg-gray-100"
          >

            <option value="">
              Select a MikroTik router
            </option>

            {routers.map(
              router => (

                <option
                  key={
                    String(
                      router.id,
                    )
                  }
                  value={
                    String(
                      router.id,
                    )
                  }
                >
                  {router.identity_name ||
                    router.api_ip ||
                    String(
                      router.id,
                    )}
                </option>

              ),
            )}

          </select>


          {/* -------------------------------------- */}
          {/* No routers                             */}
          {/* -------------------------------------- */}

          {routers.length === 0 && (

            <p className="mt-2 text-sm text-gray-500">
              No enabled MikroTik routers are available
              for this vendor.
            </p>

          )}

        </div>

      )}


      {/* ========================================== */}
      {/* Selected Router                            */}
      {/* ========================================== */}

      {value && (

        <SelectedRouter
          routers={routers}
          value={value}
        />

      )}


      {/* ========================================== */}
      {/* Error                                      */}
      {/* ========================================== */}

      {error && (

        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-800">
            Router selection error
          </p>

          <p className="mt-1 text-sm text-red-700">
            {error}
          </p>

        </div>

      )}

    </section>
  );
}


/* ================================================== */
/* Selected Router                                    */
/* ================================================== */

function SelectedRouter({
  routers,
  value,
}: {
  routers: MikrotikDevice[];

  value: string;
}) {

  const router =
    routers.find(
      item =>
        String(
          item.id,
        ) === value,
    );


  if (!router) {
    return null;
  }


  return (
    <div className="mt-5 rounded-lg bg-gray-50 p-4">

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <RouterInfo
          label="Identity"
          value={
            router.identity_name
          }
        />

        <RouterInfo
          label="Management IP"
          value={
            router.api_ip
          }
        />

        <RouterInfo
          label="Status"
          value={
            router.status
          }
        />

        <RouterInfo
          label="Site"
          value={
            router.site_name
          }
        />

      </div>

    </div>
  );
}


/* ================================================== */
/* Router Info                                        */
/* ================================================== */

function RouterInfo({
  label,
  value,
}: {
  label: string;

  value:
    | string
    | null
    | undefined;
}) {

  return (
    <div>

      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium capitalize text-gray-900">
        {value ||
          "—"}
      </p>

    </div>
  );
}
