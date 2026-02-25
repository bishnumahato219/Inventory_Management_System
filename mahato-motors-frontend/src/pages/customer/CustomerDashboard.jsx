import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { User, Mail, Phone, Calendar, Clock, CheckCircle } from "lucide-react";

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
      // Match 'customer' field from backend controller
      const filtered = res.data.filter(b => (b.customer?._id || b.customer) === meRes.data._id);
      setBookings(filtered);
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Syncing Hub...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Customer <span className="text-orange-600">Hub</span></h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-xl relative overflow-hidden group">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Identity Profile</h2>
          <div className="space-y-4 relative z-10">
            <ProfileRow icon={<User size={18}/>} label="Name" value={customer?.name} />
            <ProfileRow icon={<Mail size={18}/>} label="Email" value={customer?.email} />
            <ProfileRow icon={<Phone size={18}/>} label="Phone" value={customer?.phone || "9939274587"} />
          </div>
          <User className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform" size={120} />
        </div>
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
          <StatBox icon={<Clock className="text-orange-500"/>} title="Total Reservations" value={bookings.length} desc="Active and past bookings." />
          <StatBox icon={<CheckCircle className="text-green-500"/>} title="Fleet Deliveries" value={bookings.filter(b => b.status === "delivered").length} desc="Successfully dispatched." />
        </div>
      </div>
    </div>
  );
}

const ProfileRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="bg-slate-50 p-3 rounded-xl text-slate-400">{icon}</div>
    <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p><p className="text-sm font-black text-slate-800">{value}</p></div>
  </div>
);

const StatBox = ({ icon, title, value, desc }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border shadow-xl flex justify-between items-start group hover:-translate-y-1 transition-all">
    <div><h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h2><p className="text-4xl font-black text-slate-900 mb-2">{value}</p><p className="text-[10px] text-slate-400 font-bold">{desc}</p></div>
    <div className="bg-slate-50 p-4 rounded-2xl">{icon}</div>
  </div>
);