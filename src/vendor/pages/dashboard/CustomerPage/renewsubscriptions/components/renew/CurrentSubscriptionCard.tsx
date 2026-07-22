import {
    CalendarDays,
    Clock3,
    Wifi,
} from "lucide-react";

import Card from "../common/Card";
import InfoRow from "../common/InfoRow";
import StatusBadge from "../common/StatusBadge";

import { formatDate } from "../../utils/date";

import type {
    CurrentSubscription,
} from "../../types/subscription";

interface CurrentSubscriptionCardProps {

    subscription: CurrentSubscription;

}

export default function CurrentSubscriptionCard({

    subscription,

}: CurrentSubscriptionCardProps) {

    return (

        <Card
            title="Current Subscription"
        >

            <div className="space-y-4">

                <div className="flex items-center justify-between">

                    <h3 className="text-lg font-semibold">

                        {subscription.plan.name}

                    </h3>

                    <StatusBadge
                        status={subscription.status}
                    />

                </div>

                <InfoRow

                    icon={Wifi}

                    label="Plan"

                    value={subscription.plan.name}

                />

                <InfoRow

                    icon={Clock3}

                    label="Remaining"

                    value={`${subscription.remaining_days} days`}

                />

                <InfoRow

                    icon={CalendarDays}

                    label="Expires"

                    value={formatDate(
                        subscription.expires_at,
                    )}

                />

            </div>

        </Card>

    );

}