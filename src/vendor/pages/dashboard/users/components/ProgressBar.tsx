interface Props {

    value: number;

}

export default function ProgressBar({

    value,

}: Props) {

    const percentage = Math.min(

        100,

        Math.max(0, value)

    );

    return (

        <div className="w-full">

            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">

                <div

                    className="h-full rounded-full bg-blue-600 transition-all duration-500"

                    style={{

                        width: `${percentage}%`

                    }}

                />

            </div>

        </div>

    );

}