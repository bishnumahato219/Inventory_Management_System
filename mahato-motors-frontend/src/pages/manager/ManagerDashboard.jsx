import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { 
  TrendingUp, Car, AlertTriangle, IndianRupee, Layers, 
  ArrowUpRight, ShieldCheck, PieChart as PieIcon, BarChart3 
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
    revenueTrend: [], // Added for charts
    modelDistribution: [] // Added for charts
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
    const interval = setInterval(fetchDashboardData, 30000); // Sync every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Syncing Analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen font-sans">
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
        {/* Total Revenue Card */}
        <div className="relative overflow-hidden group bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
          <div className="relative z-10">
            <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <IndianRupee size={24} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Life-Time Revenue</p>
            <h3 className="text-4xl font-black tracking-tight">
              ₹{stats.totalRevenue?.toLocaleString("en-IN")}
            </h3>
            <div className="mt-6 flex items-center gap-2 text-green-400 text-xs font-bold">
              <ArrowUpRight size={16} /> +12.5% Growth
            </div>
          </div>
        </div>

        {/* Vehicles Sold Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
            <Layers size={24} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Vehicles Delivered</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {stats.totalSales} <span className="text-lg text-slate-300 font-medium">Units</span>
          </h3>
          <p className="mt-6 text-slate-400 text-xs font-medium">Finalized sales from "Delivered" status.</p>
        </div>

        {/* Active Inventory Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
            <Car size={24} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Available Models</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {stats.totalCars} <span className="text-lg text-slate-300 font-medium">Variants</span>
          </h3>
          <p className="mt-6 text-slate-400 text-xs font-medium">Items currently in stock.</p>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Area Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-orange-600" />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Revenue Trends</h3>
          </div>
          <div className="h-72">
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
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-blue-600" />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Sales by Model</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.modelDistribution}>
                <XAxis dataKey="model" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
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

      {/* Low Stock Alerts Section */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Inventory Warnings</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Stock levels below threshold</p>
            </div>
          </div>
          <span className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {stats.lowStock?.length} Alerts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.lowStock?.map((car) => (
            <div key={car._id} className="p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-red-100 transition-all">
              <p className="text-xs font-black text-slate-800 uppercase">{car.modelName}</p>
              <div className="flex items-end justify-between mt-2">
                <span className="text-2xl font-black text-red-600">{car.stock}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Left</span>
              </div>
            </div>
          ))}
          {stats.lowStock?.length === 0 && (
            <div className="col-span-full py-6 text-center text-slate-400 font-bold text-xs uppercase italic">
              All inventory levels are healthy.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;