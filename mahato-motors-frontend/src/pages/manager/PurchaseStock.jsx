import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { Package, Truck, ShoppingCart, Plus, CheckCircle, X, Search, FileText } from "lucide-react";

const PurchaseStock = () => {
  const [purchases, setPurchases] = useState([]);
  const [cars, setCars] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ supplier: "", car: "", quantity: 1 });
  const [receivingId, setReceivingId] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes, sRes] = await Promise.all([
        API.get("/purchases"),
        API.get("/cars"),
        API.get("/suppliers"),
      ]);
      setPurchases(pRes.data);
      setCars(cRes.data);
      setSuppliers(sRes.data);
    } catch (err) {
      console.error("Inventory sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/purchases", formData);
      setPurchases([res.data, ...purchases]);
      setIsModalOpen(false);
      setFormData({ supplier: "", car: "", quantity: 1 });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create order");
    }
  };

  const handleReceiveStock = async (id) => {
    try {
      if (!invoiceNumber) return alert("Please enter an Invoice Number");
      const res = await API.put(`/purchases/${id}/receive`, { invoiceNumber });
      setPurchases(purchases.map(p => p._id === id ? res.data.purchase : p));
      setReceivingId(null);
      setInvoiceNumber("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to receive goods");
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-pulse font-black text-slate-400 uppercase tracking-widest text-xs">Synchronizing Procurement Data...</div>
    </div>
  );

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Stock <span className="text-orange-600">Procurement</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">Manage purchase orders and inbound vehicle logistics.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95"
        >
          <Plus size={18} /> New Purchase Order
        </button>
      </div>

      {/* PROCUREMENT TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-6">Order Details</th>
              <th className="p-6">Partner & Asset</th>
              <th className="p-6 text-center">Volume</th>
              <th className="p-6 text-center">Lifecycle</th>
              <th className="p-6 text-right">Fulfillment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {purchases.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/80 transition-all group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                      <ShoppingCart size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">PO-{item._id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-sm font-bold text-slate-700">{item.supplier?.name || "Unknown Vendor"}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.car?.modelName || "N/A"}</p>
                </td>
                <td className="p-6 text-center">
                  <span className="text-lg font-black text-slate-900">{item.quantity}</span>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Units</p>
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    item.status === "received" ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  {item.status === "ordered" ? (
                    receivingId === item._id ? (
                      <div className="flex items-center gap-2 justify-end animate-in slide-in-from-right-4 duration-300">
                        <div className="relative">
                           <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                           <input 
                            type="text" 
                            placeholder="Invoice #" 
                            className="bg-slate-100 pl-8 pr-4 py-2 text-xs font-bold rounded-xl w-32 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                          />
                        </div>
                        <button onClick={() => handleReceiveStock(item._id)} className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg"><CheckCircle size={16} /></button>
                        <button onClick={() => setReceivingId(null)} className="p-2 bg-slate-200 text-slate-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X size={16} /></button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setReceivingId(item._id)}
                        className="bg-slate-900 text-white text-[10px] px-5 py-2.5 rounded-2xl hover:bg-orange-600 transition-all font-black uppercase tracking-widest shadow-lg shadow-slate-200"
                      >
                        Log Delivery
                      </button>
                    )
                  ) : (
                    <div className="text-right">
                      <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                        <CheckCircle size={10} /> Fulfilled
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium italic">
                        {new Date(item.receivedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEW ORDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative overflow-hidden">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-orange-600 transition-colors">
                <X size={24} />
             </button>

            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Create Order</h2>
            <p className="text-slate-500 font-medium mb-8">Establish a new vehicle procurement request.</p>
            
            <form onSubmit={handleCreateOrder} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-2">Verified Supplier</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-bold text-slate-700"
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  >
                    <option value="">Select Vendor</option>
                    {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-2">Vehicle Asset</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-bold text-slate-700"
                    onChange={(e) => setFormData({...formData, car: e.target.value})}
                  >
                    <option value="">Select Model</option>
                    {cars.map(c => <option key={c._id} value={c._id}>{c.modelName} ({c.variant})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-2">Inbound Quantity</label>
                  <input 
                    type="number" min="1" required
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-black text-slate-700"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-orange-600 transition-all active:scale-95 mt-4"
              >
                Transmit Purchase Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseStock;