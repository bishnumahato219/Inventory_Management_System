import { useEffect, useState } from "react";
import { CheckCircle, Clock, Truck, Search, Filter } from "lucide-react";
import API from "../../api/axios";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
    
    // Polling analytics every 10 seconds as per your requirement
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      await API.get("/analytics");
    } catch (err) {
      // Background sync silent failure
    }
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
      // Refresh local data to show updated state
      fetchBookings(); 
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved": return "bg-blue-50 text-blue-600 border-blue-100";
      case "delivered": return "bg-green-50 text-green-600 border-green-100";
      default: return "bg-orange-50 text-orange-600 border-orange-100";
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.car?.modelName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Booking <span className="text-orange-600">Queue</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage customer reservations and delivery states.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
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
              <tr><td colSpan="4" className="p-20 text-center text-slate-400 font-bold uppercase animate-pulse">Syncing reservations...</td></tr>
            ) : filteredBookings.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/80 transition-all group">
                <td className="p-6">
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{b.customer?.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">ID: {b._id.slice(-6)}</p>
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
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(b.status)}`}>
                    {b.status === "pending" && <Clock size={12} />}
                    {b.status === "approved" && <CheckCircle size={12} />}
                    {b.status === "delivered" && <Truck size={12} />}
                    {b.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  {b.status === "pending" && (
                    <button
                      onClick={() => updateStatus(b._id, "approved")}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                      Approve Order
                    </button>
                  )}

                  {b.status === "approved" && (
                    <button
                      onClick={() => updateStatus(b._id, "delivered")}
                      className="bg-orange-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-orange-200/20"
                    >
                      Dispatch Vehicle
                    </button>
                  )}
                  
                  {b.status === "delivered" && (
                    <span className="text-xs font-bold text-slate-400 italic">No further actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!loading && filteredBookings.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center gap-4">
             <Filter className="text-slate-200" size={48} />
             <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No matching bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}