import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function PortalLanding(): React.JSX.Element {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const cachedTheme = localStorage.getItem("theme");

    return (
      cachedTheme === "dark" ||
      (!cachedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const packages = [
    {
      name: "Home Lite",
      speed: "8 Mbps",
      price: "1,500",
      desc: "Ideal for browsing and social media.",
      standard: false,
    },
    {
      name: "Home Standard",
      speed: "15 Mbps",
      price: "2,500",
      desc: "Perfect for streaming and remote work.",
      standard: true,
    },
    {
      name: "Home Premium",
      speed: "30 Mbps",
      price: "4,000",
      desc: "Best for gaming, downloads and 4K streaming.",
      standard: false,
    },
  ];

  const faqs = [
    {
      q: "How do I renew via M-PESA?",
      a: "Login to the portal, select a package, enter your Safaricom number and approve the STK push.",
    },
    {
      q: "Connected but no internet?",
      a: "Open your dashboard and reset your session from the Sessions page.",
    },
    {
      q: "Do you charge installation fees?",
      a: "Installation depends on coverage and distance from our nearest distribution point.",
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black">
              K
            </div>

            <div>
              <h1 className="font-black text-lg tracking-tight">
                KayoNet
              </h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                Fiber Internet
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#features"
              className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 transition"
            >
              Features
            </a>

            <a
              href="#pricing"
              className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 transition"
            >
              Packages
            </a>

            <a
              href="#faq"
              className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 transition"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <Link
              to="/portal/login"
              className="hidden sm:flex px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition"
            >
              Client Portal
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* LEFT */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Stable • Fast • Unlimited
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-zinc-900 dark:text-white">
                Fast Reliable Internet
                <span className="block text-emerald-600 mt-2">
                  For Home & Business
                </span>
              </h2>

              <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Manage subscriptions, renew with M-PESA, monitor sessions,
                and stay connected with low-latency fiber internet.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/portal/login"
                  className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-lg shadow-emerald-600/20 text-center"
                >
                  Open Client Portal
                </Link>

                <a
                  href="#pricing"
                  className="px-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold transition text-center"
                >
                  View Packages
                </a>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-400">
                      Network Status
                    </p>

                    <h3 className="text-2xl font-black mt-1">
                      Online
                    </h3>
                  </div>

                  <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-5">
                  <StatCard
                    label="Latency"
                    value="9ms"
                  />

                  <StatCard
                    label="Uptime"
                    value="99.9%"
                  />

                  <StatCard
                    label="Active Coverage"
                    value="24/7"
                  />
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Instant M-PESA STK Push Payments
                  </p>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Renew your package directly from your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FEATURES */}
      {/* ================================================= */}

      <section
        id="features"
        className="py-20 border-t border-zinc-100 dark:border-zinc-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-3xl font-black">
              Why Customers Choose Us
            </h3>

            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              Simple, stable and optimized internet connectivity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Stable Speeds"
              desc="Dedicated bandwidth with consistent performance during peak hours."
            />

            <FeatureCard
              title="Instant Payments"
              desc="Secure M-PESA STK push renewals with automatic activation."
            />

            <FeatureCard
              title="Self-Service"
              desc="Manage sessions, subscriptions and devices from your dashboard."
            />
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* PRICING */}
      {/* ================================================= */}

      <section
        id="pricing"
        className="py-20 bg-zinc-50 dark:bg-zinc-900/40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-3xl font-black">
              Affordable Packages
            </h3>

            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              Transparent monthly pricing with unlimited access.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-7 border bg-white dark:bg-zinc-950 transition hover:-translate-y-1 hover:shadow-xl ${
                  pkg.standard
                    ? "border-emerald-500 shadow-lg shadow-emerald-500/10"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {pkg.standard && (
                  <div className="inline-flex mb-5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <h4 className="text-xl font-black">
                  {pkg.name}
                </h4>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-black">
                    {pkg.speed}
                  </span>
                </div>

                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {pkg.desc}
                </p>

                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-end gap-1">
                    <span className="text-lg font-bold">
                      KES
                    </span>

                    <span className="text-4xl font-black">
                      {pkg.price}
                    </span>

                    <span className="text-sm text-zinc-400 mb-1">
                      /month
                    </span>
                  </div>

                  <Link
                    to="/portal/login"
                    className={`mt-6 block w-full text-center py-3 rounded-2xl font-bold transition ${
                      pkg.standard
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FAQ */}
      {/* ================================================= */}

      <section
        id="faq"
        className="py-20"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black">
              Frequently Asked Questions
            </h3>

            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              Quick answers to common customer questions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="w-full px-5 py-5 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold">
                      {faq.q}
                    </span>

                    <span
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="pt-4">{faq.a}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h4 className="font-black text-lg">
                KayoNet
              </h4>

              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Premium fiber internet for homes and businesses.
              </p>
            </div>

            <div>
              <h5 className="font-bold mb-3">
                Support
              </h5>

              <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <p>+254 700 000 000</p>
                <p>support@kayonet.co.ke</p>
                <p>08:00 AM — 10:00 PM</p>
              </div>
            </div>

            <div className="md:text-right">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                © 2026 KayoNet Internet Services
              </p>

              <p className="mt-2 text-xs text-zinc-400">
                Built with MikroTik + FreeRADIUS infrastructure.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 hover:shadow-lg transition">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xl mb-5">
        ⚡
      </div>

      <h4 className="font-black text-lg">
        {title}
      </h4>

      <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {desc}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        {label}
      </span>

      <span className="font-black text-lg">
        {value}
      </span>
    </div>
  );
}