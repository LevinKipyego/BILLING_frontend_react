import {
    Copy,
    ExternalLink,
} from "lucide-react";

import StatusBadge from "../../components/StatusBadge";
import CopyButton from "../../components/common/CopyButton";

import type { Payment } from "./types/types";

interface Props {

    payments: Payment[];

}

export default function PaymentTable({

    payments,

}: Props) {

    return (

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">

            <table className="min-w-full">

                <thead className="bg-slate-50 dark:bg-slate-800">

                    <tr>

                        <th className="px-6 py-4 text-left">

                            Date

                        </th>

                        <th className="px-6 py-4 text-left">

                            Plan

                        </th>

                        <th className="px-6 py-4 text-left">

                            Service

                        </th>

                        <th className="px-6 py-4 text-left">

                            Amount

                        </th>

                        <th className="px-6 py-4 text-left">

                            Method

                        </th>

                        <th className="px-6 py-4 text-left">

                            Status

                        </th>

                        <th className="px-6 py-4 text-left">

                            Transaction

                        </th>

                        <th className="px-6 py-4 text-right">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {payments.map((payment) => (

                        <tr

                            key={payment.id}

                            className="border-t"

                        >

                            <td className="px-6 py-4">

                                {new Date(

                                    payment.created_at

                                ).toLocaleDateString()}

                            </td>

                            <td className="px-6 py-4 font-medium">

                                {payment.plan_name}

                            </td>

                            <td className="px-6 py-4">

                                {payment.service}

                            </td>

                            <td className="px-6 py-4 font-semibold text-green-600">

                                KES{" "}

                                {Number(

                                    payment.amount

                                ).toLocaleString()}

                            </td>

                            <td className="px-6 py-4">

                                {payment.payment_method}

                            </td>

                            <td className="px-6 py-4">

                                <StatusBadge

                                    status={payment.status.toLowerCase() as "success" | "failed" | "pending" | "active" | "offline" | "suspended" | "expired" | "online"}

                                />

                            </td>

                            <td className="px-6 py-4">

                                <div className="flex items-center gap-2">

                                    {payment.transaction_id}

                                    <CopyButton

                                        value={payment.transaction_id}

                                    />

                                </div>

                            </td>

                            <td className="px-6 py-4 text-right">

                                <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">

                                    <ExternalLink size={18}/>

                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}