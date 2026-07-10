import { apiFetch } from "../../../../api/client";
import type { UserProfile } from "../components/types/types";

export const fetchUserProfile = (
    id: number | string
): Promise<UserProfile> =>
    apiFetch(`/customer-profiles/${id}/profile/`);