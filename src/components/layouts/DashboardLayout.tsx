import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  UserIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronLeftIcon
} from "@heroicons/react/24/outline";
import Sidebar from "./sidebar";
import ThemeToggle from "../../themes/ThemeToggle";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-gray-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden font-inter">
      
      {/* 1. MOBILE OVERLAY */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 dark:bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* 2. DYNAMIC SIDEBAR */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-72 translate-x-0" : "w-20 lg:translate-x-0 -translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className={`h-16 flex items-center border-b border-gray-100 dark:border-slate-800 transition-all ${sidebarOpen ? "px-6 justify-between" : "justify-center"}`}>
            <div className="flex items-center min-w-max">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              {sidebarOpen && (
                <span className="ml-3 font-bold text-xl text-gray-800 dark:text-slate-100 tracking-tight whitespace-nowrap">
                  Mikro<span className="text-blue-600">Dash</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <Sidebar isOpen={sidebarOpen} closeMobile={() => setSidebarOpen(false)} />
          </div>

          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center h-12 border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-400 transition-colors"
          >
            <ChevronLeftIcon className={`w-5 h-5 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <div 
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300
          ${sidebarOpen ? "lg:pl-72" : "lg:pl-20"}
        `}
      >
        {/* Header: Reduced padding on mobile (px-2) to give content more room */}
        <header className="h-16 bg-white/80 dark:bg-slate-900 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-2 md:px-8 sticky top-0 z-30 transition-colors">
          <div className="flex items-center">
            <button 
              className={`p-2 mr-1 md:mr-4 rounded-lg transition-colors ${sidebarOpen ? "text-blue-600 bg-blue-50 dark:bg-blue-500/10" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"}`} 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h2 className="hidden sm:block text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Network Ops</h2>
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            <ThemeToggle />
            <div className="h-6 w-px bg-gray-200 dark:bg-slate-600 mx-1"></div>
            
            {/* NOTIFICATIONS */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setNotifMenuOpen(!notifMenuOpen); setUserMenuOpen(false); }}
                className={`p-2 rounded-full transition-all relative ${notifMenuOpen ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800"}`}
              >
                <BellIcon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              {notifMenuOpen && (
                <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 dark:text-slate-100">Notifications</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">2 NEW</span>
                  </div>
                  <NotificationItem icon={ExclamationTriangleIcon} color="text-amber-500" bg="bg-amber-50 dark:bg-amber-500/10" title="Router Offline" time="2 mins ago" desc="Core_Mikrotik_01 lost connection." />
                  <NotificationItem icon={CheckCircleIcon} color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-500/10" title="Payment Success" time="1 hour ago" desc="M-Pesa received." />
                </div>
              )}
            </div>

            {/* USER PROFILE */}
            <div className="relative" ref={userRef}>
              <button 
                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifMenuOpen(false); }}
                className={`flex items-center gap-2 p-1 lg:pr-3 rounded-full transition-all border ${userMenuOpen ? "bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600" : "hover:bg-gray-50 dark:hover:bg-slate-800 border-transparent hover:border-gray-200 dark:hover:border-slate-700"}`}
              >
                <UserCircleIcon className="w-7 h-7 md:w-8 md:h-8 text-gray-400 dark:text-slate-500" />
                <span className="hidden lg:block text-sm font-semibold text-gray-700 dark:text-slate-300">Admin</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-gray-100 dark:border-slate-800 py-2 z-50">
                  <DropdownLink to="/profile" icon={UserIcon} label="My Profile" />
                  <DropdownLink to="/settings" icon={Cog6ToothIcon} label="Settings" />
                  <hr className="my-2 border-gray-50 dark:border-slate-800" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Updated Main: p-2 on mobile, p-8 on desktop. Removed mx-auto for mobile. */}
        <main className="flex-1 overflow-y-auto p-2 md:p-8 bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-300">
          <div className="w-full md:max-w-7xl md:mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function DropdownLink({ to, icon: Icon, label }: any) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
      <Icon className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
      {label}
    </Link>
  );
}

function NotificationItem({ icon: Icon, color, bg, title, time, desc }: any) {
  return (
    <div className="p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 border-b border-gray-50 dark:border-slate-800 cursor-pointer transition-colors">
      <div className="flex gap-3">
        <div className={`p-2 rounded-lg ${bg} ${color} h-fit shadow-sm`}><Icon className="w-4 h-4 md:w-5 md:h-5" /></div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-0.5">
            <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-slate-200">{title}</p>
            <span className="text-[9px] text-gray-400 dark:text-slate-500 font-medium">{time}</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}