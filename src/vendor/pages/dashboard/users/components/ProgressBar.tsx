interface Props {
    value: number;
}

export default function ProgressBar({
    value,
}: Props) {
    const percentage = Math.min(
        100,
        Math.max(0, value)
    );

    return (
        <div className="w-full">
            <div className="h-2 sm:h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                    className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out"
                    style={{
                        width: `${percentage}%`
                    }}
                />
            </div>
        </div>
    );
}

