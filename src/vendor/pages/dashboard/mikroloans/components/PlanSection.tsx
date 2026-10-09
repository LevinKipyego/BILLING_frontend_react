// src/components/PlanSection.tsx



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
    const [activePlanField, setActivePlanField] = useState<string>("name");

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

        setActivePlanField("name");
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

        setActivePlanField("name");
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

        <div className="space-y-3">

            {/* Header Toolbar */}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-4 sm:px-5 py-3.5 shadow-sm">

                <div className="min-w-0">

                    <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">

                        Configured Loan Tiers & Plans

                    </h2>

                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">

                        Manage active loan packages and service limits for your customers.

                    </p>

                </div>

                <button 

                    onClick={handleAddNewClick} 

                    className="w-full sm:w-auto h-9 bg-amber-500 hover:bg-amber-600 text-white px-3.5 rounded-lg font-medium transition-colors text-xs shadow-sm flex items-center justify-center"

                >

                    \+ Add New Loan Plan

                </button>

            </div>



            {/* Progressive Editing / Creation Form */}
            {isEditingPkg && (
                <form onSubmit={handleSave} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                {currentPkg.id ? 'Edit loan plan' : 'Create loan plan'}
                            </h3>
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                Tap a setting to expand it. Your changes remain in the form until saved.
                            </p>
                        </div>
                        <button type="button" onClick={() => setIsEditingPkg(false)} className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800">
                            Cancel
                        </button>
                    </div>

                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 dark:divide-gray-800 dark:border-gray-800">
                        {/* Plan name */}
                        <div>
                            <button type="button" onClick={() => setActivePlanField(activePlanField === 'name' ? '' : 'name')} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800/60 sm:px-4">
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${currentPkg.name ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500 dark:bg-gray-800'}`}>{currentPkg.name ? '✓' : '01'}</span>
                                <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-800 dark:text-slate-100">Plan name <span className="text-amber-600">*</span></span><span className="mt-0.5 block truncate text-[10px] text-slate-400">{currentPkg.name || 'Name customers will see'}</span></span>
                                <span className="text-xs text-slate-400">{activePlanField === 'name' ? '−' : '+'}</span>
                            </button>
                            {activePlanField === 'name' && <div className="px-3 pb-3 sm:px-4"><input autoFocus required value={currentPkg.name || ''} onChange={e => setCurrentPkg({ ...currentPkg, name: e.target.value })} placeholder="e.g. Daily 5 Mbps" className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-white" /></div>}
                        </div>

                        {/* Price and fee */}
                        <div>
                            <button type="button" onClick={() => setActivePlanField(activePlanField === 'pricing' ? '' : 'pricing')} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800/60 sm:px-4">
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${currentPkg.price != null && currentPkg.service_fee != null ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500 dark:bg-gray-800'}`}>{currentPkg.price != null ? '✓' : '02'}</span>
                                <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-800 dark:text-slate-100">Price & service fee <span className="text-amber-600">*</span></span><span className="mt-0.5 block truncate text-[10px] text-slate-400">Price: Ksh {currentPkg.price ?? '—'} · Fee: Ksh {currentPkg.service_fee ?? '—'}</span></span>
                                <span className="text-xs text-slate-400">{activePlanField === 'pricing' ? '−' : '+'}</span>
                            </button>
                            {activePlanField === 'pricing' && <div className="grid grid-cols-2 gap-3 px-3 pb-3 sm:px-4"><label className="block"><span className="mb-1 block text-[10px] font-medium text-slate-500">Price (Ksh)</span><input type="number" min="0" step="0.01" required value={currentPkg.price ?? ''} onChange={e => setCurrentPkg({ ...currentPkg, price: e.target.value === '' ? undefined : parseFloat(e.target.value) })} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" /></label><label className="block"><span className="mb-1 block text-[10px] font-medium text-slate-500">Service fee (Ksh)</span><input type="number" min="0" step="0.01" required value={currentPkg.service_fee ?? ''} onChange={e => setCurrentPkg({ ...currentPkg, service_fee: e.target.value === '' ? undefined : parseFloat(e.target.value) })} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" /></label></div>}
                        </div>

                        {/* Duration */}
                        <div>
                            <button type="button" onClick={() => setActivePlanField(activePlanField === 'duration' ? '' : 'duration')} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800/60 sm:px-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-gray-800">03</span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-800 dark:text-slate-100">Duration</span><span className="mt-0.5 block text-[10px] text-slate-400">{durationNum} {durationUnit}</span></span><span className="text-xs text-slate-400">{activePlanField === 'duration' ? '−' : '+'}</span></button>
                            {activePlanField === 'duration' && <div className="flex gap-2 px-3 pb-3 sm:px-4"><input type="number" min="1" required value={durationNum} onChange={e => setDurationNum(parseInt(e.target.value) || 1)} className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white" /><select value={durationUnit} onChange={e => setDurationUnit(e.target.value as 'minutes' | 'hours' | 'days')} className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white"><option value="minutes">Minutes</option><option value="hours">Hours</option><option value="days">Days</option></select></div>}
                        </div>

                        {/* Network settings */}
                        <div>
                            <button type="button" onClick={() => setActivePlanField(activePlanField === 'network' ? '' : 'network')} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800/60 sm:px-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-gray-800">04</span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-800 dark:text-slate-100">Network configuration</span><span className="mt-0.5 block truncate text-[10px] text-slate-400">Rate: {currentPkg.rate_limit || '4M/4M'} · {currentPkg.service_type || 'HOTSPOT'}</span></span><span className="text-xs text-slate-400">{activePlanField === 'network' ? '−' : '+'}</span></button>
                            {activePlanField === 'network' && <div className="grid gap-3 px-3 pb-3 sm:grid-cols-2 sm:px-4"><label className="block"><span className="mb-1 block text-[10px] font-medium text-slate-500">Rate limit</span><select value={currentPkg.rate_limit || '4M/4M'} onChange={e => setCurrentPkg({ ...currentPkg, rate_limit: e.target.value })} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white">{RATE_LIMIT_OPTIONS.map(rate => <option key={rate} value={rate}>{rate}</option>)}{!RATE_LIMIT_OPTIONS.includes(currentPkg.rate_limit || '') && currentPkg.rate_limit && <option value={currentPkg.rate_limit}>{currentPkg.rate_limit}</option>}</select></label><label className="block"><span className="mb-1 block text-[10px] font-medium text-slate-500">Service type</span><select value={currentPkg.service_type || 'HOTSPOT'} onChange={e => setCurrentPkg({ ...currentPkg, service_type: e.target.value as any })} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white"><option value="HOTSPOT">Hotspot</option><option value="PPPOE">PPPoE</option><option value="IPOE">IPoE</option></select></label><label className="block"><span className="mb-1 block text-[10px] font-medium text-slate-500">MikroTik profile name</span><input value={currentPkg.mikrotik_profile || ''} onChange={e => setCurrentPkg({ ...currentPkg, mikrotik_profile: e.target.value })} placeholder="Optional profile name" className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white" /></label><label className="block"><span className="mb-1 block text-[10px] font-medium text-slate-500">Router device</span><select value={currentPkg.mikrotik ?? routers[0]?.id ?? ''} onChange={e => setCurrentPkg({ ...currentPkg, mikrotik: e.target.value })} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white"><option value="">Select router</option>{routers.map(r => <option key={r.id} value={r.id}>{r.identity_name} ({r.api_ip})</option>)}</select></label></div>}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col-reverse gap-2 border-t border-slate-100 pt-3 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[10px] text-slate-400"><span className="text-amber-600">*</span> Required fields</p>
                        <div className="flex gap-2"><button type="button" onClick={() => setIsEditingPkg(false)} className="h-9 flex-1 rounded-lg border border-slate-200 px-4 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 sm:flex-none">Cancel</button><button type="submit" className="h-9 flex-1 rounded-lg bg-amber-600 px-5 text-xs font-semibold text-white transition hover:bg-amber-700 sm:flex-none">Save plan</button></div>
                    </div>
                </form>
            )}

            {/* Mobile Card Layout / Desktop Table Layout */}

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-gray-700">

                {/* Desktop/Tablet Table view */}

                <div className="overflow-x-auto hidden sm:block">

                    <table className="w-full text-left text-xs sm:text-sm text-slate-800 dark:text-slate-200">

                        <thead className="bg-slate-50 dark:bg-gray-800/60 text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-[0.07em]">

                            <tr>

                                <th className="p-3.5 font-medium">Name</th>

                                <th className="p-3.5 font-medium">Price</th>

                                <th className="p-3.5 font-medium">Fee</th>

                                <th className="p-3.5 font-medium">Duration</th>

                                <th className="p-3.5 font-medium">Rate Limit</th>

                                <th className="p-3.5 font-medium">Type</th>

                                <th className="p-3.5 font-medium text-right">Actions</th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-200 dark:divide-gray-800">

                            {packages.map(p => {

                                const mins = p.duration_minutes || 0;

                                let durationLabel = `${mins} min`;

                                if (mins > 0 && mins % 1440 === 0) durationLabel = `${mins / 1440} day(s)`;

                                else if (mins > 0 && mins % 60 === 0) durationLabel = `${mins / 60} hour(s)`;



                                return (

                                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-colors">

                                        <td className="p-3.5 font-medium text-slate-900 dark:text-white">{p.name}</td>

                                        <td className="p-3.5 font-mono">Ksh {p.price}</td>

                                        <td className="p-3.5 font-mono">Ksh {p.service_fee}</td>

                                        <td className="p-3.5">{durationLabel}</td>

                                        <td className="p-3.5 font-mono text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{p.rate_limit || 'N/A'}</td>

                                        <td className="p-3.5">

                                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">

                                                {p.service_type}

                                            </span>

                                        </td>

                                        <td className="p-3.5 text-right space-x-3">

                                            <button onClick={() => handleEditClick(p)} className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs">Edit</button>

                                            <button onClick={() => handleDelete(p.id!)} className="text-red-600 dark:text-red-400 hover:underline font-medium text-xs">Delete</button>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>



                {/* Mobile Compact Card View */}

                <div className="block sm:hidden divide-y divide-slate-200 dark:divide-gray-800">

                    {packages.map(p => {

                        const mins = p.duration_minutes || 0;

                        let durationLabel = `${mins}m`;

                        if (mins > 0 && mins % 1440 === 0) durationLabel = `${mins / 1440}d`;

                        else if (mins > 0 && mins % 60 === 0) durationLabel = `${mins / 60}h`;



                        return (

                            <div key={p.id} className="p-3.5 space-y-2 hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-colors">

                                <div className="flex justify-between items-start">

                                    <div>

                                        <h4 className="font-medium text-slate-900 dark:text-white text-xs">{p.name}</h4>

                                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">

                                            {p.service_type}

                                        </span>

                                    </div>

                                    <div className="text-right">

                                        <div className="font-semibold text-slate-900 dark:text-white text-xs font-mono">Ksh {p.price}</div>

                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Fee: Ksh {p.service_fee}</div>

                                    </div>

                                </div>

                                <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-gray-800">

                                    <div>

                                        <span>Duration: <strong className="text-slate-800 dark:text-slate-200">{durationLabel}</strong></span>

                                        <span className="mx-2">•</span>

                                        <span>Rate: <strong className="font-mono text-slate-800 dark:text-slate-200">{p.rate_limit || 'N/A'}</strong></span>

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

                    <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm">No loan packages configured.</div>

                )}

            </div>

        </div>

    );

};