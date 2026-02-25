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
        // This request will now work once the backend allows "admin"
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
    <div className="flex h-64 items-center justify-center font-black text-slate-300 uppercase tracking-widest text-xs animate-pulse">
      Initialising Audit Sequence...
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          System <span className="text-orange-600">Audit</span>
        </h1>
        {error && (
          <div className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl border border-red-100 flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
            <ShieldAlert size={18} /> {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ReportTile label="Total Revenue" value={`₹${data?.totalValue?.toLocaleString() || "0"}`} icon={<IndianRupee className="text-green-500" />} />
        <ReportTile label="Inventory Volume" value={data?.totalCars || "0"} icon={<Car className="text-blue-500" />} />
        <ReportTile label="Stock Deficit" value={data?.outOfStock || "0"} icon={<ShieldAlert className="text-red-500" />} />
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-2">
          <TrendingUp size={18} className="text-orange-600" /> Stock Procurement Trends
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.recentCars || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="modelName" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <Tooltip />
              <Area type="monotone" dataKey="stock" stroke="#f97316" fill="#fff7ed" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ReportTile({ label, value, icon }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex items-center gap-6">
      <div className="bg-slate-50 p-4 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
}