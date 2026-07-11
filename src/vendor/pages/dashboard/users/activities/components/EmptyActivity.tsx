import { Clock3 } from "lucide-react";

export default function EmptyActivity() {

    return (

        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">

            <Clock3

                size={40}

                className="mx-auto text-slate-400"

            />

            <h3 className="mt-4 text-lg font-semibold">

                No Activity

            </h3>

            <p className="mt-2 text-sm text-slate-500">

                No customer activity has been recorded yet.

            </p>

        </div>

    );

}