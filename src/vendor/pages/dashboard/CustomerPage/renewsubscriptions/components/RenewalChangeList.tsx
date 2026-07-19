import {
    ArrowRight,
    CheckCircle2,
    MinusCircle,
} from "lucide-react";

interface Change {

    label: string;

    before: string;

    after: string;

}

interface Props {

    changes: Change[];

}

export default function RenewalChangeList({

    changes,

}: Props) {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <h2 className="text-lg font-bold">

                    Configuration Changes

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    These changes will be applied after renewal.

                </p>

            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">

                {changes.map((change) => {

                    const changed =
                        change.before !== change.after;

                    return (

                        <div
                            key={change.label}
                            className="flex items-start gap-4 px-6 py-5"
                        >

                            {changed ? (

                                <CheckCircle2
                                    className="mt-1 text-emerald-500"
                                    size={20}
                                />

                            ) : (

                                <MinusCircle
                                    className="mt-1 text-slate-400"
                                    size={20}
                                />

                            )}

                            <div className="flex-1">

                                <h4 className="font-semibold">

                                    {change.label}

                                </h4>

                                {changed ? (

                                    <div className="mt-2 flex items-center gap-3">

                                        <span className="rounded-lg bg-slate-100 px-3 py-1 dark:bg-slate-800">

                                            {change.before}

                                        </span>

                                        <ArrowRight
                                            size={16}
                                            className="text-slate-400"
                                        />

                                        <span className="rounded-lg bg-emerald-100 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">

                                            {change.after}

                                        </span>

                                    </div>

                                ) : (

                                    <p className="mt-1 text-sm text-slate-500">

                                        No Change

                                    </p>

                                )}

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}