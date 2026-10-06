// src/utils/payoutFormat.ts

import type { PayoutStatus } from "../types/vendorPayout";

export function formatKES(value: string | number): string {
  const amount =
    typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(amount)) {
    return "KES 0.00";
  }

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatShortDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function maskPhone(phone?: string | null): string {
  if (!phone) return "Not configured";

  if (phone.length < 7) {
    return phone;
  }

  return `${phone.slice(0, 7)} *** ${phone.slice(-4)}`;
}

export function maskEmail(email?: string | null): string {
  if (!email) return "Not configured";

  const [name, domain] = email.split("@");

  if (!domain || !name) {
    return email;
  }

  if (name.length <= 2) {
    return `${name[0]}***@${domain}`;
  }

  return `${name.slice(0, 2)}***@${domain}`;
}

export function payoutStatusLabel(
  status: PayoutStatus | string
): string {
  switch (status) {
    case "SUCCESS":
      return "Successful";

    case "FAILED":
      return "Failed";

    case "PROCESSING":
      return "Processing";

    case "SUBMITTED":
      return "Submitted";

    case "PENDING":
      return "Pending";

    default:
      return status;
  }
}