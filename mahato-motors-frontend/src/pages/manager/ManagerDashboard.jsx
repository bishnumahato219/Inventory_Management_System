import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { 
  TrendingUp, Car, AlertTriangle, IndianRupee, Layers, 
  ArrowUpRight, BarChart3 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from "recharts";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalCars: 0,
    lowStock: [],
    revenueTrend: [],
    modelDistribution: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/reports/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <p className="font-black uppercase tracking-widest text-slate-400 text-[10px] md:text-xs text-center px-4">
          Syncing Mahato Motors Analytics...
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 bg-slate-50 min-h-screen font-sans overflow-x-hidden">
      
      {/* 1. Header Section - Stacked on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Executive <span className="text-orange-600">Summary</span>
          </h2>
          <p className="text-slate-500 text-xs md:text-base font-medium mt-1">
            Real-time dealership performance overview.
          </p>
        </div>
        <div className="flex self-start md:self-center items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-[9px] md:text-xs font-black uppercase tracking-widest text-slate-600">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          Live System Status
        </div>
      </div>

      {/* 2. KPI Cards - Grid adjusts from 1 to 2 to 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Total Revenue Card */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl">
          <div className="bg-orange-500 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-orange-500/20">
            <IndianRupee size={20} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mb-2">Total Revenue</p>
          <h3 className="text-2xl md:text-4xl font-black tracking-tight">
            ₹{stats.totalRevenue?.toLocaleString("en-IN")}
          </h3>
          <div className="mt-4 md:mt-6 flex items-center gap-2 text-green-400 text-[10px] md:text-xs font-bold">
            <ArrowUpRight size={14} /> +12.5% Growth
          </div>
        </div>

        {/* Vehicles Sold Card */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="bg-blue-50 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-blue-600">
            <Layers size={20} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mb-2">Vehicles Delivered</p>
          <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            {stats.totalSales} <span className="text-sm md:text-lg text-slate-300 font-medium">Units</span>
          </h3>
        </div>

        {/* Active Inventory Card - Spans 2 columns on tablet for balanced look */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 sm:col-span-2 lg:col-span-1">
          <div className="bg-orange-50 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-orange-600">
            <Car size={20} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mb-2">Available Models</p>
          <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            {stats.totalCars} <span className="text-sm md:text-lg text-slate-300 font-medium">Variants</span>
          </h3>
        </div>
      </div>

      {/* 3. Visual Analytics Section - Stacks on Tablet, Side-by-side on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <TrendingUp className="text-orange-600" size={20} />
            <h3 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tight">Revenue Trends</h3>
          </div>
          <div className="h-60 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} 
                />
                <Area type="monotone" dataKey="amount" stroke="#f97316" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Model Bar Chart */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <BarChart3 className="text-blue-600" size={20} />
            <h3 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tight">Sales by Model</h3>
          </div>
          <div className="h-60 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.modelDistribution}>
                <XAxis dataKey="model" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                  {stats.modelDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1e293b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Low Stock Alerts Section */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-2 md:p-3 rounded-xl text-red-600">
              <AlertTriangle size={20} md:size={24} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Inventory Warnings</h3>
              <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">Stock levels below threshold</p>
            </div>
          </div>
          <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest self-start sm:self-center border border-red-100">
            {stats.lowStock?.length || 0} Alerts Active
          </span>
        </div>

        {/* Responsive Grid: 2 columns on small screens, 4 on large */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.lowStock?.map((car) => (
            <div key={car._id} className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-transparent hover:border-red-100 transition-all group">
              <p className="text-[10px] md:text-xs font-black text-slate-800 uppercase line-clamp-1 group-hover:text-red-600 transition-colors">{car.modelName}</p>
              <div className="flex items-end justify-between mt-2">
                <span className="text-xl md:text-2xl font-black text-red-600">{car.stock}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">In Stock</span>
              </div>
            </div>
          ))}
          {(!stats.lowStock || stats.lowStock.length === 0) && (
            <div className="col-span-full py-12 text-center text-slate-400 font-bold text-[10px] md:text-xs uppercase italic tracking-[0.2em]">
              All inventory levels are currently healthy.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;