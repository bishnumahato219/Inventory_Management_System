import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { Plus, Package, Truck, Loader2, X, AlertTriangle } from "lucide-react";

const StockProcurement = () => {
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({ car: "", supplier: "", quantity: 1 });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Parallel fetch for speed
        const [orderRes, carRes, suppRes] = await Promise.all([
          API.get("/purchases"),
          API.get("/cars"),
          API.get("/suppliers")
        ]);
        setOrders(orderRes.data);
        setCars(carRes.data);
        setSuppliers(suppRes.data);
      } catch (err) {
        setError("SYSTEM SYNC FAILED. ENSURE YOU ARE LOGGED IN AS MANAGER.");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await API.post("/purchases", formData);
      setOrders([res.data, ...orders]);
      setIsModalOpen(false);
      setFormData({ car: "", supplier: "", quantity: 1 });
    } catch (err) {
      alert(err.response?.data?.message || "Check permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-10 min-h-screen bg-slate-50/50">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Stock <span className="text-orange-600">Procurement</span></h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl">
          <Plus size={18} /> New Purchase Order
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-2xl">{error}</div>}

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <th className="p-8">Details</th>
              <th className="p-8">Asset</th>
              <th className="p-8">Partner</th>
              <th className="p-8">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan="4" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" /></td></tr> : 
              orders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50/80">
                  <td className="p-8 font-black">#{o._id.slice(-6)}</td>
                  <td className="p-8">
                    <p className="text-sm font-black uppercase">{o.car?.modelName}</p>
                    <p className="text-[9px] font-bold text-slate-400">{o.car?.variant}</p>
                  </td>
                  <td className="p-8 text-sm font-bold uppercase text-orange-600">{o.supplier?.name}</td>
                  <td className="p-8"><span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase">{o.status}</span></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black uppercase">Initiate <span className="text-orange-600">Order</span></h3>
               <X className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </div>
            <form onSubmit={handleCreateOrder} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Vehicle Asset</label>
                <select required className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold outline-none" onChange={(e) => setFormData({...formData, car: e.target.value})}>
                  <option value="">Select Asset</option>
                  {cars.map(c => <option key={c._id} value={c._id}>{c.modelName}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Supplier Partner</label>
                <select required className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold outline-none" onChange={(e) => setFormData({...formData, supplier: e.target.value})}>
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Quantity</label>
                <input type="number" required min="1" className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold outline-none" onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase hover:bg-orange-600 disabled:opacity-50">
                {isSubmitting ? "Processing..." : "Authorize Purchase"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockProcurement;