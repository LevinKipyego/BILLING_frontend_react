import { NavLink } from "react-router-dom";
import { 
  Squares2X2Icon, TicketIcon, ServerIcon, CpuChipIcon, 
  CreditCardIcon, UserIcon 
} from "@heroicons/react/24/outline";
import { CardSimIcon } from "lucide-react";

interface SidebarProps {
  closeMobile?: () => void; 
  isOpen: boolean; 
}

// 1. Defined a grouped structure
const navSections = [
  {
    title: "General",
    items: [
      { to: "/vendor/dashboard", label: "Overview", icon: Squares2X2Icon },
      { to: "/vendor/dashboard/users", label: "Users", icon: UserIcon },
    ]
  },
  {
    title: "Network & Infrastructure",
    items: [
      { to: "/vendor/dashboard/nas", label: "NAS Management", icon: ServerIcon },
      { to: "/vendor/dashboard/mikrotik", label: "MikroTik Devices", icon: CpuChipIcon },
      { to: "/vendor/dashboard/mikrotik/configurations", label: "Configurations", icon: CpuChipIcon },
      { to: "/vendor/dashboard/network", label: "Network", icon: CpuChipIcon },
    ]
  },
  {
    title: "ISP Services",
    items: [
      { to: "/vendor/dashboard/pppoe/credentials/list", label: "PPPoE Credentials", icon: ServerIcon },
      { to: "/vendor/dashboard/pppoe/subscriptions/list", label: "PPPoE Subscriptions", icon: TicketIcon },
      { to: "/vendor/dashboard/hotspot/credentials/list", label: "Hotspot Credentials", icon: ServerIcon },
      { to: "/vendor/dashboard/hotspot/subscriptions/list", label: "Hotspot Subscriptions", icon: TicketIcon },
      { to: "/vendor/dashboard/sessions/dashboard", label: "Active Sessions", icon: Squares2X2Icon },
    ]
  },
  {
    title: "Billing",
    items: [
      { to: "/vendor/dashboard/plans", label: "Service Plans", icon: TicketIcon },
      { to: "/vendor/dashboard/mpesa", label: "M-Pesa Config", icon: CardSimIcon },
      { to: "/vendor/dashboard/mpesa/c2b", label: "C2B Config", icon: CardSimIcon },
      { to: "/vendor/dashboard/transactions", label: "Transactions", icon: CreditCardIcon },
      { to: "/vendor/dashboard/transactions/c2b", label: "M-Pesa C2B Trans", icon: CreditCardIcon },
    ]
  }
];

const Sidebar = ({ closeMobile, isOpen }: SidebarProps) => {
  return (
    <nav className="flex-1 px-3 py-6 space-y-8">
      {navSections.map((section) => (
        <div key={section.title} className="space-y-1">
          {/* SECTION HEADER */}
          {isOpen && (
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              {section.title}
            </h3>
          )}

          {/* SECTION ITEMS */}
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/vendor/dashboard"}
              onClick={() => {
                if (window.innerWidth < 1024 && closeMobile) closeMobile();
              }}
              className={({ isActive }) => `
                flex items-center rounded-xl transition-all duration-200 group relative
                ${isOpen ? "px-4 py-2.5 gap-3" : "p-3 justify-center mb-1"}
                ${isActive 
                  ? "bg-blue-50 text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                  
                  {isOpen && (
                    <span className="font-sans text-[13px] font-medium tracking-[-0.01em] text-slate-600 group-hover:text-blue-600 transition-colors truncate">
                      {item.label}
                    </span>
                  )}

                  {/* MINIMIZED TOOLTIP */}
                  {!isOpen && (
                    <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-200 origin-left bg-gray-900 text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-xl pointer-events-none z-[100] whitespace-nowrap hidden lg:block">
                      {item.label}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}

                  {isActive && isOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;