import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { Package, ArrowDownLeft, ArrowUpRight, History, Car, Save, Info } from "lucide-react";

const StockManagement = () => {
  const [logs, setLogs] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    carId: "",
    quantity: 1,
    reason: "",
    action: "IN" 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsRes, carsRes] = await Promise.all([
        API.get("/stock/history"),
        API.get("/cars")
      ]);
      setLogs(logsRes.data);
      setCars(carsRes.data);
    } catch (err) {
      console.error("Initialization failed:", err);
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
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-pulse font-black text-slate-400 uppercase tracking-widest text-xs">Scanning Inventory Logs...</div>
    </div>
  );

  return (
    <div className="p-4 space-y-10 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Inventory <span className="text-orange-600">Terminal</span>
        </h2>
        <p className="text-slate-500 font-medium mt-1">Manual stock reconciliation and asset tracking.</p>
      </div>

      {/* ADJUSTMENT TERMINAL */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <Package size={120} />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
              <Save size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Rapid Adjustment</h3>
          </div>

          <form onSubmit={handleStockAction} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Target Asset</label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <select 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700 transition-all appearance-none"
                  value={formData.carId}
                  onChange={(e) => setFormData({...formData, carId: e.target.value})}
                >
                  <option value="">Select Model</option>
                  {cars.map(c => <option key={c._id} value={c._id}>{c.modelName} (Stock: {c.stock})</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:col-span-1">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Flow</label>
                <select 
                  className="w-full p-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
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
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Operational Reason</label>
              <div className="relative">
                <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  placeholder="e.g. Damage, Transfer"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95">
              Execute Transaction
            </button>
          </form>
        </div>
      </div>

      {/* HISTORY LEDGER */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="text-slate-400" size={20} />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Inbound/Outbound Ledger</h3>
          </div>
          <span className="text-[10px] bg-white border px-3 py-1 rounded-full font-black text-slate-400 uppercase tracking-widest shadow-sm">
            Total Logs: {logs.length}
          </span>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
            <tr>
              <th className="p-8">Timestamp</th>
              <th className="p-8">Direction</th>
              <th className="p-8">Quantity</th>
              <th className="p-8">Protocol Reason</th>
              <th className="p-8 text-right">Performed By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-slate-50/80 transition-all group">
                <td className="p-8 text-[11px] font-bold text-slate-400">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-8">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    log.action === "IN" 
                      ? "bg-green-50 text-green-600 border-green-100" 
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}>
                    {log.action === "IN" ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                    Stock {log.action}
                  </span>
                </td>
                <td className="p-8 text-lg font-black text-slate-900">{log.quantity}</td>
                <td className="p-8 text-xs font-medium text-slate-500 italic max-w-xs truncate">
                  {log.reason || "Standard Update"}
                </td>
                <td className="p-8 text-right">
                  <div className="inline-block text-right">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{log.performedBy?.name}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{log.performedBy?.role}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement;