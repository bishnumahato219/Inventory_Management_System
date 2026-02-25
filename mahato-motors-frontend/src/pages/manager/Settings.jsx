import React, { useState } from "react";
import API from "../../api/axios";
import { User, Shield, Bell, FileText, Save, Key, Mail, Fingerprint } from "lucide-react";

const Settings = () => {
  // Defensive parsing to ensure component stability
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [activeTab, setActiveTab] = useState("profile");
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/profile/${user._id}`, profileData);
      alert("Profile updated successfully! Security protocols refreshed.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Control <span className="text-orange-600">Center</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">Manage your professional identity and system preferences.</p>
        </div>
        <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
            <Fingerprint size={14} /> Security Status: Active
          </p>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit gap-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
            activeTab === "profile" 
            ? "bg-slate-900 text-white shadow-lg" 
            : "text-slate-400 hover:bg-slate-50"
          }`}
        >
          <User size={16} /> My Profile
        </button>
        {(user.role === "admin" || user.role === "manager") && (
          <button
            onClick={() => setActiveTab("system")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === "system" 
              ? "bg-slate-900 text-white shadow-lg" 
              : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            <Shield size={16} /> System Operations
          </button>
        )}
      </div>

      {/* TAB CONTENT: PROFILE */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
            <form onSubmit={handleProfileUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-bold"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="email"
                      disabled
                      className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-100 rounded-2xl text-slate-400 cursor-not-allowed font-bold"
                      value={profileData.email}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-50">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-6 flex items-center gap-2">
                  <Key size={18} className="text-orange-500" /> Security Credential Update
                </h3>
                <div className="max-w-md space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">New Password</label>
                  <input
                    type="password"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-bold"
                    placeholder="Leave blank to maintain current"
                    onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full md:w-fit bg-slate-900 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-2xl transition-all shadow-xl active:scale-95"
              >
                <Save size={18} /> Sync Account Details
              </button>
            </form>
          </div>

          <div className="bg-orange-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Staff Role</h3>
              <p className="text-orange-100 text-sm font-medium leading-relaxed opacity-80">
                Your account is provisioned as <span className="text-white font-black">"{user.role?.toUpperCase()}"</span>. 
                Access levels are governed by the Mahato Motors administrative protocol.
              </p>
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Registered UID</p>
                <p className="text-xs font-mono mt-1 opacity-100">{user._id}</p>
              </div>
            </div>
            <Shield className="absolute -bottom-10 -right-10 text-white opacity-10" size={180} />
          </div>
        </div>
      )}

      {/* TAB CONTENT: SYSTEM */}
      {activeTab === "system" && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-10">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Automated Operations</h3>
            <p className="text-slate-500 font-medium">Configure global dealership logic and automation triggers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: "Low Stock Notifications", desc: "Alert managers when vehicle inventory drops below threshold.", icon: <Bell className="text-orange-500"/> },
              { label: "Auto-Generate Invoices", desc: "Instantly create PDF ledger entries upon sale finalization.", icon: <FileText className="text-blue-500"/> }
            ].map((pref, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-start justify-between group hover:bg-white hover:border-orange-200 transition-all cursor-pointer">
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm">{pref.icon}</div>
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{pref.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 leading-relaxed">{pref.desc}</p>
                  </div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer pt-2">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;