
import { apiFetch } from "../../../../api/client";

import type { UserProfile } from "../components/types/types";

export async function fetchUserProfile(
    id: number | string
): Promise<UserProfile> {

    const response = await apiFetch(
        `/customer-profiles/${id}/profile/`
    );

    if (!response.ok) {

        throw new Error("Failed to load profile");

    }

    return await response.json();

}