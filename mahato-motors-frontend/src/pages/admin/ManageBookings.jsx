import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

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

        alert(`Booking updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating status. Check backend console.");
    }
  };

  const getStatusBadge = (status) => {
    const base =
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ";
    switch (status) {
      case "delivered":
        return base + "bg-green-100 text-green-700";
      case "pending":
        return base + "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return base + "bg-blue-100 text-blue-700";
      case "cancelled":
        return base + "bg-red-100 text-red-700";
      default:
        return base + "bg-gray-100 text-gray-700";
    }
  };

  if (loading)
    return <div className="p-10 text-center">Fetching records...</div>;

  return (
    <div className="p-2">
      <h2 className="text-2xl font-extrabold text-slate-800 mb-8">
        Vehicle Bookings
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead className="text-xs font-bold text-slate-400 uppercase">
            <tr>
              <th className="px-4 pb-4">Customer</th>
              <th className="px-4 pb-4">Vehicle Model</th>
              <th className="px-4 pb-4">Advance</th>
              <th className="px-4 pb-4 text-center">Status</th>
              <th className="px-4 pb-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="bg-white shadow-sm rounded-lg overflow-hidden transition hover:shadow-md"
              >
                <td className="p-4 border-y border-l rounded-l-xl">
                  <p className="font-bold text-slate-800">
                    {booking.customer?.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {booking.customer?.phone}
                  </p>
                </td>

                <td className="p-4 border-y text-sm text-slate-600">
                  {booking.car?.modelName || "N/A"}
                </td>

                <td className="p-4 border-y font-bold text-slate-800">
                  ₹{booking.advanceAmount?.toLocaleString("en-IN")}
                </td>

                <td className="p-4 border-y text-center">
                  <span className={getStatusBadge(booking.status)}>
                    {booking.status}
                  </span>
                </td>

                <td className="p-4 border-y border-r rounded-r-xl text-center space-y-2">
                  
                  {/* STATUS DROPDOWN */}
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking._id, e.target.value)
                    }
                    className="text-xs border border-slate-200 rounded-md p-2 bg-slate-50 hover:border-orange-500 outline-none transition cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* INVOICE BUTTON (ONLY IF DELIVERED) */}
                  {booking.status === "delivered" && (
                    <div>
                      <Link
                        to={`/invoice/${booking._id}`}
                        className="block mt-2 text-green-600 font-semibold hover:underline text-xs"
                      >
                        View Invoice
                      </Link>
                    </div>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;