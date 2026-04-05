import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { LayoutDashboard, CheckCircle, Clock, TrendingUp, Loader2 } from "lucide-react";

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
      const meRes = await API.get("/auth/me");
      if (meRes.data.role !== "employee") return navigate("/");
      setEmployee(meRes.data);

      const bookingsRes = await API.get("/bookings");
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-10 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
          Operations <span className="text-orange-600">Dashboard</span>
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">
          Welcome back, <span className="text-slate-900 font-bold">{employee?.name?.split(' ')[0]}</span>. Performance and logistics.
        </p>
      </div>

      {/* STATISTICS GRID: Stacks on mobile, 3 columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <StatCard 
          title="Active Assignments" 
          value={bookings.filter(b => b.status !== "delivered").length} 
          icon={<Clock className="text-orange-500" size={24} />}
          desc="Fulfillment pending."
        />
        <StatCard 
          title="Successful Deliveries" 
          value={bookings.filter(b => b.status === "delivered").length} 
          icon={<CheckCircle className="text-green-500" size={24} />}
          desc="Vehicles dispatched."
        />
        <StatCard 
          title="Total Managed" 
          value={bookings.length} 
          icon={<TrendingUp className="text-blue-500" size={24} />}
          desc="Lifetime volume."
        />
      </div>

      {/* QUICK VIEW TABLE / INFO CARD */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
         <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <LayoutDashboard size={16} className="text-orange-500" /> Recent Assignments
            </h3>
         </div>
         <div className="p-10 text-center">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] leading-relaxed">
              Detailed ledger available in <br className="md:hidden" />
              <span className="text-orange-600">"Manage Bookings"</span> section.
            </p>
         </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, desc }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl group hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-center md:items-start mb-4 md:mb-6">
        <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-orange-50 transition-colors">
          {icon}
        </div>
        <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h2>
      <p className="text-[10px] md:text-xs text-slate-400 font-medium">{desc}</p>
    </div>
  );
}