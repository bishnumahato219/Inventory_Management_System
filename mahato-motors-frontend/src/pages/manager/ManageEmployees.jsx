import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { UserPlus, Mail, Phone, ShieldCheck, UserCircle, X, Loader2 } from "lucide-react";

const ManageEmployees = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "",
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users"); 
      const staff = res.data.filter(u => u.role === "employee" || u.role === "manager");
      setUsers(staff);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/create-employee", formData); 
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", phone: "" });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create employee");
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Syncing Staff Records...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-0 space-y-8">
      {/* HEADER: Stack on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Staff <span className="text-orange-600">Operations</span>
          </h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Manage dealership access and personnel roles.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95"
        >
          <UserPlus size={18} /> Add New Employee
        </button>
      </div>

      {/* DESKTOP TABLE VIEW - Hidden on Mobile */}
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-6">Personnel Info</th>
              <th className="p-6">Contact Channels</th>
              <th className="p-6">Access Level</th>
              <th className="p-6 text-center">Registration Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/80 transition-all group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                      <UserCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">UID: {user._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Mail size={14} className="text-slate-300" /> {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Phone size={14} className="text-slate-300" /> {user.phone}
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.role === "manager" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                  }`}>
                    <ShieldCheck size={12} /> {user.role}
                  </span>
                </td>
                <td className="p-6 text-sm text-center font-bold text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW - Visible on small screens */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((user) => (
          <div key={user._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="bg-slate-100 p-3 rounded-2xl text-slate-400"><UserCircle size={24}/></div>
                <div>
                  <h4 className="font-black text-slate-800 uppercase text-sm">{user.name}</h4>
                  <p className="text-[9px] text-slate-400 font-bold tracking-widest">UID: {user._id.slice(-6)}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                user.role === "manager" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
              }`}>
                {user.role}
              </span>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold"><Mail size={14} /> {user.email}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold"><Phone size={14} /> {user.phone}</div>
            </div>
          </div>
        ))}
      </div>

      {/* RESPONSIVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] rounded-t-[2.5rem] sm:rounded-[3rem] p-8 md:p-10 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-orange-600 transition-colors">
              <X size={24} />
            </button>

            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">New Access</h2>
            <p className="text-slate-500 text-sm font-medium mb-8">Provision staff credentials.</p>

            <form onSubmit={handleCreateEmployee} className="space-y-4 pb-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Identity</label>
                <input required type="text" placeholder="e.g. Rahul Sharma" className="w-full bg-slate-50 p-4 rounded-2xl text-sm"
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Corporate Email</label>
                <input required type="email" placeholder="name@mahatomotors.com" className="w-full bg-slate-50 p-4 rounded-2xl text-sm"
                  onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone</label>
                  <input required type="number" className="w-full bg-slate-50 p-4 rounded-2xl text-sm"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secret Code</label>
                  <input required type="password" placeholder="••••••" className="w-full bg-slate-50 p-4 rounded-2xl text-sm"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-orange-600 transition-all mt-4">
                Create Identity
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;