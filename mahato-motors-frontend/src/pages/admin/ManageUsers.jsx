import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Users, UserMinus, RefreshCw, Shield, Briefcase, User } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data);
      setError("");
    } catch (err) {
      setError("Administrative access required. Please verify your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Executing permanent deletion protocol for this user. Proceed?")) {
      try {
        await API.delete(`/users/${id}`);
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        alert("Deletion protocol failed. Integrity check required.");
      }
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { 
          style: "bg-purple-50 text-purple-600 border-purple-100", 
          icon: <Shield size={12} /> 
        };
      case 'manager':
        return { 
          style: "bg-blue-50 text-blue-600 border-blue-100", 
          icon: <Briefcase size={12} /> 
        };
      default:
        return { 
          style: "bg-green-50 text-green-600 border-green-100", 
          icon: <User size={12} /> 
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Staff <span className="text-orange-600">Permissions</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage institutional access and user identity protocols.</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Sync Database
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3">
          <Shield size={18} /> {error}
        </div>
      )}

      {/* USER LEDGER */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
          <Users className="text-slate-400" size={20} />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Authorized Personnel Registry</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <tr>
                <th className="p-8">Identification</th>
                <th className="p-8">Communication</th>
                <th className="p-8">Access Level</th>
                <th className="p-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <div className="font-black text-slate-300 uppercase tracking-widest text-xs animate-pulse">Scanning User Records...</div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center font-bold text-slate-400 italic">No records detected in registry.</td>
                </tr>
              ) : (
                users.map((u) => {
                  const badge = getRoleBadge(u.role);
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="p-8">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">UID: {u._id.slice(-6)}</p>
                      </td>
                      <td className="p-8">
                        <p className="text-xs font-bold text-slate-500">{u.email}</p>
                      </td>
                      <td className="p-8">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${badge.style}`}>
                          {badge.icon} {u.role}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => deleteUser(u._id)}
                          className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Revoke Access"
                        >
                          <UserMinus size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}