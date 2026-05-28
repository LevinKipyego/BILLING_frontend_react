
import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";

type Vendor = {
  id: string;
  name: string;
  email: string;
  vendor_code: string;
  status: string;
  created_at: string;
};

type VendorProfile = {
  vendor: Vendor;
  vendor_code: string; // Lifted directly into profile state
  phone_number: string;
  support_phone: string;
  location: string;
  address: string;
  website: string;
  logo: string | null;
  default_timezone: string;
  default_currency: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export default function VendorProfilePage(): React.JSX.Element {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // =========================
  // FETCH VENDOR PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/vendors/profile/");
      
      // Inject vendor_code directly into the profile state schema if missing
      setProfile({
        ...data,
        vendor_code: data.vendor_code || data.vendor?.vendor_code || "",
      });
    } catch (error: any) {
      console.error(error);
      setMessage({
        type: "error",
        text: error?.message || "Failed to load configuration parameters.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT CHANGES
  // =========================
  const handleFieldInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SAVE PROFILE PERSISTENCE
  // =========================
  const saveProfile = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      setMessage(null);

      const payload = {
        vendor_code: profile.vendor_code, // Added to payload mapping
        phone_number: profile.phone_number,
        support_phone: profile.support_phone,
        location: profile.location,
        address: profile.address,
        website: profile.website,
        default_timezone: profile.default_timezone,
        default_currency: profile.default_currency,
        notes: profile.notes,
      };

      const response = await apiFetch("/vendors/profile/", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const updatedData = response?.data ? response.data : response;
      setProfile({
        ...updatedData,
        vendor_code: updatedData.vendor_code || updatedData.vendor?.vendor_code || profile.vendor_code,
      });
      
      setMessage({ type: "success", text: "Vendor profile specifications committed successfully." });
    } catch (error: any) {
      console.error(error);
      setMessage({
        type: "error",
        text: error?.message || "Failed to save data mutations back to ledger array.",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40 bg-slate-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Syncing Data Store...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto mt-24 p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-center shadow-xs">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Record Block Disconnected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Unable to process vendor context array references.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-2 md:p-8 space-y-4 md:space-y-6 animate-fadeIn pb-24 transition-colors duration-500 font-['Figtree',sans-serif]">
      
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-2 mt-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase ">
              Vendor Profile
            </h1>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight">
            Manage your ISP business details
          </p>
        </div>
        
        {/* TOP LEVEL CTA BUTTON */}
        <div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full md:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-gray-800 text-white disabled:text-slate-500 font-bold text-xs uppercase tracking-wider rounded-md transition shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 outline-none"
          >
            {saving ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Syncing Changes...</span>
              </>
            ) : (
              <span>Save Profile</span>
            )}
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER BLOCK */}
      {message && (
        <div className={`mx-2 border rounded-md p-3.5 text-xs font-bold uppercase tracking-tight shadow-xs ${
          message.type === "success"
            ? "bg-white dark:bg-gray-800 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
            : "bg-white dark:bg-gray-800 border-rose-500/30 text-rose-600 dark:text-rose-400"
        }`}>
          {message.text}
        </div>
      )}

      {/* COMPONENT GRID WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start px-2">
        
        {/* LEFT COLUMN: EDITABLE SPEC SHEET STACK */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          
          {/* CARD 1: FIRM TAXONOMY */}
          <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/70 rounded-2xl p-4 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-gray-700/50 pb-2">
              Business Specification Keys
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Vendor Core Name</label>
                <input
                  disabled
                  type="text"
                  value={profile.vendor.name}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-md text-xs font-bold text-slate-400 dark:text-gray-500 outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Infrastructure Node Email</label>
                <input
                  disabled
                  type="email"
                  value={profile.vendor.email}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-md text-xs font-bold text-slate-400 dark:text-gray-500 outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Vendor Access Code (Editable)</label>
                <input
                  type="text"
                  name="vendor_code"
                  value={profile.vendor_code || ""}
                  onChange={handleFieldInput}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Primary Site Web Link</label>
                <input
                  type="url"
                  name="website"
                  value={profile.website || ""}
                  onChange={handleFieldInput}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: OPERATIONS TELEPHONY & ROUTING */}
          <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/70 rounded-2xl p-4 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-gray-700/50 pb-2">
              Communications Network Strings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Office Contact string</label>
                <input
                  type="text"
                  name="phone_number"
                  value={profile.phone_number || ""}
                  onChange={handleFieldInput}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">NOC Desk Hotline</label>
                <input
                  type="text"
                  name="support_phone"
                  value={profile.support_phone || ""}
                  onChange={handleFieldInput}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: GEOGRAPHIC ANCHOR METRICS */}
          <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/70 rounded-2xl p-4 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider  border-b border-slate-100 dark:border-gray-700/50 pb-2">
              Localization Parameters
            </h2>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">HQ Operational Hub Region</label>
              <input
                type="text"
                name="location"
                value={profile.location || ""}
                onChange={handleFieldInput}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Physical Street Address / Lat Long Coordinates</label>
              <textarea
                name="address"
                value={profile.address || ""}
                onChange={handleFieldInput}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-xs resize-none"
              />
            </div>
          </div>

          {/* CARD 4: INTERNAL ROUTINE MEMORANDA */}
          <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/70 rounded-2xl p-4 md:p-6 shadow-xs space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight mb-1">Administrative Memoranda</label>
            <textarea
              name="notes"
              value={profile.notes || ""}
              onChange={handleFieldInput}
              rows={4}
              placeholder="Internal tracking conditions or contextual system annotations regarding this profile target..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-xs font-medium text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-xs"
            />
          </div>

        </div>

        {/* RIGHT COLUMN: READONLY RUN METRICS AND CONFIG SELECTORS */}
        <div className="space-y-4 md:space-y-6">
          
          {/* COMPONENT A: REGIONAL MATRIX INTERFACES (SELECT SECTIONS) */}
          <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/70 rounded-2xl p-4 shadow-xs space-y-4">
            <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider
             border-b border-slate-100 dark:border-gray-700/50 pb-2">
              System Regional Selection
            </h2>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Timezone</label>
              <select
                name="default_timezone"
                value={profile.default_timezone || "Africa/Nairobi"}
                onChange={handleFieldInput}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer shadow-xs"
              >
                <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Base Billing Ledger Currency</label>
              <select
                name="default_currency"
                value={profile.default_currency || "KES"}
                onChange={handleFieldInput}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer shadow-xs"
              >
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="USD">USD - United States Dollar</option>
                <option value="EUR">EUR - Euro Zone Ledger</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>

          {/* COMPONENT B: IMMUTABLE NODE TELEMETRY */}
          <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700/70 rounded-md p-4 shadow-xs space-y-4">
            
            {/* AVATAR EMBED BLOCK */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-gray-700/50">
              <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex items-center justify-center font-black text-xs text-blue-500 tracking-tight shadow-2xs overflow-hidden">
                {profile.logo ? (
                  <img src={profile.logo} alt="Brand Logo" className="w-full h-full object-cover" />
                ) : (
                  profile.vendor.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{profile.vendor.name}</h3>
                <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border tracking-wider ${
                  profile.vendor.status?.toLowerCase() === "active"
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-500/20"
                }`}>
                  {profile.vendor.status || "Operational"}
                </span>
              </div>
            </div>

            {/* METRICS STACK */}
            <div className="space-y-2 text-[11px] font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400">
              <div className="flex justify-between items-center">
                <span>Record Created</span>
                <span className="font-mono text-slate-700 dark:text-slate-200 text-xs tracking-normal">
                  {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Array Write</span>
                <span className="font-mono text-slate-700 dark:text-slate-200 text-xs tracking-normal">
                  {new Date(profile.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* COMPONENT C: SAFETY OVERLAY CARD */}
          <div className="p-3 bg-slate-100/50 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-800/80 rounded-md">
            <span className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider ">NOC Constraints Lock</span>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 leading-normal tracking-wide">
              MUTATIONS TO SECURITY PROTOCOLS AND ENCRYPTED IDENTITY ARRAYS COMMIT DIRECTLY TO CORE FREE-RADIUS LOGIC ON RUN COMMAND.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
