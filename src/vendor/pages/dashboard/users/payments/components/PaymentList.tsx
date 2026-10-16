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
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-12 text-center">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    No Payments Found
                </h3>

                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    This customer has no payments matching the current filters.
                </p>
            </div>
        );
    }

    return (
        <section className="space-y-3 sm:space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        Payment History
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Showing{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {payments.length}
                        </span>
                        {" "}of{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
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
            <div className="space-y-3 sm:space-y-4 lg:hidden">
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

