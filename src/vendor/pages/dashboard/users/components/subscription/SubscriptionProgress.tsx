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

        <div className="space-y-2">

            <ProgressBar value={percentage} />

            <div className="flex justify-between text-xs text-slate-500">

                <span>

                    {percentage.toFixed(1)}%

                </span>

                <span>

                    {format(remaining)}

                </span>

            </div>

        </div>

    );

}