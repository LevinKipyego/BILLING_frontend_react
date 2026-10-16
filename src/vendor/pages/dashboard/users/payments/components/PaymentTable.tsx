import {
    ExternalLink,
} from "lucide-react";

import StatusBadge from "../../components/StatusBadge";
import CopyButton from "../../components/common/CopyButton";
import { formatDate } from "../../../CustomerEntryPage/renewsubscriptions/utils/date";
import type { Payment } from "./types/types";

interface Props {
    payments: Payment[];
}

export default function PaymentTable({
    payments,
}: Props) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/40">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <th className="px-4 py-3 whitespace-nowrap">
                            Date
                        </th>

                        <th className="px-4 py-3 whitespace-nowrap">
                            Plan
                        </th>

                        <th className="px-4 py-3 whitespace-nowrap">
                            Service
                        </th>

                        <th className="px-4 py-3 whitespace-nowrap">
                            Amount
                        </th>

                        <th className="px-4 py-3 whitespace-nowrap">
                            Method
                        </th>

                        <th className="px-4 py-3 whitespace-nowrap">
                            Status
                        </th>

                        <th className="px-4 py-3 whitespace-nowrap">
                            Transaction
                        </th>

                        <th className="px-4 py-3 text-right whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    {payments.map((payment) => (
                        <tr
                            key={payment.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                            <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                                {formatDate(payment.created_at)}
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-slate-900 dark:text-white">
                                {payment.plan_name}
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap">
                                <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                                    {payment.service}
                                </span>
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap font-bold text-green-600 dark:text-green-400">
                                KES{" "}
                                {Number(
                                    payment.amount
                                ).toLocaleString()}
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-300">
                                {payment.payment_method}
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap">
                                <StatusBadge
                                    status={payment.status.toLowerCase() as "success" | "failed" | "pending" | "active" | "offline" | "suspended" | "expired" | "online"}
                                />
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-slate-300">
                                    <span className="truncate max-w-[140px]">{payment.transaction_id}</span>
                                    <CopyButton
                                        value={payment.transaction_id}
                                    />
                                </div>
                            </td>

                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                <button className="rounded-xl p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <ExternalLink size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
