
import { NavLink } from "react-router-dom";

import {
  CircleStackIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

import {
  GitFork,
  ShieldCheck,
  Users,
  Wifi,
  Boxes,
  BarChart3,
  CreditCard,
  ArrowLeftRight,
  MessageSquarePlus,
  Activity,
  Cog,
  Network,
  Split,
  FileText,
} from "lucide-react";

import { SiMikrotik } from "react-icons/si";
import { FaServer } from "react-icons/fa";
import { TbLockCheck } from "react-icons/tb";

interface SidebarProps {
  closeMobile?: () => void;
  isOpen: boolean;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgHover?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

/* ============================================================
   NAVIGATION
   Existing theme colors intentionally retained.
============================================================ */

const navSections: NavSection[] = [
  {
    title: "General",
    items: [
      {
        to: "/dashboard",
        label: "Overview",
        icon: BarChart3,
        color: "text-blue-600 dark:text-blue-400",
        bgHover:
          "hover:bg-blue-50/60 dark:hover:bg-blue-950/10 hover:text-blue-700 dark:hover:text-blue-400",
      },
      {
        to: "/dashboard/users",
        label: "Users",
        icon: Users,
        color: "text-blue-600 dark:text-blue-400",
        bgHover:
          "hover:bg-blue-50/60 dark:hover:bg-blue-950/10 hover:text-blue-700 dark:hover:text-blue-400",
      },
    ],
  },

  {
    title: "Network & Infrastructure",
    items: [
      {
        to: "/dashboard/nas",
        label: "NAS Management",
        icon: FaServer,
        color: "text-slate-600 dark:text-slate-400",
        bgHover:
          "hover:bg-slate-100/60 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-300",
      },
      {
        to: "/dashboard/mikrotik",
        label: "MikroTik Devices",
        icon: SiMikrotik,
        color: "text-slate-600 dark:text-slate-400",
        bgHover:
          "hover:bg-slate-100/60 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-300",
      },
      {
        to: "/dashboard/mikrotik/configurations",
        label: "Configurations",
        icon: Cog,
        color: "text-slate-600 dark:text-slate-400",
        bgHover:
          "hover:bg-slate-100/60 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-300",
      },
      {
        to: "/dashboard/network",
        label: "Network",
        icon: Network,
        color: "text-slate-600 dark:text-slate-400",
        bgHover:
          "hover:bg-slate-100/60 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-300",
      },
    ],
  },

  {
    title: "ISP Services",
    items: [
      {
        to: "/dashboard/pppoe/credentials/list",
        label: "PPPoE Credentials",
        icon: TbLockCheck,
        color: "text-indigo-600 dark:text-indigo-400",
        bgHover:
          "hover:bg-indigo-50/60 dark:hover:bg-indigo-950/10 hover:text-indigo-700 dark:hover:text-indigo-400",
      },
      {
        to: "/dashboard/pppoe/subscriptions/list",
        label: "PPPoE Subscriptions",
        icon: GitFork,
        color: "text-indigo-600 dark:text-indigo-400",
        bgHover:
          "hover:bg-indigo-50/60 dark:hover:bg-indigo-950/10 hover:text-indigo-700 dark:hover:text-indigo-400",
      },
      {
        to: "/dashboard/hotspot/credentials/list",
        label: "Hotspot Credentials",
        icon: ShieldCheck,
        color: "text-amber-600 dark:text-amber-500",
        bgHover:
          "hover:bg-amber-50/60 dark:hover:bg-amber-950/10 hover:text-amber-700 dark:hover:text-amber-400",
      },
      {
        to: "/dashboard/hotspot/subscriptions/list",
        label: "Hotspot Subscriptions",
        icon: Wifi,
        color: "text-amber-600 dark:text-amber-500",
        bgHover:
          "hover:bg-amber-50/60 dark:hover:bg-amber-950/10 hover:text-amber-700 dark:hover:text-amber-400",
      },
      {
        to: "/dashboard/sessions/dashboard",
        label: "Active Sessions",
        icon: Activity,
        color: "text-emerald-600 dark:text-emerald-400",
        bgHover:
          "hover:bg-emerald-50/60 dark:hover:bg-emerald-950/10 hover:text-emerald-700 dark:hover:text-emerald-400",
      },
    ],
  },

  {
    title: "Billing",
    items: [
      {
        to: "/dashboard/plans",
        label: "Packages",
        icon: Boxes,
        color: "text-purple-600 dark:text-purple-400",
        bgHover:
          "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400",
      },
      {
        to: "/dashboard/mpesa/c2b",
        label: "C2B Configs",
        icon: CircleStackIcon,
        color: "text-purple-600 dark:text-purple-400",
        bgHover:
          "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400",
      },
      {
        to: "/dashboard/mpesa",
        label: "M-Pesa STK Configs",
        icon: ArrowLeftRight,
        color: "text-purple-600 dark:text-purple-400",
        bgHover:
          "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400",
      },
      {
        to: "/dashboard/transactions",
        label: "M-Pesa STK Transactions",
        icon: BanknotesIcon,
        color: "text-purple-600 dark:text-purple-400",
        bgHover:
          "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400",
      },
      {
        to: "/dashboard/transactions/c2b",
        label: "M-Pesa C2B Transactions",
        icon: CreditCard,
        color: "text-purple-600 dark:text-purple-400",
        bgHover:
          "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400",
      },
    ],
  },

  {
    title: "Vendor & Finance",
    items: [
      {
        to: "/dashboard/vendor/payouts",
        label: "Payouts",
        icon: BanknotesIcon,
        color: "text-emerald-600 dark:text-emerald-400",
        bgHover:
          "hover:bg-emerald-50/60 dark:hover:bg-emerald-950/10 hover:text-emerald-700 dark:hover:text-emerald-400",
      },
      {
        to: "/dashboard/vendor/micro-loans",
        label: "Micro-Loan Hub",
        icon: CurrencyDollarIcon,
        color: "text-teal-600 dark:text-teal-400",
        bgHover:
          "hover:bg-teal-50/60 dark:hover:bg-teal-950/10 hover:text-teal-700 dark:hover:text-teal-400",
      },
    ],
  },

  {
    title: "SMS Management",
    items: [
      {
        to: "/dashboard/sms/sms_providers/list",
        label: "Gateways & Providers",
        icon: MessageSquarePlus,
        color: "text-pink-600 dark:text-pink-400",
        bgHover:
          "hover:bg-pink-50/60 dark:hover:bg-pink-950/10 hover:text-pink-700 dark:hover:text-pink-400",
      },
      {
        to: "/dashboard/sms/templates",
        label: "Message Templates",
        icon: FileText,
        color: "text-purple-600 dark:text-purple-400",
        bgHover:
          "hover:bg-purple-50/60 dark:hover:bg-purple-950/10 hover:text-purple-700 dark:hover:text-purple-400",
      },
      {
        to: "/dashboard/sms/analytics",
        label: "SMS Analytics & Logs",
        icon: BarChart3,
        color: "text-indigo-600 dark:text-indigo-400",
        bgHover:
          "hover:bg-indigo-50/60 dark:hover:bg-indigo-950/10 hover:text-indigo-700 dark:hover:text-indigo-400",
      },
    ],
  },

  {
    title: "Balancers",
    items: [
      {
        to: "/dashboard/network-deployments/create",
        label: "PCC Based Balancer",
        icon: Split,
        color: "text-pink-600 dark:text-pink-400",
        bgHover:
          "hover:bg-pink-50/60 dark:hover:bg-pink-950/10 hover:text-pink-700 dark:hover:text-pink-400",
      },
    ],
  },
];

/* ============================================================
   SIDEBAR
============================================================ */

const Sidebar = ({
  closeMobile,
  isOpen,
}: SidebarProps) => {
  return (
    <nav
      className="
        h-full
        overflow-y-auto
        overflow-x-hidden
        px-2.5
        py-4
        scrollbar-thin
        scrollbar-thumb-slate-200
        dark:scrollbar-thumb-gray-700
        scrollbar-track-transparent
      "
    >
      <div className="space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>

            {/* ==================================================
                SECTION HEADER
            ================================================== */}
            {isOpen && (
              <div className="flex items-center gap-2 px-2 mb-1.5">
                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                    dark:text-slate-500
                    whitespace-nowrap
                  "
                >
                  {section.title}
                </span>

                <div
                  className="
                    flex-1
                    h-px
                    bg-slate-100
                    dark:bg-gray-800
                  "
                />
              </div>
            )}

            {/* ==================================================
                ITEMS
            ================================================== */}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  onClick={() => {
                    if (
                      window.innerWidth < 1024 &&
                      closeMobile
                    ) {
                      closeMobile();
                    }
                  }}
                  className={({ isActive }) => `
                    group
                    relative
                    flex
                    items-center

                    transition-all
                    duration-150

                    ${
                      isOpen
                        ? "h-9 px-2.5 gap-2.5"
                        : "w-10 h-10 mx-auto justify-center"
                    }

                    rounded-lg

                    ${
                      isActive
                        ? `
                          bg-slate-100
                          dark:bg-gray-800
                        `
                        : `
                          text-slate-500
                          dark:text-slate-400
                          ${item.bgHover}
                        `
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* ======================================
                          ACTIVE COLOR RAIL
                      ====================================== */}
                      {isActive && (
                        <span
                          className={`
                            absolute
                            ${
                              isOpen
                                ? "left-0"
                                : "left-0"
                            }
                            top-1/2
                            -translate-y-1/2
                            w-[3px]
                            h-5
                            rounded-r-full

                            ${
                              item.color
                                .split(" ")[0]
                                .replace(
                                  "text-",
                                  "bg-"
                                )
                            }
                          `}
                        />
                      )}

                      {/* ======================================
                          ICON
                      ====================================== */}
                      <div
                        className={`
                          shrink-0
                          flex
                          items-center
                          justify-center

                          ${
                            isOpen
                              ? "w-5"
                              : "w-full"
                          }
                        `}
                      >
                        <item.icon
                          className={`
                            w-[18px]
                            h-[18px]

                            transition-all
                            duration-150

                            ${
                              isActive
                                ? item.color
                                : `
                                  text-slate-400
                                  dark:text-slate-500
                                  group-hover:${
                                    item.color
                                      .split(" ")[0]
                                  }
                                `
                            }
                          `}
                        />
                      </div>

                      {/* ======================================
                          LABEL
                      ====================================== */}
                      {isOpen && (
                        <span
                          className={`
                            min-w-0
                            flex-1
                            truncate

                            text-[11.5px]
                            leading-none
                            tracking-[-0.005em]

                            transition-colors

                            ${
                              isActive
                                ? `
                                  ${
                                    item.color.split(
                                      " "
                                    )[0]
                                  }
                                  ${
                                    item.color.split(
                                      " "
                                    )[1]
                                  }
                                  font-semibold
                                `
                                : `
                                  text-slate-600
                                  dark:text-slate-300
                                `
                            }
                          `}
                        >
                          {item.label}
                        </span>
                      )}

                      {/* ======================================
                          ACTIVE INDICATOR
                      ====================================== */}
                      {isActive && isOpen && (
                        <span
                          className={`
                            w-1.5
                            h-1.5
                            shrink-0
                            rounded-full

                            ${
                              item.color
                                .split(" ")[0]
                                .replace(
                                  "text-",
                                  "bg-"
                                )
                            }
                          `}
                        />
                      )}

                      {/* ======================================
                          COLLAPSED TOOLTIP
                      ====================================== */}
                      {!isOpen && (
                        <div
                          className="
                            pointer-events-none
                            absolute
                            left-[calc(100%+9px)]
                            top-1/2
                            -translate-y-1/2

                            hidden
                            lg:block

                            opacity-0
                            scale-95
                            origin-left

                            group-hover:opacity-100
                            group-hover:scale-100

                            transition-all
                            duration-150

                            z-[100]
                          "
                        >
                          <div
                            className="
                              relative
                              whitespace-nowrap

                              rounded-md

                              bg-gray-900
                              dark:bg-slate-800

                              border
                              border-gray-800
                              dark:border-slate-700

                              px-2.5
                              py-1.5

                              text-[10px]
                              font-medium
                              text-white

                              shadow-lg
                            "
                          >
                            {item.label}

                            <span
                              className="
                                absolute
                                left-[-4px]
                                top-1/2
                                -translate-y-1/2

                                w-2
                                h-2
                                rotate-45

                                bg-gray-900
                                dark:bg-slate-800

                                border-l
                                border-b
                                border-gray-800
                                dark:border-slate-700
                              "
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
