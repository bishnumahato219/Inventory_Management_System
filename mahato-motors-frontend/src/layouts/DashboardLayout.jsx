import { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, Users, Car, BookOpen, ScrollText, 
  PackagePlus, UserCircle, Truck, Warehouse, BarChart3, 
  Settings, LogOut, Moon, Sun, ChevronLeft, ChevronRight 
} from "lucide-react"; // Added for modern iconography
import API from "../api/axios";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  // Defensive parsing to prevent crash if localStorage is empty
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "employee";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (role === "admin" || role === "manager") {
      API.get("/reports/dashboard")
        .then((res) => {
          // Defensive check for lowStock array
          setLowStockCount(res.data?.lowStock?.length || 0);
        })
        .catch(() => setLowStockCount(0));
    }
  }, [role]);

  // Icons added for a futuristic look
  const menuItems = {
    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20}/> },
      { name: "Manage Users", path: "/admin/users", icon: <Users size={20}/> },
      { name: "Manage Cars", path: "/admin/cars", icon: <Car size={20}/> },
      { name: "Manage Bookings", path: "/admin/bookings", icon: <BookOpen size={20}/> },
    ],
    manager: [
      { name: "Dashboard", path: "/manager/dashboard", icon: <LayoutDashboard size={20}/> },
      { name: "Manage Cars", path: "/admin/cars", icon: <Car size={20}/> },
      { name: "Stock/Bookings", path: "/manager/stock", icon: <Warehouse size={20}/> },
      { name: "Sales History", path: "/manager/SalesHistory", icon: <ScrollText size={20}/> },
      { name: "Purchase Stock", path: "/manager/PurchaseStock", icon: <PackagePlus size={20}/> },
      { name: "Manage Employees", path: "/manager/employees", icon: <UserCircle size={20}/> },
      { name: "Manage Suppliers", path: "/manager/suppliers", icon: <Truck size={20}/> },
      { name: "Stock Management", path: "/manager/StockManagement", icon: <Warehouse size={20}/> },
      { name: "Reports", path: "/manager/reports", icon: <BarChart3 size={20}/> },
      { name: "Settings", path: "/manager/settings", icon: <Settings size={20}/> },
    ],
    employee: [
      { name: "Dashboard", path: "/employee/dashboard", icon: <LayoutDashboard size={20}/> },
      { name: "Sales Entry", path: "/employee/sales", icon: <ScrollText size={20}/> },
      { name: "Manage Bookings", path: "/admin/bookings", icon: <BookOpen size={20}/> },
      { name: "Stock Management", path: "/manager/StockManagement", icon: <Warehouse size={20}/> },
    ],
  };

  return (
    <div className={`${dark ? "dark bg-slate-950" : "bg-slate-50"} transition-colors duration-300`}>
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <div className={`
          ${collapsed ? "w-20" : "w-72"} 
          ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} 
          flex flex-col transition-all duration-500 border-r shadow-2xl z-50
        `}>
          <div className="p-8 flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-xl text-white font-black text-xl shadow-lg shadow-orange-500/20">M</div>
            {!collapsed && (
              <h1 className={`text-xl font-black uppercase tracking-tighter ${dark ? "text-white" : "text-slate-900"}`}>
                Mahato <span className="text-orange-600">Motors.</span>
              </h1>
            )}
          </div>

          <div className="flex-1 px-4 space-y-1 overflow-y-auto">
            {menuItems[role]?.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
                  ${isActive 
                    ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20" 
                    : `${dark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}
                `}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
                    {item.name === "Reports" && lowStockCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse font-black shadow-lg">
                        {lowStockCount}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800 space-y-4">
            <button 
              onClick={() => setDark(!dark)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${dark ? "text-yellow-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"}`}
            >
              {dark ? <Sun size={20}/> : <Moon size={20}/>}
              {!collapsed && <span className="text-xs font-bold uppercase tracking-widest">{dark ? "Light Mode" : "Dark Mode"}</span>}
            </button>
            
            <button 
              onClick={() => setCollapsed(!collapsed)} 
              className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-orange-500 transition-colors"
            >
              {collapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
              {!collapsed && <span className="text-xs font-bold uppercase tracking-widest">Collapse View</span>}
            </button>
            
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={20}/>
              {!collapsed && <span className="text-sm font-black uppercase tracking-widest">Logout</span>}
            </button>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className={`h-20 shadow-sm flex items-center justify-between px-10 border-b ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
            <div className="flex flex-col">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Authorized Personnel</p>
              <p className={`text-lg font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                Welcome back, <span className="text-orange-600">{user?.name}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black">
                 {user?.name?.[0]?.toUpperCase()}
               </div>
               <span className={`text-[10px] px-4 py-1.5 rounded-full uppercase font-black tracking-widest ${dark ? "bg-slate-800 text-orange-500" : "bg-orange-50 text-orange-600"}`}>
                 {role}
               </span>
            </div>
          </header>

          <main className={`p-10 flex-1 overflow-y-auto ${dark ? "bg-slate-950" : "bg-slate-50"}`}>
            {/* The Outlet handles child rendering */}
            <div className="max-w-7xl mx-auto">
              <Outlet /> 
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}