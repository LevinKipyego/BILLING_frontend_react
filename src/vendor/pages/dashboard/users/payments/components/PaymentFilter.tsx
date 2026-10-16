import { Search, Filter } from "lucide-react";

interface Props {
    search: string;
    service: string;
    status: string;
    paymentMethod: string;
    onSearchChange: (value: string) => void;
    onServiceChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onPaymentMethodChange: (value: string) => void;
}

export default function PaymentFilter({
    search,
    service,
    status,
    paymentMethod,
    onSearchChange,
    onServiceChange,
    onStatusChange,
    onPaymentMethodChange,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 sm:mb-5">
                <Filter
                    size={16}
                    className="text-slate-500 dark:text-slate-400 shrink-0 sm:w-4 sm:h-4"
                />
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Filter Payments
                </h3>
            </div>

            <div className="grid gap-2.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="relative">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 shrink-0"
                    />
                    <input
                        type="text"
                        placeholder="Search transaction..."
                        value={search}
                        onChange={(e) =>
                            onSearchChange(
                                e.target.value
                            )
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-all"
                    />
                </div>

                {/* Service */}
                <select
                    value={service}
                    onChange={(e) =>
                        onServiceChange(
                            e.target.value
                        )
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-all dark:bg-slate-900"
                >
                    <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        All Services
                    </option>
                    <option value="HOTSPOT" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Hotspot
                    </option>
                    <option value="PPPOE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        PPPoE
                    </option>
                </select>

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) =>
                        onStatusChange(
                            e.target.value
                        )
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-all dark:bg-slate-900"
                >
                    <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        All Status
                    </option>
                    <option value="Success" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Completed
                    </option>
                    <option value="Pending" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Pending
                    </option>
                    <option value="Failed" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Failed
                    </option>
                </select>

                {/* Payment Method */}
                <select
                    value={paymentMethod}
                    onChange={(e) =>
                        onPaymentMethodChange(
                            e.target.value
                        )
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-all dark:bg-slate-900"
                >
                    <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        All Methods
                    </option>
                    <option value="STK Push" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        STK Push
                    </option>
                    <option value="Wallet / Pay Later" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Wallet
                    </option>
                    <option value="Vendor Assisted" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Vendor
                    </option>
                    <option value="Cash / Manual" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Cash
                    </option>
                </select>
            </div>
        </div>
    );
}

