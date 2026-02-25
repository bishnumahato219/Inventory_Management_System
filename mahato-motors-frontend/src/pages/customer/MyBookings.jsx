import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Car, IndianRupee, Calendar, Clock, CheckCircle, Truck } from "lucide-react";

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

      // FIX: Check b.customer to match Backend Controller
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
        My <span className="text-orange-600">Reservations</span>
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        {bookings.map(b => (
          <div key={b._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl group">
            <div className="flex justify-between items-center mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                <Car size={24}/>
              </div>
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100">
                {b.status}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{b.car?.modelName || "Model Info Pending"}</h2>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <IndianRupee size={10}/> Advance Paid
                </p>
                <p className="text-sm font-black text-slate-800">₹{b.advanceAmount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Calendar size={10}/> Order Date
                </p>
                <p className="text-sm font-black text-slate-800">{new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
            No active reservations found.
          </div>
        )}
      </div>
    </div>
  );
}