import type { LucideIcon } from "lucide-react";
import {
    CreditCard,
    
    Network,
    
    LogOut,
    
    Settings,
    SubscriptIcon,
    
} from "lucide-react";


import type { Activity } from "../types/types";


export function activityIcon(type: Activity["type"]): LucideIcon {

    switch (type) {

        case "PAYMENT":
            return CreditCard;

    
        case "NETWORK_LOGIN":
            return Network;

        case "PPPOE_SUBSCRIPTION":
            return SubscriptIcon;

        case "NETWORK_LOGOUT":
            return LogOut;

        

        case "HOTSPOT_SUBSCRIPTION":
            return SubscriptIcon

        //case "device":
         //   return Smartphone;

        default:
            return Settings;
    }

}