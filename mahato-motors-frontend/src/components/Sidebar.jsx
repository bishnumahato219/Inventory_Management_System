import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Car, 
  ScrollText, 
  Settings, 
  LogOut, 
  Moon, 
  ChevronLeft 
} from "lucide-react";

const Sidebar = ({ role, collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Define options specifically for the customer
  const customerMenu = [
    { name: "Customer Hub", path: "/customer/dashboard", icon: <LayoutDashboard size={20}/> },
    { name: "Fleet Gallery", path: "/customer/book-car", icon: <Car size={20}/> },
    { name: "My Bookings", path: "/customer/my-bookings", icon: <ScrollText size={20}/> },
    { name: "Settings", path: "/customer/settings", icon: <Settings size={20}/> },
  ];

  return (
    <aside className={`${collapsed ? "w-20" : "w-72"} bg-white border-r border-slate-100 flex flex-col transition-all duration-500 shadow-2xl h-screen sticky top-0`}>
      {/* Brand Header */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-orange-600 p-2 rounded-xl text-white font-black text-xl shadow-lg shadow-orange-500/20">M</div>
        {!collapsed && (
          <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            Mahato <span className="text-orange-600 font-black">Motors.</span>
          </h1>
        )}
      </div>

      {/* Navigation Links - Mapping Customer Options */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {customerMenu.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
              ${isActive 
                ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20 font-black" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 font-bold"}
            `}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="text-[11px] uppercase tracking-widest leading-none">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="p-6 border-t border-slate-50 space-y-2">
        <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-slate-600 transition-colors">
          <Moon size={20}/>
          {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest leading-none">Dark Mode</span>}
        </button>
        
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-orange-500 transition-colors"
        >
          <ChevronLeft className={`transition-transform duration-500 ${collapsed ? "rotate-180" : ""}`} size={20}/>
          {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest leading-none">Collapse View</span>}
        </button>
        
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut size={20}/>
          {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest leading-none">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;