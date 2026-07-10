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

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">

            <div className="flex items-center gap-2 mb-5">

                <Filter
                    size={18}
                    className="text-slate-500"
                />

                <h3 className="font-semibold">

                    Filter Payments

                </h3>

            </div>

            <div className="grid gap-4 lg:grid-cols-4">

                {/* Search */}

                <div className="relative">

                    <Search

                        size={18}

                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"

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

                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none"

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

                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5"

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

                </select>

                {/* Status */}

                <select

                    value={status}

                    onChange={(e) =>

                        onStatusChange(

                            e.target.value

                        )

                    }

                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5"

                >

                    <option value="">

                        All Status

                    </option>

                    <option value="Success">

                        Completed

                    </option>

                    <option value="Pending">

                        Pending

                    </option>

                    <option value="Failed">

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

                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5"

                >

                    <option value="">

                        All Methods

                    </option>

                    <option value="STK Push">

                        STK Push

                    </option>

                    <option value="Wallet / Pay Later">

                        Wallet

                    </option>

                    <option value="Vendor Assisted">

                        Vendor

                    </option>

                    <option value="Cash / Manual">

                        Cash

                    </option>

                </select>

            </div>

        </div>

    );

}