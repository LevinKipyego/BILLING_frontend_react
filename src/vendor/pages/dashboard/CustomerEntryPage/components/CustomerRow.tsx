import {
    UserCircle2,
    Router,
} from "lucide-react";

import type {
    Customer,
} from "../types/types";

import CustomerActions from "./CustomerActions";
import ServiceBadge from "./ServiceBadge";
import StatusBadge from "./StatusBadge";

import { formatDate } from "../renewsubscriptions/utils/date";

interface Props {
    customer: Customer;
    onViewCustomer(customer: Customer): void;
    onCreatePPPoE(customer: Customer): void;
    onRenewCustomer?(customer: Customer): void;
    onSuspendCustomer?(customer: Customer): void;
    onDeleteCustomer?(customer: Customer): void;
}

export default function CustomerRow({
    customer,
    onViewCustomer,
    onCreatePPPoE,
    onRenewCustomer,
    onSuspendCustomer,
    onDeleteCustomer,
}: Props) {
    return (
        <tr className="border-b border-slate-100 dark:border-gray-800 transition hover:bg-slate-50/50 dark:hover:bg-gray-800/40">

            {/* Customer */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-slate-100 dark:bg-gray-800 p-2 shrink-0">
                        <UserCircle2
                            size={32}
                            className="text-slate-500 dark:text-slate-400"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                            {customer.full_name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            @{customer.username}
                        </p>
                    </div>
                </div>
            </td>

            {/* Service */}
            <td className="px-5 py-4">
                <ServiceBadge
                    service={customer.service_type}
                />
            </td>

            {/* Plan */}
            <td className="px-5 py-4">
                <div>
                    <p className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm">
                        {customer.plan_name ?? "-"}
                    </p>
                    {customer.expires_at && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Expires{" "}
                            {formatDate(customer.expires_at)}
                        </p>
                    )}
                </div>
            </td>

            {/* Router */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                    <Router
                        size={15}
                        className="text-slate-400 dark:text-slate-500 shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                            {customer.router_name ?? "-"}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate">
                            {customer.router_ip ?? ""}
                        </p>
                    </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-5 py-4">
                <StatusBadge
                    customer={customer}
                />
            </td>

            {/* Actions */}
            <td className="px-5 py-4 text-right">
                <CustomerActions
                    customer={customer}
                    onView={onViewCustomer}
                    onCreatePPPoE={onCreatePPPoE}
                    onRenew={onRenewCustomer}
                    onSuspend={onSuspendCustomer}
                    onDelete={onDeleteCustomer}
                />
            </td>

        </tr>
    );
}