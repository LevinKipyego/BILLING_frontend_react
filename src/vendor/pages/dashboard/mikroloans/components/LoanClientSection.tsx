import React from 'react';
import type { MicroLoan } from '../types';

interface LoanClientsSectionProps {
    loans: MicroLoan[];
}

export const LoanClientsSection: React.FC<LoanClientsSectionProps> = ({ loans }) => {
    return (
        <div className="space-y-4 text-xs sm:text-sm">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-4">
                Loaned Client Ledgers
            </h2>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Desktop/Tablet Table View */}
                <div className="overflow-x-auto hidden sm:block">
                    <table className="w-full text-left text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                        <thead className="bg-gray-100 dark:bg-gray-900 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th className="p-3">Client Phone</th>
                                <th className="p-3">Package</th>
                                <th className="p-3">Total Due</th>
                                <th className="p-3">Remaining Balance</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Borrowed At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loans.map(l => (
                                <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="p-3 font-medium text-gray-900 dark:text-white">{l.user_phone}</td>
                                    <td className="p-3">{l.package_name}</td>
                                    <td className="p-3">Ksh {l.total_amount_due}</td>
                                    <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">Ksh {l.remaining_balance}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold border ${
                                            l.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800/40' :
                                            l.status === 'PAID' ? 'bg-green-100 dark:bg-green-950/80 text-green-800 dark:text-green-400 border-green-300 dark:border-green-800/40' : 
                                            'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-400 border-red-300 dark:border-red-800/40'
                                        }`}>
                                            {l.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs">
                                        {new Date(l.borrowed_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Compact Card View */}
                <div className="block sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
                    {loans.map(l => (
                        <div key={l.id} className="p-3 space-y-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white text-xs">{l.user_phone}</div>
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400">{l.package_name}</div>
                                </div>
                                <div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                        l.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800/40' :
                                        l.status === 'PAID' ? 'bg-green-100 dark:bg-green-950/80 text-green-800 dark:text-green-400 border-green-300 dark:border-green-800/40' : 
                                        'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-400 border-red-300 dark:border-red-800/40'
                                    }`}>
                                        {l.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-[11px] pt-1 border-t border-gray-100 dark:border-gray-700/50">
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">Due: </span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">Ksh {l.total_amount_due}</span>
                                    <span className="mx-1 text-gray-400">|</span>
                                    <span className="text-gray-500 dark:text-gray-400">Bal: </span>
                                    <span className="font-semibold text-amber-600 dark:text-amber-400">Ksh {l.remaining_balance}</span>
                                </div>
                                <div className="text-gray-400 dark:text-gray-500 text-[10px]">
                                    {new Date(l.borrowed_at).toLocaleDateString()} {new Date(l.borrowed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {loans.length === 0 && (
                    <div className="p-6 text-center text-gray-500 text-xs sm:text-sm">No client loans recorded.</div>
                )}
            </div>
        </div>
    );
};