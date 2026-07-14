import { useEffect, useRef, useState } from "react";
import {
    MoreVertical,
    Eye,
    Wifi,
    RefreshCcw,
    Ban,
    Trash2,
} from "lucide-react";
import type { Customer } from "../types/types";

interface Props {
    customer: Customer;
    onCreatePPPoE: (customer: Customer) => void;
    onView?: (customer: Customer) => void;
    onRenew?: (customer: Customer) => void;
    onSuspend?: (customer: Customer) => void;
    onDelete?: (customer: Customer) => void;
}

export default function CustomerActions({
    customer,
    onCreatePPPoE,
    onView,
    onRenew,
    onSuspend,
    onDelete,
}: Props) {
    const [open, setOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false); // Tracks menu direction
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const toggleMenu = () => {
        if (!open && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // If there is less than 280px (approx height of the dropdown) below the button, open upwards
            const spaceBelow = viewportHeight - rect.bottom;
            if (spaceBelow < 280) {
                setOpenUpward(true);
            } else {
                setOpenUpward(false);
            }
        }
        setOpen(!open);
    };

    return (
        <div ref={ref} className="relative inline-block">
            <button
                onClick={toggleMenu}
                className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
                <MoreVertical size={18} />
            </button>

            {open && (
                <div 
                    className={`absolute right-0 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 ${
                        openUpward 
                            ? "bottom-full mb-2 origin-bottom" 
                            : "top-full mt-2 origin-top"
                    }`}
                >
                    {/* View */}
                    <MenuItem
                        icon={<Eye size={16} />}
                        label="View Customer"
                        onClick={() => {
                            setOpen(false);
                            onView?.(customer);
                        }}
                    />

                    {/* PPPoE */}
                    {customer.service_type === "PPPOE" && (
                        <MenuItem
                            icon={<Wifi size={16} />}
                            label="Create PPPoE"
                            onClick={() => {
                                setOpen(false);
                                onCreatePPPoE(customer);
                            }}
                        />
                    )}

                    <Divider />

                    {/* Renew */}
                    <MenuItem
                        icon={<RefreshCcw size={16} />}
                        label="Renew Subscription"
                        onClick={() => {
                            setOpen(false);
                            onRenew?.(customer);
                        }}
                    />

                    {/* Suspend */}
                    <MenuItem
                        icon={<Ban size={16} />}
                        label="Suspend"
                        danger
                        onClick={() => {
                            setOpen(false);
                            onSuspend?.(customer);
                        }}
                    />

                    {/* Delete */}
                    <MenuItem
                        icon={<Trash2 size={16} />}
                        label="Delete"
                        danger
                        onClick={() => {
                            setOpen(false);
                            onDelete?.(customer);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
    onClick: () => void;
}

function MenuItem({ icon, label, danger = false, onClick }: MenuItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 ${
                danger
                    ? "text-red-600"
                    : "text-slate-700 dark:text-slate-200"
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

function Divider() {
    return (
        <div className="border-t border-slate-200 dark:border-slate-700" />
    );
}