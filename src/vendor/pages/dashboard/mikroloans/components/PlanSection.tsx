import React, { useState } from 'react';
import type { LoanPackage } from '../types';
import { saveLoanPackageAPI, deleteLoanPackageAPI } from '../api/loan';

interface RouterDevice {
    id: string;
    identity_name: string;
    serial_number: string;
    status: string;
    enabled: boolean;
    site_name: string;
    api_ip: string;
    created_at: string;
}

interface PlanSectionProps {
    packages: LoanPackage[];
    vendorId: number;
    routers: RouterDevice[];
    onRefresh: () => void;
}

const RATE_LIMIT_OPTIONS = [
    '1M/1M',
    '2M/2M',
    '3M/3M',
    '5M/5M',
    '10M/10M',
    '15M/15M',
    '20M/20M',
    '50M/50M',
    'Unlimited'
];

export const PlanSection: React.FC<PlanSectionProps> = ({ packages, vendorId, routers, onRefresh }) => {
    const [isEditingPkg, setIsEditingPkg] = useState<boolean>(false);
    const [currentPkg, setCurrentPkg] = useState<Partial<LoanPackage & { mikrotik?: string | number }>>({
        name: '', 
        price: 10, 
        service_fee: 2, 
        duration_minutes: 60, 
        rate_limit: '4M/4M', 
        service_type: 'HOTSPOT', 
        billing_model: 'PREPAID',
        mikrotik_profile: '',
        is_loan_plan: true,
        active: true, 
        mikrotik: routers[0]?.id || ''
    });

    const [durationNum, setDurationNum] = useState<number>(60);
    const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours' | 'days'>('minutes');

    const handleEditClick = (pkg: LoanPackage) => {
        setCurrentPkg({ ...pkg, mikrotik: pkg.mikrotik ?? '' });
        const mins = pkg.duration_minutes || 60;
        if (mins % 1440 === 0) {
            setDurationNum(mins / 1440);
            setDurationUnit('days');
        } else if (mins % 60 === 0) {
            setDurationNum(mins / 60);
            setDurationUnit('hours');
        } else {
            setDurationNum(mins);
            setDurationUnit('minutes');
        }
        setIsEditingPkg(true);
    };

    const handleAddNewClick = () => {
        setCurrentPkg({ 
            name: '', 
            price: 10, 
            service_fee: 2, 
            duration_minutes: 60, 
            rate_limit: '4M/4M', 
            service_type: 'HOTSPOT', 
            billing_model: 'PREPAID',
            mikrotik_profile: '',
            is_loan_plan: true,
            active: true, 
            mikrotik: routers[0]?.id || '' 
        });
        setDurationNum(60);
        setDurationUnit('minutes');
        setIsEditingPkg(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        let calculatedMinutes = durationNum;
        if (durationUnit === 'hours') calculatedMinutes = durationNum * 60;
        if (durationUnit === 'days') calculatedMinutes = durationNum * 1440;

        const payload = {
            ...currentPkg,
            duration_minutes: calculatedMinutes
        };

        try {
            await saveLoanPackageAPI(payload, vendorId);
            setIsEditingPkg(false);
            onRefresh();
        } catch (err) {
            alert("Failed to save loan plan.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this loan plan?")) return;
        try {
            await deleteLoanPackageAPI(id);
            onRefresh();
        } catch (err) {
            alert("Failed to delete loan plan.");
        }
    };

    return (
        <div className="space-y-4 text-xs sm:text-sm">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    Configured Loan Tiers & Plans
                </h2>
                <button 
                    onClick={handleAddNewClick} 
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded font-semibold transition-colors text-xs sm:text-sm shadow-sm"
                >
                    + Add New Loan Plan
                </button>
            </div>

            {/* Editing / Creation Form */}
            {isEditingPkg && (
                <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 border border-gray-200 dark:border-gray-700">
                    <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Plan Name</label>
                        <input 
                            type="text" 
                            value={currentPkg.name || ''} 
                            onChange={e => setCurrentPkg({ ...currentPkg, name: e.target.value })} 
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded text-xs sm:text-sm focus:border-amber-500 focus:outline-none" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Price (Ksh)</label>
                        <input 
                            type="number" 
                            value={currentPkg.price ?? ''} 
                            onChange={e => setCurrentPkg({ ...currentPkg, price: parseFloat(e.target.value) })} 
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded text-xs sm:text-sm focus:border-amber-500 focus:outline-none" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Service Fee (Ksh)</label>
                        <input 
                            type="number" 
                            value={currentPkg.service_fee ?? ''} 
                            onChange={e => setCurrentPkg({ ...currentPkg, service_fee: parseFloat(e.target.value) })} 
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded text-xs sm:text-sm focus:border-amber-500 focus:outline-none" 
                            required 
                        />
                    </div>

                    {/* Duration Input & Unit Selector */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Duration Period</label>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                min="1"
                                value={durationNum} 
                                onChange={e => setDurationNum(parseInt(e.target.value) || 1)} 
                                className="w-1/2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded text-xs sm:text-sm focus:border-amber-500 focus:outline-none" 
                                required 
                            />
                            <select 
                                value={durationUnit}
                                onChange={e => setDurationUnit(e.target.value as any)}
                                className="w-1/2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                            >
                                <option value="minutes">Mins</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                    </div>

                    {/* Rate Limit Dropdown */}
                    <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Rate Limit</label>
                        <select 
                            value={currentPkg.rate_limit || '4M/4M'} 
                            onChange={e => setCurrentPkg({ ...currentPkg, rate_limit: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                        >
                            {RATE_LIMIT_OPTIONS.map(rate => (
                                <option key={rate} value={rate}>{rate}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">MikroTik Profile Name</label>
                        <input 
                            type="text" 
                            value={currentPkg.mikrotik_profile || ''} 
                            onChange={e => setCurrentPkg({ ...currentPkg, mikrotik_profile: e.target.value })} 
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded text-xs sm:text-sm focus:border-amber-500 focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Service Type</label>
                        <select 
                            value={currentPkg.service_type || 'HOTSPOT'} 
                            onChange={e => setCurrentPkg({ ...currentPkg, service_type: e.target.value as any })}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                        >
                            <option value="HOTSPOT">Hotspot</option>
                            <option value="PPPOE">PPPoE</option>
                            <option value="IPOE">IPoE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Router Device</label>
                        <select 
                            value={currentPkg.mikrotik ?? routers[0]?.id ?? ''} 
                            onChange={e => setCurrentPkg({ ...currentPkg, mikrotik: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                        >
                            {routers.map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.identity_name} ({r.api_ip})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:col-span-2 md:col-span-3 flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsEditingPkg(false)} className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-semibold transition-colors">Save Plan</button>
                    </div>
                </form>
            )}

            {/* Mobile Card Layout / Desktop Table Layout */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Desktop/Tablet Table view */}
                <div className="overflow-x-auto hidden sm:block">
                    <table className="w-full text-left text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                        <thead className="bg-gray-100 dark:bg-gray-900 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Fee</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Rate Limit</th>
                                <th className="p-3">Type</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {packages.map(p => {
                                const mins = p.duration_minutes || 0;
                                let durationLabel = `${mins} min`;
                                if (mins > 0 && mins % 1440 === 0) durationLabel = `${mins / 1440} day(s)`;
                                else if (mins > 0 && mins % 60 === 0) durationLabel = `${mins / 60} hour(s)`;

                                return (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                                        <td className="p-3">Ksh {p.price}</td>
                                        <td className="p-3">Ksh {p.service_fee}</td>
                                        <td className="p-3">{durationLabel}</td>
                                        <td className="p-3 font-mono text-[11px] sm:text-xs">{p.rate_limit || 'N/A'}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 font-medium border border-amber-300 dark:border-amber-800/40">
                                                {p.service_type}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right space-x-2 sm:space-x-3">
                                            <button onClick={() => handleEditClick(p)} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Edit</button>
                                            <button onClick={() => handleDelete(p.id!)} className="text-red-600 dark:text-red-400 hover:underline font-medium">Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Compact Card View */}
                <div className="block sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
                    {packages.map(p => {
                        const mins = p.duration_minutes || 0;
                        let durationLabel = `${mins}m`;
                        if (mins > 0 && mins % 1440 === 0) durationLabel = `${mins / 1440}d`;
                        else if (mins > 0 && mins % 60 === 0) durationLabel = `${mins / 60}h`;

                        return (
                            <div key={p.id} className="p-3 space-y-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-xs">{p.name}</h4>
                                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-medium">
                                            {p.service_type}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900 dark:text-white text-xs">Ksh {p.price}</div>
                                        <div className="text-[10px] text-gray-500">Fee: Ksh {p.service_fee}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-[11px] text-gray-600 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-700/50">
                                    <div>
                                        <span>Duration: <strong className="text-gray-900 dark:text-gray-200">{durationLabel}</strong></span>
                                        <span className="mx-2">•</span>
                                        <span>Rate: <strong className="font-mono text-gray-900 dark:text-gray-200">{p.rate_limit || 'N/A'}</strong></span>
                                    </div>
                                    <div className="space-x-2">
                                        <button onClick={() => handleEditClick(p)} className="text-blue-600 dark:text-blue-400 font-medium">Edit</button>
                                        <button onClick={() => handleDelete(p.id!)} className="text-red-600 dark:text-red-400 font-medium">Delete</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {packages.length === 0 && (
                    <div className="p-6 text-center text-gray-500 text-xs sm:text-sm">No loan packages configured.</div>
                )}
            </div>
        </div>
    );
};