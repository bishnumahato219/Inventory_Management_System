import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  Car, AlertTriangle, TrendingUp, History, 
  IndianRupee, ShieldCheck, ArrowUpRight, 
  Layers, Activity, ChevronRight 
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    totalCars: 0, 
    outOfStock: 0, 
    totalValue: 0, 
    recentCars: [],
    totalSales: 0,
    lowStock: [],
    monthlyRevenue: [] 
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
    <div className="p-4 space-y-8 bg-slate-50 min-h-screen">
      
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
        
        {/* TOTAL VALUE CARD (Manager Style - Dark) */}
        <div className="relative overflow-hidden group bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl transition-transform hover:-translate-y-2">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <IndianRupee size={24} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Portfolio Valuation</p>
            <h3 className="text-4xl font-black tracking-tight">
              ₹{stats.totalValue?.toLocaleString("en-IN")}
            </h3>
            <div className="mt-6 flex items-center gap-2 text-green-400 text-xs font-bold">
              <Activity size={16} /> Live Market Estimate
            </div>
          </div>
        </div>

        {/* TOTAL FLEET CARD */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 transition-transform hover:-translate-y-2">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
            <Car size={24} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Inventory</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {stats.totalCars} <span className="text-lg text-slate-300 font-medium">Units</span>
          </h3>
          <p className="mt-6 text-slate-400 text-xs font-medium">Across all categories and variants.</p>
        </div>

        {/* TOTAL SALES CARD */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 transition-transform hover:-translate-y-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVENUE PER MONTH - MODERN LIST */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Revenue Trends</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Monthly Performance</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {stats.monthlyRevenue?.map((data, idx) => (
              <div key={idx} className="group flex justify-between items-center p-5 bg-slate-50 rounded-3xl border border-transparent hover:border-orange-200 transition-all">
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{data.month}</p>
                  <div className="flex items-center gap-1 text-[8px] text-green-500 font-black uppercase">
                    <ArrowUpRight size={10} /> Growth
                  </div>
                </div>
                <p className="text-sm font-black text-slate-900">₹{data.amount.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>

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
                      <p className="text-sm font-black text-slate-900">₹{car.exShowroomPrice.toLocaleString("en-IN")}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CRITICAL STOCK ALERTS (Manager Style - Bottom) */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Critical Stock Alerts</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Management Action Required</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.lowStock?.map((car) => (
            <div key={car._id} className="p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-red-200 hover:bg-red-50 transition-all">
              <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{car.modelName}</p>
              <div className="mt-2 flex justify-between items-end">
                <span className="text-2xl font-black text-red-600">{car.stock}</span>
                <span className="text-[8px] text-slate-400 font-black uppercase mb-1">Units Left</span>
              </div>
            </div>
          ))}
          {stats.lowStock?.length === 0 && (
            <div className="col-span-full py-6 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">
               Inventory levels within safety parameters.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}