import CustomerRow from "./CustomerRow";
import CustomerActions from "./CustomerActions";
import ServiceBadge from "./ServiceBadge";
import StatusBadge from "./StatusBadge";
import { Cpu, Wifi, Tag, ShieldAlert } from "lucide-react";
import type { Customer } from "../types/types";


interface Props {

    customers: Customer[];

    loading?: boolean;

    onViewCustomer: (
        customer: Customer
    ) => void;

    onCreatePPPoE: (
        customer: Customer
    ) => void;

}

export default function CustomerTable({

    customers,

    loading = false,

    onViewCustomer,

    onCreatePPPoE,

}: Props) {

    if (loading) {

        return (

            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">

                Loading customers...

            </div>

        );

    }

    if (!customers.length) {

        return (

            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">

                No customers found.

            </div>

        );

    }

    return (
        <div className="space-y-4">
            {/* 📱 MOBILE CARD VIEW: Shown only on screens smaller than 768px (md) */}
            <div className="grid gap-4 md:hidden">
                {customers.map((customer) => (
                    <div 
                        key={customer.id} 
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
                    >
                        {/* Header: Name & Action Icon Dropdown */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold">
                                    {customer.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">
                                        {customer.full_name}
                                    </h4>
                                    <p className="text-xs text-slate-500 truncate">{customer.username}</p>
                                </div>
                            </div>
                            
                            {/* Actions Dropdown instead of "Add PPPoE" */}
                            <div className="shrink-0">
                                <CustomerActions
                                    customer={customer}
                                    onCreatePPPoE={onCreatePPPoE}
                                />
                            </div>
                        </div>

                        {/* Details Matrix */}
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                            {/* Service Type */}
                            <div className="space-y-1">
                                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
                                    <Wifi size={12} /> Service
                                </span>
                                <div className="pt-0.5">
                                    <ServiceBadge service={customer.service_type} />
                                </div>
                            </div>

                            {/* Plan details (with exact date layout from row) */}
                            <div className="space-y-1">
                                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
                                    <Tag size={12} /> Plan
                                </span>
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                        {customer.plan_name ?? "-"}
                                    </p>
                                    {customer.expires_at && (
                                        <p className="text-[10px] text-slate-500 mt-0.5">
                                            Expires {new Date(customer.expires_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Router with exact router details format from row */}
                            <div className="space-y-1">
                                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
                                    <Cpu size={12} /> Router
                                </span>
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                        {customer.router_name ?? "-"}
                                    </p>
                                    {customer.router_ip && (
                                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                            {customer.router_ip}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-1">
                                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
                                    <ShieldAlert size={12} /> Status
                                </span>
                                <div className="pt-0.5">
                                    <StatusBadge customer={customer} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🖥️ DESKTOP TABLE VIEW: Shown on medium screens (768px) and up */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                                Customer
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                                Service
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                                Plan
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                                Router
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                                Status
                            </th>
                            <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {customers.map((customer) => (

                            <CustomerRow

                                key={customer.id}

                                customer={customer}

                                onViewCustomer={
                                    onViewCustomer
                                }

                                onCreatePPPoE={
                                    onCreatePPPoE
                                }

                            />

                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
}