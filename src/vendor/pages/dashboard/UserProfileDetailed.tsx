import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../api/client";

interface UserProfileData {
    user: any;
    active_hotspot: any;
    hotspot_history: any[];
    active_pppoe: any;
    pppoe_history: any[];
}

export default function UserProfile() {

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [profile, setProfile] =
        useState<UserProfileData | null>(null);

    useEffect(() => {

        const load = async () => {

            try {

                const response = await apiFetch(
                    `/users/${id}/profile/`
                );

                const data = await response.json();

                setProfile(data);

            } finally {

                setLoading(false);

            }

        };

        load();

    }, [id]);

    if (loading)
        return <div>Loading...</div>;

    if (!profile)
        return <div>User not found</div>;

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">
                    {profile.user.full_name}
                </h1>

                <p>{profile.user.phone}</p>

                <p>{profile.user.email}</p>

            </div>

            <div className="rounded-xl border p-6">

                <h2 className="font-bold mb-4">
                    Active Hotspot Subscription
                </h2>

                {profile.active_hotspot ? (

                    <div>

                        <p>
                            Plan:
                            {" "}
                            {profile.active_hotspot.plan_name}
                        </p>

                        <p>
                            Username:
                            {" "}
                            {profile.active_hotspot.username}
                        </p>

                        <p>
                            Started:
                            {" "}
                            {profile.active_hotspot.start_at}
                        </p>

                        <p>
                            Ends:
                            {" "}
                            {profile.active_hotspot.end_at}
                        </p>

                    </div>

                ) : (

                    <p>No active hotspot subscription.</p>

                )}

            </div>

            <div className="rounded-xl border p-6">

                <h2 className="font-bold mb-4">
                    Active PPPoE Subscription
                </h2>

                {profile.active_pppoe ? (

                    <div>

                        <p>
                            Plan:
                            {" "}
                            {profile.active_pppoe.plan_name}
                        </p>

                        <p>
                            Username:
                            {" "}
                            {profile.active_pppoe.username}
                        </p>

                        <p>
                            Started:
                            {" "}
                            {profile.active_pppoe.start_at}
                        </p>

                        <p>
                            Ends:
                            {" "}
                            {profile.active_pppoe.end_at}
                        </p>

                    </div>

                ) : (

                    <p>No active PPPoE subscription.</p>

                )}

            </div>

            <div className="rounded-xl border p-6">

                <h2 className="font-bold mb-4">
                    Hotspot History
                </h2>

                <table className="w-full">

                    <thead>

                        <tr>

                            <th>Plan</th>

                            <th>Start</th>

                            <th>End</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {profile.hotspot_history.map(sub => (

                            <tr key={sub.id}>

                                <td>{sub.plan_name}</td>

                                <td>{sub.start_at}</td>

                                <td>{sub.end_at}</td>

                                <td>

                                    {sub.active
                                        ? "Active"
                                        : "Expired"}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}