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
    const [openUpward, setOpenUpward] = useState(false);
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
                className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-slate-700 dark:hover:text-slate-200"
            >
                <MoreVertical size={16} />
            </button>

            {open && (
               <div 
  className={`absolute right-0 z-[9999] w-48 overflow-hidden rounded-lg border border-slate-200 dark:border-gray-700 bg-white shadow-lg dark:bg-gray-900 ${
    openUpward 
      ? "bottom-full mb-1.5 origin-bottom" 
      : "top-full mt-1.5 origin-top"
  }`}
>
                    {/* View */}
                    <MenuItem
                        icon={<Eye size={15} />}
                        label="View Customer"
                        onClick={() => {
                            setOpen(false);
                            onView?.(customer);
                        }}
                    />

                    {/* PPPoE */}
                    {customer.service_type === "PPPOE" && (
                        <MenuItem
                            icon={<Wifi size={15} />}
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
                        icon={<RefreshCcw size={15} />}
                        label="Renew Subscription"
                        onClick={() => {
                            setOpen(false);
                            onRenew?.(customer);
                        }}
                    />

                    {/* Suspend */}
                    <MenuItem
                        icon={<Ban size={15} />}
                        label="Suspend"
                        danger
                        onClick={() => {
                            setOpen(false);
                            onSuspend?.(customer);
                        }}
                    />

                    {/* Delete */}
                    <MenuItem
                        icon={<Trash2 size={15} />}
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
            className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs transition hover:bg-slate-50 dark:hover:bg-gray-800 ${
                danger
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-700 dark:text-slate-200"
            }`}
        >
            <span className="shrink-0">{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );
}

function Divider() {
    return (
        <div className="border-t border-slate-100 dark:border-gray-800" />
    );
}