import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ShieldKeyhole, Fingerprint } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-6 font-sans">
      {/* Container with responsive max-width */}
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden animate-in fade-in zoom-in duration-500">
        
        {/* Branding/Icon Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 mb-6">
            <ShieldKeyhole size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter text-center leading-none">
            Reset <span className="text-orange-600">Access</span>
          </h2>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-4 text-center">
            Verification required to bypass security.
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              Corporate Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                required
                type="email"
                placeholder="Enter registered email"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-bold text-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Send Reset Link
          </button>
        </form>

        {/* Navigation Footer */}
        <div className="mt-10 pt-8 border-t border-slate-50">
          <button 
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 w-full text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> Back to Identity Portal
          </button>
        </div>

        {/* Decorative Background Element */}
        <Fingerprint className="absolute -bottom-8 -left-8 text-slate-100 opacity-50 pointer-events-none" size={120} />
      </div>
    </div>
  );
}