import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  CpuChipIcon, 
  BanknotesIcon, 
  ShieldCheckIcon, 
  ArrowRightIcon,
  GlobeAltIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

const Home: React.FC = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      {/* 1. Transparent Floating Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-blue-900 italic">
              VEND<span className="text-blue-600">HUB</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
            <Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link>
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {isRoot ? (
          <>
            {/* 2. Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                  <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
                    The Ultimate ISP Management Tool
                  </span>
                  <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                    Automate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">MikroTik ISP</span> Business.
                  </h2>
                  <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                    The all-in-one vendor portal to manage bandwidth plans, automate M-Pesa payments, and monitor router health from a single cloud-based dashboard.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200">
                      Start Your Free Trial <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                    <Link to="/onboarding" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
                      View Demo
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Background Decorative Element */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-[100%] blur-3xl -z-10 opacity-50" />
            </section>

            {/* 3. Features Grid */}
            <section id="features" className="py-24 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h3 className="text-3xl font-bold text-gray-900">Engineered for ISP Vendors</h3>
                  <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FeatureCard 
                    icon={BanknotesIcon} 
                    title="M-Pesa Automation" 
                    desc="Instant payment verification and account activation without manual intervention." 
                  />
                  <FeatureCard 
                    icon={CpuChipIcon} 
                    title="Router Orchestration" 
                    desc="Remotely push bandwidth plans and rate limits to all your MikroTik devices." 
                  />
                  <FeatureCard 
                    icon={ChartBarIcon} 
                    title="Real-time Analytics" 
                    desc="Track revenue, active users, and data consumption with deep insights." 
                  />
                </div>
              </div>
            </section>

            {/* 4. Trust Section */}
            <section className="py-20">
              <div className="max-w-5xl mx-auto px-4 text-center">
                <ShieldCheckIcon className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Bank-Grade Security</h3>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  We use AES-256 bit encryption to store your M-Pesa credentials and API keys. Your network security is our top priority.
                </p>
              </div>
            </section>
          </>
        ) : (
          <Outlet /> 
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale">
            <CpuChipIcon className="w-5 h-5 text-gray-600" />
            <span className="font-bold text-gray-600">VENDHUB</span>
          </div>
          <p className="text-gray-400 text-sm italic">
            &copy; {new Date().getFullYear()} VendHub Systems. Built for the modern ISP.
          </p>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Sub-component for clean code
const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-2xl hover:shadow-blue-100 transition-all group">
    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
      <Icon className="w-7 h-7 text-blue-600 group-hover:text-white" />
    </div>
    <h4 className="text-xl font-bold mb-3 text-gray-800">{title}</h4>
    <p className="text-gray-500 leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

export default Home;