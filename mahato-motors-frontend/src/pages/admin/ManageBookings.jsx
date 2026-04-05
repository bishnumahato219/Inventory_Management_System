import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { Trash2, FileText, ChevronRight, User, Car as CarIcon } from "lucide-react";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await API.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
      });

      if (response.status === 200) {
        setBookings((prevBookings) =>
          prevBookings.map((b) =>
            b._id === bookingId
              ? {
                  ...b,
                  status: newStatus,
                  invoiceNumber: response.data.booking.invoiceNumber,
                }
              : b
          )
        );
      }
    } catch (err) {
      alert("Error updating status.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      const response = await API.delete(`/bookings/${bookingId}`);
      if (response.status === 200) {
        setBookings((prevBookings) => prevBookings.filter((b) => b._id !== bookingId));
      }
    } catch (err) {
      alert("Error deleting booking.");
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ";
    switch (status) {
      case "delivered": return base + "bg-green-100 text-green-700";
      case "pending": return base + "bg-yellow-100 text-yellow-700";
      case "confirmed": return base + "bg-blue-100 text-blue-700";
      case "cancelled": return base + "bg-red-100 text-red-700";
      default: return base + "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-pulse font-black uppercase tracking-widest text-slate-400">Loading Fleet Records...</div>
    </div>
  );

  return (
    <div className="p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
          Vehicle <span className="text-orange-600">Bookings</span>
        </h2>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 self-start">
          {bookings.length} Total Records
        </div>
      </div>

      {/* DESKTOP TABLE VIEW - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <th className="px-6 pb-2">Customer Details</th>
              <th className="px-6 pb-2">Vehicle</th>
              <th className="px-6 pb-2">Financials</th>
              <th className="px-6 pb-2 text-center">Status</th>
              <th className="px-6 pb-2 text-right">Operations</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="bg-white group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                <td className="px-6 py-5 rounded-l-3xl border-y border-l border-transparent group-hover:border-orange-100">
                  <p className="font-black text-slate-800 uppercase text-sm">{booking.customer?.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{booking.customer?.phone}</p>
                </td>
                <td className="px-6 py-5 border-y border-transparent group-hover:border-orange-100">
                  <p className="text-xs font-bold text-slate-600 uppercase">{booking.car?.modelName || "N/A"}</p>
                </td>
                <td className="px-6 py-5 border-y border-transparent group-hover:border-orange-100">
                  <p className="font-black text-slate-800">₹{booking.advanceAmount?.toLocaleString("en-IN")}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Advance Paid</p>
                </td>
                <td className="px-6 py-5 border-y border-transparent group-hover:border-orange-100 text-center">
                  <span className={getStatusBadge(booking.status)}>{booking.status}</span>
                </td>
                <td className="px-6 py-5 rounded-r-3xl border-y border-r border-transparent group-hover:border-orange-100 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="text-[10px] font-bold uppercase border-none bg-slate-50 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {booking.status === "delivered" ? (
                      <Link to={`/invoice/${booking._id}`} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="View Invoice">
                        <FileText size={18} />
                      </Link>
                    ) : (
                      <button onClick={() => handleDeleteBooking(booking._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW - Hidden on Desktop */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="bg-slate-100 p-2 rounded-xl text-slate-600"><User size={20}/></div>
                <div>
                  <h4 className="font-black text-slate-800 uppercase text-sm">{booking.customer?.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{booking.customer?.phone}</p>
                </div>
              </div>
              <span className={getStatusBadge(booking.status)}>{booking.status}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CarIcon size={16} className="text-orange-500" />
                <span className="text-xs font-bold text-slate-600 uppercase">{booking.car?.modelName}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-800">₹{booking.advanceAmount?.toLocaleString("en-IN")}</p>
                <p className="text-[8px] uppercase font-bold text-slate-400">Advance</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <select
                value={booking.status}
                onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                className="flex-1 text-[10px] font-black uppercase bg-slate-100 rounded-xl px-4 py-3 outline-none"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {booking.status === "delivered" ? (
                <Link to={`/invoice/${booking._id}`} className="bg-green-100 text-green-600 p-3 rounded-xl">
                  <FileText size={20} />
                </Link>
              ) : (
                <button onClick={() => handleDeleteBooking(booking._id)} className="bg-red-100 text-red-500 p-3 rounded-xl">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBookings;