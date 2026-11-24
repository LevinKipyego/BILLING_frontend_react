import {
    Calendar,
    CalendarDays,
    Clock3,
    Coins,
    RefreshCw,
    Wallet,
} from "lucide-react";

import Card from "../common/Card";
import InfoRow from "../common/InfoRow";

import { formatDate, formatDuration } from "../../utils/date";

import type {
    RenewalSummary as RenewalSummaryData,
} from "../../types/subscription";

type RenewalSummaryExtended = RenewalSummaryData & {
    mode?: string;
    duration_minutes?: number;
    wallet_amount_used?: number;
};

interface RenewalSummaryProps {
    summary: RenewalSummaryExtended;
}

const MODE_LABELS: Record<string, string> = {
    extend: "Extend Current Subscription",
    reset: "Start Fresh Subscription",
    custom: "Custom Duration",
    wallet: "Redeem Wallet Balance",
};

export default function RenewalSummary({
    summary,
}: RenewalSummaryProps) {
    const mode: string = summary.mode ?? "extend";
    const isCustom = mode === "custom";
    const isWallet = mode === "wallet";

    const durationDisplay =
        typeof summary.duration_minutes === "number" && summary.duration_minutes > 0
            ? summary.duration_minutes >= 60
                ? `${formatDuration(summary.duration_minutes)} (${summary.duration_minutes.toLocaleString()} mins)`
                : formatDuration(summary.duration_minutes)
            : null;

    return (
        <Card
            title="Renewal Summary"
            subtitle="Final confirmation before submitting."
        >
            <div className="space-y-4">
                <InfoRow
                    icon={RefreshCw}
                    label="Renewal Mode"
                    value={MODE_LABELS[mode] ?? String(summary.mode ?? mode)}
                />

                {isWallet ? (
                    <InfoRow
                        icon={Wallet}
                        label="Wallet Redeemed"
                        value={`KES ${Number(summary.wallet_amount_used ?? summary.amount ?? 0).toLocaleString()}`}
                    />
                ) : !isCustom ? (
                    <InfoRow
                        icon={Coins}
                        label="Amount"
                        value={`KES ${Number(summary.amount ?? 0).toLocaleString()}`}
                    />
                ) : null}

                {durationDisplay && (
                    <InfoRow
                        icon={Clock3}
                        label={isCustom ? "Custom Duration" : isWallet ? "Top-Up Duration" : "Duration"}
                        value={durationDisplay}
                    />
                )}

                {summary.start_at && (
                    <InfoRow
                        icon={Calendar}
                        label="Starts"
                        value={formatDate(summary.start_at)}
                    />
                )}

                {summary.end_at && (
                    <InfoRow
                        icon={CalendarDays}
                        label="Expires"
                        value={formatDate(summary.end_at)}
                    />
                )}
            </div>
        </Card>
    );
}