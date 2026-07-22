import {
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

import type {
    SubscriptionChange,
} from "../../types/subscription";

interface RenewalChangeListProps {

    changes: SubscriptionChange[];

}

export default function RenewalChangeList({

    changes,

}: RenewalChangeListProps) {

    return (

        <section className="rounded-xl border border-gray-200 bg-white">

            <div className="border-b border-gray-100 px-6 py-4">

                <h3 className="flex items-center gap-2 text-lg font-semibold">

                    <CheckCircle2 size={18} />

                    Changes

                </h3>

            </div>

            <div className="divide-y divide-gray-100">

                {changes.length === 0 ? (

                    <div className="px-6 py-6 text-center text-sm text-gray-500">

                        No changes detected.

                    </div>

                ) : (

                    changes.map((change) => (

                        <div
                            key={change.field}
                            className="flex items-center justify-between px-6 py-4"
                        >

                            <span className="font-medium text-gray-900">

                                {change.field}

                            </span>

                            <div className="flex items-center gap-3">

                                <span className="max-w-[160px] truncate text-gray-500">

                                    {change.old_value ?? "—"}

                                </span>

                                <ArrowRight
                                    size={14}
                                    className="text-gray-400"
                                />

                                <span className="max-w-[160px] truncate font-semibold text-blue-600">

                                    {change.new_value ?? "—"}

                                </span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </section>

    );

}