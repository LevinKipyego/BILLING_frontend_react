// src/components/payouts/PayoutSecurity.tsx

import { useEffect, useState } from "react";

import {
  getPayoutSecurity,
  updatePayoutContact,
} from "../../api/payoutApi";

import type { PayoutSecurity as PayoutSecurityType } from "../../types/vendorPayout";

import {
  OutlineButton,
  PayoutSurface,
  SurfaceHeader,
  SurfaceRow,
} from "./PayOutSurface";

import {
  maskEmail,
  maskPhone,
} from "../../utils/payoutFormat";

interface Props {
  onChangePin: (mode: "setup" | "change") => void;
}

export default function PayoutSecurity({
  onChangePin,
}: Props) {
  const [security, setSecurity] =
    useState<PayoutSecurityType | null>(null);

  const [loading, setLoading] = useState(true);

  const [editingPhone, setEditingPhone] =
    useState(false);

  const [editingEmail, setEditingEmail] =
    useState(false);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const data = await getPayoutSecurity();

      setSecurity(data);
      setPhone(data.payoutPhone ?? "");
      setEmail(data.payoutEmail ?? "");
    } catch (err) {
      console.error(
        "Failed to load payout security:",
        err
      );

      setError(
        "Unable to load payout security settings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function savePhone() {
    try {
      setSaving(true);
      setError(null);

      const data = await updatePayoutContact({
        payoutPhone: phone.trim(),
      });

      setSecurity(data);
      setPhone(data.payoutPhone ?? "");
      setEditingPhone(false);
    } catch (err) {
      console.error(
        "Failed to update payout phone:",
        err
      );

      setError(
        "Unable to update payout phone."
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveEmail() {
    try {
      setSaving(true);
      setError(null);

      const data = await updatePayoutContact({
        payoutEmail: email.trim(),
      });

      setSecurity(data);
      setEmail(data.payoutEmail ?? "");
      setEditingEmail(false);
    } catch (err) {
      console.error(
        "Failed to update payout email:",
        err
      );

      setError(
        "Unable to update payout email."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PayoutSurface>
        <div className="animate-pulse p-4 sm:p-5 bg-white dark:bg-gray-900 rounded-lg">
          <div className="h-3 w-32 rounded bg-slate-100 dark:bg-gray-800" />

          <div className="mt-4 space-y-3">
            <div className="h-10 rounded bg-slate-100 dark:bg-gray-800" />
            <div className="h-10 rounded bg-slate-100 dark:bg-gray-800" />
            <div className="h-10 rounded bg-slate-100 dark:bg-gray-800" />
          </div>
        </div>
      </PayoutSurface>
    );
  }

  if (!security) {
    return (
      <PayoutSurface>
        <div className="p-4 sm:p-5 text-[11px] text-red-600 dark:text-red-400 font-medium bg-white dark:bg-gray-900 rounded-lg">
          {error ??
            "Payout security information is unavailable."}
        </div>
      </PayoutSurface>
    );
  }

  return (
    <PayoutSurface>
      <SurfaceHeader
        title="Payout security"
        description="Manage your withdrawal contact and payout PIN."
      />

      {error && (
        <div className="border-b border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/50 px-4 sm:px-5 py-2.5 text-[11px] text-red-700 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      <div>
        {/* =================================================
            PAYOUT PHONE
        ================================================== */}

        {editingPhone ? (
          <div className="border-b border-slate-200 dark:border-gray-800 px-4 sm:px-5 py-3.5 bg-white dark:bg-gray-900">
            <label className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
              Payout phone
            </label>

            <div className="mt-1 flex gap-2">
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                inputMode="tel"
                autoComplete="tel"
                className="h-8 min-w-0 flex-1 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 text-[12px] text-slate-900 dark:text-slate-100 outline-none focus:border-slate-400 dark:focus:border-gray-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-gray-600"
                placeholder="2547XXXXXXXX"
              />

              <OutlineButton
                disabled={saving}
                onClick={() => {
                  setPhone(
                    security.payoutPhone ?? ""
                  );
                  setEditingPhone(false);
                }}
              >
                Cancel
              </OutlineButton>

              <OutlineButton
                disabled={
                  saving ||
                  phone.trim() ===
                    (security.payoutPhone ?? "")
                }
                onClick={savePhone}
              >
                {saving ? "Saving..." : "Save"}
              </OutlineButton>
            </div>
          </div>
        ) : (
          <SurfaceRow
            label="Payout phone"
            value={
              <span className="font-mono text-[12px] text-slate-900 dark:text-slate-100">
                {security.payoutPhone
                  ? maskPhone(
                      security.payoutPhone
                    )
                  : "Not configured"}
              </span>
            }
            action={
              <OutlineButton
                onClick={() => {
                  setError(null);
                  setPhone(
                    security.payoutPhone ?? ""
                  );
                  setEditingPhone(true);
                }}
              >
                Edit
              </OutlineButton>
            }
          />
        )}

        {/* =================================================
            PAYOUT EMAIL
        ================================================== */}

        {editingEmail ? (
          <div className="border-b border-slate-200 dark:border-gray-800 px-4 sm:px-5 py-3.5 bg-white dark:bg-gray-900">
            <label className="text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
              Payout email
            </label>

            <div className="mt-1 flex gap-2">
              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                type="email"
                autoComplete="email"
                className="h-8 min-w-0 flex-1 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 text-[12px] text-slate-900 dark:text-slate-100 outline-none focus:border-slate-400 dark:focus:border-gray-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-gray-600"
                placeholder="vendor@example.com"
              />

              <OutlineButton
                disabled={saving}
                onClick={() => {
                  setEmail(
                    security.payoutEmail ?? ""
                  );
                  setEditingEmail(false);
                }}
              >
                Cancel
              </OutlineButton>

              <OutlineButton
                disabled={
                  saving ||
                  email.trim() ===
                    (security.payoutEmail ?? "")
                }
                onClick={saveEmail}
              >
                {saving ? "Saving..." : "Save"}
              </OutlineButton>
            </div>
          </div>
        ) : (
          <SurfaceRow
            label="Payout email"
            value={
              <span className="text-slate-900 dark:text-slate-100">
                {security.payoutEmail
                  ? maskEmail(
                      security.payoutEmail
                    )
                  : "Not configured"}
              </span>
            }
            action={
              <OutlineButton
                onClick={() => {
                  setError(null);
                  setEmail(
                    security.payoutEmail ?? ""
                  );
                  setEditingEmail(true);
                }}
              >
                Edit
              </OutlineButton>
            }
          />
        )}

        {/* =================================================
            PAYOUT PIN
        ================================================== */}

        <SurfaceRow
          label="Payout PIN"
          value={
            security.pinConfigured ? (
              <span className="font-mono tracking-[0.25em] text-emerald-600 dark:text-emerald-400 font-medium">
                ••••••
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Not configured
              </span>
            )
          }
          action={
            <OutlineButton
              onClick={() => {
                setError(null);

                onChangePin(
                  security.pinConfigured
                    ? "change"
                    : "setup"
                );
              }}
            >
              {security.pinConfigured
                ? "Change PIN"
                : "Set PIN"}
            </OutlineButton>
          }
        />

        {/* =================================================
            PIN STATUS
        ================================================== */}

        {security.pinConfigured && (
          <div className="border-t border-slate-200 dark:border-gray-800 px-4 sm:px-5 py-3 bg-white dark:bg-gray-900 rounded-b-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500 font-medium">
                Security status
              </span>

              <span
                className={[
                  "text-[9px] font-semibold",
                  security.pinEnabled
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400",
                ].join(" ")}
              >
                {security.pinEnabled
                  ? "Enabled"
                  : "Disabled"}
              </span>
            </div>
          </div>
        )}
      </div>
    </PayoutSurface>
  );
}