import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { Car, IndianRupee, Info, ShieldCheck, ArrowLeft } from "lucide-react";

export default function BookingPage() {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advanceAmount, setAdvanceAmount] = useState(10000);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cars/${carId}`);
        const data = await res.json();
        setCar(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car:", error);
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId]);

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication Required: Please login to continue.");
        navigate("/login");
        return;
      }

      setBookingLoading(true);
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          car: car._id,
          advanceAmount,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Success: Booking Protocol Synchronized!");
        navigate("/customer/dashboard");
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      <p className="font-black uppercase tracking-widest text-slate-400 text-[10px]">Retrieving Asset Specs...</p>
    </div>
  );

  if (!car) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black uppercase text-slate-400">
      Asset Not Found in Registry.
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <Navbar />

      <div className="max-w-4xl mx-auto pt-24 md:pt-32 px-4 md:px-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Return to Showroom
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left: Car Summary (3 Cols) */}
          <div className="lg:col-span-3 bg-white shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-6 md:p-10 border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                <Car size={24} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
                  Confirm <span className="text-orange-600">Booking</span>
                </h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Reference: {car._id?.slice(-8)}</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {[
                { label: "Model", value: car.modelName },
                { label: "Variant", value: car.variant },
                { label: "Fuel Type", value: car.fuelType },
                { label: "Stock Available", value: `${car.stock} Units`, color: car.stock > 0 ? "text-green-600" : "text-red-600" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                  <span className={`text-sm md:text-base font-bold ${item.color || "text-slate-800"}`}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
              <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
              <p className="text-[10px] md:text-xs text-blue-700 font-medium leading-relaxed">
                Booking requires an advance payment. The remaining balance of <span className="font-bold">₹{(car.onRoadPrice - advanceAmount).toLocaleString()}</span> will be processed at the dealership.
              </p>
            </div>
          </div>

          {/* Right: Payment Action (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Advance Commitment</p>
                <div className="relative mb-8">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black text-orange-500">₹</span>
                  <input
                    type="number"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-slate-700 focus:border-orange-500 py-2 pl-6 text-3xl font-black outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                    <span>On-Road Price</span>
                    <span className="text-white">₹{car.onRoadPrice?.toLocaleString()}</span>
                  </div>
                  
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading || car.stock <= 0}
                    className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {bookingLoading ? "Processing..." : "Commit Booking"}
                  </button>
                </div>
              </div>
              <ShieldCheck className="absolute -bottom-10 -right-10 text-white opacity-5" size={180} />
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <ShieldCheck size={20} />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Secure Mahato Motors Protocol</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}