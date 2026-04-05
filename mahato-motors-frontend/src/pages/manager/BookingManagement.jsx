import { useEffect, useState } from "react";
import { CheckCircle, Clock, Truck, Search, Filter, Loader2, User, Car } from "lucide-react";
import API from "../../api/axios";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try { await API.get("/analytics"); } catch (err) { /* Silent fail */ }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/bookings");
      setBookings(data);
    } catch (err) {
      console.error("Booking fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      fetchBookings(); 
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const getStatusStyle = (status) => {
    const base = "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ";
    switch (status) {
      case "approved": return base + "bg-blue-50 text-blue-600 border-blue-100";
      case "delivered": return base + "bg-green-50 text-green-600 border-green-100";
      default: return base + "bg-orange-50 text-orange-600 border-orange-100";
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.car?.modelName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Booking <span className="text-orange-600">Queue</span>
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-2">Manage customer reservations and logistics.</p>
        </div>
        
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by customer or model..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* DESKTOP TABLE VIEW - Hidden on Mobile */}
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-6">Customer Details</th>
              <th className="p-6">Vehicle Choice</th>
              <th className="p-6">Current Status</th>
              <th className="p-6 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="4" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" size={32} /></td></tr>
            ) : filteredBookings.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/80 transition-all group">
                <td className="p-6">
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{b.customer?.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Ref: {b._id.slice(-6)}</p>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">{b.car?.modelName}</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-black uppercase">
                      {b.car?.fuelType || 'Petrol'}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <span className={getStatusStyle(b.status)}>
                    {b.status === "pending" && <Clock size={12} />}
                    {b.status === "approved" && <CheckCircle size={12} />}
                    {b.status === "delivered" && <Truck size={12} />}
                    {b.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                   <ActionButtons b={b} updateStatus={updateStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW - Visible on small screens */}
      <div className="md:hidden space-y-4">
        {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" size={32} /></div>
        ) : filteredBookings.map((b) => (
          <div key={b._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-400"><User size={20} /></div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">{b.customer?.name}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: {b._id.slice(-6)}</p>
                </div>
              </div>
              <span className={getStatusStyle(b.status)}>
                {b.status}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <Car size={16} className="text-orange-500" />
                  <span className="text-xs font-bold text-slate-700 uppercase">{b.car?.modelName}</span>
               </div>
               <span className="text-[9px] font-black text-slate-400 uppercase">{b.car?.fuelType || 'Petrol'}</span>
            </div>

            <div className="pt-2">
               <ActionButtons b={b} updateStatus={updateStatus} isMobile={true} />
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && filteredBookings.length === 0 && (
        <div className="p-20 text-center flex flex-col items-center gap-4 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
           <Filter className="text-slate-200" size={48} />
           <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No matching results.</p>
        </div>
      )}
    </div>
  );
}

// Internal component for cleaner action logic
function ActionButtons({ b, updateStatus, isMobile = false }) {
    const btnClass = isMobile 
        ? "w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
        : "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95";

    if (b.status === "pending") return (
        <button onClick={() => updateStatus(b._id, "approved")} className={`${btnClass} bg-slate-900 text-white hover:bg-blue-600`}>
          Approve Order
        </button>
    );
    if (b.status === "approved") return (
        <button onClick={() => updateStatus(b._id, "delivered")} className={`${btnClass} bg-orange-600 text-white hover:bg-green-600`}>
          Dispatch Vehicle
        </button>
    );
    return <span className="text-[10px] font-bold text-slate-400 italic">Closed Record</span>;
}