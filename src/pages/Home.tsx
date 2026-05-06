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
} from "lucide-react";

const Home: React.FC = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0b0f19]">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-[#0b0f19]/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-md">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              VendHub
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600 dark:text-gray-300">
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#security" className="hover:text-blue-600">Security</a>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Button */}
          <button onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden px-4 pb-4 space-y-3">
            <Link to="/login" className="block text-gray-600 dark:text-gray-300">
              Login
            </Link>
            <Link
              to="/signup"
              className="block text-center bg-blue-600 text-white py-3 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {isRoot ? (
          <>
            {/* HERO */}
            <section className="py-20 text-center">
              <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Manage your MikroTik network
                  <span className="text-blue-600"> in one place</span>
                </h1>

                <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
                  Control bandwidth, automate M-Pesa billing, and monitor
                  your ISP infrastructure in real-time.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/signup"
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Get Started <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/onboarding"
                    className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    View Demo
                  </Link>
                </div>
              </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="py-20">
              <div className="max-w-6xl mx-auto px-4">

                <div className="text-center mb-16">
                  <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                    Everything you need to run your ISP
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Built for performance, scale, and automation
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <Feature
                    icon={CreditCard}
                    title="Payments"
                    desc="Automate M-Pesa billing and instantly activate users."
                  />
                  <Feature
                    icon={Cpu}
                    title="Router Control"
                    desc="Push configs and manage MikroTik devices in real-time."
                  />
                  <Feature
                    icon={BarChart3}
                    title="Analytics"
                    desc="Track usage, revenue, and network performance."
                  />
                </div>
              </div>
            </section>

            {/* SECURITY */}
            <section id="security" className="py-20 bg-white dark:bg-[#0b0f19] border-t border-gray-200 dark:border-gray-800">
              <div className="max-w-3xl mx-auto text-center px-4">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
                    <ShieldCheck className="text-green-600" />
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Security you can trust
                </h3>

                <p className="text-gray-500 mt-4">
                  We use strong encryption and a zero-trust architecture to keep
                  your data safe at all times.
                </p>
              </div>
            </section>
          </>
        ) : (
          <Outlet />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} VendHub</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Feature = ({ icon: Icon, title, desc }: any) => (
  <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition">

    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
      <Icon className="text-blue-600 w-5 h-5" />
    </div>

    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
      {title}
    </h4>

    <p className="text-sm text-gray-500 mt-2">
      {desc}
    </p>
  </div>
);

export default Home;