import type { ReactNode } from "react";

interface Props {

    title: string;

    description: string;

    icon: ReactNode;

    color?: string;

    onClick?: () => void;

    disabled?: boolean;

}

export default function QuickActionCard({

    title,

    description,

    icon,

    color = "bg-blue-600",

    onClick,

    disabled = false,

}: Props) {

    return (

        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full rounded-2xl border border-slate-200 dark:border-slate-700
                        bg-white dark:bg-slate-900 p-5 text-left
                        transition hover:shadow-lg hover:-translate-y-1
                        disabled:opacity-50 disabled:cursor-not-allowed`}
        >

            <div className={`${color} h-12 w-12 rounded-xl flex items-center justify-center text-white`}>

                {icon}

            </div>

            <h3 className="mt-5 font-bold">

                {title}

            </h3>

            <p className="mt-2 text-sm text-slate-500">

                {description}

            </p>

        </button>

    );

}