import ServiceCard from "../cards/ServiceCard";

import type { UserProfile } from "../types/types";

import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";

interface Props {
    profile: UserProfile;
}

export default function CurrentServicesSection({
    profile,
}: Props) {
    const hotspotAccounts = Array.isArray(profile.hotspot.accounts) ? profile.hotspot.accounts : [];
    const pppoeAccounts = Array.isArray(profile.pppoe.accounts) ? profile.pppoe.accounts : [];

    const hasServices =
        hotspotAccounts.length > 0 ||
        pppoeAccounts.length > 0;

    return (
        <section className="space-y-3 sm:space-y-5">
            <div>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    Current Services
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Active internet services assigned to this customer.
                </p>
            </div>

            {!hasServices ? (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 py-8 sm:py-10 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    No internet services found.
                </div>
            ) : (
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                    {hotspotAccounts.map((account, index) => (
                        <ServiceCard
                            key={`hotspot-${account.credential?.id ?? index}`}
                            title={`Hotspot • ${account.credential?.mikrotik?.identity_name ?? "Router"}`}
                            status={
                                account.current_subscription?.active
                                    ? "active"
                                    : account.current_subscription
                                        ? "expired"
                                        : "pending"
                            }
                            plan={
                                typeof account.current_subscription?.plan === "string"
                                    ? account.current_subscription.plan
                                    : account.current_subscription?.plan?.name
                            }
                            username={account.credential?.username ?? "unknown"}
                            expires={
                                account.current_subscription?.end_at
                                    ? formatDate(
                                          account.current_subscription.end_at
                                      )
                                    : null
                            }
                        />
                    ))}

                    {pppoeAccounts.map((account, index) => (
                        <ServiceCard
                            key={`pppoe-${account.credential?.id ?? index}`}
                            title={`PPPoE • ${account.credential?.mikrotik?.identity_name ?? "Router"}`}
                            status={
                                account.current_subscription?.active
                                    ? "active"
                                    : account.current_subscription
                                        ? "expired"
                                        : "pending"
                            }
                            plan={account.current_subscription?.plan_name}
                            username={account.credential?.username ?? "unknown"}
                            expires={
                                account.current_subscription?.end_at
                                    ? formatDate(
                                          account.current_subscription.end_at
                                      )
                                    : null
                            }
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
