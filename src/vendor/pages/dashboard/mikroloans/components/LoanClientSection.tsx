// src/components/LoanClientsSection.tsx

import React from 'react';
import type { MicroLoan } from '../types';

interface LoanClientsSectionProps {
    loans: MicroLoan[];
}

export const LoanClientsSection: React.FC<LoanClientsSectionProps> = ({ loans }) => {
    return (
        <div className="space-y-3">
            {/* Header Card / Banner */}
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-4 sm:px-5 py-3.5 shadow-sm">
                <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
                    Loaned Client Ledgers
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    Track active and historical micro-loans disbursed to clients.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-gray-700">
                {/* Desktop/Tablet Table View */}
                <div className="overflow-x-auto hidden sm:block">
                    <table className="w-full text-left text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        <thead className="bg-slate-50 dark:bg-gray-800/60 text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-[0.07em]">
                            <tr>
                                <th className="p-3.5 font-medium">Client Phone</th>
                                <th className="p-3.5 font-medium">Package</th>
                                <th className="p-3.5 font-medium">Total Due</th>
                                <th className="p-3.5 font-medium">Remaining Balance</th>
                                <th className="p-3.5 font-medium">Status</th>
                                <th className="p-3.5 font-medium">Borrowed At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                            {loans.map(l => (
                                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-colors">
                                    <td className="p-3.5 font-medium text-slate-900 dark:text-white font-mono text-xs">{l.user_phone}</td>
                                    <td className="p-3.5">{l.package_name}</td>
                                    <td className="p-3.5 font-mono">Ksh {l.total_amount_due}</td>
                                    <td className="p-3.5 font-semibold text-amber-600 dark:text-amber-400 font-mono">Ksh {l.remaining_balance}</td>
                                    <td className="p-3.5">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                                            l.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                                            l.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                                            'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                        }`}>
                                            {l.status}
                                        </span>
                                    </td>
                                    <td className="p-3.5 text-slate-400 dark:text-slate-500 text-[11px]">
                                        {new Date(l.borrowed_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Compact Card View */}
                <div className="block sm:hidden divide-y divide-slate-200 dark:divide-gray-800">
                    {loans.map(l => (
                        <div key={l.id} className="p-3.5 space-y-2 hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-medium text-slate-900 dark:text-white text-xs font-mono">{l.user_phone}</div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{l.package_name}</div>
                                </div>
                                <div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                                        l.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                                        l.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                                        'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                    }`}>
                                        {l.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-100 dark:border-gray-800">
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500">Due: </span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">Ksh {l.total_amount_due}</span>
                                    <span className="mx-1 text-slate-300 dark:text-gray-700">|</span>
                                    <span className="text-slate-400 dark:text-slate-500">Bal: </span>
                                    <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">Ksh {l.remaining_balance}</span>
                                </div>
                                <div className="text-slate-400 dark:text-slate-500 text-[10px]">
                                    {new Date(l.borrowed_at).toLocaleDateString()} {new Date(l.borrowed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {loans.length === 0 && (
                    <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm">No client loans recorded.</div>
                )}
            </div>
        </div>
    );
};