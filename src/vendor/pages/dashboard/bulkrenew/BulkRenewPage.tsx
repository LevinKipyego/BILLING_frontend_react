import React, { useState } from 'react';
import { BulkRenewForm } from './components/BulkRenewForm';
import type { BulkRenewPayload, BulkRenewResponse } from './types/bulkRenew';
import { bulkRenewApi } from './api/bulkRenewApi';

export const BulkRenewPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleBulkRenew = async (payload: BulkRenewPayload) => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const res: BulkRenewResponse = await bulkRenewApi.renewUsers(payload);
      setFeedback({
        type: 'success',
        message: res.message || `Successfully extended ${res.renewed_count} subscriber accounts!`,
      });
    } catch (err: any) {
      const errMsg = err.message || 'An unexpected error occurred during bulk renewal.';
      setFeedback({
        type: 'error',
        message: errMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 transition-colors">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Network Recovery & Renewal
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Perform targeted bulk subscription extensions for users impacted by localized outages, fiber cuts, or power failures.
        </p>
      </div>

      {feedback && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-start justify-between shadow-sm transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div>
            <p className="font-semibold text-sm">
              {feedback.type === 'success' ? 'Operation Successful' : 'Renewal Failed'}
            </p>
            <p className="text-sm mt-0.5 opacity-90">{feedback.message}</p>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-lg leading-none ml-4 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      <BulkRenewForm onSubmit={handleBulkRenew} isLoading={isLoading} />
    </div>
  );
};

export default BulkRenewPage;