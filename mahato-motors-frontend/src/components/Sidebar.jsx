import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Car, 
  ScrollText, 
  Settings, 
  LogOut, 
  Moon, 
  ChevronLeft,
  X // Added for mobile close button
} from "lucide-react";

const Sidebar = ({ role, collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const customerMenu = [
    { name: "Customer Hub", path: "/customer/dashboard", icon: <LayoutDashboard size={20}/> },
    { name: "Fleet Gallery", path: "/customer/book-car", icon: <Car size={20}/> },
    { name: "My Bookings", path: "/customer/my-bookings", icon: <ScrollText size={20}/> },
    { name: "Settings", path: "/customer/settings", icon: <Settings size={20}/> },
  ];

  return (
    <>
      {/* MOBILE OVERLAY: Dims the background when sidebar is open on mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        /* Mobile Styles */
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out bg-white shadow-2xl
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        
        /* Desktop Styles */
        md:relative md:translate-x-0 md:flex md:flex-col md:h-screen md:sticky md:top-0 md:border-r md:border-slate-100
        ${collapsed ? "md:w-20" : "md:w-72"} 
      `}>
        
        {/* Brand Header */}
        <div className="p-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-xl text-white font-black text-xl shadow-lg shadow-orange-500/20">M</div>
            {(!collapsed || mobileOpen) && (
              <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                Mahato <span className="text-orange-600 font-black">Motors.</span>
              </h1>
            )}
          </div>
          
          {/* Close button - Only visible on Mobile */}
          <button className="md:hidden text-slate-400" onClick={() => setMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {customerMenu.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              onClick={() => setMobileOpen(false)} // Auto-close on link click
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
                ${isActive 
                  ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20 font-black" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 font-bold"}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              {(!collapsed || mobileOpen) && (
                <span className="text-[11px] uppercase tracking-widest leading-none">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Controls */}
        <div className="p-6 border-t border-slate-50 space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-slate-600 transition-colors">
            <Moon size={20}/>
            {(!collapsed || mobileOpen) && <span className="text-[10px] font-black uppercase tracking-widest leading-none">Dark Mode</span>}
          </button>
          
          {/* Collapse Toggle - Hidden on Mobile because mobile uses drawer logic */}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="hidden md:flex w-full items-center gap-4 px-4 py-3 text-slate-400 hover:text-orange-500 transition-colors"
          >
            <ChevronLeft className={`transition-transform duration-500 ${collapsed ? "rotate-180" : ""}`} size={20}/>
            {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest leading-none">Collapse View</span>}
          </button>
          
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={20}/>
            {(!collapsed || mobileOpen) && <span className="text-[10px] font-black uppercase tracking-widest leading-none">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;