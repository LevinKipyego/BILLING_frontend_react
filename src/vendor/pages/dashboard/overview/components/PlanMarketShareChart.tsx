
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import {
  ChartPieIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline";

interface ShareItem {
  name: string;
  value: number;
  is_featured?: boolean;
  mikrotik_id?: string | null;
  is_trial?: boolean;
  is_loan_plan?: boolean;
  service_type?: string | null;
}

interface MarketShareProps {
  data: ShareItem[];
  loading: boolean;
  colors: string[];
}

interface RouterGroup {
  id: string;
  label: string;
  plans: (ShareItem & { _key: string })[];
  total: number;
}

interface ServiceGroup {
  type: string;
  routers: RouterGroup[];
  total: number;
  planCount: number;
}

const FALLBACK_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
];

function getPlanTags(plan: ShareItem) {
  const tags: { label: string; className: string }[] = [];

  if (plan.is_featured) {
    tags.push({
      label: "Featured",
      className:
        "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    });
  }

  if (plan.is_trial) {
    tags.push({
      label: "Trial",
      className:
        "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    });
  }

  if (plan.is_loan_plan) {
    tags.push({
      label: "Loan",
      className:
        "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    });
  }

  return tags;
}

function formatRouterId(id: string) {
  if (id === "unassigned") return "Unassigned router";
  if (id === "unknown") return "Router unavailable";
  return `Router ${id.slice(0, 8)}`;
}

export function PlanMarketShareChart({
  data = [],
  loading,
  colors,
}: MarketShareProps) {
  const [expandedServices, setExpandedServices] = useState<
    Record<string, boolean>
  >({});

  const [expandedRouters, setExpandedRouters] = useState<
    Record<string, boolean>
  >({});

  const chartColors =
    colors?.length > 0 ? colors : FALLBACK_COLORS;

  const totalMarketUnits = useMemo(
    () =>
      data.reduce(
        (total, item) => total + (Number(item.value) || 0),
        0
      ),
    [data]
  );

  const groupedData = useMemo<ServiceGroup[]>(() => {
    const serviceMap = new Map<
      string,
      Map<string, RouterGroup>
    >();

    data.forEach((plan, index) => {
      const serviceType = (
        plan.service_type?.trim() || "UNSPECIFIED"
      ).toUpperCase();

      const routerId = plan.mikrotik_id?.trim() || "unassigned";
      const normalizedRouterId = routerId === "unassigned"
        ? "unassigned"
        : routerId;

      if (!serviceMap.has(serviceType)) {
        serviceMap.set(serviceType, new Map());
      }

      const routerMap = serviceMap.get(serviceType)!;

      if (!routerMap.has(normalizedRouterId)) {
        routerMap.set(normalizedRouterId, {
          id: normalizedRouterId,
          label: formatRouterId(normalizedRouterId),
          plans: [],
          total: 0,
        });
      }

      const router = routerMap.get(normalizedRouterId)!;
      const value = Number(plan.value) || 0;

      router.plans.push({
        ...plan,
        value,
        _key: `${serviceType}-${normalizedRouterId}-${index}`,
      });

      router.total += value;
    });

    return Array.from(serviceMap.entries())
      .map(([type, routerMap]) => {
        const routers = Array.from(routerMap.values()).sort(
          (a, b) => b.total - a.total
        );

        return {
          type,
          routers,
          total: routers.reduce(
            (sum, router) => sum + router.total,
            0
          ),
          planCount: routers.reduce(
            (sum, router) => sum + router.plans.length,
            0
          ),
        };
      })
      .sort((a, b) => a.type.localeCompare(b.type));
  }, [data]);

  const toggleService = (type: string) => {
    setExpandedServices((previous) => ({
      ...previous,
      [type]: !previous[type],
    }));
  };

  const toggleRouter = (key: string) => {
    setExpandedRouters((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const toggleAll = () => {
    const hasExpanded =
      groupedData.some((group) => expandedServices[group.type]) ||
      groupedData.some((group) =>
        group.routers.some(
          (router) =>
            expandedRouters[`${group.type}:${router.id}`]
        )
      );

    if (hasExpanded) {
      setExpandedServices({});
      setExpandedRouters({});
    } else {
      const services: Record<string, boolean> = {};
      const routers: Record<string, boolean> = {};

      groupedData.forEach((group) => {
        services[group.type] = true;

        group.routers.forEach((router) => {
          routers[`${group.type}:${router.id}`] = true;
        });
      });

      setExpandedServices(services);
      setExpandedRouters(routers);
    }
  };

  return (
    <div className="flex h-[320px] min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-xs shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-3 py-3 dark:border-gray-800 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <ChartPieIcon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              Plan Market Share
            </h3>
            <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
              Service and MikroTik distribution
            </p>
          </div>
        </div>

        {!loading && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600 dark:bg-gray-800 dark:text-gray-300">
            {data.length} plans
          </span>
        )}
      </header>

      {/* Fixed-height body */}
      <div className="grid min-h-0 flex-1 grid-cols-[40%_60%]">
        {/* Donut chart */}
        <div className="relative flex min-h-0 items-center justify-center overflow-hidden border-r border-slate-100 px-1 dark:border-gray-800">
          {loading ? (
            <div className="h-24 w-24 animate-pulse rounded-full border-[14px] border-slate-100 dark:border-gray-800" />
          ) : data.length > 0 ? (
            <>
              <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="61%"
                      outerRadius="82%"
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {data.map((item, index) => (
                        <Cell
                          key={`${item.name}-${index}`}
                          fill={
                            chartColors[index % chartColors.length]
                          }
                          stroke="none"
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) {
                          return null;
                        }

                        const item = payload[0].payload as ShareItem;
                        const percentage =
                          totalMarketUnits > 0
                            ? (
                                (item.value / totalMarketUnits) *
                                100
                              ).toFixed(1)
                            : "0.0";

                        return (
                          <div className="z-50 min-w-[135px] rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                            <p className="max-w-[180px] truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                              {item.name}
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                              {item.value.toLocaleString()} users
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {percentage}% of total
                            </p>
                            <p className="mt-1 text-[9px] text-slate-400 dark:text-slate-500">
                              {item.service_type || "Unspecified service"}
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center">
                <p className="text-[8px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Total users
                </p>
                <p className="mt-1 text-base font-bold leading-none text-slate-900 dark:text-white">
                  {totalMarketUnits.toLocaleString()}
                </p>
              </div>
            </>
          ) : (
            <p className="px-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
              No plan data
            </p>
          )}
        </div>

        {/* Service -> MikroTik -> Plans */}
        <div className="flex min-h-0 min-w-0 flex-col p-2 sm:p-3">
          <div className="mb-1.5 flex shrink-0 items-center justify-between gap-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Services & routers
            </span>

            {!loading && groupedData.length > 0 && (
              <button
                type="button"
                onClick={toggleAll}
                className="shrink-0 rounded px-1 py-1 text-[9px] font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800"
              >
                {groupedData.some(
                  (group) => expandedServices[group.type]
                ) ||
                groupedData.some((group) =>
                  group.routers.some(
                    (router) =>
                      expandedRouters[
                        `${group.type}:${router.id}`
                      ]
                  )
                )
                  ? "Collapse all"
                  : "Expand all"}
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-8 animate-pulse rounded-lg bg-slate-100 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : groupedData.length > 0 ? (
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-0.5">
              {groupedData.map((service) => {
                const serviceOpen =
                  !!expandedServices[service.type];

                return (
                  <section
                    key={service.type}
                    className="overflow-hidden rounded-lg border border-slate-100 dark:border-gray-800"
                  >
                    {/* Service type */}
                    <button
                      type="button"
                      onClick={() => toggleService(service.type)}
                      aria-expanded={serviceOpen}
                      className="flex min-h-9 w-full items-center gap-1.5 px-2 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-gray-800"
                    >
                      {serviceOpen ? (
                        <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      ) : (
                        <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      )}

                      <span className="min-w-0 flex-1 truncate text-[10px] font-bold text-slate-800 dark:text-slate-100">
                        {service.type}
                      </span>

                      <span className="shrink-0 rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[9px] text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {service.routers.length} routers
                      </span>

                      <span className="shrink-0 font-mono text-[9px] text-slate-500 dark:text-slate-400">
                        {service.total.toLocaleString()}
                      </span>
                    </button>

                    {serviceOpen && (
                      <div className="space-y-1 border-t border-slate-100 bg-slate-50/50 p-1.5 dark:border-gray-800 dark:bg-gray-900/50">
                        {service.routers.map((router) => {
                          const routerKey =
                            `${service.type}:${router.id}`;
                          const routerOpen =
                            !!expandedRouters[routerKey];

                          return (
                            <div
                              key={router.id}
                              className="overflow-hidden rounded-md border border-slate-100 bg-white dark:border-gray-800 dark:bg-gray-900"
                            >
                              {/* MikroTik router */}
                              <button
                                type="button"
                                onClick={() =>
                                  toggleRouter(routerKey)
                                }
                                aria-expanded={routerOpen}
                                title={
                                  router.id === "unassigned"
                                    ? "No MikroTik assigned"
                                    : router.id
                                }
                                className="flex min-h-8 w-full items-center gap-1.5 px-2 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-gray-800"
                              >
                                {routerOpen ? (
                                  <ChevronDownIcon className="h-3 w-3 shrink-0 text-slate-400" />
                                ) : (
                                  <ChevronRightIcon className="h-3 w-3 shrink-0 text-slate-400" />
                                )}

                                <ServerStackIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                                <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-slate-700 dark:text-slate-200">
                                  {router.label}
                                </span>

                                <span className="shrink-0 text-[9px] text-slate-400 dark:text-slate-500">
                                  {router.plans.length} plans
                                </span>
                              </button>

                              {routerOpen && (
                                <div className="border-t border-slate-100 px-2 dark:border-gray-800">
                                  {router.plans.map((plan, index) => {
                                    const percentage =
                                      totalMarketUnits > 0
                                        ? (plan.value /
                                            totalMarketUnits) *
                                          100
                                        : 0;

                                    const originalIndex = data.indexOf(
                                      data.find(
                                        (item) =>
                                          item.name === plan.name &&
                                          item.mikrotik_id ===
                                            plan.mikrotik_id &&
                                          item.service_type ===
                                            plan.service_type
                                      )!
                                    );

                                    return (
                                      <div
                                        key={plan._key}
                                        className="border-b border-slate-50 py-2 last:border-0 dark:border-gray-800"
                                      >
                                        <div className="flex min-w-0 items-center justify-between gap-1.5">
                                          <span
                                            title={plan.name}
                                            className="min-w-0 truncate text-[10px] font-medium text-slate-700 dark:text-slate-200"
                                          >
                                            {plan.name}
                                          </span>

                                          <span className="shrink-0 font-mono text-[9px] font-semibold text-slate-600 dark:text-slate-300">
                                            {plan.value.toLocaleString()}
                                          </span>
                                        </div>

                                        {getPlanTags(plan).length > 0 && (
                                          <div className="mt-1 flex flex-wrap gap-1">
                                            {getPlanTags(plan).map(
                                              (tag) => (
                                                <span
                                                  key={tag.label}
                                                  className={`rounded px-1.5 py-0.5 text-[8px] font-semibold ${tag.className}`}
                                                >
                                                  {tag.label}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        )}

                                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-gray-800">
                                          <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                              width: `${Math.min(
                                                100,
                                                Math.max(0, percentage)
                                              )}%`,
                                              backgroundColor:
                                                chartColors[
                                                  Math.max(
                                                    0,
                                                    originalIndex >= 0
                                                      ? originalIndex
                                                      : index
                                                  ) %
                                                    chartColors.length
                                                ],
                                            }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center text-center text-[10px] text-slate-400 dark:text-slate-500">
              No plans to display
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-100 px-3 py-2 dark:border-gray-800">
        <span className="truncate text-[9px] text-slate-400 dark:text-slate-500">
          Grouped by service and MikroTik
        </span>

        <span className="shrink-0 font-mono text-[9px] text-slate-500 dark:text-slate-400">
          {loading
            ? "Loading..."
            : `${totalMarketUnits.toLocaleString()} users`}
        </span>
      </footer>
    </div>
  );
}
