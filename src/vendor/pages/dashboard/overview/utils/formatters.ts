/**
 * Converts raw bytes into human-readable units (B, KB, MB, GB, TB, PB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0 || isNaN(bytes)) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${value} ${sizes[i]}`;
}

/**
 * Normalizes an array of raw byte numbers into a target uniform unit (e.g., GB or TB)
 * so that chart axes remain scaled correctly.
 */
export function getOptimalByteUnit(bytesArray: number[]): {
  unit: string;
  divider: number;
} {
  const maxBytes = Math.max(...bytesArray, 0);
  const k = 1024;
  if (maxBytes >= Math.pow(k, 4)) return { unit: "TB", divider: Math.pow(k, 4) };
  if (maxBytes >= Math.pow(k, 3)) return { unit: "GB", divider: Math.pow(k, 3) };
  if (maxBytes >= Math.pow(k, 2)) return { unit: "MB", divider: Math.pow(k, 2) };
  return { unit: "KB", divider: k };
}