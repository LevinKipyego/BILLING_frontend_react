import {

    Calendar,

    CreditCard,

    Hash,

    Wallet,

    Wifi,

} from "lucide-react";

import StatusBadge from "../../components/StatusBadge";
import InfoRow from "../../components/InfoRow";

import type { Payment } from "./types/types";

interface Props {

    payment: Payment;

}

export default function PaymentCard({

    payment,

}: Props) {

    return (

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                <div>

                    <h3 className="text-lg font-semibold">

                        {payment.plan_name}

                    </h3>

                    <p className="mt-1 text-sm text-slate-500">

                        {payment.service}

                    </p>

                </div>

                <StatusBadge
                    status={payment.status.toLowerCase() as "success" | "failed" | "pending" | "active" | "offline" | "suspended" | "expired" | "online"}
                />

            </div>

            {/* Body */}

            <div className="space-y-6 p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-slate-500">

                            Amount Paid

                        </p>

                        <p className="mt-1 text-3xl font-bold text-green-600">

                            KES {Number(payment.amount).toLocaleString()}

                        </p>

                    </div>

                    <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">

                        <Wallet

                            size={28}

                            className="text-blue-600"

                        />

                    </div>

                </div>

                <div className="grid gap-4 md:grid-cols-2">

                    <InfoRow

                        icon={<Hash size={16}/>}

                        label="Transaction"

                        value={payment.transaction_id}

                    />

                    <InfoRow

                        icon={<CreditCard size={16}/>}

                        label="Method"

                        value={payment.payment_method}

                    />

                    <InfoRow

                        icon={<Wifi size={16}/>}

                        label="Service"

                        value={payment.service}

                    />

                    <InfoRow

                        icon={<Calendar size={16}/>}

                        label="Paid On"

                        value={

                            new Date(

                                payment.created_at

                            ).toLocaleString()

                        }

                    />

                    <InfoRow

                        icon={<Hash size={16}/>}

                        label="Reference"

                        value={

                            payment.reference ||

                            "-"

                        }

                    />

                </div>

            </div>

        </div>

    );

}