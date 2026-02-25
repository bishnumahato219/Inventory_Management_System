import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Car, AlertTriangle, TrendingUp, History, ChevronRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalCars: 0, outOfStock: 0, totalValue: 0, recentCars: [] });
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
    <div className="flex h-64 items-center justify-center font-black text-slate-400 uppercase tracking-widest text-xs">
      Loading Executive Intelligence...
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Executive <span className="text-orange-600">Summary</span>
        </h1>
        <p className="text-slate-500 font-medium mt-1">Real-time dealership performance and asset intelligence.</p>
      </div>
      
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Total Vehicles" 
          value={stats.totalCars} 
          icon={<Car className="text-blue-500" />} 
          border="border-blue-500"
        />
        <StatCard 
          title="Out of Stock" 
          value={stats.outOfStock} 
          icon={<AlertTriangle className="text-red-500" />} 
          border="border-red-500"
        />
        <StatCard 
          title="Inventory Value" 
          value={`₹${stats.totalValue.toLocaleString()}`} 
          icon={<TrendingUp className="text-green-500" />} 
          border="border-green-500"
          valueClass="text-green-600"
        />
      </div>

      {/* RECENT INVENTORY LEDGER */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
          <History className="text-slate-400" size={20} />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Fleet Additions</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <tr>
                <th className="p-8">Model</th>
                <th className="p-8">Variant</th>
                <th className="p-8 text-center">Stock</th>
                <th className="p-8 text-right">Ex-Showroom Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.recentCars.map((car) => (
                <tr key={car._id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="p-8">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{car.modelName}</p>
                  </td>
                  <td className="p-8">
                    <span className="text-xs font-bold text-slate-400 uppercase">{car.variant}</span>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${
                      car.stock < 5 
                        ? "bg-red-50 text-red-600 border-red-100 animate-pulse" 
                        : "bg-slate-50 text-slate-600 border-slate-100"
                    }`}>
                      {car.stock} Units
                    </span>
                  </td>
                  <td className="p-8 text-right font-black text-slate-900">
                    ₹{car.exShowroomPrice.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Component to match the Hub style
function StatCard({ title, value, icon, border, valueClass = "" }) {
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] border-l-8 ${border} shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-white transition-colors">
          {icon}
        </div>
        <ChevronRight className="text-slate-200 group-hover:text-orange-500 transition-colors" size={20} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h2 className={`text-3xl font-black tracking-tighter ${valueClass}`}>{value}</h2>
    </div>
  );
}