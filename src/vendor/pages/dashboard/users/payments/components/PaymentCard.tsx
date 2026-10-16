import {
    Calendar,
    CreditCard,
    Hash,
    Wallet,
    Wifi,
} from "lucide-react";

import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";
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
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sm:py-5 gap-3">
                <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
                        {payment.plan_name}
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                        {payment.service}
                    </p>
                </div>

                <div className="shrink-0">
                    <StatusBadge
                        status={payment.status.toLowerCase() as "success" | "failed" | "pending" | "active" | "offline" | "suspended" | "expired" | "online"}
                    />
                </div>
            </div>

            {/* Body */}
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Amount Paid
                        </p>
                        <p className="mt-0.5 text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                            KES {Number(payment.amount).toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-blue-100 p-2.5 sm:p-4 dark:bg-blue-900/30 shrink-0">
                        <Wallet
                            size={22}
                            className="text-blue-600 dark:text-blue-400 sm:w-7 sm:h-7"
                        />
                    </div>
                </div>

                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                    <InfoRow
                        icon={<Hash size={15} className="shrink-0" />}
                        label="Transaction"
                        value={payment.transaction_id}
                    />

                    <InfoRow
                        icon={<CreditCard size={15} className="shrink-0" />}
                        label="Method"
                        value={payment.payment_method}
                    />

                    <InfoRow
                        icon={<Wifi size={15} className="shrink-0" />}
                        label="Service"
                        value={payment.service}
                    />

                    <InfoRow
                        icon={<Calendar size={15} className="shrink-0" />}
                        label="Paid On"
                        value={formatDate(payment.created_at)}
                    />

                    <InfoRow
                        icon={<Hash size={15} className="shrink-0" />}
                        label="Reference"
                        value={payment.reference || "-"}
                    />
                </div>
            </div>
        </div>
    );
}

