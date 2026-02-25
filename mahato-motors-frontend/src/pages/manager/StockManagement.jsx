import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { Package, ArrowDownLeft, ArrowUpRight, History, Car, Save, Info } from "lucide-react";

const StockManagement = () => {
  const [logs, setLogs] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ carId: "", quantity: 1, reason: "", action: "IN" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetching independently to ensure one failure doesn't block the other
      const carsRes = await API.get("/cars");
      setCars(carsRes.data);

      const logsRes = await API.get("/stock/history");
      setLogs(logsRes.data);
    } catch (err) {
      console.error("Inventory sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockAction = async (e) => {
    e.preventDefault();
    const endpoint = formData.action === "IN" ? "/stock/in" : "/stock/out";
    try {
      await API.post(endpoint, {
        carId: formData.carId,
        quantity: parseInt(formData.quantity),
        reason: formData.reason
      });
      setFormData({ carId: "", quantity: 1, reason: "", action: "IN" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Protocol Error: Transaction Failed");
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center font-black text-slate-400 uppercase tracking-widest text-xs animate-pulse">
      Scanning Asset Registry...
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Inventory <span className="text-orange-600">Terminal</span>
        </h2>
        <p className="text-slate-500 font-medium mt-1">Manual stock reconciliation and asset tracking.</p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
        <form onSubmit={handleStockAction} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Target Asset</label>
            <div className="relative">
              <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <select 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700 appearance-none"
                value={formData.carId}
                onChange={(e) => setFormData({...formData, carId: e.target.value})}
              >
                <option value="">Select Model</option>
                {cars.map(c => (
                  <option key={c._id} value={c._id}>{c.modelName} (Stock: {c.stock})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Flow</label>
              <select 
                className="w-full p-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.action}
                onChange={(e) => setFormData({...formData, action: e.target.value})}
              >
                <option value="IN">Stock In</option>
                <option value="OUT">Stock Out</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Units</label>
              <input 
                type="number" min="1" required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Reason</label>
            <input 
              type="text" placeholder="e.g. Purchase"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all">
            Execute Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockManagement;