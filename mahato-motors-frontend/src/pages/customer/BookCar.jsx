import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Car, ChevronRight, Zap } from "lucide-react";

export default function BookCar() {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all cars available in the dealership
    API.get("/cars").then(res => setCars(res.data));
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

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
        Fleet <span className="text-orange-600">Reservation</span>
      </h1>
      <div className="grid md:grid-cols-3 gap-8">
        {cars.map(car => (
          <div key={car._id} className="bg-white p-8 rounded-[2.5rem] border shadow-xl flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-orange-100 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                <Car size={24}/>
              </div>
              <span className="text-[9px] font-black uppercase bg-green-50 text-green-600 px-3 py-1 rounded-full">
                {car.stock} Units Available
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{car.modelName}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {car.variant} • {car.fuelType}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase">On-Road Estimate</p>
                <p className="text-xl font-black">₹{car.onRoadPrice?.toLocaleString()}</p>
              </div>
              <button 
                onClick={() => handleBooking(car._id)} 
                className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-orange-600 transition-all active:scale-95"
              >
                <ChevronRight size={20}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}