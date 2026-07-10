import type { FC } from "react";

import {
    Play,
    Pause,
    RefreshCw,
    KeyRound,
    Trash2,
    Plus,
} from "lucide-react";

import type { UserProfile } from "../../../components/types/types";

interface Props {

    profile: UserProfile;

}

const ActionButton = ({

    icon,

    title,

    description,

    color,

    onClick,

}: {

    icon: React.ReactNode;

    title: string;

    description: string;

    color: string;

    onClick: () => void;

}) => (

    <button
        onClick={onClick}
        className="flex w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
    >

        <div
            className={`rounded-xl p-3 ${color}`}
        >
            {icon}
        </div>

        <div>

            <h3 className="font-semibold">

                {title}

            </h3>

            <p className="mt-1 text-sm text-slate-500">

                {description}

            </p>

        </div>

    </button>

);

const PPPoEQuickActions: FC<Props> = ({ profile }) => {

    const credential = profile.pppoe.credential;

    return (

        <section className="space-y-5">

            <div>

                <h2 className="text-xl font-bold">

                    Quick Actions

                </h2>

                <p className="text-sm text-slate-500">

                    Manage the customer's PPPoE service.

                </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                <ActionButton

                    icon={<Play size={20} className="text-green-700" />}

                    color="bg-green-100"

                    title="Activate Service"

                    description="Enable the customer's PPPoE account."

                    onClick={() => {

                        console.log("Activate", credential?.id);

                    }}

                />

                <ActionButton

                    icon={<Pause size={20} className="text-yellow-700" />}

                    color="bg-yellow-100"

                    title="Suspend Service"

                    description="Temporarily suspend internet access."

                    onClick={() => {

                        console.log("Suspend", credential?.id);

                    }}

                />

                <ActionButton

                    icon={<RefreshCw size={20} className="text-blue-700" />}

                    color="bg-blue-100"

                    title="Renew Subscription"

                    description="Renew or extend the current package."

                    onClick={() => {

                        console.log("Renew");

                    }}

                />

                <ActionButton

                    icon={<KeyRound size={20} className="text-purple-700" />}

                    color="bg-purple-100"

                    title="Reset Password"

                    description="Generate a new PPPoE password."

                    onClick={() => {

                        console.log("Reset Password");

                    }}

                />

                <ActionButton

                    icon={<Plus size={20} className="text-cyan-700" />}

                    color="bg-cyan-100"

                    title="Assign Package"

                    description="Assign a new PPPoE plan."

                    onClick={() => {

                        console.log("Assign Package");

                    }}

                />

                <ActionButton

                    icon={<Trash2 size={20} className="text-red-700" />}

                    color="bg-red-100"

                    title="Delete Credential"

                    description="Remove the PPPoE account."

                    onClick={() => {

                        console.log("Delete");

                    }}

                />

            </div>

        </section>

    );

};

export default PPPoEQuickActions;