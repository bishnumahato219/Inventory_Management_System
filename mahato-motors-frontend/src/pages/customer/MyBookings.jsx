import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Car, IndianRupee, Calendar, Clock, Loader2 } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const meRes = await API.get("/auth/me");
      const res = await API.get("/bookings");

      const myData = res.data.filter(b => {
        const bookingCustomerId = b.customer?._id || b.customer; 
        return bookingCustomerId === meRes.data._id;
      });

      setBookings(myData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retrieving Records...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
          My <span className="text-orange-600">Reservations</span>
        </h1>
        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
          Tracking your dealership acquisitions
        </p>
      </div>

      {/* GRID: 1 column on mobile, 2 columns on tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {bookings.map(b => (
          <div key={b._id} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl group hover:border-orange-100 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <Car size={24}/>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                b.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
              }`}>
                {b.status}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight truncate">
                {b.car?.modelName || "Model Info Pending"}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Ref ID: <span className="font-mono">{b._id.slice(-8).toUpperCase()}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <IndianRupee size={12} className="text-orange-500" /> Advance
                </p>
                <p className="text-sm md:text-base font-black text-slate-800 truncate">
                  ₹{b.advanceAmount?.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Calendar size={12} className="text-orange-500" /> Booked
                </p>
                <p className="text-sm md:text-base font-black text-slate-800 truncate">
                  {new Date(b.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-slate-50 rounded-full mb-4">
              <Clock size={40} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
              No active reservations found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}