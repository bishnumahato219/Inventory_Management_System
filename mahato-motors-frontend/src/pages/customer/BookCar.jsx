import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Car, ChevronRight, Zap, Info } from "lucide-react";

export default function BookCar() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await API.get("/cars");
        setCars(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleBooking = async (id) => {
    try {
      // Creates a new booking entry with a default advance amount
      await API.post("/bookings", { car: id, advanceAmount: 50000 });
      // Redirect to the "My Bookings" page to see the update
      navigate("/customer/my-bookings"); 
    } catch (err) { 
      alert("Booking failed. System error."); 
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Fleet...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
          Fleet <span className="text-orange-600">Reservation</span>
        </h1>
        <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest">
          Secure your premium driving experience
        </p>
      </div>

      {/* GRID: 1 column (mobile), 2 (tablet), 3 (desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {cars.map(car => (
          <div 
            key={car._id} 
            className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col justify-between group hover:border-orange-200 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                <Car size={24}/>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                  car.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                }`}>
                  {car.stock > 0 ? `${car.stock} Units Available` : "Out of Stock"}
                </span>
                {car.stock < 5 && car.stock > 0 && (
                  <span className="text-[8px] font-black text-orange-500 animate-pulse uppercase tracking-tighter">
                    Limited Availability
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                {car.modelName}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                {car.variant} <span className="h-1 w-1 bg-slate-200 rounded-full"></span> {car.fuelType}
              </p>
            </div>

            <div className="pt-6 mt-8 border-t border-slate-50 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">On-Road Est.</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">
                  ₹{car.onRoadPrice?.toLocaleString("en-IN")}
                </p>
              </div>
              
              <button 
                onClick={() => handleBooking(car._id)} 
                disabled={car.stock <= 0}
                className={`
                  flex items-center justify-center p-4 rounded-2xl transition-all active:scale-90
                  ${car.stock > 0 
                    ? "bg-slate-900 text-white hover:bg-orange-600 shadow-lg" 
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"}
                `}
              >
                <ChevronRight size={24}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE HELP BOX */}
      <div className="md:hidden bg-slate-900 p-6 rounded-[2rem] flex items-center gap-4 text-white">
        <div className="bg-white/10 p-3 rounded-xl"><Info size={20}/></div>
        <p className="text-xs font-bold leading-relaxed uppercase tracking-tight">
          Tap the arrow to finalize your ₹50,000 reservation advance.
        </p>
      </div>
    </div>
  );
}