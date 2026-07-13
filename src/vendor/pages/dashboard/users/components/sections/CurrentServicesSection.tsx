import ServiceCard from "../cards/ServiceCard";

import type { UserProfile } from "../types/types";

interface Props {
    profile: UserProfile;
}

export default function CurrentServicesSection({
    profile,
}: Props) {

    const hotspotAccounts = profile.hotspot.accounts ?? [];
    const pppoeAccounts = profile.pppoe.accounts ?? [];

    const hasServices =
        hotspotAccounts.length > 0 ||
        pppoeAccounts.length > 0;

    return (

        <section className="space-y-5">

            <div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">

                    Current Services

                </h2>

                <p className="text-sm text-slate-500">

                    Active internet services assigned to this customer.

                </p>

            </div>

            {!hasServices ? (

                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 py-10 text-center text-slate-500">

                    No internet services found.

                </div>

            ) : (

                <div className="grid gap-6 lg:grid-cols-2">

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
                                    ? new Date(
                                          account.current_subscription.end_at
                                      ).toLocaleString()
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
                                    ? new Date(
                                          account.current_subscription.end_at
                                      ).toLocaleString()
                                    : null
                            }
                        />

                    ))}

                </div>

            )}

        </section>

    );

}