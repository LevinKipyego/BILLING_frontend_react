
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    RotateCcw,
    Users,
    ChevronDown,
} from "lucide-react";

import CustomerHeader from "./components/CustomerHeader";
import CreateHotspotCustomerModal from "./modal/CreateHotspotCustomerModal";
import CreatePPPoECustomerModal from "./modal/CreatePPPoECustomerModal";

import CustomerStats from "./components/CustomerStats";
import CustomerTable from "./components/CustomerTable";

import PPPoECreateDrawer, {
    type CreatePPPoEPayload,
} from "./components/PPPoECreateDrawer";

import PPPoEProvisionSuccessModal from "./modal/PppoeProvisionSuccessModal";

import CustomerActionCenter from "./renewsubscriptions/CustomerActionCenter/CustomerActionCenter";

import type { CustomerActionType } from "./renewsubscriptions/CustomerActionCenter/actionRegistry";

import useCustomers from "./hooks/useRenewal";

import type {
    Customer,
    PPPoEProvisionResponse,
} from "./types/types";

/*
 * These fields are read defensively because the API response
 * may contain additional fields beyond the base Customer type.
 */
type FilterableCustomer = Record<string, unknown>;

const readField = (
    customer: Customer,
    field: string
): unknown => {
    return (customer as unknown as FilterableCustomer)[field];
};

const readText = (
    customer: Customer,
    field: string
): string => {
    const value = readField(customer, field);

    return value == null ? "" : String(value).trim();
};

const normalize = (value: unknown): string =>
    value == null ? "" : String(value).trim().toUpperCase();

const uniqueValues = (
    customers: Customer[],
    field: string
): string[] => {
    return Array.from(
        new Set(
            customers
                .map((customer) => readText(customer, field))
                .filter(Boolean)
        )
    ).sort((a, b) => a.localeCompare(b));
};

type SubscriptionFilter =
    | ""
    | "ACTIVE"
    | "INACTIVE"
    | "UNKNOWN";

type RecordStatusFilter = "" | "ACTIVE" | "INACTIVE";

const inputClass =
    "h-10 w-full min-w-0 rounded-lg border border-slate-200 " +
    "bg-white px-3 text-sm text-slate-700 outline-none " +
    "transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 " +
    "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

const labelClass =
    "mb-1.5 block text-xs font-medium text-slate-600 " +
    "dark:text-slate-400";

