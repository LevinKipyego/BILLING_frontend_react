import { useEffect, useRef } from "react";

import CustomerActionModal from "../modal/CustomerActionModal";

import RenewalConfiguration from "./RenewalConfiguration";
import RenewalPreview from "./RenewalPreview";
import RenewalSummary from "./RenewalSummary";
import RenewalChangeList from "./RenewalChangeList";

import { useRenewSubscription } from "../../hooks/useRenewSubscription";
import { useRenewal } from "../../hooks/useRenewal";
import { useRenewAction } from "../../hooks/useActionSubmit";

import type { Customer } from "../../types/customerInfo";

interface RenewSubscriptionModalProps {
    open: boolean;
    customer: Customer;
    onClose(): void;
    onSuccess?(): void;
}

type ErrorLike =
    | string
    | {
          message?: string;
          detail?: string;
          error?: string;
          response?: {
              data?: {
                  detail?: string;
                  message?: string;
                  error?: string;
              };
          };
      }
    | null
    | undefined;

function extractBackendMessage(err: ErrorLike): string | null {
    if (!err) return null;
    if (typeof err === "string") {
        const trimmed = err.trim();
        return trimmed.length > 0 ? trimmed : null;
    }

    const candidates = [
        err.response?.data?.detail,
        err.response?.data?.message,
        err.response?.data?.error,
        err.detail,
        err.error,
        err.message,
    ];

    for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate.trim().length > 0) {
            return candidate.trim();
        }
    }

    return null;
}

export default function RenewSubscriptionModal({
    open,
    customer,
    onClose,
    onSuccess,
}: RenewSubscriptionModalProps) {
    const didRenewRef = useRef(false);

    const {
        subscription,
        plans,
        loading,
        error: loadError,
        load,
    } = useRenewSubscription();

    const {
        configuration,
        renewal,
        selectedPlan,
        customMinutes,
        setCustomMinutes,
        setPlan,
        setMode,
        setNotes,
        canSubmit,
    } = useRenewal(subscription, plans);

    const {
        submitting,
        error: submitError,
        submit,
    } = useRenewAction();

    useEffect(() => {
        if (!open) {
            didRenewRef.current = false;
            return;
        }

        didRenewRef.current = false;
        void load(customer.id);
    }, [open, customer.id, load]);

    function handleDismiss() {
        // Closing/canceling without a confirmed backend submit must never report success
        didRenewRef.current = false;
        onClose();
    }

    async function handleSubmit() {
        if (!renewal || !canSubmit || submitting) {
            return;
        }

        didRenewRef.current = false;

        try {
            const response = await submit(customer.id, renewal.payload);

            if (response && response.success === true) {
                didRenewRef.current = true;
                onSuccess?.();
                onClose();
            }
        } catch {
            didRenewRef.current = false;
            // handled by useRenewAction
        }
    }

    const loadErrorMessage = extractBackendMessage(loadError as ErrorLike);
    const submitErrorMessage = extractBackendMessage(submitError as ErrorLike);
    const missingRenewalMessage =
        !loading && !renewal
            ? loadErrorMessage ??
              submitErrorMessage ??
              extractBackendMessage(
                  subscription as { detail?: string; error?: string; message?: string } | null,
              ) ??
              "No renewal preview was returned by the backend."
            : null;

    return (
        <CustomerActionModal
            open={open}
            title="Renew Subscription"
            subtitle={`Renew ${customer.full_name}'s subscription`}
            loading={loading}
            submitting={submitting}
            submitLabel="Renew Subscription"
            onClose={handleDismiss}
            onSubmit={handleSubmit}
            left={
                subscription && (
                    <RenewalConfiguration
                        subscription={subscription}
                        plans={plans}
                        configuration={configuration}
                        selectedPlan={selectedPlan}
                        customMinutes={customMinutes}
                        onCustomMinutesChange={setCustomMinutes}
                        onPlanChange={setPlan}
                        onModeChange={setMode}
                        onNotesChange={setNotes}
                    />
                )
            }
            right={
                renewal && (
                    <div className="space-y-6">
                        <RenewalPreview preview={renewal.preview} />

                        <RenewalChangeList changes={renewal.changes} />

                        <RenewalSummary summary={renewal.summary} />
                    </div>
                )
            }
            summary={
                <div className="space-y-3">
                    {loadErrorMessage && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                            {loadErrorMessage}
                        </div>
                    )}

                    {submitErrorMessage && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                            {submitErrorMessage}
                        </div>
                    )}

                    {missingRenewalMessage && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/40 dark:text-yellow-200">
                            {missingRenewalMessage}
                        </div>
                    )}
                </div>
            }
        />
    );
}