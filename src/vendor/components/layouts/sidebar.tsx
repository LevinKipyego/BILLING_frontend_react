import { NavLink } from "react-router-dom";
import { 
  CircleStackIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { GitFork, ShieldCheck, Users, Wifi,
        Boxes,  BarChart3 ,CreditCard, ArrowLeftRight, 
        MessageSquarePlus, Activity, Cog, Network, Split,} from "lucide-react";
import { SiMikrotik } from 'react-icons/si'
import { FaServer } from "react-icons/fa";
import { TbLockCheck } from "react-icons/tb";
interface SidebarProps {
  closeMobile?: () => void; 
  isOpen: boolean; 
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgHover?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "General",
    items: [
      { to: "/dashboard", label: "Overview", icon: BarChart3, color: "text-blue-600 dark:text-blue-400", bgHover: "hover:bg-blue-50/60 dark:hover:bg-blue-950/10 hover:text-blue-700 dark:hover:text-blue-400" },
      { to: "/dashboard/users", label: "Users", icon: Users, color: "text-blue-600 dark:text-blue-400", bgHover: "hover:bg-blue-50/60 dark:hover:bg-blue-950/10 hover:text-blue-700 dark:hover:text-blue-400" },
    ]
  },
  {
    title: "Network & Infrastructure",
    items: [
      { to: "/dashboard/nas", label: "NAS Management", icon: FaServer, color: "text-slate-600 dark:text-slate-400", bgHover: "hover:bg-slate-100/60 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-300" },
      { to: "/dashboard/mikrotik", label: "MikroTik Devices", icon: SiMikrotik, color: "text-slate-600 dark:text-slate-400", bgHover: "hover:bg-slate-100/60 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-300" },
      { to: "/dashboard/mikrotik/configurations", label: "Configurations", icon: Cog, color: "text-slate-600 dark:text-slate-400", bgHover: "hover:bg-slate-100/60 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-300" },
      { to: "/dashboard/network", label: "Network", icon: Network, color: "text-slate-600 dark:text-slate-400", bgHover: "hover:bg-slate-100/60 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-300" },
    ]
  },
  {
    title: "ISP Services",
    items: [
      { 
        to: "/dashboard/pppoe/credentials/list", 
        label: "PPPoE Credentials", 
        icon: TbLockCheck, 
        color: "text-indigo-600 dark:text-indigo-400",
        bgHover: "hover:bg-indigo-50/60 dark:hover:bg-indigo-950/10 hover:text-indigo-700 dark:hover:text-indigo-400"
      },
      { 
        to: "/dashboard/pppoe/subscriptions/list", 
        label: "PPPoE Subscriptions", 
        icon: GitFork, 
        color: "text-indigo-600 dark:text-indigo-400",
        bgHover: "hover:bg-indigo-50/60 dark:hover:bg-indigo-950/10 hover:text-indigo-700 dark:hover:text-indigo-400"
      },
      { 
        to: "/dashboard/hotspot/credentials/list", 
        label: "Hotspot Credentials", 
        icon: ShieldCheck, 
        color: "text-amber-600 dark:text-amber-500",
        bgHover: "hover:bg-amber-50/60 dark:hover:bg-amber-950/10 hover:text-amber-700 dark:hover:text-amber-400"
      },
      { 
        to: "/dashboard/hotspot/subscriptions/list", 
        label: "Hotspot Subscriptions", 
        icon: Wifi, 
        color: "text-amber-600 dark:text-amber-500",
        bgHover: "hover:bg-amber-50/60 dark:hover:bg-amber-950/10 hover:text-amber-700 dark:hover:text-amber-400"
      },
      { 
        to: "/dashboard/sessions/dashboard", 
        label: "Active Sessions", 
        icon: Activity, 
        color: "text-emerald-600 dark:text-emerald-400",
        bgHover: "hover:bg-emerald-50/60 dark:hover:bg-emerald-950/10 hover:text-emerald-700 dark:hover:text-emerald-400"
      },
    ]
  },
  {
    title: "Billing",
    items: [
      { to: "/dashboard/plans", label: "Packages", icon: Boxes, color: "text-purple-600 dark:text-purple-400", bgHover: "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400" },
      { to: "/dashboard/mpesa/c2b", label: "C2B Configs", icon: CircleStackIcon, color: "text-purple-600 dark:text-purple-400", bgHover: "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400" },
     
      { to: "/dashboard/mpesa", label: "M-Pesa STK Configs", icon: ArrowLeftRight, color: "text-purple-600 dark:text-purple-400", bgHover: "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400" },
      { to: "/dashboard/transactions", label: "M-pesa STk Transactions", icon: BanknotesIcon, color: "text-purple-600 dark:text-purple-400", bgHover: "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400" },
      { to: "/dashboard/transactions/c2b", label: "M-Pesa C2B Transactions", icon: CreditCard, color: "text-purple-600 dark:text-purple-400", bgHover: "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400" },
    ]
  },

  {
    title: "SMS Management",
    items: [
      { to: "/dashboard/sms/sms_providers/list", label: "SMS and Bulk SMS", icon: MessageSquarePlus, color: "text-pink-600 dark:text-pink-400", bgHover: "hover:bg-pink-50/60 dark:hover:bg-pink-950/10 hover:text-pink-700 dark:hover:text-pink-400" },
    ] 
  },


  {
  title: "balancers",

  items: [
    {
      to: "/dashboard/network-deployments/create",
      label: "PCC based balancer",
      icon: Split,
      color:
        "text-pink-600 dark:text-pink-400",
      bgHover:
        "hover:bg-pink-50/60 dark:hover:bg-pink-950/10 hover:text-pink-700 dark:hover:text-pink-400",
    },
  ],
},

];

