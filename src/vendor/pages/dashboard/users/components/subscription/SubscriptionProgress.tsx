import ProgressBar from "../ProgressBar";

interface Props {
    percentage: number;
    remaining: number;
}

function format(seconds: number) {
    if (seconds <= 0)
        return "Expired";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);

    if (days > 0)
        return `${days}d ${hours}h`;

    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
}

export default function SubscriptionProgress({
    percentage,
    remaining,
}: Props) {
    return (
        <div className="space-y-1.5 sm:space-y-2">
            <ProgressBar value={percentage} />

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>
                    {percentage.toFixed(1)}% elapsed
                </span>

                <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {format(remaining)} remaining
                </span>
            </div>
        </div>
    );
}

