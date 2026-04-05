import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { Package, ArrowDownLeft, ArrowUpRight, History, Car, Save, Info, ChevronDown } from "lucide-react";

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
      alert("Transaction Synchronized.");
    } catch (err) {
      alert(err.response?.data?.message || "Protocol Error: Transaction Failed");
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center font-black text-slate-400 uppercase tracking-widest text-[10px] md:text-xs animate-pulse">
      Scanning Asset Registry...
    </div>
  );

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-10 animate-in fade-in duration-500">
      
      {/* 1. HEADER SECTION */}
      <div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Inventory <span className="text-orange-600">Terminal</span>
        </h2>
        <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Manual stock reconciliation and asset tracking.</p>
      </div>

      {/* 2. TRANSACTION FORM - Grid logic: 1 col (mobile) -> 2 cols (tablet) -> 4 cols (desktop) */}
      <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
        <form onSubmit={handleStockAction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end relative z-10">
          
          {/* Target Asset Selection */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Target Asset</label>
            <div className="relative">
              <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <select 
                required
                className="w-full pl-11 pr-10 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700 text-sm appearance-none cursor-pointer transition-all"
                value={formData.carId}
                onChange={(e) => setFormData({...formData, carId: e.target.value})}
              >
                <option value="">Select Model</option>
                {cars.map(c => (
                  <option key={c._id} value={c._id}>{c.modelName} (Qty: {c.stock})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Flow & Units - Grouped on mobile/tablet */}
          <div className="grid grid-cols-2 gap-4 sm:col-span-2 lg:col-span-1">
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Flow</label>
              <select 
                className="w-full p-3.5 md:p-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                value={formData.action}
                onChange={(e) => setFormData({...formData, action: e.target.value})}
              >
                <option value="IN">Stock In</option>
                <option value="OUT">Stock Out</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Units</label>
              <input 
                type="number" min="1" required
                className="w-full p-3.5 md:p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Reason / Memo</label>
            <input 
              type="text" placeholder="e.g. Purchase, Sale"
              className="w-full p-3.5 md:p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full sm:col-span-2 lg:col-span-1 bg-slate-900 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl transition-all active:scale-95"
          >
            Execute Transaction
          </button>
        </form>
      </div>

      {/* 3. RECENT ACTIVITY PREVIEW (Optional Placeholder) */}
      <div className="bg-slate-900/5 p-6 rounded-[2rem] border border-dashed border-slate-200">
        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
          Transaction history can be viewed in the <span className="text-slate-600 underline">Reports Module</span>
        </p>
      </div>
    </div>
  );
};

export default StockManagement;