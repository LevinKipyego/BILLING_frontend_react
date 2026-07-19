import {
    Calendar,
    ArrowRight,
    Clock3,
} from "lucide-react";

interface Props {

    started: string;

    expires: string;

    projected: string;

}

export default function RenewalTimeline({

    started,

    expires,

    projected,

}: Props) {

    const format = (date: string) =>
        new Date(date).toLocaleDateString();

    return (

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <h2 className="font-bold text-lg">

                    Subscription Timeline

                </h2>

            </div>

            <div className="p-8">

                <div className="relative">

                    <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-slate-300 dark:bg-slate-700"/>

                    <TimelineNode

                        icon={<Calendar size={18}/>}

                        title="Subscription Started"

                        date={format(started)}

                    />

                    <TimelineNode

                        icon={<Clock3 size={18}/>}

                        title="Current Expiry"

                        date={format(expires)}

                    />

                    <TimelineNode

                        icon={<ArrowRight size={18}/>}

                        title="Renewed Expiry"

                        date={format(projected)}

                        active

                    />

                </div>

            </div>

        </div>

    );

}

interface NodeProps{

    icon:React.ReactNode;

    title:string;

    date:string;

    active?:boolean;

}

function TimelineNode({

    icon,

    title,

    date,

    active=false,

}:NodeProps){

    return(

        <div className="relative flex gap-4 pb-8">

            <div className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full

                ${active

                    ? "bg-emerald-600 text-white"

                    : "bg-slate-200 dark:bg-slate-700"

                }

            `}>

                {icon}

            </div>

            <div>

                <h4 className="font-semibold">

                    {title}

                </h4>

                <p className="text-sm text-slate-500">

                    {date}

                </p>

            </div>

        </div>

    );

}