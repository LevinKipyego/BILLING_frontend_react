import { useState } from "react";

import CustomerStats from "./components/CustomerStats";
import CustomerTable from "./components/CustomerTable";
import PPPoECreateDrawer, {
    type CreatePPPoEPayload,
} from "./components/PPPoECreateDrawer";
import PPPoEProvisionSuccessModal from "./components/PPPoEProvisionSuccessModal";

import useCustomers from "./hooks/useCustomers";

import type {
    Customer,
    PPPoEProvisionResult,
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
        useState<PPPoEProvisionResult | null>(null);

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

    return (

        <div className="space-y-6">

            <CustomerStats

                stats={stats}

            />

            <CustomerTable

                customers={customers}

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

        </div>

    );

}