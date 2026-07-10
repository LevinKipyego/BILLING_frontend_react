import {
    Wallet,
    CreditCard,
    TrendingUp,
    CalendarClock,
} from "lucide-react";

import SummaryCard from "../../components/cards/SummaryCard";

import type { Overview } from "../../components/types/types";

interface Props {

    overview: Overview;

}

export default function PaymentSummary({

    overview,

}: Props) {

    return (

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <SummaryCard

                title="Lifetime Spend"

                value={`KES ${Number(
                    overview.lifetime_spend
                ).toLocaleString()}`}

                subtitle="Total amount paid"

                icon={<Wallet size={22}/>}

            />

            <SummaryCard

                title="Payments"

                value={overview.total_payments.toLocaleString()}

                subtitle="Successful payments"

                icon={<CreditCard size={22}/>}

            />

            <SummaryCard

                title="Average Payment"

                value={`KES ${Number(
                    overview.average_purchase
                ).toLocaleString()}`}

                subtitle="Average transaction"

                icon={<TrendingUp size={22}/>}

            />

            <SummaryCard

                title="Last Payment"

                value={

                    overview.last_payment

                        ? new Date(

                            overview.last_payment

                        ).toLocaleDateString()

                        : "-"

                }

                subtitle="Most recent transaction"

                icon={<CalendarClock size={22}/>}

            />

        </div>

    );

}