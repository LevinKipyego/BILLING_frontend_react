import PaymentItem from "../item/PaymentItem";

import type { UserProfile } from "../types/types";

interface Props {

    profile: UserProfile;

}

export default function RecentPaymentsSection({

    profile,

}: Props) {

    return (

        <section className="rounded-2xl border bg-white dark:bg-slate-900 p-6">

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h2 className="text-xl font-bold">

                        Recent Payments

                    </h2>

                    <p className="text-sm text-slate-500">

                        Latest customer transactions.

                    </p>

                </div>

                <button

                    className="text-blue-600 hover:text-blue-700 font-medium"

                >

                    View all

                </button>

            </div>

            {

                profile.payments.length === 0

                ?

                (

                    <div className="py-12 text-center text-slate-500">

                        No payments found.

                    </div>

                )

                :

                (

                    profile.payments
                        .slice(0,5)
                        .map(payment => (

                            <PaymentItem

                                key={payment.id}

                                payment={payment}

                            />

                        ))

                )

            }

        </section>

    );

}