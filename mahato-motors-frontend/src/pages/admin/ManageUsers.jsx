import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  Users, UserMinus, RefreshCw, Shield, 
  Briefcase, User as UserIcon, PlusCircle, X, Mail, Phone 
} from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", role: "employee",
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data);
      setError("");
    } catch (err) {
      setError("Administrative access required.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      let endpoint = formData.role === "manager" ? "/users/create-manager" : "/users/create-employee";
      const res = await API.post(endpoint, formData);
      setUsers([...users, res.data.user]);
      setShowForm(false);
      setFormData({ name: "", email: "", password: "", phone: "", role: "employee" });
    } catch (err) {
      alert(err.response?.data?.message || "User creation failed.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Revoke access for this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Deletion failed.");
    }
  };

  const getRoleBadge = (role) => {
    const base = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase border ";
    switch (role) {
      case "admin": return { style: base + "bg-purple-50 text-purple-600 border-purple-100", icon: <Shield size={12} /> };
      case "manager": return { style: base + "bg-blue-50 text-blue-600 border-blue-100", icon: <Briefcase size={12} /> };
      default: return { style: base + "bg-green-50 text-green-600 border-green-100", icon: <UserIcon size={12} /> };
    }
  };

  return (
    <div className="p-4 md:p-0 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Staff <span className="text-orange-600">Permissions</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Manage access control</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-orange-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase transition-all shadow-lg shadow-orange-600/20"
          >
            {showForm ? <X size={16} /> : <PlusCircle size={16} />}
            {showForm ? "Cancel" : "Add Staff"}
          </button>
          <button onClick={fetchUsers} className="bg-slate-900 text-white p-3 rounded-2xl">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* FORM SECTION - Responsive Grid */}
      {showForm && (
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Contact Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Assigned Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm appearance-none">
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Access Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm" />
            </div>
            <button type="submit" className="md:col-span-2 bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-2">
              Finalize Staff Credentials
            </button>
          </form>
        </div>
      )}

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
            <tr>
              <th className="p-6">Member</th>
              <th className="p-6">Contact Info</th>
              <th className="p-6">Access Level</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const badge = getRoleBadge(u.role);
              return (
                <tr key={u._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-black text-slate-800 uppercase text-sm">{u.name}</td>
                  <td className="p-6 text-xs text-slate-500 font-medium">{u.email}</td>
                  <td className="p-6"><span className={badge.style}>{badge.icon}{u.role}</span></td>
                  <td className="p-6 text-right">
                    <button onClick={() => deleteUser(u._id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                      <UserMinus size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((u) => {
          const badge = getRoleBadge(u.role);
          return (
            <div key={u._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="bg-slate-100 p-3 rounded-2xl text-slate-600"><UserIcon size={20}/></div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-sm">{u.name}</h4>
                    <span className={badge.style + " mt-1"}>{badge.icon}{u.role}</span>
                  </div>
                </div>
                <button onClick={() => deleteUser(u._id)} className="p-3 bg-red-50 text-red-500 rounded-xl">
                  <UserMinus size={18} />
                </button>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2 text-xs text-slate-500"><Mail size={14} /> {u.email}</div>
                <div className="flex items-center gap-2 text-xs text-slate-500"><Phone size={14} /> {u.phone || "No phone registered"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}