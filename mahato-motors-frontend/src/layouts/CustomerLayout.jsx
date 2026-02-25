import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const CustomerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar instance - Role passed as prop */}
      <Sidebar 
        role="customer" 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Matching Customer Hub */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-10 border-b border-slate-100">
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authorized Personnel</p>
            <p className="text-lg font-bold text-slate-800">
              Welcome back, <span className="text-orange-600 font-black">{user?.name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-[10px] bg-slate-100 px-4 py-1.5 rounded-full uppercase font-black tracking-widest text-slate-600">
              Customer
            </span>
          </div>
        </header>

        {/* This is where your Hub and Book Car pages render */}
        <main className="p-10 flex-1 overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;