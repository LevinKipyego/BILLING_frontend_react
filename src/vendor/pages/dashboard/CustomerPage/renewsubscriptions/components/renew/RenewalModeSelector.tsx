import {
    CalendarPlus,
    RotateCcw,
} from "lucide-react";

import type {
    RenewalMode,
} from "../../types/subscription";

interface RenewalModeSelectorProps {

    value: RenewalMode;

    onChange(
        mode: RenewalMode,
    ): void;

}

const OPTIONS = [

    {

        value: "extend" as const,

        title: "Extend Current Subscription",

        description:
            "Add the new plan duration to the customer's remaining subscription period.",

        icon: CalendarPlus,

    },

    {

        value: "reset" as const,

        title: "Start Fresh Subscription",

        description:
            "End the current subscription and start a new billing cycle immediately.",

        icon: RotateCcw,

    },

];

export default function RenewalModeSelector({

    value,

    onChange,

}: RenewalModeSelectorProps) {

    return (

        <div className="space-y-4">

            <div>

                <h3 className="text-lg font-semibold text-gray-900">

                    Renewal Mode

                </h3>

                <p className="mt-1 text-sm text-gray-500">

                    Choose how the customer's subscription should be renewed.

                </p>

            </div>

            <div className="grid gap-4">

                {OPTIONS.map((option) => {

                    const Icon = option.icon;

                    const active =

                        value === option.value;

                    return (

                        <button

                            key={option.value}

                            type="button"

                            onClick={() =>
                                onChange(option.value)
                            }

                            className={`
                                flex
                                items-start
                                gap-4
                                rounded-xl
                                border
                                p-4
                                text-left
                                transition-all
                                duration-200
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-blue-500
                                focus-visible:ring-offset-2

                                ${
                                    active
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                }
                            `}
                        >

                            <div
                                className={`
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg

                                    ${
                                        active
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-gray-600"
                                    }
                                `}
                            >

                                <Icon className="h-5 w-5" />

                            </div>

                            <div className="flex-1">

                                <div className="font-semibold text-gray-900">

                                    {option.title}

                                </div>

                                <div className="mt-1 text-sm text-gray-500">

                                    {option.description}

                                </div>

                            </div>

                        </button>

                    );

                })}

            </div>

        </div>

    );

}