import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, MapPinOff, ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden font-sans">
      
      {/* 1. CINEMATIC BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-800 rounded-full blur-[150px]"></div>
      </div>

      {/* 2. ERROR CARD */}
      <div className="max-w-xl w-full text-center relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Visual Icon */}
        <div className="inline-flex items-center justify-center bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 mb-8 shadow-2xl">
          <MapPinOff size={48} className="text-orange-500" strokeWidth={1.5} />
        </div>

        {/* Error Typography */}
        <h1 className="text-[8rem] md:text-[12rem] font-black text-white leading-none tracking-tighter opacity-10 absolute left-1/2 -translate-x-1/2 -top-12 md:-top-20 select-none">
          404
        </h1>
        
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">
          Off-Road <span className="text-orange-600">Event</span>
        </h2>
        
        <div className="flex items-center justify-center gap-2 mb-10">
           <div className="h-1 w-8 bg-orange-600 rounded-full"></div>
           <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
             Navigation Protocol Failure
           </p>
           <div className="h-1 w-8 bg-orange-600 rounded-full"></div>
        </div>

        <p className="text-slate-500 font-medium text-sm md:text-base max-w-sm mx-auto mb-12 leading-relaxed">
          The requested coordinate does not exist in the <span className="text-white font-bold">Mahato Motors</span> registry. 
          Reroute to the primary terminal.
        </p>

        {/* Action Buttons: Stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Home size={16} /> Home Terminal
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Previous Node
          </button>
        </div>

        {/* Footer Meta */}
        <div className="mt-16 pt-8 border-t border-slate-900/50">
          <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">
            Audit Ref: ERR_COORD_NOT_FOUND_Haldia_Region
          </p>
        </div>
      </div>
    </div>
  );
}