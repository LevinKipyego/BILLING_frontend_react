import { NavLink } from "react-router-dom";
import { 
  Squares2X2Icon, 
  TicketIcon, 
  ServerIcon, 
  CpuChipIcon, 
  CreditCardIcon, 
  UserIcon 
} from "@heroicons/react/24/outline";
import { CardSimIcon } from "lucide-react";

interface SidebarProps {
  closeMobile?: () => void; 
  isOpen: boolean; 
}

const Sidebar = ({ closeMobile, isOpen }: SidebarProps) => {
  const navItems = [
    { to: "/dashboard", label: "Overview", icon: Squares2X2Icon },
    { to: "/dashboard/plans", label: "Service Plans", icon: TicketIcon },
    { to: "/dashboard/nas", label: "NAS Management", icon: ServerIcon },
    { to: "/dashboard/mikrotik", label: "MikroTik Devices", icon: CpuChipIcon },
    { to: "/dashboard/mikrotik/configurations", label: "Configurations", icon: CpuChipIcon }, 
    { to: "/dashboard/mpesa", label: "M-Pesa Config", icon: CardSimIcon },

    { to: "/dashboard/transactions", label: "Transactions", icon: CreditCardIcon },
    { to: "/dashboard/subscriptions/list", label: "Subscriptions", icon: TicketIcon },
    
    { to: "/dashboard/users", label: "Users", icon: UserIcon },
    { to: "/dashboard/network", label: "Network", icon: CpuChipIcon },
    { to: "/dashboard/sessions/dashboard", label: "Sessions", icon: Squares2X2Icon },
  ];

  return (
    <nav className="flex-1 px-3 py-6 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/dashboard"}
          onClick={() => {
            if (window.innerWidth < 1024 && closeMobile) closeMobile();
          }}
          // Added 'group' to enable group-hover on children
          className={({ isActive }) => `
            flex items-center rounded-xl transition-all duration-200 group relative
            ${isOpen ? "px-4 py-3 gap-3" : "p-3 justify-center mb-1"}
            ${isActive 
              ? "bg-blue-50 text-blue-600 shadow-sm" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon className={`w-6 h-6 shrink-0 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
              
              {/* NORMAL LABEL (Visible when Sidebar is OPEN) */}
              {isOpen && (
                <span className="font-sans text-[13px] font-semibold tracking-[-0.01em] text-slate-600 group-hover:text-blue-600 transition-colors">
                  {item.label}
                </span>
              )}

              {/* HOVER TOOLTIP (Visible ONLY when Sidebar is CLOSED/MINIMIZED) */}
              {!isOpen && (
                <div className="
                  absolute left-16 scale-0 group-hover:scale-100 
                  transition-all duration-200 origin-left
                  bg-gray-900 text-white text-[11px] font-bold px-3 py-2 rounded-lg 
                  shadow-xl pointer-events-none z-[100] whitespace-nowrap
                  hidden lg:block
                ">
                  {item.label}
                  {/* Optional: Small triangle arrow for the tooltip */}
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
    </nav>
  );
};

export default Sidebar;