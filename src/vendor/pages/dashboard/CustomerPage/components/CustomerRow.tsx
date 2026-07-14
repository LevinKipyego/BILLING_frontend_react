import { UserCircle2, Router } from "lucide-react";
import type { Customer } from "../types/types";
import CustomerActions from "./CustomerActions";
import ServiceBadge from "./ServiceBadge";
import StatusBadge from "./StatusBadge";

interface Props {
    customer: Customer;
    onCreatePPPoE: (customer: Customer) => void;
}

export default function CustomerRow({ customer, onCreatePPPoE }: Props) {
    return (
        <tr className="border-b border-slate-100 transition hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40">
            {/* Customer Name & Username */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                        <UserCircle2 size={34} className="text-slate-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            {customer.full_name}
                        </p>
                        <p className="text-xs text-slate-500">
                            {customer.username}
                        </p>
                    </div>
                </div>
            </td>

            {/* Service Type Badge */}
            <td className="px-5 py-4">
                <ServiceBadge service={customer.service_type} />
            </td>

            {/* Billing Plan & Expiration */}
            <td className="px-5 py-4">
                <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                        {customer.plan_name ?? "-"}
                    </p>
                    {customer.expires_at && (
                        <p className="text-xs text-slate-500">
                            Expires {new Date(customer.expires_at).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </td>

            {/* Assigned MikroTik Router Details */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                    <Router size={15} className="text-slate-400" />
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                            {customer.router_name ?? "-"}
                        </p>
                        <p className="text-xs text-slate-400">
                            {customer.router_ip ?? ""}
                        </p>
                    </div>
                </div>
            </td>

            {/* Status Badge */}
            <td className="px-5 py-4">
                <StatusBadge customer={customer} />
            </td>

            {/* Actions Menu/Buttons */}
            <td className="px-5 py-4 text-right">
                <CustomerActions
                    customer={customer}
                    onCreatePPPoE={onCreatePPPoE}
                />
            </td>
        </tr>
    );
}