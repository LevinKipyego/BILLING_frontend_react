import { useCallback, useEffect, useState } from "react";

import type { UserProfile } from "../components/types/types";
import { fetchUserProfile } from "../services/userProfileApi";

export function useUserProfile(id: number | string) {

    const [profile, setProfile] =
        useState<UserProfile | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const load = useCallback(async () => {

        try {

            setLoading(true);

            setError(null);

            const data = await fetchUserProfile(id);

            setProfile(data);

        }

        catch (err) {

            if (err instanceof Error)
                setError(err.message);
            else
                setError("Unknown error");

        }

        finally {

            setLoading(false);

        }

    }, [id]);

    useEffect(() => {

        load();

    }, [load]);

    return {

        profile,

        loading,

        error,

        reload: load

    };

}