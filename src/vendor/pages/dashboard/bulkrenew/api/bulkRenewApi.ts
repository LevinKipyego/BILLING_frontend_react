import { apiPost, apiFetch } from '../../../../api/client'; 
import type { BulkRenewPayload, BulkRenewResponse } from '../types/bulkRenew';
import type { MikrotikDevice } from '../../../../types/device'; 
export const bulkRenewApi = {
  /**
   * Execute bulk subscription renewal/extension via backend API
   */
  renewUsers: async (payload: BulkRenewPayload): Promise<BulkRenewResponse> => {
    return apiPost<BulkRenewResponse>('/clients/bulk-renew/', payload);
  },

  /**
   * Fetch list of vendor Mikrotik routers using existing utility function
   */
  getMikrotikRouters: async (): Promise<MikrotikDevice[]> => {
    return apiFetch<MikrotikDevice[]>('/devices/');
  },
};