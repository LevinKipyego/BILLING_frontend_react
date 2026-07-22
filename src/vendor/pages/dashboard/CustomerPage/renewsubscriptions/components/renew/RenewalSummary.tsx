import {
    Calendar,
    CalendarDays,
    Coins,
    RefreshCw,
} from "lucide-react";

import Card from "../common/Card";
import InfoRow from "../common/InfoRow";

import { formatDate } from "../../utils/date";

import type {
    RenewalSummary,
} from "../../types/subscription";

interface RenewalSummaryProps {

    summary: RenewalSummary;

}

export default function RenewalSummary({

    summary,

}: RenewalSummaryProps) {

    return (

        <Card
            title="Renewal Summary"
            subtitle="Final confirmation before submitting."
        >

            <div className="space-y-4">

                <InfoRow

                    icon={RefreshCw}

                    label="Renewal Mode"

                    value={summary.mode}

                />

                <InfoRow

                    icon={Coins}

                    label="Amount"

                    value={`KES ${summary.amount.toLocaleString()}`}

                />

                <InfoRow

                    icon={Calendar}

                    label="Starts"

                    value={formatDate(summary.start_at)}

                />

                <InfoRow

                    icon={CalendarDays}

                    label="Expires"

                    value={formatDate(summary.end_at)}

                />

            </div>

        </Card>

    );

}