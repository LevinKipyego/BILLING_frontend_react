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
    onPlanChange(planId: number): void;
    onModeChange(mode: RenewalMode): void;
    onNotesChange(notes: string): void;
    className?: string;
}

export default function RenewalConfiguration({
    subscription,
    plans,
    configuration,
    selectedPlan,
    onPlanChange,
    onModeChange,
    onNotesChange,
    className = "",
}: RenewalConfigurationProps) {
    return (
        <div className={`space-y-5 sm:space-y-6 ${className}`}>
            {/* Current Active Subscription Display */}
            <CurrentSubscriptionCard subscription={subscription} />

            {/* Renewal Mode Toggle Selection */}
            <RenewalModeSelector
                value={configuration.mode}
                onChange={onModeChange}
            />

            {/* Available Subscription Plans Selection */}
            <section className="space-y-3 sm:space-y-4">
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Select Renewal Plan
                    </h3>

                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Choose the subscription plan that will be applied during renewal.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            title={plan.name}
                            plan={plan}
                            selected={selectedPlan?.id === plan.id}
                            onSelect={() => onPlanChange(plan.id)}
                        />
                    ))}
                </div>
            </section>

            {/* Optional Operator Notes Textarea */}
            <section className="space-y-2">
                <label 
                    htmlFor="renewal-notes" 
                    className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white"
                >
                    Internal Notes
                </label>

                <textarea
                    id="renewal-notes"
                    rows={3}
                    value={configuration.notes}
                    onChange={(event) => onNotesChange(event.target.value)}
                    placeholder="Optional notes or references for this renewal action..."
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300 dark:border-slate-700
                        bg-white dark:bg-slate-900
                        px-3.5 py-2.5
                        text-xs sm:text-sm
                        text-slate-900 dark:text-white
                        placeholder-slate-400 dark:placeholder-slate-500
                        shadow-sm
                        transition
                        focus:border-blue-500 dark:focus:border-blue-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                    "
                />
            </section>
        </div>
    );
}