import {
    Calendar,
    CalendarDays,
    Clock3,
    Coins,
    Wallet,
} from "lucide-react";

import Card from "../common/Card";
import InfoRow from "../common/InfoRow";

import { formatDate, formatDuration } from "../../utils/date";

import type {
    RenewalPreview as RenewalPreviewData,
} from "../../types/subscription";

type RenewalPreviewExtended = RenewalPreviewData & {
    mode?: string;
    duration_minutes?: number;
    custom_minutes?: number;
    amount?: number;
    wallet_amount_used?: number;
};

interface RenewalPreviewProps {
    preview: RenewalPreviewExtended;
}

export default function RenewalPreview({
    preview,
}: RenewalPreviewProps) {
    const mode: string = preview.mode ?? "extend";
    const isCustom = mode === "custom";
    const isWallet = mode === "wallet";

    const rawMinutes =
        typeof preview.duration_minutes === "number" && preview.duration_minutes > 0
            ? preview.duration_minutes
            : typeof preview.custom_minutes === "number" && preview.custom_minutes > 0
                ? preview.custom_minutes
                : 0;

    const durationValue =
        rawMinutes > 0
            ? rawMinutes >= 60
                ? `${formatDuration(rawMinutes)} (${rawMinutes.toLocaleString()} mins)`
                : formatDuration(rawMinutes)
            : "0 mins";

    const walletRedeemed = Number(preview.wallet_amount_used ?? preview.amount ?? 0);
    const planAmount = Number(preview.amount ?? 0);

    const subtitleText = isCustom
        ? "Review standalone custom duration before applying."
        : isWallet
            ? "Review wallet balance redemption and calculated top-up duration."
            : "Review how the subscription will change.";

    return (
        <Card
            title="Renewal Preview"
            subtitle={subtitleText}
        >
            <div className="space-y-4">
                {isWallet ? (
                    <InfoRow
                        icon={Wallet}
                        label="Wallet Redeemed"
                        value={`KES ${walletRedeemed.toLocaleString()}`}
                    />
                ) : !isCustom ? (
                    <InfoRow
                        icon={Coins}
                        label="Amount"
                        value={`KES ${planAmount.toLocaleString()}`}
                    />
                ) : null}

                <InfoRow
                    icon={Clock3}
                    label={isCustom ? "Custom Duration" : isWallet ? "Top-Up Duration" : "Duration"}
                    value={durationValue}
                />

                {preview.start_at && (
                    <InfoRow
                        icon={Calendar}
                        label="Starts"
                        value={formatDate(preview.start_at)}
                    />
                )}

                {preview.end_at && (
                    <InfoRow
                        icon={CalendarDays}
                        label="Expires"
                        value={formatDate(preview.end_at)}
                    />
                )}
            </div>
        </Card>
    );
}