
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

    const navigate = useNavigate();

    // ============================================================
    // CUSTOMER DATA
    // ============================================================

    const {
        customers,
        stats,
        loading,
        mikrotiks,
        plans,
        refresh,
        createPPPoE,
    } = useCustomers();


    // ============================================================
    // CUSTOMER DRAWER / ACTION STATE
    // ============================================================

    const [drawerCustomer, setDrawerCustomer] =
        useState<Customer | null>(null);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [actionCustomer, setActionCustomer] =
        useState<Customer | null>(null);

    const [customerAction, setCustomerAction] =
        useState<CustomerActionType | null>(null);


    // ============================================================
    // PPPOE PROVISIONING STATE
    // ============================================================

    const [successOpen, setSuccessOpen] =
        useState(false);

    const [provisionResult, setProvisionResult] =
        useState<PPPoEProvisionResponse | null>(null);


    // ============================================================
    // CREATE MODAL STATE
    // ============================================================

    const [hotspotModalOpen, setHotspotModalOpen] =
        useState(false);

    const [pppoeModalOpen, setPPPoEModalOpen] =
        useState(false);


    // ============================================================
    // FILTER STATE
    // ============================================================

    const [search] = useState("");
    const [service] = useState("");
    const [status] = useState("");
    const [vendor] = useState("");


    // ============================================================
    // PPPOE DRAWER
    // ============================================================

    const openPPPoEDrawer = (customer: Customer) => {
        setDrawerCustomer(customer);
        setDrawerOpen(true);
    };


    const closeDrawer = () => {
        setDrawerOpen(false);
        setDrawerCustomer(null);
    };


    // ============================================================
    // PPPOE PROVISION
    // ============================================================

    const handleProvision = async (
        payload: CreatePPPoEPayload
    ) => {

        if (!drawerCustomer) {
            return;
        }

        const result = await createPPPoE(
            drawerCustomer.id,
            payload
        );

        if (!result) {
            return;
        }

        setProvisionResult(result);

        setDrawerOpen(false);

        setSuccessOpen(true);
    };


    // ============================================================
    // PROVISION SUCCESS
    // ============================================================

    const closeSuccess = async () => {

        setSuccessOpen(false);

        setProvisionResult(null);

        // Refresh customer list and statistics
        // after successful provisioning.
        await refresh();
    };


    // ============================================================
    // CUSTOMER ACTION CENTER
    // ============================================================

    const openCustomerAction = (
        customer: Customer,
        action: CustomerActionType
    ) => {

        setActionCustomer(customer);

        setCustomerAction(action);
    };


    const closeCustomerAction = () => {

        setActionCustomer(null);

        setCustomerAction(null);
    };


    const handleCustomerActionCompleted = async () => {

        // Refresh FIRST so the table contains the
        // latest customer state.
        await refresh();

        // Then close the action center.
        closeCustomerAction();
    };


    // ============================================================
    // HOTSPOT CREATE MODAL
    // ============================================================

    const openHotspotModal = () => {
        setHotspotModalOpen(true);
    };


    const closeHotspotModal = async () => {

        setHotspotModalOpen(false);

        // Refresh after create/update/delete performed
        // inside the modal.
        await refresh();
    };


    // ============================================================
    // PPPOE CREATE MODAL
    // ============================================================

    const openPPPoEModal = () => {
        setPPPoEModalOpen(true);
    };


    const closePPPoEModal = async () => {

        setPPPoEModalOpen(false);

        // Refresh after create/update performed
        // inside the modal.
        await refresh();
    };


    // ============================================================
    // FILTERED CUSTOMERS
    // ============================================================

    const filteredCustomers = useMemo(() => {

        const normalizedSearch =
            search.trim().toLowerCase();

        return customers.filter((customer) => {

            const matchesSearch =
                !normalizedSearch ||

                customer.full_name
                    .toLowerCase()
                    .includes(normalizedSearch) ||

                customer.phone
                    .toLowerCase()
                    .includes(normalizedSearch) ||

                customer.username
                    .toLowerCase()
                    .includes(normalizedSearch);


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


    // ============================================================
    // VIEW CUSTOMER
    // ============================================================

    const handleViewCustomer = (
        customer: Customer
    ) => {

        navigate(
            `/dashboard/users/detailed/${customer.id}`
        );
    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <div className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <CustomerHeader
                onCreateHotspot={openHotspotModal}
                onCreatePPPoE={openPPPoEModal}
            />


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <CustomerStats
                stats={stats}
            />


            {/* ==================================================
                CUSTOMER TABLE
            ================================================== */}

            <CustomerTable

                customers={filteredCustomers}

                loading={loading}

                onViewCustomer={
                    handleViewCustomer
                }

                onCreatePPPoE={
                    openPPPoEDrawer
                }

                onRenewCustomer={(customer) =>
                    openCustomerAction(
                        customer,
                        "renew"
                    )
                }

                onSuspendCustomer={(customer) =>
                    openCustomerAction(
                        customer,
                        "suspend"
                    )
                }

                onDeleteCustomer={(customer) =>
                    openCustomerAction(
                        customer,
                        "delete"
                    )
                }
            />


            {/* ==================================================
                PPPOE PROVISION DRAWER
            ================================================== */}

            {drawerCustomer && (

                <PPPoECreateDrawer

                    open={drawerOpen}

                    onClose={closeDrawer}

                    customer={drawerCustomer}

                    mikrotiks={mikrotiks}

                    plans={plans}

                    loading={loading}

                    onSubmit={handleProvision}
                />
            )}


            {/* ==================================================
                CUSTOMER ACTION CENTER
            ================================================== */}

            {actionCustomer && customerAction && (

                <CustomerActionCenter

                    open={customerAction !== null}

                    customer={actionCustomer}

                    action={customerAction}

                    onClose={
                        closeCustomerAction
                    }

                    onCompleted={
                        handleCustomerActionCompleted
                    }
                />
            )}


            {/* ==================================================
                PPPOE PROVISION SUCCESS
            ================================================== */}

            <PPPoEProvisionSuccessModal

                open={successOpen}

                onClose={closeSuccess}

                result={provisionResult}
            />


            {/* ==================================================
                CREATE HOTSPOT CUSTOMER
            ================================================== */}

            <CreateHotspotCustomerModal

                open={hotspotModalOpen}

                onClose={
                    closeHotspotModal
                }
            />


            {/* ==================================================
                CREATE PPPOE CUSTOMER
            ================================================== */}

            <CreatePPPoECustomerModal

                open={pppoeModalOpen}

                onClose={
                    closePPPoEModal
                }
            />

        </div>
    );
}
