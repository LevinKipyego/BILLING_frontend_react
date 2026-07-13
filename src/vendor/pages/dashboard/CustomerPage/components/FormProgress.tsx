import { Check } from "lucide-react";

interface Props {
    serviceComplete: boolean;
    networkComplete: boolean;
    customerComplete: boolean;
}

export default function FormProgress({
    serviceComplete,
    networkComplete,
    customerComplete,
}: Props) {

    const steps = [
        {
            title: "Service",
            complete: serviceComplete,
        },
        {
            title: "Network",
            complete: networkComplete,
        },
        {
            title: "Customer",
            complete: customerComplete,
        },
    ];

    return (

        <div className="flex items-center justify-between">

            {steps.map((step, index) => (

                <div
                    key={step.title}
                    className="flex flex-1 items-center"
                >

                    <div className="flex flex-col items-center">

                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition
                            ${
                                step.complete
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-slate-300 bg-white text-slate-500"
                            }`}
                        >

                            {step.complete ? (
                                <Check size={18}/>
                            ) : (
                                index + 1
                            )}

                        </div>

                        <span className="mt-2 text-sm font-medium">
                            {step.title}
                        </span>

                    </div>

                    {index !== steps.length - 1 && (

                        <div
                            className={`mx-4 h-1 flex-1 rounded-full
                            ${
                                step.complete
                                    ? "bg-green-500"
                                    : "bg-slate-200"
                            }`}
                        />

                    )}

                </div>

            ))}

        </div>

    );

}