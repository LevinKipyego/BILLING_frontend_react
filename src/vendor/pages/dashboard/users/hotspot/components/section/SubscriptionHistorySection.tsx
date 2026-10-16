import type { UserProfile } from "../../../components/types/types";
import SubscriptionHistoryTable from "../../tables/SubscriptionHistoryTable";

interface Props {
    profile: UserProfile;
}

export default function SubscriptionHistorySection({
    profile,
}: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5">
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    Purchase History
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Previous hotspot subscriptions.
                </p>
            </div>

            <div className="overflow-x-auto">
                <SubscriptionHistoryTable
                    subscriptions={
                        profile.hotspot_history
                    }
                />
            </div>
        </section>
    );
}

