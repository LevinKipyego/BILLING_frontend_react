import type { LucideIcon } from "lucide-react";
import {
    CreditCard,
    Wifi,
    Network,
    LogIn,
    LogOut,
    Smartphone,
    Settings,
    
} from "lucide-react";


import type { Activity } from "../types/types";

export function activityIcon(type: Activity["type"]): LucideIcon {

    switch (type) {

        case "payment":
            return CreditCard;

        case "hotspot":
            return Wifi;

        case "pppoe":
            return Network;

        case "login":
            return LogIn;

        case "logout":
            return LogOut;

        case "device":
            return Smartphone;

        default:
            return Settings;
    }

}