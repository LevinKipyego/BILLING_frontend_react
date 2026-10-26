import React, { useState, useEffect } from 'react';
import type { BulkMigrationPayload, MigrationUser, ServiceType } from './types/migrations';
import type { MikrotikDevice } from '../../../types/device';
import type { Plan } from '../../../types/plan';
import { migrateBulkUsers } from './api/migrationApi';
import { fetchMikrotiks } from '../../../api/devices';
import { listPlans } from '../../../api/plans';

import {
  Users,
  Server,
  FileCode,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';

const SAMPLE_JSON = `[
  {
    "full_name": "wamuwa",
    "email": "",
    "phone": "",
    "mac": "",
    "username": "FRDecxt",
    "password": "dyfuigo",
    "county":"Kisumu",
    "location": "Kisumu",
    "address": "4040",
    "building": "",
    "floor":"3rd fl",
    "house_number": "",
    "longitude": "",
    "latitude": "",
    "expire_date": "2026-10-30T12:00:00"
    
  }
]`;

type FormSection = "target" | "payload" | null;

interface SuccessModalData {
  migrated_count: number;
  service_type: string;
  message: string;
}

export const VendorBulkMigration: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [mikrotiks, setMikrotiks] = useState<MikrotikDevice[]>([]);
  
  const [mikrotikId, setMikrotikId] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  const [serviceType, setServiceType] = useState<ServiceType>('PPPOE');
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON);
  
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessModalData | null>(null);

  // Accordion Form State
  const [formSection, setFormSection] = useState<FormSection>("target");

  const toggleFormSection = (section: Exclude<FormSection, null>) => {
    setFormSection((current) => (current === section ? null : section));
  };

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [plansRes, mikrotiksRes] = await Promise.all([listPlans(), fetchMikrotiks()]);
        setPlans(plansRes || []);
        setMikrotiks(mikrotiksRes || []);
      } catch (err: any) {
        setError(`Failed to load device or plan options: ${err.message}`);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadDropdownData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessData(null);

    if (!mikrotikId || !planId) {
      setError('Please select both a Mikrotik device and a plan.');
      setFormSection("target");
      return;
    }

    let parsedUsers: MigrationUser[];
    try {
      const sanitizedJson = jsonInput
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\bNone\b/g, 'null');

      parsedUsers = JSON.parse(sanitizedJson);
      if (!Array.isArray(parsedUsers)) {
        throw new Error('Parsed JSON must be an array of objects.');
      }
    } catch (err: any) {
      setError(`Invalid JSON format: ${err.message}. Ensure booleans are lowercase (true/false).`);
      setFormSection("payload");
      return;
    }

    const payload: BulkMigrationPayload = {
      mikrotik_id: String(mikrotikId),
      plan_id: Number(planId),
      service_type: serviceType,
      users: parsedUsers,
    };

    setLoading(true);
    try {
      const res = await migrateBulkUsers(payload);
      setSuccessData({
        migrated_count: res.migrated_count,
        service_type: serviceType,
        message: res.message || `Bravo!! You Successfully onboarded ${res.migrated_count} ${serviceType} users.`
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during migration.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="flex items-center justify-center min-h-[350px] text-slate-400">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mr-2.5"></div>
        <span className="text-xs sm:text-sm">Loading configuration options...</span>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-200 relative">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-gray-700 pb-3.5">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            Vendor Bulk Client Migration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select target options, paste your normalized client JSON list below, and execute bulk migration.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="whitespace-pre-wrap">{error}</span>
          </span>
          <button onClick={() => setError(null)} className="underline hover:text-red-500 font-medium text-xs ml-3">
            Dismiss
          </button>
        </div>
      )}

      {/* Accordion Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-200 dark:divide-gray-800">
          
          {/* Section 1: Target Parameters */}
          <div>
            <button
              type="button"
              onClick={() => toggleFormSection("target")}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Server className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    1. Target Configuration & Service
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {mikrotikId && planId ? "Device and plan selected" : "Select service type, router, and subscription plan"}
                  </p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${formSection === "target" ? "rotate-180" : ""}`} />
            </button>

            {formSection === "target" && (
              <div className="space-y-4 px-4 pb-4 pt-1 sm:px-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as ServiceType)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    >
                      <option value="PPPOE">PPPoE</option>
                      <option value="HOTSPOT">Hotspot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      MikroTik Device <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={mikrotikId}
                      onChange={(e) => setMikrotikId(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    >
                      <option value="">-- Select Device --</option>
                      {mikrotiks.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.identity_name || `Device #${m.id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Plan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={planId}
                      onChange={(e) => setPlanId(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    >
                      <option value="">-- Select Plan --</option>
                      {plans.map((p) => {
                        const planName = p.name || `Plan #${p.id}`;
                        const planPrice = p.price !== undefined && p.price !== null ? ` - ${p.price}` : '';
                        const sType = p.service_type !== undefined && p.service_type !== null ? ` - ${p.service_type}` : '';
                        return (
                          <option key={p.id} value={p.id}>
                            {planName}{planPrice}{sType}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setFormSection("payload")}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Continue to JSON Payload</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Normalized JSON Data */}
          <div>
            <button
              type="button"
              onClick={() => toggleFormSection("payload")}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <FileCode className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    2. Normalized JSON Data Array
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {jsonInput ? "JSON payload ready" : "Paste your user array JSON"}
                  </p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${formSection === "payload" ? "rotate-180" : ""}`} />
            </button>

            {formSection === "payload" && (
              <div className="space-y-3.5 px-4 pb-4 pt-1 sm:px-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Client Records JSON Array <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={12}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg font-mono text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setFormSection("target")}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    <span>{loading ? 'Processing Migration...' : 'Run Bulk Migration'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="border-t border-slate-200 bg-slate-50 dark:bg-gray-800/40 px-4 py-3 text-center dark:border-gray-800">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
            Secure vendor bulk import pipeline
          </p>
        </div>
      </form>

      {/* ---------------- LOADING ANIMATED PROGRESS MODAL ---------------- */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-16 w-16 rounded-full bg-indigo-500/20 animate-ping"></div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
                <RefreshCw className="h-7 w-7 animate-spin" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Migrating Bulk Clients...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Writing users, credentials, and subscriptions atomically. Please wait.
              </p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUCCESS POPUP MODAL ---------------- */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5 relative">
            <button
              onClick={() => setSuccessData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-inner">
                <Sparkles className="h-8 w-8" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Migration Complete!
              </h3>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 px-2 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg inline-block">
                {successData.message}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSuccessData(null)}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-md shadow-indigo-500/20"
              >
                Okay, Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VendorBulkMigration;