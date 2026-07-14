import CustomerRow from "./CustomerRow";

import type { Customer } from "../types/types";

interface Props {

    customers: Customer[];

    loading: boolean;

    onCreatePPPoE: (
        customer: Customer
    ) => void;

}

export default function CustomerTable({

    customers,

    loading,

    onCreatePPPoE,

}: Props) {

    if (loading) {

        return (

            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">

                Loading customers...

            </div>

        );

    }

    if (customers.length === 0) {

        return (

            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">

                <h3 className="text-lg font-semibold">

                    No customers found

                </h3>

                <p className="mt-2 text-sm text-slate-500">

                    Customers will appear here after they are created.

                </p>

            </div>

        );

    }

    return (

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <table className="w-full">

                <thead>

                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase">

                            Customer

                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase">

                            Service

                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase">

                            Plan

                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase">

                            Router

                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase">

                            Status

                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        customers.map(customer => (

                            <CustomerRow

                                key={customer.id}

                                customer={customer}

                                onCreatePPPoE={
                                    onCreatePPPoE
                                }

                            />

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}