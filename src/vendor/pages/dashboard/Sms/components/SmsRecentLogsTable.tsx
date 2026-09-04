import React from "react";

export interface SMSLogEntry {
  id: number;
  recipient: string;
  message_title?: string;
  message_content?: string;
  provider_name?: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  failure_reason?: string | null;
  created_at: string;
}

interface SmsRecentLogsTableProps {
  logs?: SMSLogEntry[];
  onViewAllClick?: () => void;
}

/**
 * Utility to convert UTC timestamps into relative local time strings
 * (e.g., "just now", "5 mins ago", "2 hrs ago", "3 days ago")
 */
const formatRelativeTime = (utcDateString: string): string => {
  if (!utcDateString) return "—";

  // Parse ISO/SQL UTC string format safely (e.g., "2026-09-02 16:29:15" -> ISO)
  const normalizedUtcString = utcDateString.includes("T")
    ? utcDateString
    : utcDateString.replace(" ", "T") + "Z";

  const date = new Date(normalizedUtcString);

  // Fallback if parsing fails or input is already relative (e.g., mock data)
  if (isNaN(date.getTime())) {
    return utcDateString;
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return "just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} mo${diffInMonths > 1 ? "s" : ""} ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} yr${diffInYears > 1 ? "s" : ""} ago`;
};

/**
 * Truncates text to the first specified number of words
 */
const truncateWords = (text: string = "", wordLimit: number = 6): string => {
  if (!text) return "—";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

// Fallback mock data if no logs prop is supplied
const DEFAULT_MOCK_LOGS: SMSLogEntry[] = [
  {
    id: 23,
    recipient: "+254712345678",
    message_title: "Direct SMS",
    message_content:
      "Your M-Pesa payment could not be processed due to a Safaricom network Coverage error. Please try moving to an area with good Safaricom cellular network coverage and try again.",
    provider_name: "BYTEWAVE",
    status: "SUCCESS",
    failure_reason: null,
    created_at: "2026-09-02 16:29:15",
  },
  {
    id: 22,
    recipient: "+254722987654",
    message_title: "Direct SMS",
    message_content:
      "Your M-Pesa payment could not be processed due to a Safaricom network Coverage error. Please try moving to an area with good Safaricom cellular network coverage and try again.",
    provider_name: "BYTEWAVE",
    status: "SUCCESS",
    failure_reason: null,
    created_at: "2026-09-02 15:01:15",
  },
];

export const SmsRecentLogsTable: React.FC<SmsRecentLogsTableProps> = ({
  logs = DEFAULT_MOCK_LOGS,
  onViewAllClick,
}) => {
  // Always take only the last/latest 5 items
  const recentLogs = logs.slice(0, 5);

  const getStatusBadge = (status: SMSLogEntry["status"]) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Success
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Failed
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm">
      {/* Header & View All button */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
            Recent SMS Activity
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Showing the latest 5 dispatch requests
          </p>
        </div>

        {onViewAllClick && (
          <button
            onClick={onViewAllClick}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            View all logs &rarr;
          </button>
        )}
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-gray-800 text-slate-500 dark:text-slate-400 font-medium">
              <th className="py-2 px-2.5">Recipient</th>
              <th className="py-2 px-2.5">Title</th>
              <th className="py-2 px-2.5">Message Snippet</th>
              <th className="py-2 px-2.5">Provider</th>
              <th className="py-2 px-2.5">Status</th>
              <th className="py-2 px-2.5 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60 text-slate-700 dark:text-slate-300">
            {recentLogs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-colors"
              >
                {/* Recipient */}
                <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-900 dark:text-slate-200 whitespace-nowrap">
                  {log.recipient || "—"}
                </td>

                {/* Template / Title */}
                <td className="py-2.5 px-2.5 font-medium whitespace-nowrap">
                  {log.message_title || "Direct SMS"}
                </td>

                {/* Message Content Snippet */}
                <td className="py-2.5 px-2.5 text-slate-600 dark:text-slate-400 max-w-[200px] sm:max-w-xs truncate">
                  <span title={log.message_content}>
                    {truncateWords(log.message_content, 7)}
                  </span>
                </td>

                {/* Provider */}
                <td className="py-2.5 px-2.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {log.provider_name || "—"}
                </td>

                {/* Status */}
                <td className="py-2.5 px-2.5 whitespace-nowrap">
                  <div className="flex flex-col">
                    {getStatusBadge(log.status)}
                    {log.status === "FAILED" && log.failure_reason && (
                      <span
                        className="text-[10px] text-red-500/80 mt-0.5 truncate max-w-[150px]"
                        title={log.failure_reason}
                      >
                        {log.failure_reason}
                      </span>
                    )}
                  </div>
                </td>

                {/* Relative Time */}
                <td
                  className="py-2.5 px-2.5 text-right text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap"
                  title={log.created_at}
                >
                  {formatRelativeTime(log.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SmsRecentLogsTable;