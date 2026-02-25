import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/axios"; // Use your existing axios instance

const Sales = () => {
  const [formData, setFormData] = useState({
    bookingId: "",
    paymentMode: "cash",
    invoiceNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Points to your POST route
      const response = await API.post("/sales", formData);
      alert("Sale recorded and Invoice generated successfully!");
      setFormData({ bookingId: "", paymentMode: "cash", invoiceNumber: "" });
    } catch (err) {
      // Handles the 500 error by showing the specific backend message
      alert(`Error: ${err.response?.data?.message || "Internal Server Error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Product Issue / Sales Entry</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Booking ID</label>
          <input
            required
            type="text"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Enter the unique Booking ID"
            value={formData.bookingId}
            onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Invoice Number</label>
          <input
            required
            type="text"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="e.g., INV-2024-001"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Mode</label>
          <select
            className="w-full p-3 border border-slate-300 rounded-lg bg-white outline-none"
            value={formData.paymentMode}
            onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="finance">Finance</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition shadow-md disabled:bg-slate-400"
        >
          {loading ? "Processing..." : "Generate Invoice & Record Sale"}
        </button>
      </form>
    </div>
  );
};

export default Sales;