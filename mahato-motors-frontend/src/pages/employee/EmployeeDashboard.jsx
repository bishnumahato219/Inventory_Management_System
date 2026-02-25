import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { LayoutDashboard, CheckCircle, Clock, TrendingUp } from "lucide-react";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Use the API instance to handle headers automatically
      const meRes = await API.get("/auth/me");
      if (meRes.data.role !== "employee") return navigate("/");
      setEmployee(meRes.data);

      const bookingsRes = await API.get("/bookings");
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
      // Optional: Redirect on auth failure
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center font-black text-slate-400 uppercase tracking-widest text-xs animate-pulse">
      Syncing Operational Intelligence...
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Operations <span className="text-orange-600">Dashboard</span>
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Welcome back, {employee?.name}. Performance metrics and logistics tracking.
        </p>
      </div>

      {/* STATISTICS GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        <StatCard 
          title="Active Assignments" 
          value={bookings.filter(b => b.status !== "delivered").length} 
          icon={<Clock className="text-orange-500" />}
          desc="Bookings pending fulfillment."
        />
        <StatCard 
          title="Successful Deliveries" 
          value={bookings.filter(b => b.status === "delivered").length} 
          icon={<CheckCircle className="text-green-500" />}
          desc="Vehicles successfully dispatched."
        />
        <StatCard 
          title="Total Managed" 
          value={bookings.length} 
          icon={<TrendingUp className="text-blue-500" />}
          desc="Lifetime assignment volume."
        />
      </div>

      {/* QUICK VIEW TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden p-2">
         <div className="p-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Assignments</h3>
         </div>
         {/* Placeholder for a simplified assignments table */}
         <div className="px-8 pb-8 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            Detailed ledger available in "Sales Entry" section.
         </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, desc }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-orange-50 transition-colors">
          {icon}
        </div>
        <p className="text-4xl font-black text-slate-900">{value}</p>
      </div>
      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h2>
      <p className="text-xs text-slate-500 font-medium">{desc}</p>
    </div>
  );
}