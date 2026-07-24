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
    RenewalMode,
} from "../types/subscription";

import type {
    RenewalConfiguration,
    UseRenewalResult,
} from "../types/renewal";

export function useRenewal(
    subscription: CurrentSubscription | null,
    plans: AvailablePlan[] = [],
): UseRenewalResult {
    const [
        configuration,
        setConfiguration,
    ] = useState<RenewalConfiguration>({
        planId: null,
        mode: "extend",
        notes: "",
    });

    useEffect(() => {

        if (!subscription) {

            return;

        }

        setConfiguration({

            planId: subscription.plan.id,

            mode: "extend",

            notes: "",

        });

    }, [subscription]);

    const selectedPlan = useMemo(() => {

        if (!subscription) {

            return null;

        }

        const availablePlans = Array.isArray(plans)
            ? plans
            : [];

        return (
            availablePlans.find(
                plan =>
                    plan.id === configuration.planId,
            ) ?? subscription.plan
        );

    }, [
        configuration.planId,
        plans,
        subscription,
    ]);


    console.log({
    subscription,
    plans,
    isArray: Array.isArray(plans),
    });

    const renewal = useMemo(() => {

        if (
            !subscription ||
            !selectedPlan
        ) {

            return null;

        }

        return buildRenewal(
            subscription,
            selectedPlan,
            configuration,
        );

    }, [
        subscription,
        selectedPlan,
        configuration,
    ]);

    const hasChanges = useMemo(() => {

        if (!subscription) {

            return false;

        }

        return (
            configuration.planId !==
                subscription.plan.id ||

            configuration.mode !== "extend" ||

            configuration.notes.trim() !== ""
        );

    }, [
        configuration,
        subscription,
    ]);

    const canSubmit =
        renewal !== null;

    const setPlan = useCallback(
        (planId: number) => {

            setConfiguration(
                current => ({
                    ...current,
                    planId,
                }),
            );

        },
        [],
    );

    const setMode = useCallback(
        (mode: RenewalMode) => {

            setConfiguration(
                current => ({
                    ...current,
                    mode,
                }),
            );

        },
        [],
    );

    const setNotes = useCallback(
        (notes: string) => {

            setConfiguration(
                current => ({
                    ...current,
                    notes,
                }),
            );

        },
        [],
    );

    return {

        subscription,

        plans,

        selectedPlan,

        configuration,

        renewal,

        hasChanges,

        canSubmit,

        setPlan,

        setMode,

        setNotes,

    };

}