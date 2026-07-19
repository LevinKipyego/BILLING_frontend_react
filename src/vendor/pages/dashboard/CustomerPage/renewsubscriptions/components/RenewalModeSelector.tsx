import { CalendarClock, PlayCircle, ArrowRightCircle } from "lucide-react";

import type { RenewMode } from "../types/subscription";

interface Props {
    value: RenewMode;
    onChange: (mode: RenewMode) => void;
}

export default function RenewalModeSelector({
    value,
    onChange,
}: Props) {

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

            <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">

                <h3 className="font-semibold">

                    Renewal Method

                </h3>

                <p className="mt-1 text-sm text-slate-500">

                    Choose how this subscription should be renewed.

                </p>

            </div>

            <div className="space-y-3 p-5">

                <Option

                    icon={<ArrowRightCircle size={18} />}

                    title="Extend Existing Subscription"

                    description="Starts immediately after the current subscription expires."

                    checked={value === "EXTEND"}

                    onClick={() => onChange("EXTEND")}

                />

                <Option

                    icon={<PlayCircle size={18} />}

                    title="Start Immediately"

                    description="Ends the current subscription and starts a new one now."

                    checked={value === "IMMEDIATE"}

                    onClick={() => onChange("IMMEDIATE")}

                />

                <Option

                    icon={<CalendarClock size={18} />}

                    title="Custom Start Date"

                    description="Choose a future start date."

                    checked={value === "CUSTOM"}

                    onClick={() => onChange("CUSTOM")}

                />

            </div>

        </div>

    );

}

interface OptionProps {

    icon: React.ReactNode;

    title: string;

    description: string;

    checked: boolean;

    onClick: () => void;

}

function Option({
    icon,
    title,
    description,
    checked,
    onClick,
}: OptionProps) {

    return (

        <button
            type="button"
            onClick={onClick}
            className={`w-full rounded-xl border p-4 text-left transition
                ${
                    checked
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 hover:border-blue-400 dark:border-slate-700"
                }`}
        >

            <div className="flex items-start gap-4">

                <div className="mt-1">

                    {icon}

                </div>

                <div className="flex-1">

                    <h4 className="font-semibold">

                        {title}

                    </h4>

                    <p className="mt-1 text-sm text-slate-500">

                        {description}

                    </p>

                </div>

                <input
                    readOnly
                    type="radio"
                    checked={checked}
                />

            </div>

        </button>

    );

}