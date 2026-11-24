import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { buildRenewal } from "../utils/buildRenewal";

import type {
    AvailablePlan,
    CurrentSubscription,
} from "../types/subscription";

import type { RenewalMode } from "../types/subscription";

import type {
    RenewalConfiguration,
    UseRenewalResult,
} from "../types/renewal";

type ExtendedRenewalConfiguration = RenewalConfiguration & {
    planId?: number | null;
    mode: RenewalMode;
    notes: string;
    custom_minutes?: number;
    duration_minutes?: number;
};

const DEFAULT_CUSTOM_MINUTES = 60;

export function useRenewal(
    subscription: CurrentSubscription | null,
    plans: AvailablePlan[] = [],
): UseRenewalResult & {
    customMinutes: number;
    setCustomMinutes(minutes: number): void;
} {
    const [configuration, setConfiguration] = useState<ExtendedRenewalConfiguration>({
        planId: null,
        mode: "extend",
        notes: "",
        custom_minutes: DEFAULT_CUSTOM_MINUTES,
        duration_minutes: DEFAULT_CUSTOM_MINUTES,
    });

    useEffect(() => {
        if (!subscription) {
            return;
        }

        setConfiguration((prev) => ({
            ...prev,
            planId: subscription.plan?.id ?? null,
            mode: "extend",
            notes: "",
            custom_minutes:
                typeof prev.custom_minutes === "number" && prev.custom_minutes > 0
                    ? prev.custom_minutes
                    : DEFAULT_CUSTOM_MINUTES,
            duration_minutes:
                typeof prev.custom_minutes === "number" && prev.custom_minutes > 0
                    ? prev.custom_minutes
                    : DEFAULT_CUSTOM_MINUTES,
        }));
    }, [subscription]);

    const selectedPlan = useMemo(() => {
        if (!subscription) {
            return null;
        }

        const availablePlans = Array.isArray(plans) ? plans : [];
        const targetPlanId = configuration.planId ?? subscription.plan?.id ?? null;

        return (
            availablePlans.find((plan) => String(plan.id) === String(targetPlanId)) ??
            subscription.plan ??
            null
        );
    }, [configuration.planId, plans, subscription]);

    const customMinutes = useMemo(() => {
        const raw = configuration.custom_minutes ?? configuration.duration_minutes;
        const parsed = Number(raw);
        return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
    }, [configuration.custom_minutes, configuration.duration_minutes]);

    const renewal = useMemo(() => {
        if (!subscription || !selectedPlan) {
            return null;
        }

        return buildRenewal(subscription, selectedPlan, {
            ...configuration,
            custom_minutes: customMinutes,
        });
    }, [subscription, selectedPlan, configuration, customMinutes]);

    const hasChanges = useMemo(() => {
        if (!subscription) {
            return false;
        }

        return (
            configuration.planId !== subscription.plan?.id ||
            configuration.mode !== "extend" ||
            configuration.notes.trim() !== "" ||
            customMinutes !== DEFAULT_CUSTOM_MINUTES
        );
    }, [configuration, subscription, customMinutes]);

    const canSubmit = useMemo(() => {
        if (!renewal || !subscription) {
            return false;
        }

        if (configuration.mode === "custom") {
            return customMinutes > 0;
        }

        if (configuration.mode === "wallet") {
            const wallet = Number(subscription.walletbalance ?? 0);
            const price = Number(subscription.plan?.price ?? selectedPlan?.price ?? 0);
            const mins = Number(
                subscription.plan?.duration_minutes ?? selectedPlan?.duration_minutes ?? 0,
            );
            return wallet > 0 && price > 0 && mins > 0;
        }

        return Boolean(selectedPlan);
    }, [renewal, subscription, configuration.mode, customMinutes, selectedPlan]);

    const setPlan = useCallback((planId: number | null) => {
        setConfiguration((current) => ({
            ...current,
            planId,
        }));
    }, []);

    const setMode = useCallback((mode: RenewalMode) => {
        setConfiguration((current) => ({
            ...current,
            mode,
        }));
    }, []);

    const setNotes = useCallback((notes: string) => {
        setConfiguration((current) => ({
            ...current,
            notes,
        }));
    }, []);

    const setCustomMinutes = useCallback((minutes: number) => {
        const sanitized = Math.max(0, Math.floor(Number.isFinite(minutes) ? minutes : 0));
        setConfiguration((current) => ({
            ...current,
            custom_minutes: sanitized,
            duration_minutes: sanitized,
        }));
    }, []);

    return {
        subscription,
        plans,
        selectedPlan,
        configuration: configuration as RenewalConfiguration,
        renewal,
        hasChanges,
        canSubmit,
        customMinutes,
        setPlan: setPlan as UseRenewalResult["setPlan"],
        setMode: setMode as UseRenewalResult["setMode"],
        setNotes,
        setCustomMinutes,
    };
}