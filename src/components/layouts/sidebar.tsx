import { NavLink } from "react-router-dom";
import { 
  Squares2X2Icon, 
  TicketIcon, 
  ServerIcon, 
  CpuChipIcon, 
  CreditCardIcon, 
  UserIcon
} from "@heroicons/react/24/outline";

interface SidebarProps {
  closeMobile?: () => void;
}

const Sidebar = ({ closeMobile }: SidebarProps) => {
  const navItems = [
    { to: "/dashboard", label: "Overview", icon: Squares2X2Icon },
    { to: "/dashboard/plans", label: "Service Plans", icon: TicketIcon },
    { to: "/dashboard/nas", label: "NAS Management", icon: ServerIcon },
    { to: "/dashboard/mikrotik", label: "MikroTik Devices", icon: CpuChipIcon },
    { to: "/dashboard/mpesa", label: "M-Pesa Config", icon: CreditCardIcon },
    { to: "/dashboard/mikroconfig", label: "MikroTik Config", icon: CpuChipIcon },
    { to: "/dashboard/users", label: "Users", icon: UserIcon },
    { to: "/dashboard/network", label: "Network", icon: CpuChipIcon },

    
  ];

  return (
    <nav className="flex-1 px-4 py-6 space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/dashboard"} // Ensures active logic works for the home route
          onClick={closeMobile}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
            ${isActive 
              ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
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