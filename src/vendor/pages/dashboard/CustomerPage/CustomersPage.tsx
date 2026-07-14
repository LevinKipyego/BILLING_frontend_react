
import { useMemo, useState } from "react";

import CustomerHeader from "./components/CustomerHeader";
import CreateHotspotCustomerModal from "./modal/CreateHotspotCustomerModal";
import CreatePPPoECustomerModal from "./modal/CreatePPPoECustomerModal";

import CustomerStats from "./components/CustomerStats";
import CustomerTable from "./components/CustomerTable";
import PPPoECreateDrawer, {
    type CreatePPPoEPayload,
} from "./components/PPPoECreateDrawer";
import PPPoEProvisionSuccessModal from "./modal/PppoeProvisionSuccessModal";

import useCustomers from "./hooks/useCustomers";

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

    const [selectedCustomer, setSelectedCustomer] =
        useState<Customer | null>(null);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [successOpen, setSuccessOpen] =
        useState(false);

    const [provisionResult, setProvisionResult] =
    useState<PPPoEProvisionResponse | null>(null);

    const openPPPoEDrawer = (
        customer: Customer
    ) => {

        setSelectedCustomer(customer);

        setDrawerOpen(true);

    };

    const closeDrawer = () => {

        setDrawerOpen(false);

        setSelectedCustomer(null);

    };

    const closeSuccess = () => {

        setSuccessOpen(false);

        setProvisionResult(null);

        refresh();

    };

    const handleProvision = async (
        payload: CreatePPPoEPayload
    ) => {

        if (!selectedCustomer) return;

        const result = await createPPPoE(

            selectedCustomer.id,

            payload,

        );

        if (!result) return;

        setProvisionResult(result);

        setDrawerOpen(false);

        setSuccessOpen(true);

    };


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

                onCreatePPPoE={openPPPoEDrawer}

            />

            {

                selectedCustomer && (

                    <PPPoECreateDrawer

                        open={drawerOpen}

                        onClose={closeDrawer}

                        customer={selectedCustomer}

                        mikrotiks={mikrotiks}

                        plans={plans}

                        loading={loading}

                        onSubmit={handleProvision}

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