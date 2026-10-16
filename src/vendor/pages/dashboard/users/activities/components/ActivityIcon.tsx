import {
    CreditCard,
    Wifi,
    Router,
    User,
    Lock,
    CheckCircle2,
} from "lucide-react";

interface Props {
    type: string;
}

export default function ActivityIcon({
    type,
}: Props) {
    const iconClasses = "w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0";

    switch (type) {
        case "PAYMENT":
            return <CreditCard size={16} className={iconClasses} />;

        case "HOTSPOT_SUBSCRIPTION":
            return <Wifi size={16} className={iconClasses} />;

        case "PPPOE_SUBSCRIPTION":
            return <Router size={16} className={iconClasses} />;

        case "NETWORK_LOGIN":
            return <CheckCircle2 size={16} className={iconClasses} />;

        case "NETWORK_LOGOUT":
            return <Router size={16} className={iconClasses} />;

        case "PASSWORD_CHANGED":
            return <Lock size={16} className={iconClasses} />;

        default:
            return <User size={16} className={iconClasses} />;
    }
}