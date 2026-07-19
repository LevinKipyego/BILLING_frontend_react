import {
    CheckCircle2,
    Circle,
} from "lucide-react";

interface Props {

    radius: boolean;

    activate: boolean;

}

export default function RenewalExecutionPlan({

    radius,

    activate,

}: Props) {

    const steps = [

        "Validate Customer",

        "Validate Plan",

        "Validate MikroTik",

        "Create Subscription",

        activate
            ? "Activate Subscription"
            : "Leave Subscription Inactive",

        radius
            ? "Synchronize Radius"
            : "Skip Radius Sync",

        "Create Audit Log",

    ];

    return (

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <div className="border-b px-6 py-5">

                <h2 className="text-lg font-bold">

                    Execution Plan

                </h2>

            </div>

            <div className="space-y-4 p-6">

                {steps.map((step, index) => (

                    <div
                        key={step}
                        className="flex items-center gap-3"
                    >

                        {index === steps.length - 1 ? (

                            <CheckCircle2
                                size={18}
                                className="text-emerald-500"
                            />

                        ) : (

                            <Circle
                                size={18}
                                className="text-slate-400"
                            />

                        )}

                        <span>

                            {step}

                        </span>

                    </div>

                ))}

            </div>

        </div>

    );

}