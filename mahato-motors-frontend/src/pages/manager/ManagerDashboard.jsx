import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { TrendingUp, Car, AlertTriangle, IndianRupee, Layers, ArrowUpRight, ShieldCheck } from "lucide-react";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalCars: 0,
    lowStock: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Keep fetching as it is
      const res = await API.get("/reports/dashboard"); 
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Syncing Analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-8 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Executive <span className="text-orange-600">Summary</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">Real-time dealership performance overview.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-xs font-bold text-slate-600">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          Live System Status
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Revenue Card */}
        <div className="relative overflow-hidden group bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl transition-transform hover:-translate-y-2">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <IndianRupee size={24} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Monthly Revenue</p>
            <h3 className="text-4xl font-black tracking-tight">
              ₹{stats.totalRevenue?.toLocaleString("en-IN")}
            </h3>
            <div className="mt-6 flex items-center gap-2 text-green-400 text-xs font-bold">
              <ArrowUpRight size={16} /> +12.5% from last month
            </div>
          </div>
        </div>

        {/* Vehicles Sold Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 transition-transform hover:-translate-y-2">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
            <Layers size={24} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Vehicles Sold</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {stats.totalSales} <span className="text-lg text-slate-300 font-medium">Units</span>
          </h3>
          <p className="mt-6 text-slate-400 text-xs font-medium">Total finalized sales records.</p>
        </div>

        {/* Active Inventory Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 transition-transform hover:-translate-y-2">
          <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
            <Car size={24} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Active Inventory</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {stats.totalCars} <span className="text-lg text-slate-300 font-medium">Models</span>
          </h3>
          <p className="mt-6 text-slate-400 text-xs font-medium">Live available stock items.</p>
        </div>
      </div>

      {/* Low Stock Alerts Section */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Critical Stock Alerts</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Action required immediately</p>
            </div>
          </div>
          <span className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {stats.lowStock?.length} Alerts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.lowStock?.map((car) => (
            <div 
              key={car._id} 
              className="group flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-red-200 hover:bg-red-50 transition-all cursor-default"
            >
              <div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-red-700 transition-colors">
                  {car.modelName}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{car.variant || 'Standard'}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-red-600">{car.stock}</p>
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Units Left</p>
              </div>
            </div>
          ))}

          {stats.lowStock?.length === 0 && (
            <div className="col-span-full py-10 text-center flex flex-col items-center gap-4">
               <div className="h-12 w-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                 <ShieldCheck size={24} />
               </div>
               <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">All inventory levels are healthy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;