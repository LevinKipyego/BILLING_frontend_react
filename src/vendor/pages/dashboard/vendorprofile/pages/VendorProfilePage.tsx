import React, { useEffect, useState } from "react";
import type { VendorProfile, VendorProfileUpdatePayload } from "../types/vendor";
import { getVendorProfile, updateVendorProfile } from "../api/vendorProfile";
import BusinessDetailsCard from "../components/vendor/BusinessDetailsCard";
import ContactDetailsCard from "../components/vendor/ContactDetailsCard";
import LocalizationCard from "../components/vendor/LocalizationCard";
import VendorAccountSidebar from "../components/vendor/VendorAccountSidebar";

export default function VendorProfilePage(): React.JSX.Element {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getVendorProfile();
      setProfile(data);
    } catch (error: any) {
      console.error("Error loading vendor profile:", error);
      setMessage({
        type: "error",
        text: error?.message || "Failed to load vendor profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      setMessage(null);

      const payload: VendorProfileUpdatePayload = {
        business_name: profile.business_name,
        phone_number: profile.phone_number,
        support_phone: profile.support_phone,
        support_email: profile.support_email,
        location: profile.location,
        address: profile.address,
        website: profile.website,
        primary_color: profile.primary_color,
        default_timezone: profile.default_timezone,
        default_currency: profile.default_currency,
        default_mikrotik_dns: profile.default_mikrotik_dns,
      };

      const response = await updateVendorProfile(payload);
      setProfile(response.data);

      setMessage({
        type: "success",
        text: "Vendor profile updated successfully.",
      });
    } catch (error: any) {
      console.error("Error saving vendor profile:", error);
      setMessage({
        type: "error",
        text: error?.message || "Failed to save profile updates.",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px] text-slate-400">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mr-2.5"></div>
        <span className="text-xs sm:text-sm">Loading vendor profile configuration...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-200">
      {/* Top Header & Save Button using the requested gradient theme */}
      <section className="relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 shadow-sm sm:rounded-3xl dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30">
        {/* Decorative background glows */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

        <div className="relative p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
              Vendor Profile Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure your ISP business specifications, contacts, and telemetry routing.
            </p>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-gray-800 text-white font-medium text-xs sm:text-sm rounded-lg transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Profile</span>
            )}
          </button>
        </div>
      </section>

      {/* Feedback Banner Block */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs sm:text-sm font-medium border shadow-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Left Column: Editable Form Cards */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <BusinessDetailsCard profile={profile} onChange={handleFieldInput} />
          <ContactDetailsCard profile={profile} onChange={handleFieldInput} />
          <LocalizationCard profile={profile} onChange={handleFieldInput} />
        </div>

        {/* Right Column: Account Sidebar & Regional Selects */}
        <div>
          <VendorAccountSidebar profile={profile} onChange={handleFieldInput} />
        </div>
      </div>
    </div>
  );
}