import type {

    AvailablePlan,
    CurrentSubscription,
    RenewalMode,
    RenewalPreview,
    RenewalSummary,
    RenewSubscriptionPayload,
    SubscriptionChange,

} from "./subscription";

/* =====================================================
 * Renewal Configuration
 * ===================================================== */

export interface RenewalConfiguration {

    /**
     * Selected plan.
     */
    planId: number | null;

    /**
     * Renewal strategy.
     */
    mode: RenewalMode;

    /**
     * Internal notes.
     */
    notes: string;

}

/* =====================================================
 * Complete Renewal Model
 * ===================================================== */

export interface Renewal {

    /**
     * Payload sent to backend.
     */
    payload: RenewSubscriptionPayload;

    /**
     * Preview shown to the user.
     */
    preview: RenewalPreview;

    /**
     * Summary displayed in footer.
     */
    summary: RenewalSummary;

    /**
     * Human-readable changes.
     */
    changes: SubscriptionChange[];

}

/* =====================================================
 * useRenewal Return Type
 * ===================================================== */

export interface UseRenewalResult {

    subscription: CurrentSubscription | null;

    plans: AvailablePlan[];

    selectedPlan: AvailablePlan | null;

    configuration: RenewalConfiguration;

    renewal: Renewal | null;

    hasChanges: boolean;

    canSubmit: boolean;

    setPlan(planId: number): void;

    setMode(mode: RenewalMode): void;

    setNotes(notes: string): void;

}