const Sidebar = ({ closeMobile, isOpen }: SidebarProps) => {
  return (
    <>
      {/* Dynamic style block targeting mobile browser frames exclusively */}
      <style>{`
        @media (max-width: 1023px) {
          .mobile-no-scroll {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          .mobile-no-scroll::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
        }
      `}</style>

      {/* - applied w-[88vw] sm:w-[350px] for wider mobile panels, leaving lg layouts intact
        - injected mobile-no-scroll to selectively target responsive scroll containers
        - switched font styling directly to Figtree for all devices
      */}
      <nav className="flex-1 w-[88vw] sm:w-[350px] lg:w-full overflow-y-auto mobile-no-scroll px-3 py-6 space-y-8 font-['Gummymimimal']">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {/* SECTION HEADER */}
            {isOpen && (
              <h3 className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                {section.title}
              </h3>
            )}

            {/* SECTION ITEMS */}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={() => {
                  if (window.innerWidth < 1024 && closeMobile) closeMobile();
                }}
                className={({ isActive }) => `
                  flex items-center rounded-xl transition-all duration-200 group relative
                  ${isOpen ? "px-4 py-2.5 gap-3" : "p-3 justify-center mb-1"}
                  ${isActive 
                    ? "bg-slate-100/80 dark:bg-slate-800/50 shadow-sm" 
                    : `text-slate-500 dark:text-slate-400 ${item.bgHover}`}
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* ICON SPECIFIC CATEGORY TINT COLOR */}
                    <item.icon className={`w-5 h-5 shrink-0 transition-colors duration-200
                      ${isActive ? item.color : "text-slate-400 group-hover:" + item.color.split(" ")[0]}
                    `} />
                    
                    {isOpen && (
                      <span className={`text-[13px] font-medium tracking-[-0.01em] transition-colors duration-200 truncate
                        ${isActive ? `${item.color.split(" ")[0]} dark:${item.color.split(" ")[1]} font-bold` : "text-slate-600 dark:text-slate-300 group-hover:" + item.color.split(" ")[0]}
                      `}>
                        {item.label}
                      </span>
                    )}

                    {/* MINIMIZED TOOLTIP */}
                    {!isOpen && (
                      <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-200 origin-left bg-gray-900 dark:bg-slate-800 text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-xl pointer-events-none z-[100] whitespace-nowrap hidden lg:block">
                        {item.label}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-slate-800 rotate-45" />
                      </div>
                    )}

                    {/* END BADGE DOT MATCHES ACCENT CATEGORY */}
                    {isActive && isOpen && (
                      <div className={`ml-auto w-1.5 h-1.5 rounded-full ${item.color.split(" ")[0].replace("text-", "bg-")}`} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;