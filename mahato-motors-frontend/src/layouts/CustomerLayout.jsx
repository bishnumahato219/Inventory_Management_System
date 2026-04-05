import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react"; // Import Menu icon

const CustomerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // New state for mobile drawer
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar instance - Now passing mobile states */}
      <Sidebar 
        role="customer" 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Made responsive */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 md:px-10 border-b border-slate-100 sticky top-0 z-30">
          
          <div className="flex items-center gap-4">
            {/* MOBILE MENU BUTTON - Visible only on small screens */}
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2 bg-slate-100 text-slate-600 rounded-lg md:hidden hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="flex flex-col">
              <p className="hidden xs:block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Authorized Personnel
              </p>
              <p className="text-sm md:text-lg font-bold text-slate-800">
                Welcome, <span className="text-orange-600 font-black">{user?.name?.split(' ')[0]}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-8 w-8 md:h-10 md:w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black text-xs md:text-base">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            {/* Role badge hidden on very small screens to save space */}
            <span className="hidden sm:inline-block text-[10px] bg-slate-100 px-4 py-1.5 rounded-full uppercase font-black tracking-widest text-slate-600">
              Customer
            </span>
          </div>
        </header>

        {/* Main Content - Reduced padding on mobile */}
        <main className="p-4 md:p-10 flex-1 overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;