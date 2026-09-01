import {

    RefreshCcw,

    PauseCircle,

    PlayCircle,

    Unplug,

    ArrowRightLeft,

    KeyRound,

    Trash2,

    UserPlus,

} from "lucide-react";

import type { CustomerActionType } from "../types/actions";

export interface ActionConfig {

    title: string;

    submitLabel: string;

    submitVariant:
        | "primary"
        | "success"
        | "danger";

    icon: any;
}

export const ACTION_CONFIG: Record<
    CustomerActionType,
    ActionConfig
> = {

    renew: {

        title: "Renew Subscription",

        submitLabel: "Renew Subscription",

        submitVariant: "success",

        icon: RefreshCcw,

    },

    suspend: {

        title: "Suspend Customer",

        submitLabel: "Suspend Customer",

        submitVariant: "danger",

        icon: PauseCircle,

    },

    resume: {

        title: "Resume Customer",

        submitLabel: "Resume Customer",

        submitVariant: "success",

        icon: PlayCircle,

    },

    disconnect: {

        title: "Disconnect Customer",

        submitLabel: "Disconnect",

        submitVariant: "primary",

        icon: Unplug,

    },

    "move-router": {

        title: "Move Router",

        submitLabel: "Move Customer",

        submitVariant: "primary",

        icon: ArrowRightLeft,

    },

    "change-password": {

        title: "Change Password",

        submitLabel: "Update Password",

        submitVariant: "primary",

        icon: KeyRound,

    },

    delete: {

        title: "Delete Customer",

        submitLabel: "Delete Customer",

        submitVariant: "danger",

        icon: Trash2,

    },

    create: {

        title: "Create Customer",

        submitLabel: "Create Customer",

        submitVariant: "success",

        icon: UserPlus,

    },

};