import React from 'react';
import type { LoanAnalytics } from '../types';

interface AnalyticsSectionProps {
    analytics: LoanAnalytics | null;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ analytics }) => {
    if (!analytics) {
        return <div className="p-6 text-center text-gray-500 text-xs sm:text-sm">Loading analytics...</div>;
    }

    const totalPortfolio = analytics.active_loans_count + analytics.defaulted_loans_count + analytics.paid_loans_count;
    const paidPct = totalPortfolio > 0 ? Math.round((analytics.paid_loans_count / totalPortfolio) * 100) : 0;
    const activePct = totalPortfolio > 0 ? Math.round((analytics.active_loans_count / totalPortfolio) * 100) : 0;
    const defaultedPct = totalPortfolio > 0 ? Math.round((analytics.defaulted_loans_count / totalPortfolio) * 100) : 0;

    return (
        <div className="space-y-4 sm:space-y-6 text-xs sm:text-sm">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl shadow-lg border-l-4 border-amber-500 border border-gray-200 dark:border-gray-700">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Disbursed</div>
                    <div className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                        Ksh {analytics.total_disbursed.toLocaleString()}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl shadow-lg border-l-4 border-green-500 border border-gray-200 dark:border-gray-700">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Repaid</div>
                    <div className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                        Ksh {analytics.total_repaid.toLocaleString()}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl shadow-lg border-l-4 border-red-500 border border-gray-200 dark:border-gray-700">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Outstanding Balance</div>
                    <div className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                        Ksh {analytics.total_outstanding.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Distribution Graph Section */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-4">
                    Loan Portfolio Distribution Graph
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-[11px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            <span>Fully Paid ({analytics.paid_loans_count})</span>
                            <span>{paidPct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 sm:h-3 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${paidPct}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[11px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            <span>Active Pending Repayment ({analytics.active_loans_count})</span>
                            <span>{activePct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 sm:h-3 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${activePct}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[11px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            <span>Defaulted ({analytics.defaulted_loans_count})</span>
                            <span>{defaultedPct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 sm:h-3 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${defaultedPct}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};