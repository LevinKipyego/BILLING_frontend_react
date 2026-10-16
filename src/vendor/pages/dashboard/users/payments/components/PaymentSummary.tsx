import {
    Wallet,
    CreditCard,
    TrendingUp,
    CalendarClock,
} from "lucide-react";

import SummaryCard from "../../components/cards/SummaryCard";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";
import type { Overview } from "../../components/types/types";

interface Props {
    overview: Overview;
}

export default function PaymentSummary({
    overview,
}: Props) {
    return (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
                title="Lifetime Spend"
                value={`KES ${Number(
                    overview.lifetime_spend
                ).toLocaleString()}`}
                subtitle="Total amount paid"
                icon={<Wallet size={20} className="sm:w-[22px] sm:h-[22px]" />}
            />

            <SummaryCard
                title="Payments"
                value={overview.total_payments.toLocaleString()}
                subtitle="Successful payments"
                icon={<CreditCard size={20} className="sm:w-[22px] sm:h-[22px]" />}
            />

            <SummaryCard
                title="Average Payment"
                value={`KES ${Number(
                    overview.average_purchase
                ).toLocaleString()}`}
                subtitle="Average transaction"
                icon={<TrendingUp size={20} className="sm:w-[22px] sm:h-[22px]" />}
            />

            <SummaryCard
                title="Last Payment"
                value={
                    overview.last_payment
                        ? formatDate(overview.last_payment)
                        : "-"
                }
                subtitle="Most recent transaction"
                icon={<CalendarClock size={20} className="sm:w-[22px] sm:h-[22px]" />}
            />
        </div>
    );
}

