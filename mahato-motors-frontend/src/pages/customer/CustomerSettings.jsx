import React, { useState } from "react";
import API from "../../api/axios";
import { User, Key, Mail, Fingerprint, Save, ShieldCheck } from "lucide-react";

const CustomerSettings = () => {
  // Defensive parsing to ensure component stability
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    newPassword: "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Updates the user profile using the established PUT route
      await API.put(`/users/profile/${user._id}`, profileData);
      alert("Profile synchronized successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed. Please try again.");
    }
  };

  return (
    <div className="p-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Account <span className="text-orange-600">Preferences</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">Manage your digital identity and security protocols.</p>
        </div>
        <div className="bg-green-50 px-5 py-2.5 rounded-2xl border border-green-100">
          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} /> Account Verified
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FORM SECTION */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Registered Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-bold text-slate-800"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Communication Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="email"
                    disabled
                    className="w-full pl-14 pr-6 py-5 bg-slate-100 border border-slate-100 rounded-[1.5rem] text-slate-400 cursor-not-allowed font-bold"
                    value={profileData.email}
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-6 flex items-center gap-2">
                <Key size={18} className="text-orange-500" /> Authentication Update
              </h3>
              <div className="max-w-md space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">New Password</label>
                <input
                  type="password"
                  placeholder="Leave empty to maintain current"
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-bold text-slate-800"
                  onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-3 w-full md:w-fit bg-slate-900 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] px-12 py-5 rounded-2xl transition-all shadow-xl active:scale-95 shadow-slate-200"
            >
              <Save size={18} /> Save Preferences
            </button>
          </form>
        </div>

        {/* INFO SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Member Tier</p>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Gold Client</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mt-4">
                As an authorized client of <span className="text-white">Mahato Motors</span>, you have access to exclusive fleet reservations and priority stock alerts.
              </p>
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Fingerprint size={14} /> Unique Identifier
                </div>
                <p className="text-[10px] font-mono mt-1 text-slate-300">{user._id}</p>
              </div>
            </div>
            <User className="absolute -bottom-10 -right-10 text-white opacity-5 group-hover:scale-110 transition-transform duration-500" size={200} />
          </div>
          
          <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100">
             <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Help & Support</p>
             <p className="text-xs font-bold text-slate-600">Need to change your email? Contact our support desk.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;