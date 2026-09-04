import React, { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { SMSAnalyticsResponse } from "./types/sms";
import { fetchSMSAnalytics } from "./api/sms";
import SmsRecentLogsTable from "./components/SmsRecentLogsTable";
export const SmsAnalyticsDashboard: React.FC = () => {
  const [days, setDays] = useState<number>(30);
  const [analytics, setAnalytics] = useState<SMSAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSMSAnalytics(days);
      setAnalytics(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load SMS delivery analytics."
      );
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px] text-slate-400">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mr-2.5"></div>
        <span className="text-xs sm:text-sm">Loading SMS analytics & charts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadAnalytics}
            className="underline hover:text-red-500 font-medium text-xs ml-3"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
        No analytics data available.
      </div>
    );
  }

  const { summary, failure_analysis, charts } = analytics;

  const STATUS_COLORS = {
    successful: "#10B981", // Emerald 500
    failed: "#EF4444",     // Red 500
    pending: "#F59E0B",    // Amber 500
  };

  const statusPieData = [
    { name: "Successful", value: summary.successful, color: STATUS_COLORS.successful },
    { name: "Failed", value: summary.failed, color: STATUS_COLORS.failed },
    { name: "Pending", value: summary.pending, color: STATUS_COLORS.pending },
  ].filter((item) => item.value > 0);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-200">
      {/* Top Header & Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-gray-700 pb-3.5">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            SMS Delivery Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor dispatch logs, success ratios, and failure trends.
          </p>
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full sm:w-auto px-3 py-1.5 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Requests */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-3.5 sm:p-4 shadow-sm">
          <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Total Requests
          </span>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mt-1">
            {summary.total_requests.toLocaleString()}
          </div>
        </div>

        {/* Successful */}
        <div className="bg-white dark:bg-gray-900 border border-emerald-500/30 dark:border-gray-700 rounded-lg p-3.5 sm:p-4 shadow-sm">
          <span className="text-[11px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Successful
          </span>
          <div className="text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            {summary.successful.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600/90 dark:text-emerald-400/90 mt-0.5 font-normal">
            {summary.success_rate_percentage}% Success Rate
          </p>
        </div>

        {/* Failed */}
        <div className="bg-white dark:bg-gray-900 border border-red-500/30 dark:border-gray-700 rounded-lg p-3.5 sm:p-4 shadow-sm">
          <span className="text-[11px] sm:text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
            Failed
          </span>
          <div className="text-xl sm:text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
            {summary.failed.toLocaleString()}
          </div>
          <p className="text-[11px] text-red-600/90 dark:text-red-400/90 mt-0.5 font-normal">
            {summary.failure_rate_percentage}% Failure Rate
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-gray-900 border border-amber-500/30 dark:border-gray-700 rounded-lg p-3.5 sm:p-4 shadow-sm">
          <span className="text-[11px] sm:text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            Pending
          </span>
          <div className="text-xl sm:text-2xl font-semibold text-amber-600 dark:text-amber-400 mt-1">
            {summary.pending.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* 1. Daily Trends Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
              Dispatch Trends Over Time
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Daily volume
            </span>
          </div>

          <div className="h-56 sm:h-72 w-full">
            {charts.daily_trends && charts.daily_trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.daily_trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={STATUS_COLORS.successful} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={STATUS_COLORS.successful} stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={STATUS_COLORS.failed} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={STATUS_COLORS.failed} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#FFF",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Area
                    type="monotone"
                    dataKey="successful"
                    name="Successful"
                    stroke={STATUS_COLORS.successful}
                    fillOpacity={1}
                    fill="url(#colorSuccess)"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="failed"
                    name="Failed"
                    stroke={STATUS_COLORS.failed}
                    fillOpacity={1}
                    fill="url(#colorFailed)"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                No daily trend data recorded.
              </div>
            )}
          </div>
        </div>

        {/* 2. Delivery Status Ratio Donut Chart */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mb-1">
              Status Ratio
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              Proportion of sent vs failed messages
            </p>
          </div>

          <div className="h-44 sm:h-52 w-full relative flex items-center justify-center">
            {statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#FFF",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs italic">No data</div>
            )}
          </div>

          <div className="flex justify-around pt-2 border-t border-slate-100 dark:border-gray-800 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-300">Success</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-slate-600 dark:text-slate-300">Failed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-slate-600 dark:text-slate-300">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Provider Breakdown Bar Chart */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm">
          <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mb-3">
            Provider Distribution
          </h2>
          <div className="h-52 sm:h-60 w-full">
            {charts.provider_breakdown && charts.provider_breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.provider_breakdown} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="provider_name" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#FFF",
                    }}
                  />
                  <Bar dataKey="successful" name="Successful" fill={STATUS_COLORS.successful} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="failed" name="Failed" fill={STATUS_COLORS.failed} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic py-6 text-center">
                No provider breakdown recorded.
              </p>
            )}
          </div>
        </div>

        {/* Failure Reasons Analysis */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm">
          <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mb-3">
            Top Failure Reasons
          </h2>

          {failure_analysis.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic py-6 text-center">
              No recorded failures in this timeframe 🎉
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-gray-800">
              {failure_analysis.map((fail, idx) => (
                <li key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-mono truncate max-w-[180px] sm:max-w-xs">
                    {fail.reason}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-red-500/10 text-red-600 dark:text-red-400 rounded border border-red-500/20">
                    {fail.count} failed
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Most Used Templates Breakdown */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm md:col-span-2 lg:col-span-1">
          <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mb-3">
            Most Used Templates
          </h2>

          {charts.top_templates.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic py-6 text-center">
              No template usage recorded in this timeframe.
            </p>
          ) : (
            <ul className="space-y-3">
              {charts.top_templates.map((tpl, idx) => {
                const percentage =
                  summary.total_requests > 0
                    ? Math.min((tpl.total_sent / summary.total_requests) * 100, 100)
                    : 0;

                return (
                  <li key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-normal text-slate-700 dark:text-slate-300 truncate max-w-[180px] sm:max-w-xs">
                        {tpl.template_title}
                      </span>
                      <span className="text-slate-900 dark:text-slate-200 font-medium">
                        {tpl.total_sent.toLocaleString()} sent
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        
      </div>
      {/* 3. Recent 5 Logs Table */}
      <SmsRecentLogsTable
        onViewAllClick={() => {
          // Navigate to full logs route if applicable
          console.log("Navigating to full logs...");
        }}
      />
    </div>
  );
};

export default SmsAnalyticsDashboard;