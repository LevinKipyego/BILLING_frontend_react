import { Search, UserPlus, Wifi, Router } from "lucide-react";
import type { FC } from "react";

interface Props {
    search: string;
    onSearchChange: (value: string) => void;

    service: string;
    onServiceChange: (value: string) => void;

    status: string;
    onStatusChange: (value: string) => void;

    vendor: string;
    onVendorChange: (value: string) => void;

    vendors?: {
        id: string;
        name: string;
    }[];

    onCreateHotspot: () => void;
    onCreatePPPoE: () => void;
}

const CustomerHeader: FC<Props> = ({
    search,
    onSearchChange,
    service,
    onServiceChange,
    status,
    onStatusChange,
    vendor,
    onVendorChange,
    vendors = [],
    onCreateHotspot,
    onCreatePPPoE,
}) => {
    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Customers
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage Hotspot and PPPoE subscribers across all vendors.
                    </p>

                </div>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={onCreateHotspot}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700"
                    >
                        <Wifi size={18} />
                        New Hotspot
                    </button>

                    <button
                        onClick={onCreatePPPoE}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-white transition hover:bg-emerald-700"
                    >
                        <Router size={18} />
                        New PPPoE
                    </button>

                </div>

            </div>

            {/* Filters */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">

                <div className="grid gap-4 lg:grid-cols-4">

                    {/* Search */}

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                onSearchChange(e.target.value)
                            }
                            placeholder="Search customer..."
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                        />

                    </div>

                    {/* Vendor */}

                    <select
                        value={vendor}
                        onChange={(e) =>
                            onVendorChange(e.target.value)
                        }
                        className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
                    >
                        <option value="">
                            All Vendors
                        </option>

                        {vendors.map((v) => (

                            <option
                                key={v.id}
                                value={v.id}
                            >
                                {v.name}
                            </option>

                        ))}

                    </select>

                    {/* Service */}

                    <select
                        value={service}
                        onChange={(e) =>
                            onServiceChange(e.target.value)
                        }
                        className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
                    >
                        <option value="">
                            All Services
                        </option>

                        <option value="HOTSPOT">
                            Hotspot
                        </option>

                        <option value="PPPOE">
                            PPPoE
                        </option>

                        <option value="MIXED">
                            Mixed
                        </option>

                    </select>

                    {/* Status */}

                    <select
                        value={status}
                        onChange={(e) =>
                            onStatusChange(e.target.value)
                        }
                        className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
                    >
                        <option value="">
                            All Status
                        </option>

                        <option value="ONLINE">
                            Online
                        </option>

                        <option value="OFFLINE">
                            Offline
                        </option>

                        <option value="EXPIRED">
                            Expired
                        </option>

                        <option value="SUSPENDED">
                            Suspended
                        </option>

                    </select>

                </div>

            </div>

        </div>
    );
};

export default CustomerHeader;