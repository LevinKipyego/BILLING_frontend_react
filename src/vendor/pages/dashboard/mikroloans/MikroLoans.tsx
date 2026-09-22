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
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center text-xs sm:text-sm">
                Loading Micro-Loan Hub...
            </div>
        );
    }

    const pendingLoansCount = loans.filter(l => l.status === 'PENDING').length;

    return (
        <div className="p-3 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                {/* Header Title */}
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>⚡</span> Emergency Micro-Loan Hub
                </h1>

                {/* Navigation Tabs - Mobile Scrollable & Responsive */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
                    <button
                        className={`py-2 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'analytics' 
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        📊 Analytics & Graph
                    </button>
                    <button
                        className={`py-2 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'packages' 
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('packages')}
                    >
                        ⚙️ Loan Plans (Tiers)
                    </button>
                    <button
                        className={`py-2 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                            activeTab === 'loans' 
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('loans')}
                    >
                        <span>👥 Loaned Clients</span>
                        {pendingLoansCount > 0 && (
                            <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-amber-300 dark:border-amber-800/40">
                                {pendingLoansCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Tab Content Section */}
                <div className="pt-2">
                    {activeTab === 'analytics' && <AnalyticsSection analytics={analytics} />}
                    {activeTab === 'packages' && <PlanSection packages={packages} vendorId={vendorId} routers={routers} onRefresh={loadData} />}
                    {activeTab === 'loans' && <LoanClientsSection loans={loans} />}
                </div>
            </div>
        </div>
    );
};