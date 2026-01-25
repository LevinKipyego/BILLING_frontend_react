import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon, 
  UserIcon, 
  Cog6ToothIcon,
  ChevronDownIcon 
} from "@heroicons/react/24/outline";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("vendor_id");
    navigate("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-all border ${
          isOpen ? "bg-gray-100 border-gray-300 shadow-sm" : "hover:bg-gray-50 border-transparent hover:border-gray-200"
        }`}
      >
        <UserCircleIcon className="w-8 h-8 text-gray-400" />
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-gray-700 leading-none">Vendor Admin</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Premium Plan</p>
        </div>
        <ChevronDownIcon className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[100] animate-in fade-in zoom-in duration-100 origin-top-right">
          <div className="px-4 py-3 border-b border-gray-50 mb-1">
            <p className="text-sm font-bold text-gray-900">Account Settings</p>
            <p className="text-xs text-gray-500 truncate">admin@yourisp.com</p>
          </div>

          <MenuLink to="/profile" icon={UserIcon} label="My Profile" />
          <MenuLink to="/settings" icon={Cog6ToothIcon} label="System Settings" />
          
          <hr className="my-2 border-gray-50" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// Sub-component for Menu Links
const MenuLink = ({ to, icon: Icon, label }: any) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all"
  >
    <Icon className="w-5 h-5 opacity-70" />
    {label}
  </Link>
);