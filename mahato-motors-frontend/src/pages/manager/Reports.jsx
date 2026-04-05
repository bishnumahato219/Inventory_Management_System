import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldAlert, TrendingUp, Car, IndianRupee } from "lucide-react";

export default function ADReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await API.get("/reports/dashboard"); 
        setData(res.data);
      } catch (err) {
        setError(err.response?.status === 403 
          ? "Administrative Access Denied: Verify Role Permissions." 
          : "Network Error: Unable to fetch audit data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center font-black text-slate-300 uppercase tracking-widest text-[10px] md:text-xs animate-pulse">
      Initialising Audit Sequence...
    </div>
  );

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER: Flex-col on mobile to handle potential long error messages */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
          System <span className="text-orange-600">Audit</span>
        </h1>
        {error && (
          <div className="w-full md:w-auto bg-red-50 text-red-600 px-4 md:px-6 py-3 rounded-2xl border border-red-100 flex items-center gap-3 font-bold text-[9px] md:text-xs uppercase tracking-widest">
            <ShieldAlert size={16} className="shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* KPI TILES: Grid 1 col on mobile, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        <ReportTile 
          label="Total Revenue" 
          value={`₹${data?.totalValue?.toLocaleString() || "0"}`} 
          icon={<IndianRupee size={20} className="text-green-500" />} 
        />
        <ReportTile 
          label="Inventory Volume" 
          value={data?.totalCars || "0"} 
          icon={<Car size={20} className="text-blue-500" />} 
        />
        {/* Full width on small tablets for the third card */}
        <div className="sm:col-span-2 md:col-span-1">
          <ReportTile 
            label="Stock Deficit" 
            value={data?.outOfStock || "0"} 
            icon={<ShieldAlert size={20} className="text-red-500" />} 
          />
        </div>
      </div>

      {/* CHART SECTION: Adjusted padding and height for mobile */}
      <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30">
        <h3 className="text-[10px] md:text-sm font-black text-slate-900 uppercase tracking-widest mb-6 md:mb-10 flex items-center gap-2">
          <TrendingUp size={18} className="text-orange-600" /> Stock Procurement Trends
        </h3>
        <div className="h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.recentCars || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="modelName" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 9, fontWeight: 'bold'}} 
              />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="stock" 
                stroke="#f97316" 
                fill="#fff7ed" 
                strokeWidth={3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Refactored ReportTile with responsive text and padding
function ReportTile({ label, value, icon }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex items-center gap-4 md:gap-6">
      <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">
          {label}
        </p>
        <p className="text-xl md:text-2xl font-black text-slate-900 leading-none truncate">
          {value}
        </p>
      </div>
    </div>
  );
}