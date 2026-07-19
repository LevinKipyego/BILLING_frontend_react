import {
    CalendarDays,
    
    Database,
    Router,
    ShieldCheck,
} from "lucide-react";

interface Props {

    daysAdded: number;

    radiusSync: boolean;

    activate: boolean;

    disconnectSession: boolean;

}

export default function RenewalImpactCard({

    daysAdded,

    radiusSync,

    activate,

    disconnectSession,

}: Props) {

    const items = [

        {
            icon: <CalendarDays size={18} />,
            title: `${daysAdded} Day${daysAdded !== 1 ? "s" : ""} Added`,
            description: "Subscription duration will be extended.",
        },

        {
            icon: <ShieldCheck size={18} />,
            title: activate
                ? "Customer will remain active"
                : "Subscription created inactive",
            description: "Activation behaviour.",
        },

        {
            icon: <Database size={18} />,
            title: radiusSync
                ? "Radius Synchronization"
                : "Radius Sync Disabled",
            description: "Authentication server update.",
        },

        {
            icon: <Router size={18} />,
            title: disconnectSession
                ? "Reconnect Required"
                : "Current Session Preserved",
            description: "Online customer behaviour.",
        },

    ];

    return (

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <div className="border-b px-6 py-5">

                <h2 className="font-bold text-lg">

                    Renewal Impact

                </h2>

            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">

                {items.map(item => (

                    <div
                        key={item.title}
                        className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                    >

                        <div className="flex items-center gap-3">

                            {item.icon}

                            <div>

                                <h4 className="font-semibold">

                                    {item.title}

                                </h4>

                                <p className="text-xs text-slate-500">

                                    {item.description}

                                </p>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}