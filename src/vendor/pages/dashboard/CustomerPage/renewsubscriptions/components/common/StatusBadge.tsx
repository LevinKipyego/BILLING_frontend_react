

interface StatusBadgeProps {

    status: string;

    className?: string;

}

const STATUS_STYLES: Record<
    string,
    string
> = {

    /* Customer */

    active:
        "bg-green-100 text-green-700",

    suspended:
        "bg-yellow-100 text-yellow-700",

    disabled:
        "bg-red-100 text-red-700",

    deleted:
        "bg-gray-200 text-gray-700",

    /* Router */

    online:
        "bg-green-100 text-green-700",

    offline:
        "bg-red-100 text-red-700",

    degraded:
        "bg-orange-100 text-orange-700",

    /* Subscription */

    expired:
        "bg-red-100 text-red-700",

    pending:
        "bg-blue-100 text-blue-700",

    /* Network */

    success:
        "bg-green-100 text-green-700",

    partial:
        "bg-yellow-100 text-yellow-700",

    failed:
        "bg-red-100 text-red-700",

};

export default function StatusBadge({

    status,

    className = "",

}: StatusBadgeProps) {

    const key = status.toLowerCase();

    const color =

        STATUS_STYLES[key] ??

        "bg-gray-100 text-gray-700";

    return (

        <span

            className={`
                inline-flex
                items-center
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                capitalize
                ${color}
                ${className}
            `}

        >

            {status}

        </span>

    );

}