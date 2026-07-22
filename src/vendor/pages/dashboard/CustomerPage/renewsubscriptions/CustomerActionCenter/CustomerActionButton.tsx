import {
    getCustomerAction,
    type CustomerActionType,
} from "./actionRegistry";

interface CustomerActionButtonProps {

    action: CustomerActionType;

    active?: boolean;

    loading?: boolean;

    onClick(
        action: CustomerActionType,
    ): void;

}

export default function CustomerActionButton({

    action,

    active = false,

    loading = false,

    onClick,

}: CustomerActionButtonProps) {

    const definition =

        getCustomerAction(action);

    const Icon = definition.icon;

    const disabled =

        loading ||

        !definition.enabled;

    return (

        <button

            type="button"

            title={definition.title}

            aria-label={definition.title}

            aria-pressed={active}

            aria-disabled={disabled}

            disabled={disabled}

            onClick={() => onClick(action)}

            className={`
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                px-4
                py-3
                text-left
                transition-all
                duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500
                focus-visible:ring-offset-2

                ${
                    active
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-gray-200 bg-white"
                }

                ${
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm"
                }
            `}
        >

            <div
                className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg

                    ${
                        active
                            ? "bg-blue-100"
                            : "bg-gray-100"
                    }
                `}
            >

                <Icon className="h-5 w-5" />

            </div>

            <div className="min-w-0 flex-1">

                <div className="font-medium">

                    {definition.toolbarLabel}

                </div>

                <div className="mt-0.5 text-xs text-gray-500">

                    {definition.description}

                </div>

            </div>

        </button>

    );

}