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
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import Sidebar from "./sidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle click outside to close menus
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
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar aside code remains the same... */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
           <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xl">M</span></div>
            <span className="ml-3 font-bold text-xl text-gray-800 tracking-tight">Mikro<span className="text-blue-600">Dash</span></span>
          </div>
          <div className="flex-1 overflow-y-auto"><Sidebar closeMobile={() => setSidebarOpen(false)} /></div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center">
            <button className="p-2 mr-4 text-gray-600 md:hidden hover:bg-gray-100 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h2 className="hidden md:block text-sm font-medium text-gray-400 uppercase tracking-[0.2em]">Network Ops</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            
            {/* NOTIFICATION DROPDOWN */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setNotifMenuOpen(!notifMenuOpen); setUserMenuOpen(false); }}
                className={`p-2 rounded-full transition-all relative ${notifMenuOpen ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
              >
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Notifications</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">2 NEW</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <NotificationItem icon={ExclamationTriangleIcon} color="text-amber-500" bg="bg-amber-50" title="Router Offline" time="2 mins ago" desc="Core_Mikrotik_01 lost connection." />
                    <NotificationItem icon={CheckCircleIcon} color="text-emerald-500" bg="bg-emerald-50" title="Payment Success" time="1 hour ago" desc="M-Pesa Ref: SBX092... received." />
                  </div>
                  <button className="w-full py-3 text-center text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors">View All Notifications</button>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            {/* USER PROFILE DROPDOWN */}
            <div className="relative" ref={userRef}>
              <button 
                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifMenuOpen(false); }}
                className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-all border ${userMenuOpen ? "bg-gray-100 border-gray-300" : "hover:bg-gray-50 border-transparent hover:border-gray-200"}`}
              >
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
                <span className="hidden sm:block text-sm font-semibold text-gray-700">Vendor Admin</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1 sm:hidden">
                    <p className="text-sm font-bold text-gray-900">Vendor Admin</p>
                  </div>
                  <DropdownLink to="/profile" icon={UserIcon} label="My Profile" />
                  <DropdownLink to="/settings" icon={Cog6ToothIcon} label="Account Settings" />
                  <hr className="my-2 border-gray-50" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}

// Utility Components for Clean Code
function NotificationItem({ icon: Icon, color, bg, title, time, desc }: any) {
  return (
    <div className="p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors">
      <div className="flex gap-3">
        <div className={`p-2 rounded-lg ${bg} ${color} h-fit`}><Icon className="w-5 h-5" /></div>
        <div>
          <div className="flex justify-between items-center mb-0.5">
            <p className="text-sm font-bold text-gray-800">{title}</p>
            <span className="text-[10px] text-gray-400">{time}</span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function DropdownLink({ to, icon: Icon, label }: any) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all">
      <Icon className="w-5 h-5 opacity-70" />
      {label}
    </Link>
  );
}