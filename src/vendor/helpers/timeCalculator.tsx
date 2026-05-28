export interface HumanizedDuration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

/**
 * Converts a duration in seconds into an object breaking down 
 * days, hours, minutes, and seconds, alongside a user-friendly string.
 * * @param totalSeconds - The duration in seconds to calculate.
 * @returns An object containing the calculated time units and a formatted string.
 */
export function humanizeDuration(totalSeconds: number): HumanizedDuration {
  // Handle edge case for negative values or absolute zero
  const absoluteSeconds = Math.max(0, Math.floor(totalSeconds));

  if (absoluteSeconds === 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, formatted: "0s" };
  }

  // Time calculation math
  const days = Math.floor(absoluteSeconds / (24 * 3600));
  const hours = Math.floor((absoluteSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((absoluteSeconds % 3600) / 60);
  const seconds = absoluteSeconds % 60;

  // Build a readable string format (e.g., "2d 4h 15m 30s")
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  const formatted = parts.join(" ");

  return {
    days,
    hours,
    minutes,
    seconds,
    formatted,
  };
}