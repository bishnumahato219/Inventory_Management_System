import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { Search, ArrowRight, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import API from "../../api/axios"; // Import your Axios instance

const slides = [
  "https://i.pinimg.com/736x/06/f7/ea/06f7ea1a5b0cd64876ada3ca936f6fe9.jpg",
  "https://i.pinimg.com/736x/24/01/f1/2401f1b6eeb28aca2acd5902427feae5.jpg",
  "https://i.pinimg.com/control1/736x/9f/8b/be/9f8bbe1ec8472073cdde4c4d839553eb.jpg",
  "https://i.pinimg.com/736x/1a/5c/9a/1a5c9a2e0f16c9563a4076ebdd482df7.jpg"
];

export default function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fuel, setFuel] = useState("");

  // Point this to your Render URL (without the /api)
  const RENDER_BACKEND_URL = "https://inventory-management-system-ftg8.onrender.com";

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        // Use your API instance instead of fetch
        const res = await API.get("/cars");
        setCars(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Inventory sync failed:", err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleBookingRedirect = (carId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate(`/booking/${carId}`);
    }
  };

  const filteredCars = cars.filter((car) => {
    return (
      car.modelName?.toLowerCase().includes(search.toLowerCase()) &&
      (fuel ? car.fuelType?.toLowerCase() === fuel.toLowerCase() : true) &&
      car.stock > 0
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-500 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden">
        {slides.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === current ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>

        <div className="relative z-10 h-full flex items-center px-6 md:px-24">
          <div className="max-w-5xl">
            <div className="flex items-center gap-2 mb-4 md:mb-6 text-orange-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs">
              <span className="w-8 md:w-12 h-[2px] bg-orange-500"></span>
              The Future of Driving
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.85] mb-6">
              Mahato <br />
              <span className="text-orange-500">Motors.</span>
            </h1>
            <p className="text-sm md:text-lg text-slate-300 max-w-sm md:max-w-lg font-medium leading-relaxed mb-8 md:mb-10">
              Authorized Maruti Suzuki Partner. We combine 
              heritage with digital innovation to bring you the best in class vehicles.
            </p>
            <button
              onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white text-slate-900 px-6 md:px-10 py-4 md:py-5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-orange-600 hover:text-white transition-all shadow-2xl flex items-center gap-3 md:gap-4 group"
            >
              Explore Collection <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. INVENTORY SECTION */}
      <section id="collection" className="py-16 md:py-24 px-4 md:px-20">
        <div className="max-w-7xl mx-auto mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">Inventory</h2>
              <div className="h-1.5 w-20 md:w-24 bg-orange-600 mt-3 md:mt-4"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search Model..."
                  className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="bg-white border border-slate-200 px-6 py-3.5 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-black text-[10px] uppercase tracking-widest text-slate-600 cursor-pointer"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
              >
                <option value="">All Fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse text-xs italic">
              Synchronizing Asset Registry...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {filteredCars.map((car) => (
                <div key={car._id} className="group bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div className="h-56 md:h-64 overflow-hidden relative">
                    <img
                      src={car.image?.startsWith('http') 
                        ? car.image 
                        : `${RENDER_BACKEND_URL}/${car.image}`.replace(/([^:]\/)\/+/g, "$1")}
                      alt={car.modelName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Preview+Unavailable"; }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-800">
                      {car.fuelType}
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">{car.modelName}</h3>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6">{car.variant}</p>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                      <div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">On-Road</p>
                        <p className="text-xl md:text-2xl font-black text-orange-600">₹{car.onRoadPrice?.toLocaleString("en-IN")}</p>
                      </div>
                      <button
                        onClick={() => handleBookingRedirect(car._id)}
                        className="bg-slate-950 text-white w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="bg-slate-950 text-white pt-20 pb-10 px-6 md:px-24">
        {/* ... (Footer content stays same) ... */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8">Mahato <span className="text-orange-600">Motors.</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-900 rounded-xl text-orange-500"><ShieldCheck size={20} /></div>
                <div>
                  <h4 className="font-bold text-[11px] md:text-xs uppercase mb-1">Certified Sales</h4>
                  <p className="text-slate-500 text-[10px] md:text-xs">Authorized Maruti Suzuki Dealership Partner.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-900 rounded-xl text-orange-500"><Zap size={20} /></div>
                <div>
                  <h4 className="font-bold text-[11px] md:text-xs uppercase mb-1">Rapid Delivery</h4>
                  <p className="text-slate-500 text-[10px] md:text-xs">Express vehicle processing and documentation.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-orange-500 font-black uppercase text-[10px] tracking-[0.2em] mb-6">Contact Registry</h4>
            <ul className="space-y-3 text-slate-400 text-xs font-medium">
              <li>Showroom: NH-33, Near Dhanbad, Jharkhand</li>
              <li>Support Line: +91 9113456786</li>
              <li>Operational: Mon - Sat (9AM - 8PM)</li>
            </ul>
          </div>
        </div>
        <p className="pt-10 border-t border-slate-900 text-slate-700 text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-center">
          © 2026 Mahato Motors Pvt Ltd. Dhanbad Region.
        </p>
      </footer>
    </div>
  );
}