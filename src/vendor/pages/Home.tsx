
// src/pages/Home.tsx

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
  Users,
  Router,
  Wifi,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

import AppFooter from "./AppFooter";

const Home: React.FC = () => {
  const location = useLocation();

  const isRoot =
    location.pathname === "/" || location.pathname === "";

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
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0"
            >
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

                <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Explore
                </p>

                <a
                  href="#features"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Cpu size={17} className="text-blue-500" />
                  Features
                </a>

                <a
                  href="#security"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ShieldCheck
                    size={17}
                    className="text-emerald-500"
                  />
                  Security
                </a>

              </div>

              <div className="mt-4 space-y-1">

                <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Resources
                </p>

                <Link
                  to="/#"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <BookOpen size={17} />
                  API Docs
                </Link>

                <Link
                  to="/#"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Activity size={17} />
                  System Status
                </Link>

                <Link
                  to="/#"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <HelpCircle size={17} />
                  Help Center
                </Link>

              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">

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

            <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">

              {/* Subtle background glow */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />

                <div className="absolute top-1/2 -left-40 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl" />
              </div>

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center py-14 sm:py-20 lg:py-24">

                  {/* =================================================
                      HERO COPY
                  ================================================= */}

                  <div className="max-w-2xl">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60 animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
                      </span>

                      ISP Network Management Platform
                    </div>

                    {/* Heading */}
                    <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4rem] font-semibold tracking-tight leading-[1.05] text-gray-900 dark:text-white">
                      Run your ISP network
                      <span className="block text-blue-600 mt-1">
                        from one platform.
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-5 max-w-xl text-sm sm:text-base lg:text-[17px] leading-7 text-gray-500 dark:text-gray-400">
                      Manage MikroTik infrastructure, customers,
                      bandwidth, subscriptions, and M-Pesa billing
                      from a single operational platform.
                    </p>

                    {/* CTA */}
                    <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                      <Link
                        to="/signup"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm shadow-blue-600/20"
                      >
                        Get Started
                        <ArrowRight size={15} />
                      </Link>

                      <Link
                        to="/#"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm font-medium"
                      >
                        View Demo
                        <ArrowUpRight size={14} />
                      </Link>

                    </div>

                    {/* Trust indicators */}
                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[11px] text-gray-500 dark:text-gray-400">

                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          size={14}
                          className="text-emerald-500"
                        />
                        MikroTik ready
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          size={14}
                          className="text-emerald-500"
                        />
                        M-Pesa billing
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          size={14}
                          className="text-emerald-500"
                        />
                        Real-time monitoring
                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      HERO PRODUCT PREVIEW
                  ================================================= */}

                  <div className="relative lg:pl-4">

                    <div className="relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-xl shadow-gray-200/40 dark:shadow-black/20 overflow-hidden">

                      {/* Browser / dashboard header */}
                      <div className="h-10 px-3.5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">

                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                          <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                          <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                        </div>

                        <div className="text-[9px] font-medium text-gray-400">
                          Network Overview
                        </div>

                        <Activity
                          size={13}
                          className="text-blue-500"
                        />
                      </div>


                      {/* Dashboard content */}
                      <div className="p-3.5 sm:p-4">

                        {/* Status */}
                        <div className="flex items-center justify-between mb-3">

                          <div>
                            <p className="text-[10px] text-gray-400">
                              System status
                            </p>

                            <div className="mt-0.5 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                All systems operational
                              </span>
                            </div>
                          </div>

                          <span className="text-[9px] text-gray-400">
                            Live
                          </span>

                        </div>


                        {/* Metric cards */}
                        <div className="grid grid-cols-3 gap-2">

                          <HeroMetric
                            icon={Users}
                            label="Customers"
                            value="1,284"
                            trend="+8.4%"
                            color="blue"
                          />

                          <HeroMetric
                            icon={Wifi}
                            label="Active"
                            value="942"
                            trend="+4.2%"
                            color="emerald"
                          />

                          <HeroMetric
                            icon={Router}
                            label="Routers"
                            value="18"
                            trend="Online"
                            color="purple"
                          />

                        </div>


                        {/* Network activity */}
                        <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3">

                          <div className="flex items-center justify-between mb-3">

                            <div>
                              <p className="text-[10px] font-medium text-gray-800 dark:text-gray-200">
                                Network throughput
                              </p>

                              <p className="text-[9px] text-gray-400">
                                Last 24 hours
                              </p>
                            </div>

                            <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                              482 Mbps
                            </span>

                          </div>

                          {/* Simple graph */}
                          <div className="h-20 flex items-end gap-1.5">

                            {[35, 48, 42, 65, 52, 70, 58, 78, 62, 84, 73, 90, 68, 76, 88, 82].map(
                              (height, index) => (
                                <div
                                  key={index}
                                  className="flex-1 rounded-t bg-blue-500/20"
                                  style={{ height: `${height}%` }}
                                >
                                  <div
                                    className="h-full w-full rounded-t bg-blue-500/70"
                                    style={{
                                      transform: `scaleY(${
                                        0.35 + height / 180
                                      })`,
                                      transformOrigin: "bottom",
                                    }}
                                  />
                                </div>
                              )
                            )}

                          </div>

                        </div>


                        {/* Bottom status */}
                        <div className="mt-3 grid grid-cols-2 gap-2">

                          <div className="rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2.5">

                            <div className="flex items-center gap-2">

                              <div className="w-7 h-7 flex items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-900/20">
                                <CreditCard
                                  size={14}
                                  className="text-emerald-600 dark:text-emerald-400"
                                />
                              </div>

                              <div>
                                <p className="text-[9px] text-gray-400">
                                  Payments
                                </p>

                                <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                                  KES 184,520
                                </p>
                              </div>

                            </div>

                          </div>


                          <div className="rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2.5">

                            <div className="flex items-center gap-2">

                              <div className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-50 dark:bg-blue-900/20">
                                <Server
                                  size={14}
                                  className="text-blue-600 dark:text-blue-400"
                                />
                              </div>

                              <div>
                                <p className="text-[9px] text-gray-400">
                                  Infrastructure
                                </p>

                                <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                                  18 / 18 Online
                                </p>
                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* Small floating status */}
                    <div className="absolute -bottom-4 -left-3 sm:-left-5 hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] px-3 py-2 shadow-lg">

                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-900/20">
                        <Activity
                          size={14}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                      </div>

                      <div>
                        <p className="text-[9px] text-gray-400">
                          Network
                        </p>

                        <p className="text-[10px] font-semibold text-gray-800 dark:text-gray-200">
                          Operating normally
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </section>


            {/* =====================================================
                FEATURES
            ===================================================== */}

            <section
              id="features"
              className="py-14 sm:py-20"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="max-w-2xl mb-10 sm:mb-14">

                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                    Platform capabilities
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white">
                    Everything you need to run your ISP
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    Built around network management, automation,
                    billing, and customer operations.
                  </p>

                </div>


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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  <SummaryItem
                    title="Network"
                    description="Manage routers, bandwidth, services, VLANs, and network infrastructure."
                  />

                  <SummaryItem
                    title="Customers"
                    description="Manage subscribers, packages, access credentials, and customer locations."
                  />

                  <SummaryItem
                    title="Business"
                    description="Track payments, subscriptions, revenue, and operational activity from one dashboard."
                  />

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

              <div className="max-w-3xl mx-auto px-4 sm:px-6">

                <div className="flex justify-center mb-5">

                  <div className="p-3 rounded-full border border-green-200 dark:border-green-900/60 bg-green-50 dark:bg-green-900/20">
                    <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>

                </div>

                <h3 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white text-center">
                  Security you can trust
                </h3>

                <p className="mt-4 text-sm sm:text-base leading-7 text-gray-500 dark:text-gray-400 text-center">
                  Secure authentication and controlled access help
                  protect your customer, billing, and network information.
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
   HERO METRIC
