import {

    CreditCard,

    Wifi,

    Router,

    User,

    Lock,

    Shield,

    CheckCircle2,

} from "lucide-react";

interface Props {

    type: string;

}

export default function ActivityIcon({

    type,

}: Props) {

    switch (type) {

        case "PAYMENT":

            return <CreditCard size={18} />;

        case "HOTSPOT_SUBSCRIPTION":

            return <Wifi size={18} />;

        case "PPPOE_SUBSCRIPTION":

            return <Router size={18} />;

        case "NETWORK_LOGIN":

            return <CheckCircle2 size={18} />;

        case "NETWORK_LOGOUT":

            return <Router size={18} />;

        case "PASSWORD_CHANGED":

            return <Lock size={18} />;

        default:

            return <User size={18} />;

    }

}