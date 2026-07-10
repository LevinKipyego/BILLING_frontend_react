import { useMemo, useState } from "react";

import PaymentSummary from "./components/PaymentSummary";
import PaymentFilter from "./components/PaymentFilter";
import PaymentList from "./components/PaymentList";

import type {
    
    UserProfile,
} from "../components/types/types";
import type { Payment } from "./components/types/types";

interface Props {

    profile: UserProfile;

}

export default function PaymentsTab({

    profile,

}: Props) {

    const [search, setSearch] = useState("");

    const [service, setService] = useState("");

    const [status, setStatus] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("");

    const filteredPayments = useMemo(() => {

        return profile.payments.filter((payment: Payment) => {

            // ----------------------------------------
            // SEARCH
            // ----------------------------------------

            const query = search.toLowerCase();

            const matchesSearch =

                search === "" ||

                payment.transaction_id
                    .toLowerCase()
                    .includes(query) ||

                payment.reference
                    .toLowerCase()
                    .includes(query) ||

                payment.plan_name
                    .toLowerCase()
                    .includes(query);

            // ----------------------------------------
            // SERVICE
            // ----------------------------------------

            const matchesService =

                service === "" ||

                payment.service === service;

            // ----------------------------------------
            // STATUS
            // ----------------------------------------

            const matchesStatus =

                status === "" ||

                payment.status === status;

            // ----------------------------------------
            // PAYMENT METHOD
            // ----------------------------------------

            const matchesMethod =

                paymentMethod === "" ||

                payment.payment_method === paymentMethod;

            return (

                matchesSearch &&

                matchesService &&

                matchesStatus &&

                matchesMethod

            );

        });

    }, [

        profile.payments,

        search,

        service,

        status,

        paymentMethod,

    ]);

    return (

        <div className="space-y-6">

            <PaymentSummary

                overview={profile.overview}

            />

            <PaymentFilter

                search={search}

                service={service}

                status={status}

                paymentMethod={paymentMethod}

                onSearchChange={setSearch}

                onServiceChange={setService}

                onStatusChange={setStatus}

                onPaymentMethodChange={setPaymentMethod}

            />

            <PaymentList
                payments={filteredPayments}
                totalPayments={profile.payments.length}
            />

        </div>

    );

}