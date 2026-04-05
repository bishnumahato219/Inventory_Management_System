import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { User, Mail, Phone, Clock, CheckCircle, ShieldCheck } from "lucide-react";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const meRes = await API.get("/auth/me");
      if (meRes.data.role !== "customer") return navigate("/");
      setCustomer(meRes.data);

      const res = await API.get("/bookings");
      const filtered = res.data.filter(b => (b.customer?._id || b.customer) === meRes.data._id);
      setBookings(filtered);
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Hub...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
          Customer <span className="text-orange-600">Hub</span>
        </h1>
        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
          Welcome to your dealership portal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* IDENTITY PROFILE - Stacked on Mobile, 1/3 width on Desktop */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-6 md:mb-8 relative z-10">
            <ShieldCheck size={16} className="text-orange-500" />
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Profile</h2>
          </div>
          
          <div className="space-y-5 md:space-y-6 relative z-10">
            <ProfileRow icon={<User size={18}/>} label="Full Name" value={customer?.name} />
            <ProfileRow icon={<Mail size={18}/>} label="Email Address" value={customer?.email} />
            <ProfileRow icon={<Phone size={18}/>} label="Contact" value={customer?.phone || "Not Provided"} />
          </div>
          
          <User className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:scale-110 transition-transform hidden sm:block" size={140} />
        </div>

        {/* STATS AREA - 1 col on mobile, 2 col on Desktop */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <StatBox 
            icon={<Clock className="text-orange-500" size={24}/>} 
            title="Total Reservations" 
            value={bookings.length} 
            desc="Active & historical bookings" 
          />
          <StatBox 
            icon={<CheckCircle className="text-green-500" size={24}/>} 
            title="Fleet Deliveries" 
            value={bookings.filter(b => b.status === "delivered").length} 
            desc="Successfully dispatched units" 
          />
        </div>
      </div>

      {/* MOBILE QUICK ACTION */}
      <div className="md:hidden">
        <button 
          onClick={() => navigate("/customer/book-car")}
          className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs flex justify-between items-center shadow-2xl"
        >
          Explore New Fleet
          <div className="bg-orange-600 p-2 rounded-lg"><User size={16}/></div>
        </button>
      </div>
    </div>
  );
}

const ProfileRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:bg-orange-50 transition-colors">{icon}</div>
    <div className="min-w-0">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-black text-slate-800 truncate">{value}</p>
    </div>
  </div>
);

const StatBox = ({ icon, title, value, desc }) => (
  <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl flex justify-between items-center md:items-start group hover:-translate-y-1 transition-all">
    <div className="min-w-0">
      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</h2>
      <p className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{value}</p>
      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight truncate">{desc}</p>
    </div>
    <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-orange-50 transition-colors">
      {icon}
    </div>
  </div>
);