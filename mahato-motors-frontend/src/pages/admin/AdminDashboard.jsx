import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Cell 
} from "recharts";
import { 
  Car, AlertTriangle, TrendingUp, History, 
  IndianRupee, ShieldCheck, ArrowUpRight, 
  Layers, Activity, BarChart3 
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
    modelDistribution: [] // New field for the bar chart
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
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Syncing Executive Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Admin <span className="text-orange-600">Control</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">Global dealership assets and financial trajectory.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-xs font-bold text-slate-600">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
          Administrator Access Active
        </div>
      </div>

      {/* TOP KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* TOTAL REVENUE CARD - Manager Style Dark */}
        <div className="relative overflow-hidden group bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl transition-transform hover:-translate-y-2">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <IndianRupee size={24} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Life-Time Revenue</p>
            <h3 className="text-4xl font-black tracking-tight">
              ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
            </h3>
            <div className="mt-6 flex items-center gap-2 text-green-400 text-xs font-bold">
              <ArrowUpRight size={16} /> +12.5% Growth
            </div>
          </div>
        </div>

        {/* TOTAL FLEET */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl transition-transform hover:-translate-y-2">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
            <Car size={24} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Inventory</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {stats.totalCars} <span className="text-lg text-slate-300 font-medium">Units</span>
          </h3>
          <p className="mt-6 text-slate-400 text-xs font-medium">Live fleet variants in stock.</p>
        </div>

        {/* GROSS SALES */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl transition-transform hover:-translate-y-2">
          <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
            <Layers size={24} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Gross Sales</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {stats.totalSales} <span className="text-lg text-slate-300 font-medium">Orders</span>
          </h3>
          <p className="mt-6 text-slate-400 text-xs font-medium">Total volume processed to date.</p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* REVENUE TRENDS - Area Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-orange-600" />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Revenue Trends</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} 
                />
                <Area type="monotone" dataKey="amount" stroke="#f97316" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SALES BY MODEL - Bar Chart */}
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT RECORDS LEDGER */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-3 rounded-xl text-white">
                <History size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Inventory Ledger</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Latest Fleet Updates</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto px-4 pb-10">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-6 pb-2">Model</th>
                  <th className="px-6 pb-2 text-center">Stock</th>
                  <th className="px-6 pb-2 text-right">MSRP</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentCars.map((car) => (
                  <tr key={car._id} className="group bg-slate-50 hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-5 rounded-l-3xl border-y border-l border-transparent group-hover:border-orange-100">
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{car.modelName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{car.variant}</p>
                    </td>
                    <td className="px-6 py-5 text-center border-y border-transparent group-hover:border-orange-100">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${
                        car.stock < 5 ? "bg-red-100 text-red-600" : "bg-white text-slate-600 shadow-sm"
                      }`}>
                        {car.stock} Qty
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right rounded-r-3xl border-y border-r border-transparent group-hover:border-orange-100">
                      <p className="text-sm font-black text-slate-900">
                        ₹{(car.exShowroomPrice || 0).toLocaleString("en-IN")}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CRITICAL ALERTS */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-red-100 p-3 rounded-xl text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Critical Stock</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Management Action Required</p>
            </div>
          </div>
          <div className="space-y-4">
            {stats.lowStock?.map((car) => (
              <div key={car._id} className="p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-red-200 hover:bg-red-50 transition-all flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase">{car.modelName}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{car.variant}</p>
                </div>
                <div className="text-right text-red-600 font-black">
                  <span className="text-xl">{car.stock}</span>
                  <p className="text-[8px] uppercase tracking-widest text-slate-400">Left</p>
                </div>
              </div>
            ))}
            {stats.lowStock?.length === 0 && (
               <div className="py-10 text-center flex flex-col items-center gap-4">
                  <div className="h-12 w-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic text-center">All inventory levels healthy.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}