=============================================================== */

interface HeroMetricProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color: "blue" | "emerald" | "purple";
}

const HeroMetric = ({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: HeroMetricProps) => {

  const colorClasses = {
    blue: {
      icon: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      trend: "text-blue-600 dark:text-blue-400",
    },

    emerald: {
      icon: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
      trend: "text-emerald-600 dark:text-emerald-400",
    },

    purple: {
      icon: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      trend: "text-purple-600 dark:text-purple-400",
    },
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-2.5">

      <div className="flex items-center justify-between">

        <div
          className={[
            "w-6 h-6 rounded-md flex items-center justify-center",
            colorClasses[color].icon,
          ].join(" ")}
        >
          <Icon size={12} />
        </div>

        <span
          className={[
            "text-[8px] font-medium",
            colorClasses[color].trend,
          ].join(" ")}
        >
          {trend}
        </span>

      </div>

      <p className="mt-2 text-[9px] text-gray-400">
        {label}
      </p>

      <p className="mt-0.5 text-xs font-semibold text-gray-900 dark:text-white">
        {value}
      </p>

    </div>
  );
};


/* ===============================================================
   SUMMARY ITEM
=============================================================== */

interface SummaryItemProps {
  title: string;
  description: string;
}

const SummaryItem = ({
  title,
  description,
}: SummaryItemProps) => (
  <div>

    <p className="text-sm font-medium text-gray-900 dark:text-white">
      {title}
    </p>

    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
      {description}
    </p>

  </div>
);


/* ===============================================================
   FEATURE CARD
=============================================================== */

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

const Feature = ({
  icon: Icon,
  title,
  desc,
}: FeatureProps) => (
  <div
    className="
      h-full
      rounded-xl
      border border-gray-200 dark:border-gray-800
      bg-white dark:bg-[#111827]
      p-5 sm:p-6
      transition-all
      hover:border-blue-300 dark:hover:border-blue-800
      hover:shadow-sm
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
