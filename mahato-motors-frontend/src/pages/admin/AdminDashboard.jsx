import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Cell 
} from "recharts";
import { 
  Car, AlertTriangle, TrendingUp, History, 
  IndianRupee, ShieldCheck, ArrowUpRight, 
  Layers, BarChart3 
} from "lucide-react";

const COLORS = ["#f97316", "#3b82f6", "#8277a7", "#10b981"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    totalCars: 0, 
    outOfStock: 0, 
    totalRevenue: 0, 
    recentCars: [],
    totalSales: 0,
    lowStock: [],
    monthlyRevenue: [],
    modelDistribution: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/dashboard/stats"); 
        setStats(res.data);
      } catch (err) { 
        console.error("Dashboard Fetch Error:", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <p className="font-black uppercase tracking-widest text-slate-400 text-[10px] text-center">Syncing Executive Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Admin <span className="text-orange-600">Control</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Dealership assets and financial trajectory.</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-[10px] font-bold text-slate-600 self-start sm:self-center">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
          Administrator Access Active
        </div>
      </div>

      {/* TOP KPI GRID - 1 col on mobile, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {/* TOTAL REVENUE */}
        <div className="relative overflow-hidden group bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white shadow-xl">
          <div className="absolute -top-4 -right-4 p-8 opacity-10 group-hover:scale-110 transition-transform hidden sm:block">
            <TrendingUp size={100} />
          </div>
          <div className="relative z-10">
            <div className="bg-orange-500 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <IndianRupee size={20} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Life-Time Revenue</p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">
              ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-[10px] font-bold">
              <ArrowUpRight size={14} /> +12.5% Growth
            </div>
          </div>
        </div>

        {/* TOTAL FLEET */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-md">
          <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-blue-600">
            <Car size={20} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Inventory</p>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {stats.totalCars} <span className="text-sm text-slate-300 font-medium uppercase">Units</span>
          </h3>
        </div>

        {/* GROSS SALES */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-md">
          <div className="bg-orange-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-orange-600">
            <Layers size={20} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Gross Sales</p>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {stats.totalSales} <span className="text-sm text-slate-300 font-medium uppercase">Orders</span>
          </h3>
        </div>
      </div>

      {/* CHARTS SECTION - Stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-orange-600" size={20} />
            <h3 className="text-md font-black text-slate-800 uppercase tracking-tight">Revenue Trends</h3>
          </div>
          <div className="h-60 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="amount" stroke="#f97316" fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-blue-600" size={20} />
            <h3 className="text-md font-black text-slate-800 uppercase tracking-tight">Sales by Model</h3>
          </div>
          <div className="h-60 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.modelDistribution}>
                <XAxis dataKey="model" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                  {stats.modelDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - Table and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INVENTORY LEDGER */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden">
          <div className="p-6 md:p-10 flex items-center gap-4">
            <div className="bg-slate-900 p-2 rounded-lg text-white">
              <History size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Inventory Ledger</h3>
          </div>
          
          <div className="overflow-x-auto px-4 md:px-10 pb-10">
            {/* Table stays as table but with responsive sizing */}
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-4">Model Details</th>
                  <th className="pb-4 text-center">Status</th>
                  <th className="pb-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentCars.map((car) => (
                  <tr key={car._id} className="border-b border-slate-50 last:border-0">
                    <td className="py-4">
                      <p className="text-xs font-black text-slate-800 uppercase">{car.modelName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{car.variant}</p>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black ${
                        car.stock < 5 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"
                      }`}>
                        {car.stock} Units
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <p className="text-xs font-black text-slate-900">₹{car.exShowroomPrice?.toLocaleString("en-IN")}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ALERTS SECTION */}
        <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-100 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-50 p-2 rounded-lg text-red-600">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {stats.lowStock?.map((car) => (
              <div key={car._id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-transparent hover:border-red-100 transition-all">
                <div>
                  <p className="text-[10px] font-black text-slate-800 uppercase">{car.modelName}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">{car.variant}</p>
                </div>
                <div className="text-red-600 font-black text-sm">{car.stock} <span className="text-[8px] uppercase text-slate-400">Left</span></div>
              </div>
            ))}
            {stats.lowStock?.length === 0 && (
              <div className="py-6 text-center">
                <ShieldCheck size={32} className="mx-auto text-green-400 mb-2" />
                <p className="text-[10px] text-slate-400 font-bold uppercase">All levels stable</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}