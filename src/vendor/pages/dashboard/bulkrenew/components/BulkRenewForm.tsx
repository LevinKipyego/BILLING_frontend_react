import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import type { ServiceType, BulkRenewPayload } from '../types/bulkRenew';
import type { MikrotikDevice } from '../../../../types/device';
import { bulkRenewApi } from '../api/bulkRenewApi';
import { DurationPresets } from './DurationPresets';

interface BulkRenewFormProps {
  onSubmit: (payload: BulkRenewPayload) => void;
  isLoading: boolean;
}

function formatDurationSummary(minutes: number): string {
  const safeMins = Math.max(0, Math.floor(minutes));
  if (safeMins < 60) {
    return `${safeMins} minute${safeMins === 1 ? '' : 's'}`;
  }
  const hours = safeMins / 60;
  if (safeMins % 1440 === 0) {
    const days = safeMins / 1440;
    return `${days} day${days === 1 ? '' : 's'} (${hours} hours)`;
  }
  if (safeMins % 60 === 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  const wholeHours = Math.floor(safeMins / 60);
  const remMins = safeMins % 60;
  return `${wholeHours}h ${remMins}m (${safeMins} mins)`;
}

export const BulkRenewForm: React.FC<BulkRenewFormProps> = ({ onSubmit, isLoading }) => {
  const [serviceType, setServiceType] = useState<ServiceType>('PPPOE');
  const [durationMinutes, setDurationMinutes] = useState<number>(1440); // Default 24 hrs
  const [windowHours, setWindowHours] = useState<number>(24);
  const [selectedMikrotikId, setSelectedMikrotikId] = useState<string>('');
  const [routers, setRouters] = useState<MikrotikDevice[]>([]);
  const [loadingRouters, setLoadingRouters] = useState<boolean>(false);

  // Custom confirmation alert state
  const [pendingPayload, setPendingPayload] = useState<BulkRenewPayload | null>(null);

  useEffect(() => {
    const fetchRouters = async () => {
      setLoadingRouters(true);
      try {
        const data = await bulkRenewApi.getMikrotikRouters();
        setRouters(data);
      } catch (err) {
        console.error('Failed to load Mikrotik routers', err);
      } finally {
        setLoadingRouters(false);
      }
    };
    fetchRouters();
  }, []);

  const selectedRouterLabel = useMemo(() => {
    if (!selectedMikrotikId) return 'All Routers / Entire Network';
    const match = routers.find((r) => String(r.id) === String(selectedMikrotikId));
    if (!match) return `Router #${selectedMikrotikId}`;
    return `${match.identity_name}${match.site_name ? ` (${match.site_name})` : ''}`;
  }, [routers, selectedMikrotikId]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const payload: BulkRenewPayload = {
      service_type: serviceType,
      duration_minutes: Math.max(1, Number(durationMinutes)),
      window_hours: Math.max(1, Number(windowHours)),
      mikrotik_id: selectedMikrotikId ? Number(selectedMikrotikId) : null,
    };

    setPendingPayload(payload);
  };

  const handleConfirmExtension = () => {
    if (!pendingPayload || isLoading) return;
    const payloadToRun = pendingPayload;
    setPendingPayload(null);
    onSubmit(payloadToRun);
  };

  const handleCancelExtension = () => {
    if (isLoading) return;
    setPendingPayload(null);
  };

  return (
    <>
      <form
        onSubmit={handleFormSubmit}
        className="space-y-6 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800 transition-colors"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bulk Subscription Renewal</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Extend or renew subscriptions for users affected by network outages or interruptions.
          </p>
        </div>

        {/* Service Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Service Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setServiceType('PPPOE')}
              className={`py-3 px-4 rounded-xl font-medium text-sm border text-center transition-all ${
                serviceType === 'PPPOE'
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              PPPoE Subscribers
            </button>
            <button
              type="button"
              onClick={() => setServiceType('HOTSPOT')}
              className={`py-3 px-4 rounded-xl font-medium text-sm border text-center transition-all ${
                serviceType === 'HOTSPOT'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              Hotspot Users
            </button>
          </div>
        </div>

        {/* Router Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Mikrotik Router <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
          </label>
          <select
            value={selectedMikrotikId}
            onChange={(e) => setSelectedMikrotikId(e.target.value)}
            disabled={loadingRouters}
            className="w-full px-3.5 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-colors"
          >
            <option value="">All Routers / Entire Network</option>
            {routers.map((r, index) => {
              const routerKey = r.id || index;
              return (
                <option key={routerKey} value={r.id}>
                  {r.identity_name} {r.site_name ? `(${r.site_name})` : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Interruption Window Filter with Mobile Steppers */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Interruption Window (Hours Back)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWindowHours(Math.max(1, windowHours - 1))}
              className="sm:hidden px-3 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold border border-gray-200 dark:border-gray-700 active:scale-95"
            >
              -
            </button>
            <div className="relative flex-1">
              <input
                type="number"
                min={1}
                value={windowHours}
                onChange={(e) => setWindowHours(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                placeholder="e.g. 24"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => setWindowHours(windowHours + 1)}
              className="sm:hidden px-3 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold border border-gray-200 dark:border-gray-700 active:scale-95"
            >
              +
            </button>
            <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              Hours ago
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            Targets users active or whose sub was valid within the last {windowHours} hour(s).
          </p>
        </div>

        {/* Extension Duration with Mobile Steppers */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Extension Duration (Minutes)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDurationMinutes(Math.max(30, durationMinutes - 60))}
              className="sm:hidden px-3 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold border border-gray-200 dark:border-gray-700 active:scale-95"
              title="Subtract 1 hour"
            >
              -1h
            </button>
            <div className="relative flex-1">
              <input
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                placeholder="e.g. 1440 for 24 hours"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => setDurationMinutes(durationMinutes + 60)}
              className="sm:hidden px-3 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold border border-gray-200 dark:border-gray-700 active:scale-95"
              title="Add 1 hour"
            >
              +1h
            </button>
          </div>

          {/* Quick Presets Selector */}
          <DurationPresets
            selectedMinutes={durationMinutes}
            onSelectDuration={(mins) => setDurationMinutes(mins)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Processing Bulk Renewal...
            </>
          ) : (
            'Extend Subscriptions'
          )}
        </button>
      </form>

      {/* Custom Confirmation Alert Modal */}
      {pendingPayload &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="bulk-renew-confirm-title"
            onClick={handleCancelExtension}
          >
            <div
              className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3
                      id="bulk-renew-confirm-title"
                      className="text-base font-bold text-gray-900 dark:text-white"
                    >
                      Confirm Subscription Extension?
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Please review the bulk extension details before applying.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCancelExtension}
                  aria-label="Close confirmation alert"
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 px-6 py-4 text-sm">
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  Do you really intend to extend{' '}
                  <strong className="font-semibold text-gray-900 dark:text-white">
                    {pendingPayload.service_type === 'PPPOE' ? 'PPPoE Subscribers' : 'Hotspot Users'}
                  </strong>{' '}
                  subscriptions by{' '}
                  <strong className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatDurationSummary(pendingPayload.duration_minutes)}
                  </strong>
                  ?
                </p>

                <div className="rounded-xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Extension Duration</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatDurationSummary(pendingPayload.duration_minutes)} ({pendingPayload.duration_minutes} min)
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Interruption Window</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Last {pendingPayload.window_hours} hour{pendingPayload.window_hours === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Target Router</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-right truncate max-w-[60%]">
                      {selectedRouterLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/80 px-6 py-3.5">
                <button
                  type="button"
                  onClick={handleCancelExtension}
                  className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExtension}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  Yes, Extend Subscriptions
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};