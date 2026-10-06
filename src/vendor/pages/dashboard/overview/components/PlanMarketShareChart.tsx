import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface ShareItem {
  name: string;
  value: number;
}

interface MarketShareProps {
  data: ShareItem[];
  loading: boolean;
  colors: string[];
}

export function PlanMarketShareChart({
  data,
  loading,
  colors,
}: MarketShareProps) {
  const totalMarketUnits =
    data?.reduce(
      (acc, curr) => acc + curr.value,
      0
    ) || 0;

  return (
    <div
      className="
        bg-white dark:bg-gray-900
        rounded-lg
        border border-slate-200 dark:border-gray-700
        shadow-sm
        overflow-hidden
        text-xs
      "
    >
      {/* ========================================= */}
      {/* Header                                    */}
      {/* ========================================= */}

      <div
        className="
          px-4 pt-4 pb-3
          border-b
          border-slate-100 dark:border-gray-800
        "
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="
                text-sm
                font-medium
                text-slate-900 dark:text-white
                truncate
              "
            >
              Plan Market Share
            </h3>

            <p
              className="
                text-[10px]
                text-slate-500 dark:text-slate-400
                mt-0.5
                truncate
              "
            >
              User distribution by subscription plan
            </p>
          </div>

          {!loading && data?.length > 0 && (
            <span
              className="
                shrink-0
                text-[9px]
                font-mono
                uppercase
                tracking-wider
                text-slate-400 dark:text-slate-500
              "
            >
              {data.length} Plans
            </span>
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* Main Compact Layout                       */}
      {/* ========================================= */}

      <div
        className="
          grid
          grid-cols-[42%_58%]
          min-h-[230px]
        "
      >
        {/* --------------------------------------- */}
        {/* Donut — Upper / Left                    */}
        {/* --------------------------------------- */}

        <div
          className="
            relative
            flex
            items-start
            justify-center
            pt-5
            px-1
          "
        >
          {loading ? (
            <div
              className="
                h-[112px]
                w-[112px]
                rounded-full
                border-[16px]
                border-slate-100
                dark:border-gray-800
                animate-pulse
              "
            />
          ) : data && data.length > 0 ? (
            <>
              <div className="h-[145px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={43}
                      outerRadius={62}
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                      cornerRadius={2}
                    >
                      {data.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            colors[
                              index % colors.length
                            ]
                          }
                          stroke="none"
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      cursor={false}
                      content={({
                        active,
                        payload,
                      }) => {
                        if (
                          !active ||
                          !payload ||
                          !payload.length
                        ) {
                          return null;
                        }

                        const item =
                          payload[0].payload;

                        const percentage =
                          totalMarketUnits > 0
                            ? (
                                (item.value /
                                  totalMarketUnits) *
                                100
                              ).toFixed(1)
                            : "0.0";

                        return (
                          <div
                            className="
                              min-w-[150px]
                              rounded-lg
                              border
                              border-slate-200 dark:border-gray-700
                              bg-white dark:bg-gray-900
                              p-2.5
                              shadow-lg
                              z-50
                            "
                          >
                            <p
                              className="
                                text-[9px]
                                uppercase
                                tracking-wider
                                font-medium
                                text-slate-400
                                dark:text-slate-500
                                truncate
                              "
                            >
                              {item.name}
                            </p>

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-3
                                mt-1
                              "
                            >
                              <span
                                className="
                                  text-sm
                                  font-semibold
                                  font-mono
                                  text-slate-900
                                  dark:text-white
                                "
                              >
                                {item.value.toLocaleString()}
                              </span>

                              <span
                                className="
                                  text-[9px]
                                  font-mono
                                  text-slate-500
                                  dark:text-slate-400
                                "
                              >
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Center Metric */}
              <div
                className="
                  absolute
                  top-[72px]
                  left-1/2
                  -translate-x-1/2
                  -translate-y-1/2
                  text-center
                  pointer-events-none
                  whitespace-nowrap
                "
              >
                <p
                  className="
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-wider
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  Total
                </p>

                <p
                  className="
                    text-base
                    font-semibold
                    font-mono
                    leading-none
                    mt-1
                    text-slate-900
                    dark:text-white
                  "
                >
                  {totalMarketUnits.toLocaleString()}
                </p>

                <p
                  className="
                    text-[8px]
                    text-slate-400
                    dark:text-slate-500
                    mt-0.5
                  "
                >
                  users
                </p>
              </div>
            </>
          ) : (
            <div
              className="
                h-[145px]
                flex
                items-center
                justify-center
                text-[10px]
                text-slate-400
                dark:text-slate-500
                text-center
                px-2
              "
            >
              No data
            </div>
          )}
        </div>

        {/* --------------------------------------- */}
        {/* Plan Breakdown — Right                  */}
        {/* --------------------------------------- */}

        <div
          className="
            py-4
            pr-4
            pl-1
            flex
            flex-col
            justify-center
            min-w-0
          "
        >
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="space-y-1.5"
                >
                  <div
                    className="
                      flex
                      justify-between
                      gap-2
                    "
                  >
                    <div
                      className="
                        h-2.5
                        w-16
                        rounded
                        bg-slate-100
                        dark:bg-gray-800
                        animate-pulse
                      "
                    />

                    <div
                      className="
                        h-2.5
                        w-8
                        rounded
                        bg-slate-100
                        dark:bg-gray-800
                        animate-pulse
                      "
                    />
                  </div>

                  <div
                    className="
                      h-1
                      w-full
                      rounded-full
                      bg-slate-100
                      dark:bg-gray-800
                      animate-pulse
                    "
                  />
                </div>
              ))}
            </div>
          ) : data && data.length > 0 ? (
            <div className="space-y-3">
              {data.map((item, i) => {
                const percentage =
                  totalMarketUnits > 0
                    ? Math.round(
                        (item.value /
                          totalMarketUnits) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={item.name}
                    className="min-w-0"
                  >
                    {/* Name + percentage */}
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-2
                        mb-1
                      "
                    >
                      <span
                        className="
                          flex
                          items-center
                          gap-1.5
                          min-w-0
                        "
                      >
                        <span
                          className="
                            w-1.5
                            h-1.5
                            rounded-full
                            shrink-0
                          "
                          style={{
                            backgroundColor:
                              colors[
                                i % colors.length
                              ],
                          }}
                        />

                        <span
                          className="
                            text-[10px]
                            font-medium
                            text-slate-600
                            dark:text-slate-400
                            truncate
                          "
                          title={item.name}
                        >
                          {item.name}
                        </span>
                      </span>

                      <span
                        className="
                          shrink-0
                          text-[9px]
                          font-mono
                          text-slate-400
                          dark:text-slate-500
                        "
                      >
                        {percentage}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div
                      className="
                        relative
                        w-full
                        h-1
                        rounded-full
                        overflow-hidden
                        bg-slate-100
                        dark:bg-gray-800
                      "
                    >
                      <div
                        className="
                          absolute
                          inset-y-0
                          left-0
                          rounded-full
                          transition-all
                          duration-500
                        "
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            colors[
                              i % colors.length
                            ],
                        }}
                      />
                    </div>

                    {/* User count */}
                    <div
                      className="
                        flex
                        justify-end
                        mt-0.5
                      "
                    >
                      <span
                        className="
                          text-[8px]
                          font-mono
                          text-slate-400
                          dark:text-slate-500
                        "
                      >
                        {item.value.toLocaleString()} users
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="
                text-center
                text-[10px]
                text-slate-400
                dark:text-slate-500
              "
            >
              No plans to display
            </div>
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* Compact Footer                            */}
      {/* ========================================= */}

      {!loading && data && data.length > 0 && (
        <div
          className="
            px-4
            py-2
            border-t
            border-slate-100
            dark:border-gray-800
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-[8px]
              uppercase
              tracking-wider
              text-slate-400
              dark:text-slate-500
            "
          >
            Market distribution
          </span>

          <span
            className="
              text-[8px]
              font-mono
              text-slate-400
              dark:text-slate-500
            "
          >
            {totalMarketUnits.toLocaleString()} total
          </span>
        </div>
      )}
    </div>
  );
}