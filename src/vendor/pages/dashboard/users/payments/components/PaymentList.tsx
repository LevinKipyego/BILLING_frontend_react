import PaymentCard from "./PaymentCard";
import PaymentTable from "./PaymentTable";

import type { Payment } from "./types/types";

interface Props {

    payments: Payment[];

    totalPayments?: number;

}

export default function PaymentList({

    payments,

    totalPayments,

}: Props) {

    const total = totalPayments ?? payments.length;

    if (payments.length === 0) {

        return (

            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">

                <h3 className="text-lg font-semibold">

                    No Payments Found

                </h3>

                <p className="mt-2 text-sm text-slate-500">

                    This customer has no payments matching the current filters.

                </p>

            </div>

        );

    }

    return (

        <section className="space-y-5">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-bold">

                        Payment History

                    </h2>

                    <p className="text-sm text-slate-500">

                        Showing{" "}

                        <span className="font-semibold">

                            {payments.length}

                        </span>

                        {" "}of{" "}

                        <span className="font-semibold">

                            {total}

                        </span>

                        {" "}payments

                    </p>

                </div>

            </div>

            {/* Desktop */}

            <div className="hidden lg:block">

                <PaymentTable

                    payments={payments}

                />

            </div>

            {/* Mobile & Tablet */}

            <div className="space-y-4 lg:hidden">

                {payments.map((payment) => (

                    <PaymentCard

                        key={payment.id}

                        payment={payment}

                    />

                ))}

            </div>

        </section>

    );

}