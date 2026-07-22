
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerHeader from "./components/CustomerHeader";
import CreateHotspotCustomerModal from "./modal/CreateHotspotCustomerModal";
import CreatePPPoECustomerModal from "./modal/CreatePPPoECustomerModal";

import CustomerStats from "./components/CustomerStats";
import CustomerTable from "./components/CustomerTable";
import PPPoECreateDrawer, {
    type CreatePPPoEPayload,
} from "./components/PPPoECreateDrawer";
import PPPoEProvisionSuccessModal from "./modal/PppoeProvisionSuccessModal";
import CustomerActionCenter from "./renewsubscriptions/CustomerActionCenter/CustomerActionCenter";

import type { CustomerActionType } from "./renewsubscriptions/CustomerActionCenter/actionRegistry";

import useCustomers from "./hooks/useRenewal";

import type {
    Customer,
    
    PPPoEProvisionResponse,
} from "./types/types";



export default function CustomersPage() {

    const {

        customers,

        stats,

        loading,

        mikrotiks,

        plans,

        refresh,

        createPPPoE,

    } = useCustomers();

    const [

    drawerCustomer,

    setDrawerCustomer,

    ] = useState<Customer | null>(null);

    const [

        actionCustomer,

        setActionCustomer,

    ] = useState<Customer | null>(null);

    const [

        customerAction,

        setCustomerAction,

    ] = useState<CustomerActionType | null>(null);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [successOpen, setSuccessOpen] =
        useState(false);

    const [provisionResult, setProvisionResult] =
    useState<PPPoEProvisionResponse | null>(null);

    const openPPPoEDrawer = (

        customer: Customer,

    ) => {

        setDrawerCustomer(customer);

        setDrawerOpen(true);

    };

    const closeDrawer = () => {

        setDrawerOpen(false);

        setDrawerCustomer(null);

    };

    const closeSuccess = () => {

        setSuccessOpen(false);

        setProvisionResult(null);

        refresh();

    };

    const handleProvision = async (
        payload: CreatePPPoEPayload
        ) => {

            if (!drawerCustomer) {

        return;

}

        const result = await createPPPoE(

            drawerCustomer.id,

            payload,

        );

        if (!result) return;

        setProvisionResult(result);

        setDrawerOpen(false);

        setSuccessOpen(true);

    };
    
    function openCustomerAction(

        customer: Customer,

        action: CustomerActionType,

    ) {

        setActionCustomer(customer);

        setCustomerAction(action);

    }

    function closeCustomerAction() {

        setActionCustomer(null);

        setCustomerAction(null);

    }

    const [search, setSearch] = useState("");

    const [service, setService] = useState("");

    const [status, setStatus] = useState("");

    const [vendor, setVendor] = useState("");

    const [hotspotModalOpen, setHotspotModalOpen] =
        useState(false);

    const [pppoeModalOpen, setPPPoEModalOpen] =
        useState(false);



    
    const filteredCustomers = useMemo(() => {

        return customers.filter(customer => {

            const matchesSearch =
                customer.full_name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                customer.phone.includes(search) ||

                customer.username
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesService =
                !service ||
                customer.service_type === service;

            const matchesStatus =
                !status ||
                customer.session_status === status;

            const matchesVendor =
                !vendor ||
                customer.vendor_name === vendor;

            return (

                matchesSearch &&
                matchesService &&
                matchesStatus &&
                matchesVendor

            );

        });

    }, [

        customers,

        search,

        service,

        status,

        vendor,

    ]);


    const navigate = useNavigate();


    const handleViewCustomer = (

        customer: Customer

    ) => {

        navigate(

            `/dashboard/users/detailed/${customer.id}`

        );

    };

    return (

        <div className="space-y-6">

            <CustomerHeader

                search={search}

                onSearchChange={setSearch}

                service={service}

                onServiceChange={setService}

                status={status}

                onStatusChange={setStatus}

                vendor={vendor}

                onVendorChange={setVendor}

                vendors={[]}

                onCreateHotspot={() =>
                    setHotspotModalOpen(true)
                }

                onCreatePPPoE={() =>
                    setPPPoEModalOpen(true)
                }

            />

            <CustomerStats

                stats={stats}

            />

            <CustomerTable

                customers={filteredCustomers}

                loading={loading}

                onViewCustomer={handleViewCustomer}

                onCreatePPPoE={openPPPoEDrawer}

                onRenewCustomer={(customer) =>

                    openCustomerAction(

                        customer,

                        "renew",

                    )

                }

                onSuspendCustomer={(customer) =>

                    openCustomerAction(

                        customer,

                        "suspend",

                    )

                }

                onDeleteCustomer={(customer) =>

                    openCustomerAction(

                        customer,

                        "delete",

                    )

                }

            />

            {

                drawerCustomer && (

                    <PPPoECreateDrawer

                        open={drawerOpen}

                        onClose={closeDrawer}

                        customer={drawerCustomer}

                        mikrotiks={mikrotiks}

                        plans={plans}

                        loading={loading}

                        onSubmit={handleProvision}

                    />

                )

            }


            {

            actionCustomer &&

            customerAction && (

                <CustomerActionCenter
                    open={customerAction !== null}
                    customer={actionCustomer}
                    action={customerAction}
                    onClose={closeCustomerAction}
                    onCompleted={() => {
                        refresh();
                        closeCustomerAction();
                    }}
                />

            )

        }

            <PPPoEProvisionSuccessModal

                open={successOpen}

                onClose={closeSuccess}

                result={provisionResult}

            />

            <CreateHotspotCustomerModal

                open={hotspotModalOpen}

                onClose={() =>
                    setHotspotModalOpen(false)
                }

            />

        <CreatePPPoECustomerModal

            open={pppoeModalOpen}

            onClose={() =>
                setPPPoEModalOpen(false)
            }

        />

        </div>

    );

}