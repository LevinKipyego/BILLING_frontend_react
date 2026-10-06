// src/components/VendorLoanHub.tsx

import React, { useState, useEffect } from 'react';
import type { LoanPackage, MicroLoan, LoanAnalytics } from './types';
import { fetchLoanPackages, fetchMicroLoans, fetchLoanAnalytics } from './api/loan';
import { AnalyticsSection } from './components/AnalyticsSection';
import { PlanSection } from './components/PlanSection';
import { LoanClientsSection } from './components/LoanClientSection';
import { apiFetch } from '../../../api/client';

export const VendorLoanHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'analytics' | 'packages' | 'loans'>('analytics');
    const [vendorId, setVendorId] = useState<number | null>(null);
    const [routers, setRouters] = useState<React.ComponentProps<typeof PlanSection>['routers']>([]);
    const [packages, setPackages] = useState<LoanPackage[]>([]);
    const [loans, setLoans] = useState<MicroLoan[]>([]);
    const [analytics, setAnalytics] = useState<LoanAnalytics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initVendorData = async () => {
            try {
                const profile: any = await apiFetch('/vendors/profile/'); 
                const resolvedVendorId = profile.vendor.id || profile.id;
                setVendorId(resolvedVendorId);

                // Fetch routers via api/devices/ endpoint
                const routerData: any = await apiFetch('/devices/');
                setRouters(routerData);

                const [pkgData, loanData, analyticData] = await Promise.all([
                    fetchLoanPackages(),
                    fetchMicroLoans(),
                    fetchLoanAnalytics()
                ]);
                setPackages(pkgData);
                setLoans(loanData);
                setAnalytics(analyticData);
            } catch (err) {
                console.error("Error loading vendor session or loan data:", err);
            } finally {
                setLoading(false);
            }
        };

        initVendorData();
    }, []);

    const loadData = async () => {
        if (!vendorId) return;
        try {
            const [pkgData, loanData, analyticData] = await Promise.all([
                fetchLoanPackages(),
                fetchMicroLoans(),
                fetchLoanAnalytics()
            ]);
            setPackages(pkgData);
            setLoans(loanData);
            setAnalytics(analyticData);
        } catch (err) {
            console.error("Error reloading loan data:", err);
        }
    };

    if (loading || !vendorId) {
        return (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-gray-900 min-h-[60vh] flex items-center justify-center text-xs sm:text-sm">
                Loading Micro-Loan Hub...
            </div>
        );
    }

    const pendingLoansCount = loans.filter(l => l.status === 'PENDING').length;

    return (
        <div className="w-full px-2 py-2 sm:px-4 sm:py-4 lg:px-6">
            <div className="mx-auto w-full max-w-7xl space-y-3">
                {/* Header Title & Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-4 sm:px-5 py-3.5 shadow-sm">
                    <div className="min-w-0">
                        <h1 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <span>⚡</span> Emergency Micro-Loan Hub
                        </h1>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            Monitor loan portfolios, review client repayment frequencies, and configure tiers.
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs - Mobile Scrollable & Responsive */}
                <div className="flex bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-3 gap-2 sm:gap-4 overflow-x-auto shadow-sm">
                    <button
                        className={`py-3 px-3 sm:px-4 font-medium text-xs sm:text-[13px] border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'analytics' 
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        📊 Analytics & Graph
                    </button>
                    <button
                        className={`py-3 px-3 sm:px-4 font-medium text-xs sm:text-[13px] border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'packages' 
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                        onClick={() => setActiveTab('packages')}
                    >
                        ⚙️ Loan Plans (Tiers)
                    </button>
                    <button
                        className={`py-3 px-3 sm:px-4 font-medium text-xs sm:text-[13px] border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                            activeTab === 'loans' 
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                        onClick={() => setActiveTab('loans')}
                    >
                        <span>👥 Loaned Clients</span>
                        {pendingLoansCount > 0 && (
                            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded font-medium border border-amber-500/20 font-mono">
                                {pendingLoansCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Tab Content Section */}
                <div className="pt-1">
                    {activeTab === 'analytics' && <AnalyticsSection analytics={analytics} />}
                    {activeTab === 'packages' && <PlanSection packages={packages} vendorId={vendorId} routers={routers} onRefresh={loadData} />}
                    {activeTab === 'loans' && <LoanClientsSection loans={loans} />}
                </div>
            </div>
        </div>
    );
};