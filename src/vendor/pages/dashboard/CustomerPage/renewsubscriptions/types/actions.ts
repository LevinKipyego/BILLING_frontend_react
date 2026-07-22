import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

import type { Customer } from "../../../CustomerPage/types/types";

/* =====================================================
 * Customer Action Types
 * ===================================================== */

export type CustomerActionType =
    | "renew"
    | "suspend"
    | "resume"
    | "disconnect"
    | "move-router"
    | "change-password"
    | "delete"
    | "create";

/* =====================================================
 * Button / Theme Variants
 * ===================================================== */

export type ActionVariant =
    | "primary"
    | "success"
    | "danger";

/* =====================================================
 * Base Modal Props
 * ===================================================== */

export interface CustomerActionModalProps {

    customer: Customer;

    open: boolean;

    onClose(): void;

    onCompleted?(): void;

}

/* =====================================================
 * Action Definition
 * ===================================================== */

export interface ActionDefinition {

    /**
     * Internal action key.
     */
    type: CustomerActionType;

    /**
     * Backend endpoint.
     * Example:
     * renew
     * suspend
     * disconnect
     */
    endpoint: string;

    /**
     * Modal title.
     */
    title: string;

    /**
     * Toolbar button label.
     */
    toolbarLabel: string;

    /**
     * Footer submit button label.
     */
    submitLabel: string;

    /**
     * Toolbar icon.
     */
    icon: LucideIcon;

    /**
     * Theme.
     */
    color: ActionVariant;

    /**
     * Submit button style.
     */
    submitVariant: ActionVariant;

    /**
     * Modal component.
     */
    modal: ComponentType<CustomerActionModalProps>;

}

/* =====================================================
 * Action Execution
 * ===================================================== */

export interface ActionExecution<T = unknown> {

    action: ActionDefinition;

    payload: T;

}

/* =====================================================
 * Customer Action State
 * ===================================================== */

export interface CustomerActionState {

    loading: boolean;

    submitting: boolean;

    error: string | null;

}