import { useParams } from "react-router-dom";

import { useUserProfile } from "./hooks/useUserProfile";
import { updateCustomerProfile } from "./services/userProfileApi";

import {
    UserHeader,
    type EditableUserField,
} from "./components/UserHeader";

import UserTabs from "./components/UserTabs";

export default function UserProfile() {
    const { id } = useParams();

    const {
        profile,
        loading,
        error,
        reload,
    } = useUserProfile(id!);

    if (loading && !profile)
        return (
            <div className="p-10">
                Loading customer...
            </div>
        );

    if (error && !profile)
        return (
            <div className="p-10 text-red-600">
                {error}
            </div>
        );

    if (!profile)
        return (
            <div className="p-10">
                Customer not found.
            </div>
        );

    const handleSaveField = async (
        field: EditableUserField,
        value: string | boolean | null,
    ) => {
        await updateCustomerProfile(profile.user.id, {
            [field]: value,
        });
    };

    return (
        <div className="space-y-8 p-6">
            <UserHeader
                user={profile.user}
                overview={profile.overview}
                reload={reload}
                onSaveField={handleSaveField}
                reloadAfterSave={false}
            />

            <UserTabs
                profile={profile}
                reload={reload}
            />
        </div>
    );
}