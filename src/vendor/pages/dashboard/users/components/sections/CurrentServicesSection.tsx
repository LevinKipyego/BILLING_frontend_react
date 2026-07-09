import ServiceCard from "../cards/ServiceCard";

import type { UserProfile } from "../types/types";

interface Props {

    profile: UserProfile;

}

export default function CurrentServicesSection({

    profile,

}: Props) {

    const hotspot = profile.hotspot.current_subscription;

    const hotspotCredential = profile.hotspot.credential;

    const pppoe = profile.pppoe.current_subscription;

    const pppoeCredential = profile.pppoe.credential;

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

            <div className="grid gap-6 lg:grid-cols-2">

                <ServiceCard

                    title="Hotspot"

                    status={
                        hotspot?.active
                            ? "active"
                            : hotspot
                                ? "expired"
                                : "pending"
                    }

                    plan={
                        // hotspot.plan may be an object (SubscriptionPlan) or a string.
                        // Normalize to string or undefined for ServiceCard prop.
                        typeof hotspot?.plan === "string"
                            ? hotspot.plan
                            : hotspot?.plan?.name ?? undefined
                    }

                    username={hotspotCredential?.username}

                    expires={
                        hotspot?.end_at
                            ? new Date(hotspot.end_at).toLocaleString()
                            : null
                    }

                />

                <ServiceCard

                    title="PPPoE"

                    status={
                        pppoe?.active
                            ? "active"
                            : pppoe
                                ? "expired"
                                : "pending"
                    }

                    plan={pppoe?.plan_name}

                    username={pppoeCredential?.username}

                    expires={
                        pppoe?.end_at
                            ? new Date(pppoe.end_at).toLocaleString()
                            : null
                    }

                />

            </div>

        </section>

    );

}