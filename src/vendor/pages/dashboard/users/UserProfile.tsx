import { useParams } from "react-router-dom";

import { useUserProfile } from "./hooks/useUserProfile";

import { UserHeader } from "./components/UserHeader";

import UserTabs from "./components/UserTabs";



export default function UserProfile() {

    const { id } = useParams();

    const {

        profile,

        loading,

        error,

        reload,

    } = useUserProfile(id!);

    if (loading)
        return (
            <div className="p-10">
                Loading customer...
            </div>
        );

    if (error)
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

    return (

        <div className="space-y-8 p-6">

            <UserHeader
                user={profile.user}
                overview={profile.overview}
                reload={reload}
            />

            <UserTabs
                profile={profile}
            />

        </div>

    );

}