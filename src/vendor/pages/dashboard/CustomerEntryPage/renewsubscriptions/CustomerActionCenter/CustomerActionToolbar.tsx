import CustomerActionButton from "./CustomerActionButton";

import {

    listCustomerActions,

    type CustomerActionType,

} from "./actionRegistry";

interface CustomerActionToolbarProps {

    active?: CustomerActionType;

    busyAction?: CustomerActionType;

    className?: string;

    onSelect(

        action: CustomerActionType,

    ): void;

}

export default function CustomerActionToolbar({

    active,

    busyAction,

    className = "",

    onSelect,

}: CustomerActionToolbarProps) {

    const actions =

        listCustomerActions();

    return (

        <div

            className={`
                grid
                gap-3
                sm:grid-cols-2
                xl:grid-cols-3
                ${className}
            `}

        >

            {actions.map(

                action => (

                    <CustomerActionButton

                        key={action.type}

                        action={action.type}

                        active={

                            active ===

                            action.type

                        }

                        loading={

                            busyAction ===

                            action.type

                        }

                        onClick={onSelect}

                    />

                ),

            )}

        </div>

    );

}