export default function CustomersPage() {
    const navigate = useNavigate();

    // ============================================================
    // CUSTOMER DATA
    // ============================================================

    const {
        customers,
        stats,
        loading,
        mikrotiks,
        plans,
        refresh,
        createPPPoE,
    } = useCustomers();

    // ============================================================
    // CUSTOMER DRAWER / ACTION STATE
    // ============================================================

    const [drawerCustomer, setDrawerCustomer] =
        useState<Customer | null>(null);

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [actionCustomer, setActionCustomer] =
        useState<Customer | null>(null);

    const [customerAction, setCustomerAction] =
        useState<CustomerActionType | null>(null);

    // ============================================================
    // PPPOE PROVISIONING STATE
    // ============================================================

    const [successOpen, setSuccessOpen] = useState(false);

    const [provisionResult, setProvisionResult] =
        useState<PPPoEProvisionResponse | null>(null);

    // ============================================================
    // CREATE MODAL STATE
    // ============================================================

    const [hotspotModalOpen, setHotspotModalOpen] =
        useState(false);

    const [pppoeModalOpen, setPPPoEModalOpen] =
        useState(false);

    // ============================================================
    // FILTER STATE
    // ============================================================

    const [search, setSearch] = useState("");
    const [service, setService] = useState("");
    const [sessionStatus, setSessionStatus] = useState("");
    const [subscription, setSubscription] =
        useState<SubscriptionFilter>("");
    const [recordStatus, setRecordStatus] =
        useState<RecordStatusFilter>("");
    const [vendor, setVendor] = useState("");
    const [plan, setPlan] = useState("");
    const [router, setRouter] = useState("");

    const [filtersOpen, setFiltersOpen] = useState(true);

    // ============================================================
    // AVAILABLE FILTER OPTIONS
    // Derived from the current API response.
    // ============================================================

    const filterOptions = useMemo(() => {
        const services = uniqueValues(customers, "service_type");
        const vendors = uniqueValues(customers, "vendor_name");
        const plansList = uniqueValues(customers, "plan_name");
        const routersList = uniqueValues(customers, "router_name");

        const returnedStatuses = uniqueValues(
            customers,
            "session_status"
        );

        // Include the common MikroTik states even when no customer
        // currently has one of those states.
        const preferredStatuses = [
            "ONLINE",
            "OFFLINE",
            "EXPIRED",
        ];

        const statuses = [
            ...preferredStatuses,
            ...returnedStatuses.filter(
                (value) => !preferredStatuses.includes(value)
            ),
        ];

        return {
            services,
            vendors,
            plans: plansList,
            routers: routersList,
            statuses,
        };
    }, [customers]);

    // ============================================================
    // FILTERED CUSTOMERS
    // ============================================================

    const filteredCustomers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return customers.filter((customer) => {
            const fullName = readText(customer, "full_name");
            const phone = readText(customer, "phone");
            const username = readText(customer, "username");
            const radUsername = readText(customer, "rad_username");
            const planName = readText(customer, "plan_name");
            const routerName = readText(customer, "router_name");
            const routerIp = readText(customer, "router_ip");
            const vendorName = readText(customer, "vendor_name");
            const serviceType = readText(customer, "service_type");
            const mikrotikSession = normalize(
                readField(customer, "session_status")
            );

            // Search across customer identity and connection details.
            const searchableText = [
                fullName,
                phone,
                username,
                radUsername,
                planName,
                routerName,
                routerIp,
                vendorName,
                serviceType,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !query || searchableText.includes(query);

            const matchesService =
                !service ||
                normalize(serviceType) === normalize(service);

            const matchesSession =
                !sessionStatus ||
                mikrotikSession === normalize(sessionStatus);

            const matchesVendor =
                !vendor ||
                normalize(vendorName) === normalize(vendor);

            const matchesPlan =
                !plan ||
                normalize(planName) === normalize(plan);

            const matchesRouter =
                !router ||
                normalize(routerName) === normalize(router);

            // Subscription status is independent of MikroTik session
            // status. A customer may be subscribed but offline.
            const subscriptionValue = readField(
                customer,
                "subscription_active"
            );

            let matchesSubscription = true;

            if (subscription === "ACTIVE") {
                matchesSubscription = subscriptionValue === true;
            } else if (subscription === "INACTIVE") {
                matchesSubscription = subscriptionValue === false;
            } else if (subscription === "UNKNOWN") {
                matchesSubscription =
                    typeof subscriptionValue !== "boolean";
            }

            // Customer record status uses the API's `active` field.
            const activeValue = readField(customer, "active");

            let matchesRecordStatus = true;

            if (recordStatus === "ACTIVE") {
                matchesRecordStatus = activeValue === true;
            } else if (recordStatus === "INACTIVE") {
                matchesRecordStatus = activeValue === false;
            }

            return (
                matchesSearch &&
                matchesService &&
                matchesSession &&
                matchesSubscription &&
                matchesRecordStatus &&
                matchesVendor &&
                matchesPlan &&
                matchesRouter
            );
        });
    }, [
        customers,
        search,
        service,
        sessionStatus,
        subscription,
        recordStatus,
        vendor,
        plan,
        router,
    ]);

    // ============================================================
    // FILTER COUNTS / RESET
    // ============================================================

    const activeFilterCount = [
        search.trim() !== "",
        service !== "",
        sessionStatus !== "",
        subscription !== "",
        recordStatus !== "",
        vendor !== "",
        plan !== "",
        router !== "",
    ].filter(Boolean).length;

    const resetFilters = () => {
        setSearch("");
        setService("");
        setSessionStatus("");
        setSubscription("");
        setRecordStatus("");
        setVendor("");
        setPlan("");
        setRouter("");
    };

    // ============================================================
    // PPPOE DRAWER
    // ============================================================

    const openPPPoEDrawer = (customer: Customer) => {
        setDrawerCustomer(customer);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setDrawerCustomer(null);
    };

    // ============================================================
    // PPPOE PROVISION
    // ============================================================

    const handleProvision = async (
        payload: CreatePPPoEPayload
    ) => {
        if (!drawerCustomer) return;

        const result = await createPPPoE(
            drawerCustomer.id,
            payload
        );

        if (!result) return;

        setProvisionResult(result);
        setDrawerOpen(false);
        setSuccessOpen(true);
    };

    // ============================================================
    // PROVISION SUCCESS
    // ============================================================

    const closeSuccess = async () => {
        setSuccessOpen(false);
        setProvisionResult(null);
        await refresh();
    };

    // ============================================================
    // CUSTOMER ACTION CENTER
    // ============================================================

    const openCustomerAction = (
        customer: Customer,
        action: CustomerActionType
    ) => {
        setActionCustomer(customer);
        setCustomerAction(action);
    };

    const closeCustomerAction = () => {
        setActionCustomer(null);
        setCustomerAction(null);
    };

    const handleCustomerActionCompleted = async () => {
        await refresh();
        closeCustomerAction();
    };

    // ============================================================
    // HOTSPOT CREATE MODAL
    // ============================================================

    const openHotspotModal = () => {
        setHotspotModalOpen(true);
    };

    const closeHotspotModal = async () => {
        setHotspotModalOpen(false);
        await refresh();
    };

    // ============================================================
    // PPPOE CREATE MODAL
    // ============================================================

    const openPPPoEModal = () => {
        setPPPoEModalOpen(true);
    };

    const closePPPoEModal = async () => {
        setPPPoEModalOpen(false);
        await refresh();
    };

    // ============================================================
    // VIEW CUSTOMER
    // ============================================================

    const handleViewCustomer = (customer: Customer) => {
        navigate(`/dashboard/users/detailed/${customer.id}`);
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-w-0 space-y-5">

            {/* HEADER */}

            <CustomerHeader
                onCreateHotspot={openHotspotModal}
                onCreatePPPoE={openPPPoEModal}
            />

            {/* STATISTICS */}

            <CustomerStats stats={stats} />

            {/* CUSTOMER FILTERS */}

            <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/80">

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-5">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                            <Filter size={17} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                Customer filters
                            </h2>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Find customers by connection, plan, and status
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium tabular-nums text-slate-600 dark:border-slate-700 dark:text-slate-300">
                            {filteredCustomers.length} / {customers.length}
                        </span>

                        <button
                            type="button"
                            onClick={() => setFiltersOpen((open) => !open)}
                            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                            aria-expanded={filtersOpen}
                        >
                            {filtersOpen ? "Hide" : "Show"}
                            <ChevronDown
                                size={14}
                                className={`transition-transform ${
                                    filtersOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {filtersOpen && (
                    <div className="space-y-4 p-4 sm:p-5">

                        {/* Search */}

                        <div>
                            <label
                                htmlFor="customer-search"
                                className={labelClass}
                            >
                                Search customers
                            </label>

                            <div className="relative">
                                <Search
                                    size={16}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="customer-search"
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Name, phone, username, router, or plan..."
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </div>

                        {/* Filter grid */}

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">

                            <div>
                                <label
                                    htmlFor="filter-service"
                                    className={labelClass}
                                >
                                    Service type
                                </label>

                                <select
                                    id="filter-service"
                                    value={service}
                                    onChange={(event) =>
                                        setService(event.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="">All services</option>

                                    {filterOptions.services.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="filter-session"
                                    className={labelClass}
                                >
                                    MikroTik session
                                </label>

                                <select
                                    id="filter-session"
                                    value={sessionStatus}
                                    onChange={(event) =>
                                        setSessionStatus(event.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="">All session states</option>

                                    {filterOptions.statuses.map((value) => (
                                        <option key={value} value={value}>
                                            {value === "ONLINE"
                                                ? "Online"
                                                : value === "OFFLINE"
                                                  ? "Offline"
                                                  : value === "EXPIRED"
                                                    ? "Expired"
                                                    : value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="filter-subscription"
                                    className={labelClass}
                                >
                                    Subscription
                                </label>

                                <select
                                    id="filter-subscription"
                                    value={subscription}
                                    onChange={(event) =>
                                        setSubscription(
                                            event.target.value as SubscriptionFilter
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">All subscriptions</option>
                                    <option value="ACTIVE">
                                        Subscription active
                                    </option>
                                    <option value="INACTIVE">
                                        Subscription inactive
                                    </option>
                                    <option value="UNKNOWN">
                                        Subscription unknown
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="filter-record-status"
                                    className={labelClass}
                                >
                                    Customer record
                                </label>

                                <select
                                    id="filter-record-status"
                                    value={recordStatus}
                                    onChange={(event) =>
                                        setRecordStatus(
                                            event.target.value as RecordStatusFilter
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">All records</option>
                                    <option value="ACTIVE">
                                        Active record
                                    </option>
                                    <option value="INACTIVE">
                                        Inactive record
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="filter-plan"
                                    className={labelClass}
                                >
                                    Plan
                                </label>

                                <select
                                    id="filter-plan"
                                    value={plan}
                                    onChange={(event) =>
                                        setPlan(event.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="">All plans</option>

                                    {filterOptions.plans.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="filter-vendor"
                                    className={labelClass}
                                >
                                    Vendor
                                </label>

                                <select
                                    id="filter-vendor"
                                    value={vendor}
                                    onChange={(event) =>
                                        setVendor(event.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="">All vendors</option>

                                    {filterOptions.vendors.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="filter-router"
                                    className={labelClass}
                                >
                                    Router
                                </label>

                                <select
                                    id="filter-router"
                                    value={router}
                                    onChange={(event) =>
                                        setRouter(event.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="">All routers</option>

                                    {filterOptions.routers.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter footer */}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-700">
                            <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Users size={14} />
                                Showing{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                    {filteredCustomers.length}
                                </span>
                                of {customers.length} customers
                            </p>

                            <button
                                type="button"
                                onClick={resetFilters}
                                disabled={activeFilterCount === 0}
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                <RotateCcw size={14} />
                                Reset filters
                                {activeFilterCount > 0 && (
                                    <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* CUSTOMER TABLE */}

            <CustomerTable
                customers={filteredCustomers}
                loading={loading}
                onViewCustomer={handleViewCustomer}
                onCreatePPPoE={openPPPoEDrawer}
                onRenewCustomer={(customer) =>
                    openCustomerAction(customer, "renew")
                }
                onSuspendCustomer={(customer) =>
                    openCustomerAction(customer, "suspend")
                }
                onDeleteCustomer={(customer) =>
                    openCustomerAction(customer, "delete")
                }
            />

            {/* PPPOE PROVISION DRAWER */}

            {drawerCustomer && (
                <PPPoECreateDrawer
                    open={drawerOpen}
                    onClose={closeDrawer}
                    customer={drawerCustomer}
                    mikrotiks={mikrotiks}
                    plans={plans}
                    loading={loading}
                    onSubmit={handleProvision}
                />
            )}

            {/* CUSTOMER ACTION CENTER */}

            {actionCustomer && customerAction && (
                <CustomerActionCenter
                    open={customerAction !== null}
                    customer={actionCustomer}
                    action={customerAction}
                    onClose={closeCustomerAction}
                    onCompleted={handleCustomerActionCompleted}
                />
            )}

            {/* PPPOE PROVISION SUCCESS */}

            <PPPoEProvisionSuccessModal
                open={successOpen}
                onClose={closeSuccess}
                result={provisionResult}
            />

            {/* CREATE HOTSPOT CUSTOMER */}

            <CreateHotspotCustomerModal
                open={hotspotModalOpen}
                onClose={closeHotspotModal}
            />

            {/* CREATE PPPOE CUSTOMER */}

            <CreatePPPoECustomerModal
                open={pppoeModalOpen}
                onClose={closePPPoEModal}
            />
        </div>
    );
}
