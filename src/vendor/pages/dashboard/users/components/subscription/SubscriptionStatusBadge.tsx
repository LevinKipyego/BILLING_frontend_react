import StatusBadge from "../StatusBadge";

interface Props {

    active: boolean;

    expired: boolean;

}

export default function SubscriptionStatusBadge({

    active,

    expired,

}: Props) {

    if (expired)

        return <StatusBadge status="expired" />;

    if (active)

        return <StatusBadge status="active" />;

    return <StatusBadge status="suspended" />;

}