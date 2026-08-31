import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface ShareItem {
  name: string;
  value: number;
}

interface MarketShareProps {
  data: ShareItem[];
  loading: boolean;
  colors: string[];
}

export function PlanMarketShareChart({ data, loading, colors }: MarketShareProps) {
  const totalMarketUnits = data?.reduce((acc, curr) => acc + curr.value, 0) || 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
      <div>
        <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
          Plan Market Share
        </h3>

        <div className="h-52 relative">
          {loading ? (
            <div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-full max-w-[200px] mx-auto" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data || []}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(data || []).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] font-medium text-slate-400 uppercase">Total</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white leading-none mt-0.5">
                  {totalMarketUnits.toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded"
              />
            ))}
          </div>
        ) : (
          (data || []).map((item, i) => (
            <div key={item.name} className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span className="text-slate-600 dark:text-slate-400 font-medium truncate max-w-[130px] sm:max-w-[180px]">
                  {item.name}
                </span>
              </span>
              <span className="font-sans text-slate-900 dark:text-slate-200">
                {item.value} USERS
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}