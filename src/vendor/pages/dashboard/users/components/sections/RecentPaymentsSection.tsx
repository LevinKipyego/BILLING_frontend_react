import PaymentItem from "../item/PaymentItem";

import type { UserProfile } from "../types/types";

interface Props {
    profile: UserProfile;
}

export default function RecentPaymentsSection({
    profile,
}: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        Recent Payments
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Latest customer transactions.
                    </p>
                </div>

                <button
                    className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
                >
                    View all
                </button>
            </div>

            {
                profile.payments.length === 0
                ?
                (
                    <div className="py-8 sm:py-12 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        No payments found.
                    </div>
                )
                :
                (
                    <div className="space-y-2 sm:space-y-3">
                        {profile.payments
                            .slice(0, 5)
                            .map(payment => (
                                <PaymentItem
                                    key={payment.id}
                                    payment={payment}
                                />
                            ))}
                    </div>
                )
            }
        </section>
    );
}

