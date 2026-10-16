import { useState } from "react";
import { 
    User, 
    Phone, 
    Loader2, 
    MapPin, 
    Compass, 
    ChevronDown, 
     
} from "lucide-react";

import { apiFetch } from "../../../../api/client";

interface Props {
    serviceType: "HOTSPOT" | "PPPOE";
    onSuccess?: () => void;
}

type FormSection = "basic" | "location" | "coordinates" | null;

export default function CustomerForm({
    serviceType,
    onSuccess,
}: Props) {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    
    // Optional Backend Fields
    const [county, setCounty] = useState("");
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState("");
    const [building, setBuilding] = useState("");
    const [floor, setFloor] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Accordion Form State
    const [formSection, setFormSection] = useState<FormSection>("basic");

    const toggleFormSection = (section: Exclude<FormSection, null>) => {
        setFormSection((current) => (current === section ? null : section));
    };

    function normalizePhone(value: string) {
        let phone = value.replace(/\D/g, "");

        if (phone.startsWith("0")) {
            phone = "254" + phone.substring(1);
        }

        if (phone.startsWith("7")) {
            phone = "254" + phone;
        }

        return phone;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await apiFetch("/customers/create/", {
                method: "POST",
                body: JSON.stringify({
                    full_name: fullName,
                    phone: normalizePhone(phone),
                    service_type: serviceType,
                    county: county || null,
                    address: address || null,
                    location: location || null,
                    building: building || null,
                    floor: floor || null,
                    house_no: houseNo || null,
                    longitude: longitude ? parseFloat(longitude) : null,
                    latitude: latitude ? parseFloat(latitude) : null,
                }),
            });

            setFullName("");
            setPhone("");
            setCounty("");
            setAddress("");
            setLocation("");
            setBuilding("");
            setFloor("");
            setHouseNo("");
            setLongitude("");
            setLatitude("");
            onSuccess?.();
        } catch (err: any) {
            setError(
                err?.message ?? "Unable to create customer."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="rounded-lg border border-slate-200 dark:border-gray-800 overflow-hidden divide-y divide-slate-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                
                {/* 1. Basic Information Section */}
                <div>
                    <button
                        type="button"
                        onClick={() => toggleFormSection("basic")}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-gray-800/50"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <User className="h-3.5 w-3.5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                    1. Basic Information & Service
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                    {fullName ? `Name: ${fullName}` : "Enter full name and contact info"}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${formSection === "basic" ? "rotate-180" : ""}`} />
                    </button>

                    {formSection === "basic" && (
                        <div className="space-y-3.5 px-4 pb-4 pt-1">
                            {/* Full Name */}
                            <div>
                                <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                    />
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:border-slate-400 dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                    />
                                    <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="0712345678"
                                        required
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:border-slate-400 dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none"
                                    />
                                </div>
                                <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                                    Accepted formats: 0712345678, 712345678, 254712345678
                                </p>
                            </div>

                            {/* Service Type Display */}
                            <div>
                                <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                    Service Type
                                </label>
                                <div className="rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 px-3 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                                    {serviceType === "PPPOE" ? "PPPoE" : "Hotspot"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Location & Address Section */}
                <div>
                    <button
                        type="button"
                        onClick={() => toggleFormSection("location")}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-gray-800/50"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <MapPin className="h-3.5 w-3.5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                    2. Location & Address Details
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                    {location || building ? "Location details added" : "County, building, floor, house no."}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${formSection === "location" ? "rotate-180" : ""}`} />
                    </button>

                    {formSection === "location" && (
                        <div className="space-y-3.5 px-4 pb-4 pt-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                        County
                                    </label>
                                    <input
                                        value={county}
                                        onChange={(e) => setCounty(e.target.value)}
                                        placeholder="Nairobi"
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 px-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                        Location / Area
                                    </label>
                                    <input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Westlands"
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 px-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                        Building
                                    </label>
                                    <input
                                        value={building}
                                        onChange={(e) => setBuilding(e.target.value)}
                                        placeholder="Heights Apartments"
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 px-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                        Floor
                                    </label>
                                    <input
                                        value={floor}
                                        onChange={(e) => setFloor(e.target.value)}
                                        placeholder="3rd Floor"
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 px-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                        House No.
                                    </label>
                                    <input
                                        value={houseNo}
                                        onChange={(e) => setHouseNo(e.target.value)}
                                        placeholder="B4"
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 px-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                    Full Address
                                </label>
                                <textarea
                                    rows={2}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Street address or additional directions..."
                                    className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 p-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. GPS Coordinates Section */}
                <div>
                    <button
                        type="button"
                        onClick={() => toggleFormSection("coordinates")}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-gray-800/50"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <Compass className="h-3.5 w-3.5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                    3. GPS Coordinates (Optional)
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                    {longitude && latitude ? "Coordinates set" : "Latitude & longitude for mapping"}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${formSection === "coordinates" ? "rotate-180" : ""}`} />
                    </button>

                    {formSection === "coordinates" && (
                        <div className="space-y-3.5 px-4 pb-4 pt-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        placeholder="-1.286389"
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 px-3 font-mono text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em] text-slate-400 dark:text-slate-500">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        placeholder="36.817223"
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800 py-2.5 px-3 font-mono text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    {loading && (
                        <Loader2 size={15} className="animate-spin" />
                    )}
                    Create Customer
                </button>
            </div>
        </form>
    );
}