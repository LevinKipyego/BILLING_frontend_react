import { useMemo, useState } from "react";

import CustomerActionToolbar from "./CustomerActionToolbar";

import {
    getCustomerAction,
    type CustomerActionType,
} from "./actionRegistry";
import type { Customer } from "../../types/types";

interface CustomerActionCenterProps {
    customer: Customer;
    /**
     * Controlled mode.
     */
    open?: boolean;
    action?: CustomerActionType | null;
    /**
     * Callback after successful completion.
     */
    onCompleted?(): void;
    /**
     * Close callback.
     */
    onClose?(): void;
}

export default function CustomerActionCenter({
    customer,
    open = false,
    action = null,
    onCompleted,
    onClose,
}: CustomerActionCenterProps) {
    /**
     * Internal state (used when toolbar controls actions)
     */
    const [
        internalAction,
        setInternalAction,
    ] = useState<CustomerActionType | null>(null);

    /**
     * If a parent supplies an action,
     * use it. Otherwise use toolbar state.
     */
    const activeAction = action ?? internalAction;

    const definition = useMemo(
        () => (activeAction ? getCustomerAction(activeAction) : null),
        [activeAction],
    );

    const Modal = definition?.modal;

    function handleClose() {
        setInternalAction(null);
        onClose?.();
    }

    function handleCompleted() {
        setInternalAction(null);
        onCompleted?.();
    }

    const isModalOpen = action ? Boolean(open) : Boolean(internalAction);

    return (
        <>
            {/* Toolbar is only shown in standalone mode */}
            {!action && (
                <CustomerActionToolbar
                    active={internalAction ?? undefined}
                    onSelect={setInternalAction}
                />
            )}

            {Modal && isModalOpen && (
                <Modal
                    open={isModalOpen}
                    customer={customer}
                    onClose={handleClose}
                    onSuccess={handleCompleted}
                    onCompleted={handleCompleted}
                />
            )}
        </>
    );
}