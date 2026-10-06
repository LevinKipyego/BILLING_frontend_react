// src/components/AnalyticsSection.tsx

import React from 'react';
import type { LoanAnalytics } from '../types';

interface AnalyticsSectionProps {
    analytics: LoanAnalytics | null;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ analytics }) => {
    if (!analytics) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-slate-200 dark:border-gray-700 p-8 text-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
                Loading analytics...
            </div>
        );
    }

    const totalPortfolio = analytics.total_portfolio_count || (analytics.active_loans_count + analytics.defaulted_loans_count + analytics.paid_loans_count + (analytics.partially_paid_count || 0));
    
    const paidPct = totalPortfolio > 0 ? Math.round((analytics.paid_loans_count / totalPortfolio) * 100) : 0;
    const activePct = totalPortfolio > 0 ? Math.round((analytics.active_loans_count / totalPortfolio) * 100) : 0;
    const defaultedPct = totalPortfolio > 0 ? Math.round((analytics.defaulted_loans_count / totalPortfolio) * 100) : 0;

    // Find peak bar height for dynamic scaling of the chart bars
    const maxBarValue = Math.max(
        ...((analytics.peak_time_distribution || []).flatMap(s => [s.borrow, s.pay])),
        10 // fallback minimum max divisor
    );

    return (
        <div className="space-y-4 text-xs sm:text-sm">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-lg shadow-sm border-l-4 border-amber-500 border border-slate-200 dark:border-gray-700">
                    <div className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Total Disbursed</div>
                    <div className="text-base sm:text-xl font-semibold text-slate-900 dark:text-white mt-1 ">
                        Ksh {analytics.total_disbursed.toLocaleString()}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-lg shadow-sm border-l-4 border-emerald-500 border border-slate-200 dark:border-gray-700">
                    <div className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Total Repaid</div>
                    <div className="text-base sm:text-xl font-semibold text-slate-900 dark:text-white mt-1       ">
                        Ksh {analytics.total_repaid.toLocaleString()}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-lg shadow-sm border-l-4 border-red-500 border border-slate-200 dark:border-gray-700">
                    <div className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Outstanding Balance</div>
                    <div className="text-base sm:text-xl font-semibold text-slate-900 dark:text-white mt-1 ">
                        Ksh {analytics.total_outstanding.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Frequency & Repayment Behaviour Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
                    <div className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Repeat Borrowers</div>
                    <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mt-1 ">
                        {analytics.repeat_borrowers_count} <span className="text-[11px] font-normal text-slate-400">clients</span>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Clients taking multiple micro-loans</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
                    <div className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Avg. Repayment Time</div>
                    <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mt-1 ">
                        {analytics.avg_repayment_time_hours} <span className="text-[11px] font-normal text-slate-400">Hours</span>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Duration from disbursement to full clearance</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
                    <div className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">Repayment Success Rate</div>
                    <div className="text-sm sm:text-base font-semibold text-emerald-600 dark:text-emerald-400 mt-1 ">
                        {analytics.repayment_success_rate}%
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Ratio of successfully cleared micro-loans</p>
                </div>
            </div>

            {/* Distribution Graph Section */}
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
                <h3 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mb-1">
                    Loan Portfolio Status Breakdown
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">Proportional breakdown of active, paid, partially paid, and defaulted micro-loans.</p>
                
                <div className="space-y-3.5">
                    <div>
                        <div className="flex justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                            <span>Fully Paid ({analytics.paid_loans_count})</span>
                            <span className="font-light">{paidPct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${paidPct}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                            <span>Active Pending Repayment ({analytics.active_loans_count})</span>
                            <span className="font-light">{activePct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${activePct}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                            <span>Defaulted ({analytics.defaulted_loans_count})</span>
                            <span className="font-light">{defaultedPct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${defaultedPct}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Peak Borrowing & Payment Time Distribution Graph */}
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <div>
                        <h3 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
                            Borrowing & Repayment Peak Times
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Hourly frequency analysis showing when clients borrow and settle loans.</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-light text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span> Borrowed</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span> Paid</span>
                    </div>
                </div>

                {/* Dynamic Bar Chart mapped from backend peak_time_distribution */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2 border-t border-slate-100 dark:border-gray-800">
                    {(analytics.peak_time_distribution || []).map((slot, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <div className="h-32 w-full flex items-end justify-center gap-1 bg-slate-50 dark:bg-gray-800/40 rounded-lg p-1 border border-slate-100 dark:border-gray-800">
                                <div 
                                    className="w-2.5 bg-amber-500 rounded-t transition-all" 
                                    style={{ height: `${Math.min(100, (slot.borrow / maxBarValue) * 100)}%` }}
                                    title={`Borrowed at ${slot.time}: ${slot.borrow}`}
                                ></div>
                                <div 
                                    className="w-2.5 bg-emerald-500 rounded-t transition-all" 
                                    style={{ height: `${Math.min(100, (slot.pay / maxBarValue) * 100)}%` }}
                                    title={`Paid at ${slot.time}: ${slot.pay}`}
                                ></div>
                            </div>
                            <span className="text-[10px] font-light text-slate-400 dark:text-slate-500">{slot.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};