
import {
    User,
    Phone,
    Mail,
    Router,
    Shield,
} from "lucide-react";

import InfoRow from "./InfoRow";
import StatusBadge from "./StatusBadge";

import type { Customer } from "../../types/customerInfo";

interface CustomerInfoCardProps {

    customer: Customer;

}

export default function CustomerInfoCard({

    customer,

}: CustomerInfoCardProps) {

    return (

        <section className="rounded-xl border border-gray-200 bg-white">

            <div className="border-b border-gray-200 px-5 py-4">

                <h3 className="text-lg font-semibold text-gray-900">

                    Customer Information

                </h3>

                <p className="mt-1 text-sm text-gray-500">

                    Basic account details.

                </p>

            </div>

            <div className="space-y-4 p-5">

                <InfoRow

                    icon={User}

                    label="Customer"

                    value={customer.full_name}

                />

                {customer.username && (

                    <InfoRow

                        icon={Shield}

                        label="Username"

                        value={customer.username}

                    />

                )}

                {customer.phone && (

                    <InfoRow

                        icon={Phone}

                        label="Phone"

                        value={customer.phone}

                    />

                )}

                {customer.email && (

                    <InfoRow

                        icon={Mail}

                        label="Email"

                        value={customer.email}

                    />

                )}

                <InfoRow

                    icon={Router}

                    label="Router"

                    value={

                        customer.router_name ??

                        "Not Assigned"

                    }

                />

                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">

                    <span className="text-sm font-medium text-gray-600">

                        Status

                    </span>

                    <StatusBadge

                        status={customer.status}

                    />

                </div>

            </div>

        </section>

    );

}