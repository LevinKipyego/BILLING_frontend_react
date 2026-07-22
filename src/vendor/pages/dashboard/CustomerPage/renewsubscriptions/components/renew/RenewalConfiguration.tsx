import CurrentSubscriptionCard from "./CurrentSubscriptionCard";
import RenewalModeSelector from "./RenewalModeSelector";

import PlanCard from "../common/PlanCard";

import type {
    AvailablePlan,
    CurrentSubscription,
    RenewalMode,
} from "../../types/subscription";

import type {
    RenewalConfiguration as RenewalConfigurationState,
} from "../../types/renewal";

interface RenewalConfigurationProps {

    subscription: CurrentSubscription;

    plans: AvailablePlan[];

    configuration: RenewalConfigurationState;

    selectedPlan: AvailablePlan | null;

    onPlanChange(
        planId: number,
    ): void;

    onModeChange(
        mode: RenewalMode,
    ): void;

    onNotesChange(
        notes: string,
    ): void;

}

export default function RenewalConfiguration({

    subscription,

    plans,

    configuration,

    selectedPlan,

    onPlanChange,

    onModeChange,

    onNotesChange,

}: RenewalConfigurationProps) {

    return (

        <div className="space-y-6">

            <CurrentSubscriptionCard
                subscription={subscription}
            />

            <RenewalModeSelector
                value={configuration.mode}
                onChange={onModeChange}
            />

            <section className="space-y-4">

                <div>

                    <h3 className="text-lg font-semibold text-gray-900">
                        Select Renewal Plan
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Choose the subscription plan that will be applied during
                        renewal.
                    </p>

                </div>

                <div className="grid gap-4">

                    {plans.map((plan) => (

                        <PlanCard
                            key={plan.id}
                            
                            plan={plan}
                            selected={
                                selectedPlan?.id === plan.id
                            }
                            onSelect={() =>
                                onPlanChange(plan.id)
                            }
                        />

                       

                    ))}

                </div>

            </section>

            <section className="space-y-2">

                <h3 className="text-lg font-semibold text-gray-900">
                    Internal Notes
                </h3>

                <textarea
                    rows={4}
                    value={configuration.notes}
                    onChange={(event) =>
                        onNotesChange(
                            event.target.value,
                        )
                    }
                    placeholder="Optional notes for this renewal..."
                    className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        px-3
                        py-2
                        text-sm
                        shadow-sm
                        focus:border-blue-500
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20
                    "
                />

            </section>

        </div>

    );

}