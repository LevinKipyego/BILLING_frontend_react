import {
    CreditCard,
    CheckCircle2,
    XCircle,
    Clock3,
} from "lucide-react";

import type { Payment } from "../../payments/components/types/types";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";

interface Props {
    payment: Payment;
}

export default function PaymentItem({
    payment,
}: Props) {
    const statusIcon = () => {
        switch (payment.status.toLowerCase()) {
            case "completed":
                return (
                    <CheckCircle2
                        className="text-green-600 dark:text-green-400 shrink-0"
                        size={16}
                    />
                );

            case "failed":
                return (
                    <XCircle
                        className="text-red-500 dark:text-red-400 shrink-0"
                        size={16}
                    />
                );

            default:
                return (
                    <Clock3
                        className="text-yellow-500 dark:text-yellow-400 shrink-0"
                        size={16}
                    />
                );
        }
    };

    return (
        <div className="flex items-center justify-between gap-3 py-2.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 last:border-0 min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2 text-blue-600 dark:text-blue-400 shrink-0">
                    <CreditCard
                        size={16}
                        className="sm:w-[18px] sm:h-[18px]"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        KES {Number(payment.amount).toLocaleString()}
                    </h4>

                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        <span>{payment.payment_method}</span>
                        {payment.plan_name && (
                            <span className="ml-1 text-slate-400 dark:text-slate-500">
                                • {payment.plan_name}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <div className="text-right shrink-0">
                <div className="flex justify-end">
                    {statusIcon()}
                </div>

                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {formatDate(payment.created_at)}
                </p>
            </div>
        </div>
    );
}