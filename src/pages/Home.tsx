import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  CpuChipIcon, 
  BanknotesIcon, 
  ShieldCheckIcon, 
  ArrowRightIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

const Home: React.FC = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500 selection:text-white bg-slate-50 dark:bg-[#0a0f18]">
      {/* 1. Industrial Floating Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#0a0f18]/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase">
              VEND<span className="text-blue-600">HUB</span>
            </h1>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
            <Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link>
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 italic"
            >
              Get Started _
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button className="md:hidden text-slate-900 dark:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#0a0f18] border-b border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in slide-in-from-top duration-300">
            <Link to="/login" className="block text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Login</Link>
            <Link to="/signup" className="block w-full text-center bg-blue-600 text-white py-4 rounded-xl font-black uppercase italic tracking-widest">Sign Up Now</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {isRoot ? (
          <>
            {/* 2. Hero Section: The NOC Center */}
            <section className="relative pt-20 pb-40 overflow-hidden">
              {/* Background Tech Grid */}
              <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
                <div className="absolute inset-0 h-full w-full bg-[size:40px_40px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]"></div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-5xl mx-auto">
                  <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <BoltIcon className="w-4 h-4 text-blue-500" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] italic">
                      Mission_Critical_ISP_Orchestration
                    </span>
                  </div>
                  
                  <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-8 uppercase italic">
                    Automate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">MikroTik</span> <br/>
                    Business_Flow
                  </h2>
                  
                  <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                    Centralized cloud control for bandwidth provisioning, M-Pesa automated billing, and real-time network telemetry.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link to="/signup" className="group relative px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest italic hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40 active:scale-95 overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Deploy_System <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                    <Link to="/onboarding" className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-black uppercase tracking-widest italic hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                      View_Simulator
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Features: The Modular Grid */}
            <section id="features" className="py-32 bg-slate-900 dark:bg-black relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
                  <div>
                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block italic">Systems_Overview</span>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Engineered_Precision</h3>
                  </div>
                  <div className="h-px flex-1 bg-slate-800 mx-10 hidden md:block opacity-50" />
                  <p className="text-slate-400 text-sm max-w-xs uppercase tracking-tighter font-bold italic">
                    High-performance infrastructure built for high-scale network vendors.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <FeatureCard 
                    icon={BanknotesIcon} 
                    title="M-Pesa Core" 
                    label="PAYMENT_GATEWAY"
                    desc="Instant callback verification and radical account activation latency reductions." 
                  />
                  <FeatureCard 
                    icon={CpuChipIcon} 
                    title="Node Sync" 
                    label="ROUTER_OS"
                    desc="Push rate-limit changes and firewall rules across global clusters in 250ms." 
                  />
                  <FeatureCard 
                    icon={ChartBarIcon} 
                    title="Telemetry" 
                    label="ANALYTICS"
                    desc="Full-stack visibility into revenue churn, bandwidth peaks, and user density." 
                  />
                </div>
              </div>
            </section>

            {/* 4. Security Status */}
            <section className="py-32 bg-white dark:bg-[#0a0f18] border-t border-slate-100 dark:border-slate-800">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="inline-block p-4 bg-emerald-500/10 rounded-3xl mb-8">
                  <ShieldCheckIcon className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-black mb-6 text-slate-900 dark:text-white uppercase italic tracking-tighter">Hardened_Security</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-loose uppercase text-[11px] tracking-widest">
                  AES-256 standard encryption. Zero-trust architecture. Your credentials never leave our encrypted vault.
                </p>
              </div>
            </section>
          </>
        ) : (
          <div className="animate-in fade-in duration-700">
            <Outlet />
          </div>
        )}
      </main>

      {/* 5. Minimalist Industrial Footer */}
      <footer className="bg-white dark:bg-[#0a0f18] border-t border-slate-100 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
            <CpuChipIcon className="w-5 h-5 text-slate-900 dark:text-white" />
            <span className="font-black text-slate-900 dark:text-white uppercase italic tracking-widest">VENDHUB_CORP</span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} DEPLOYED_BY_VENDHUB_SYSTEMS.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy_Doc</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms_Of_Use</a>
            <a href="#" className="hover:text-blue-600 transition-colors">API_SDK</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Fancy Feature Card Component
const FeatureCard = ({ icon: Icon, title, desc, label }: any) => (
  <div className="group relative bg-slate-800/40 dark:bg-white/[0.02] p-10 rounded-[2rem] border border-slate-700/50 dark:border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
       <Icon className="w-24 h-24 text-white" />
    </div>
    
    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7" />
    </div>
    
    <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 block italic">{label}</span>
    <h4 className="text-2xl font-black mb-4 text-white uppercase italic tracking-tighter">{title}</h4>
    <p className="text-slate-400 leading-relaxed text-sm font-medium">
      {desc}
    </p>
  </div>
);

export default Home;