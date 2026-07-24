import {
    useEffect,
} from "react";

import CustomerActionModal from "../modal/CustomerActionModal";

import RenewalConfiguration from "./RenewalConfiguration";
import RenewalPreview from "./RenewalPreview";
import RenewalSummary from "./RenewalSummary";
import RenewalChangeList from "./RenewalChangeList";

import { useRenewSubscription } from "../../hooks/useRenewSubscription";
import { useRenewal } from "../../hooks/useRenewal";
import { useRenewAction } from "../../hooks/useActionSubmit";

import type {
    Customer,
} from "../../types/customerInfo";

interface RenewSubscriptionModalProps {

    open: boolean;

    customer: Customer;

    onClose(): void;

    onSuccess?(): void;

}

export default function RenewSubscriptionModal({

    open,

    customer,

    onClose,

    onSuccess,

}: RenewSubscriptionModalProps) {

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

        setPlan,

        setMode,

        setNotes,

        canSubmit,

    } = useRenewal(

        subscription,

        plans,

    );

    const {

        submitting,

        error: submitError,

        submit,

    } = useRenewAction();

    useEffect(() => {

        if (!open) {

            return;

        }

        void load(

            customer.id,

        );

    }, [

        open,

        customer.id,

        load,

    ]);

    async function handleSubmit() {

        if (

            !renewal ||

            !canSubmit

        ) {

            return;

        }

        try {

            const response =

                await submit(

                    customer.id,

                    renewal.payload,

                );

            if (

                response.success

            ) {

                onSuccess?.();

                onClose();

            }

        }

        catch {

            // handled by useRenewAction

        }

    }

    return (

        

        <CustomerActionModal

            open={open}

            title="Renew Subscription"

            subtitle={`Renew ${customer.full_name}'s subscription`}

            loading={loading}

            submitting={submitting}

            submitLabel="Renew Subscription"

            onClose={onClose}

            onSubmit={handleSubmit}

            left={

                subscription && (

                    <RenewalConfiguration

                        subscription={subscription}

                        plans={plans}

                        configuration={configuration}

                        selectedPlan={selectedPlan}

                        onPlanChange={setPlan}

                        onModeChange={setMode}

                        onNotesChange={setNotes}

                    />

                )

            }

            right={

                renewal && (

                    <div className="space-y-6">

                        <RenewalPreview

                            preview={

                                renewal.preview

                            }

                        />

                        <RenewalChangeList

                            changes={

                                renewal.changes

                            }

                        />

                        <RenewalSummary

                            summary={

                                renewal.summary

                            }

                        />

                    </div>

                )

            }

            summary={

                <div className="space-y-3">

                    {loadError && (

                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">

                            {loadError.message}

                        </div>

                    )}

                    {submitError && (

                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">

                            {submitError}

                        </div>

                    )}

                    {!loading &&

                        !renewal && (

                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">

                                Unable to generate the renewal preview.

                            </div>

                        )}

                </div>

            }

        />

    );

}