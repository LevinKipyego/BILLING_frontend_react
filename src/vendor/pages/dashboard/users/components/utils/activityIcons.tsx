import type { LucideIcon } from "lucide-react";
import {
    CreditCard,
    Wifi,
    Network,
    LogIn,
    LogOut,
    Smartphone,
    Settings,
    SubscriptIcon,
    
} from "lucide-react";


import type { Activity } from "../types/types";


export function activityIcon(type: Activity["type"]): LucideIcon {

    switch (type) {

        case "PAYMENT":
            return CreditCard;

        case "HOTSPOT_LOGIN":
            return Wifi;

        case "PPPOE_LOGIN":
            return Network;

        //case "login":
           // return LogIn;

        case "HOTSPOT_LOGOUT":
            return LogOut;

        case "PPPOE_LOGOUT":
            return LogOut;


        case "SUBSCRIPTION":
            return SubscriptIcon

        //case "device":
         //   return Smartphone;

        default:
            return Settings;
    }

}