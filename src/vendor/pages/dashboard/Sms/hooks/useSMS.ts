import { useState, useEffect, useCallback } from 'react';
import { 
  fetchSMSProviders, 
  fetchSMSTemplates, 
  fetchSMSAnalytics 
} from '../api/sms';
import type { SMSProvider, SMSMessage, SMSAnalyticsResponse } from '../types/sms';

export const useSMSData = (analyticsDays: number = 30) => {
  const [providers, setProviders] = useState<SMSProvider[]>([]);
  const [templates, setTemplates] = useState<SMSMessage[]>([]);
  const [analytics, setAnalytics] = useState<SMSAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const reloadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [providersData, templatesData, analyticsData] = await Promise.all([
        fetchSMSProviders(),
        fetchSMSTemplates(),
        fetchSMSAnalytics(analyticsDays),
      ]);
      setProviders(providersData);
      setTemplates(templatesData);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load SMS data.');
    } finally {
      setLoading(false);
    }
  }, [analyticsDays]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return { providers, templates, analytics, loading, error, refresh: reloadData };
};