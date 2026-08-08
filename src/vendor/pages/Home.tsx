
import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Cpu,
  CreditCard,
  ShieldCheck,
  BarChart3,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Activity,
  Server,
  Map,
  Network,
  WalletCards,
} from "lucide-react";

import AppFooter from "./AppFooter";

const Home: React.FC = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/" || location.pathname === "";

  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100">
      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>

              <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                Veego
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7 text-sm text-gray-600 dark:text-gray-300">
              <a
                href="#features"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Features
              </a>

              <a
                href="#security"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Security
              </a>

              <Link
                to="/login"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle navigation"
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>

          {/* =====================================================
              MOBILE MENU
          ===================================================== */}
          {open && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
              <div className="space-y-1">
                <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  Explore
                </p>

                <a
                  href="#features"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Cpu size={17} className="text-blue-500" />
                  Features
                </a>

                <a
                  href="#security"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ShieldCheck size={17} className="text-emerald-500" />
                  Security
                </a>
              </div>

              <div className="mt-5 space-y-1">
                <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  Resources
                </p>
                
                <Link
                  to="/#"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <BookOpen size={17} />
                  API Docs
                </Link>

                <Link
                  to="/#"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Activity size={17} />
                  System Status
                </Link>

                <Link
                  to="/#"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <HelpCircle size={17} />
                  Help Center
                </Link>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center text-sm text-gray-600 dark:text-gray-300 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center text-sm bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* =========================================================
          MAIN
      ========================================================= */}
      <main className="flex-1">
        {isRoot ? (
          <>
            {/* =====================================================
                HERO
            ===================================================== */}
            <section className="py-14 sm:py-20 lg:py-24">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs">
                  <Activity size={13} />
                  ISP Network Management Platform
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-medium sm:font-semibold text-gray-900 dark:text-white leading-tight tracking-tight">
                  Manage your MikroTik network
                  <span className="block sm:inline text-blue-600">
                    {" "}
                    in one place
                  </span>
                </h1>

                <p className="mt-5 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-7 text-gray-500 dark:text-gray-400">
                  Control bandwidth, automate M-Pesa billing, manage customers,
                  and monitor your ISP infrastructure from one platform.
                </p>

                <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/#"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
                  >
                    View Demo
                  </Link>
                </div>
              </div>
            </section>

            {/* =====================================================
                FEATURES
            ===================================================== */}
            <section id="features" className="py-14 sm:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                    Platform capabilities
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white">
                    Everything you need to run your ISP
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    Built around network management, automation, billing, and
                    customer operations.
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  <Feature
                    icon={CreditCard}
                    title="Payments"
                    desc="Automate M-Pesa billing and activate customers after successful payments."
                  />

                  <Feature
                    icon={Cpu}
                    title="Router Control"
                    desc="Manage MikroTik devices and push network configurations from one place."
                  />

                  <Feature
                    icon={BarChart3}
                    title="Analytics"
                    desc="Monitor revenue, usage, subscribers, and overall network performance."
                  />

                  <Feature
                    icon={Server}
                    title="GenieACS"
                    desc="Manage supported customer devices and automate TR-069 provisioning."
                  />

                  <Feature
                    icon={Map}
                    title="GeoMapping"
                    desc="Visualize customers, network locations, and infrastructure on a map."
                  />

                  <Feature
                    icon={Network}
                    title="VLAN Management"
                    desc="Organize network segments and simplify VLAN-based service management."
                  />

                  <Feature
                    icon={WalletCards}
                    title="Money Mapping"
                    desc="Connect payments, customers, plans, and transactions for clearer financial tracking."
                  />

                  <Feature
                    icon={ShieldCheck}
                    title="Security"
                    desc="Protect platform access and network operations with secure authentication."
                  />
                </div>
              </div>
            </section>

            {/* =====================================================
                PLATFORM SUMMARY
            ===================================================== */}
            <section className="py-14 sm:py-20 border-y border-gray-200 dark:border-gray-800">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Network
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      Manage routers, bandwidth, services, VLANs, and network
                      infrastructure.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Customers
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      Manage subscribers, packages, access credentials, and
                      customer locations.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Business
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      Track payments, subscriptions, revenue, and operational
                      activity from one dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =====================================================
                SECURITY
            ===================================================== */}
            <section
              id="security"
              className="py-14 sm:py-20 bg-white dark:bg-[#0b0f19]"
            >
              <div className="max-w-3xl mx-auto text-center px-4 sm:px-6">
                <div className="flex justify-center mb-5">
                  <div className="p-3 rounded-full border border-green-200 dark:border-green-900/60 bg-green-50 dark:bg-green-900/20">
                    <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white">
                  Security you can trust
                </h3>

                <p className="mt-4 text-sm sm:text-base leading-7 text-gray-500 dark:text-gray-400">
                  Secure authentication and controlled access help protect your
                  customer, billing, and network information.
                </p>
              </div>
            </section>
          </>
        ) : (
          <Outlet />
        )}
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <AppFooter
        appName="Veego"
        description="Complete billing, customer and network management for ISPs."
        email="vee@veegostems.com"
        phone="+254 712 083 124"
        location=""
        website="https://veegostems.com"
        version="1.0.0"
        links={[
          {
            label: "Documentation",
            href: "/#",
          },
          {
            label: "Support",
            href: "/#",
          },
          {
            label: "Privacy Policy",
            href: "/#",
          },
          {
            label: "Terms of Service",
            href: "/#",
          },
        ]}
        social={{
          github: "",
          facebook: "",
          twitter: "",
        }}
      />
    </div>
  );
};

/* ===============================================================
   FEATURE CARD
=============================================================== */

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

const Feature = ({ icon: Icon, title, desc }: FeatureProps) => (
  <div
    className="
      h-full
      rounded-xl
      border border-gray-200 dark:border-gray-800
      bg-white dark:bg-[#111827]
      p-5 sm:p-6
      transition-colors
      hover:border-blue-300 dark:hover:border-blue-800
    "
  >
    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 mb-4">
      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    </div>

    <h4 className="text-base font-medium text-gray-900 dark:text-white">
      {title}
    </h4>

    <p className="mt-2 text-sm leading-6 font-normal text-gray-500 dark:text-gray-400">
      {desc}
    </p>
  </div>
);

export default Home;

