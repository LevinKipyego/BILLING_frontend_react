import { useEffect } from "react";

import Modal from "../../../../components/ui/Modal";

import SubscriptionOverviewCard from "./SubscriptionOverviewCard";
import RenewalModeSelector from "./RenewalModeSelector";
import RenewalConfiguration from "./RenewalConfiguration";
import RenewalSummary from "./RenewalSummary";
import RenewalWarnings from "./RenewalWarnings";
import RenewalFooter from "./RenewalFooter";

import useRenewSubscription from "../hooks";

import type { RenewSubscriptionModalProps } from "./types";

export default function RenewSubscriptionModal({

    open,

    customer,

    subscription,

    plans,

    mikrotiks,

    loading = false,

    onClose,

    onSubmit,

}: RenewSubscriptionModalProps) {

    const {

        renewal,

        summary,

        warnings,

        canSubmit,

        showCustomDate,

        updateMode,

        updatePlan,

        updateRouter,

        updateStartDate,

        submit,

        submitting,

    } = useRenewSubscription({

        customer,

        subscription,

        plans,

        mikrotiks,

        onSubmit,

    });

    useEffect(() => {

        if (!open) {

            return;

        }

    }, [open]);

    return (

        <Modal

            open={open}

            onClose={onClose}

            title="Renew Subscription"

            size="4xl"

        >

            <div className="space-y-6">

                <SubscriptionOverviewCard

                    customer={customer}

                    subscription={subscription}

                />

                <RenewalModeSelector

                    value={renewal.mode}

                    onChange={updateMode}

                />

                <RenewalConfiguration

                    renewal={renewal}

                    plans={plans}

                    mikrotiks={mikrotiks}

                    showCustomDate={showCustomDate}

                    onPlanChange={updatePlan}

                    onRouterChange={updateRouter}

                    onStartDateChange={updateStartDate}

                />

                <RenewalSummary

                    summary={summary}

                />

                <RenewalWarnings

                    warnings={warnings}

                />

                <RenewalFooter

                    loading={loading || submitting}

                    canSubmit={canSubmit}

                    onCancel={onClose}

                    onSubmit={submit}

                />

            </div>

        </Modal>

    );

}