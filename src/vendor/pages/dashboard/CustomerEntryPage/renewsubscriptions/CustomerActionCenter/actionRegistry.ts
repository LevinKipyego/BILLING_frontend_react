import type { ComponentType } from "react";

import type { LucideIcon } from "lucide-react";

import {
    ArrowRightLeft,
    KeyRound,
    PauseCircle,
    PlayCircle,
    RefreshCcw,
    Trash2,
    Unplug,
} from "lucide-react";

import RenewSubscriptionModal from "../components/renew/RenewSubscriptionModal";

/*
Future imports

import SuspendCustomerModal from "../../suspend/SuspendCustomerModal";
import ResumeCustomerModal from "../../resume/ResumeCustomerModal";
import MoveRouterModal from "../../move/MoveRouterModal";
import ChangePasswordModal from "../../password/ChangePasswordModal";
import DisconnectCustomerModal from "../../disconnect/DisconnectCustomerModal";
import DeleteCustomerModal from "../../delete/DeleteCustomerModal";
*/

export type SubmitVariant =
    | "primary"
    | "success"
    | "warning"
    | "danger";

export interface CustomerActionDefinition {

    endpoint: string;

    title: string;

    description: string;

    toolbarLabel: string;

    submitLabel: string;

    submitVariant: SubmitVariant;

    icon: LucideIcon;

    modal: ComponentType<any>;

    /**
     * Display order inside the toolbar.
     */
    sortOrder: number;

    /**
     * Can be hidden based on permissions.
     */
    visible: boolean;

    /**
     * Feature implemented?
     */
    enabled: boolean;

}

export const CUSTOMER_ACTIONS = {

    renew: {

        endpoint: "renew",

        title: "Renew Subscription",

        description:
            "Renew the customer's active subscription.",

        toolbarLabel: "Renew",

        submitLabel: "Renew Subscription",

        submitVariant: "primary",

        icon: RefreshCcw,

        modal: RenewSubscriptionModal,

        sortOrder: 10,

        visible: true,

        enabled: true,

    },

    suspend: {

        endpoint: "suspend",

        title: "Suspend Customer",

        description:
            "Temporarily suspend customer service.",

        toolbarLabel: "Suspend",

        submitLabel: "Suspend Customer",

        submitVariant: "warning",

        icon: PauseCircle,

        modal: () => null,

        sortOrder: 20,

        visible: true,

        enabled: false,

    },

    resume: {

        endpoint: "resume",

        title: "Resume Customer",

        description:
            "Restore suspended customer service.",

        toolbarLabel: "Resume",

        submitLabel: "Resume Customer",

        submitVariant: "success",

        icon: PlayCircle,

        modal: () => null,

        sortOrder: 30,

        visible: true,

        enabled: false,

    },

    move: {

        endpoint: "move-router",

        title: "Move Router",

        description:
            "Move customer to another router.",

        toolbarLabel: "Move",

        submitLabel: "Move Customer",

        submitVariant: "primary",

        icon: ArrowRightLeft,

        modal: () => null,

        sortOrder: 40,

        visible: true,

        enabled: false,

    },

    password: {

        endpoint: "change-password",

        title: "Change Password",

        description:
            "Update customer credentials.",

        toolbarLabel: "Password",

        submitLabel: "Change Password",

        submitVariant: "primary",

        icon: KeyRound,

        modal: () => null,

        sortOrder: 50,

        visible: true,

        enabled: false,

    },

    disconnect: {

        endpoint: "disconnect",

        title: "Disconnect Session",

        description:
            "Disconnect the customer's active session.",

        toolbarLabel: "Disconnect",

        submitLabel: "Disconnect",

        submitVariant: "warning",

        icon: Unplug,

        modal: () => null,

        sortOrder: 60,

        visible: true,

        enabled: false,

    },

    delete: {

        endpoint: "delete",

        title: "Delete Customer",

        description:
            "Permanently remove the customer.",

        toolbarLabel: "Delete",

        submitLabel: "Delete Customer",

        submitVariant: "danger",

        icon: Trash2,

        modal: () => null,

        sortOrder: 70,

        visible: true,

        enabled: false,

    },

} satisfies Record<string, CustomerActionDefinition>;

export type CustomerActionType =
    keyof typeof CUSTOMER_ACTIONS;

/**
 * Lookup a single action.
 */
export function getCustomerAction(

    type: CustomerActionType,

): CustomerActionDefinition {

    return CUSTOMER_ACTIONS[type];

}

/**
 * Toolbar / menus.
 */
export function listCustomerActions() {

    return Object.entries(CUSTOMER_ACTIONS)

        .map(([type, action]) => ({

            type: type as CustomerActionType,

            ...action,

        }))

        .filter(action => action.visible)

        .sort(

            (a, b) =>

                a.sortOrder -

                b.sortOrder,

        );

}