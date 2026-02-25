import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  X, 
  RefreshCcw, 
  MoreVertical 
} from "lucide-react";

const ManageSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error("Database Retrieval Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/suppliers", formData);
      setIsModalOpen(false);
      setFormData({ name: "", contactPerson: "", phone: "", email: "", address: "" });
      fetchSuppliers();
    } catch (err) {
      alert(err.response?.data?.error || "Protocol failure: Unable to register supplier.");
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center font-black text-slate-400 uppercase tracking-widest text-xs animate-pulse">
      Syncing Supplier Intelligence...
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Supplier <span className="text-orange-600">Network</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage institutional procurement and vendor relationships.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchSuppliers}
            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-orange-600 rounded-2xl transition-all shadow-sm"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus size={16} /> Register Vendor
          </button>
        </div>
      </div>

      {/* TABLE LEDGER */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="p-8">Identification</th>
                <th className="p-8">Liaison</th>
                <th className="p-8">Contact Channel</th>
                <th className="p-8">Facility Location</th>
                <th className="p-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {suppliers.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-xl border border-slate-100 text-slate-400 group-hover:text-orange-600 transition-colors shadow-sm">
                        <Building2 size={20} />
                      </div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{s.name}</p>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2 text-slate-600">
                      <User size={14} className="text-slate-300" />
                      <span className="text-xs font-bold">{s.contactPerson || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Phone size={12} className="text-slate-300" /> {s.phone || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                        <Mail size={12} className="text-slate-300" /> {s.email || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 max-w-[200px] truncate">
                      <MapPin size={14} className="text-slate-300" /> {s.address || "N/A"}
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-20 text-center font-bold text-slate-300 uppercase tracking-widest text-xs">
                    No vendor records detected in registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-xl shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8">
              Vendor <span className="text-orange-600">Registration</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Company Identification</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Mahato Parts Corp"
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm transition-all"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Primary Liaison</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Contact Number</label>
                <input
                  type="text"
                  placeholder="+91"
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Electronic Mail</label>
                <input
                  type="email"
                  placeholder="vendor@example.com"
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Facility Address</label>
                <textarea
                  rows="2"
                  placeholder="Full operational address..."
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm resize-none"
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                ></textarea>
              </div>
              <div className="col-span-2 pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-600/20 hover:bg-orange-500 transition-all active:scale-95"
                >
                  Save Institutional Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSupplier;