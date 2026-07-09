import type { UserProfile } from "../../../components/types/types";

import SubscriptionHistoryTable from "../../tables/SubscriptionHistoryTable";

interface Props {

    profile: UserProfile;

}

export default function SubscriptionHistorySection({

    profile,

}: Props) {

    return (

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

            <div className="border-b px-6 py-5">

                <h2 className="text-xl font-bold">

                    Purchase History

                </h2>

                <p className="text-sm text-slate-500 mt-1">

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