import {
    CreditCard,
    CheckCircle2,
    XCircle,
    Clock3,
} from "lucide-react";

import type { Payment } from "../../payments/components/types/types";

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
                        className="text-green-600"
                        size={18}
                    />
                );

            case "failed":

                return (
                    <XCircle
                        className="text-red-500"
                        size={18}
                    />
                );

            default:

                return (
                    <Clock3
                        className="text-yellow-500"
                        size={18}
                    />
                );

        }

    };

    return (

        <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700 last:border-0">

            <div className="flex gap-3">

                <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2">

                    <CreditCard
                        size={18}
                    />

                </div>

                <div>

                    <h4 className="font-semibold">

                        KES {Number(payment.amount).toLocaleString()}

                    </h4>

                    <p className="text-sm text-slate-500">

                        {payment.payment_method}

                        {payment.plan_name && (
                            <> • {payment.plan_name}</>
                        )}

                    </p>

                </div>

            </div>

            <div className="text-right">

                <div className="flex justify-end">

                    {statusIcon()}

                </div>

                <p className="text-sm text-slate-500 mt-1">

                    {new Date(
                        payment.created_at
                    ).toLocaleString()}

                </p>

            </div>

        </div>

    );

}