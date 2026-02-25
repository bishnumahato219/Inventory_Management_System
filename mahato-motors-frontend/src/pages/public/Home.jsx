import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { Search, Fuel, ArrowRight, Zap, ShieldCheck } from "lucide-react";

// Using high-quality Maruti/Premium car images to match your showroom style
const slides = [
  "https://instagram.fdbd5-1.fna.fbcdn.net/v/t51.82787-15/621753561_18192071008352376_2038896646433977071_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MjQ2MzAyNjQxNDQ5ODkzODk2OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjc1MHg3Mzkuc2RyLkMzIn0%3D&_nc_ohc=fc2iBi9Aj-kQ7kNvwGnSxen&_nc_oc=Adm5zyW-yY-vJcgnHV0t-xDJtSTGBkHjHaUDgB5xJdJsL7wtRsb7vr12oAxcn4brMOVBwquqRXMDTkRgvojW8b4P&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fdbd5-1.fna&_nc_gid=rxvxZfzJW7__BUpOGmCkiw&oh=00_AfuY_DxsftbUXmn5Tksn-chlK-CSwvGSAGQytA-6mqnDgQ&oe=69A3D94F",
  "https://i.pinimg.com/736x/b1/7e/6f/b17e6f4f9eb49d3c2bd46dac19dbe626.jpg",
  "https://i.pinimg.com/736x/cc/e6/19/cce61947ae34b19ca75def3d0c15c456.jpg",
  "https://img.indianautosblog.com/resize/750x-/2018/04/2018-Maruti-Ertiga-Suzuki-Ertiga-front-angle.jpg",

  "cursor: pointer; transform: translate3d(0px, 0px, 0px) scale(1); transform-origin: 0px 0px;",
];

export default function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fuel, setFuel] = useState("");

  const IMAGE_BASE_URL = "http://localhost:5000/";

  // Auto-sliding logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetching inventory from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cars");
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error("Inventory sync failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleBookingRedirect = (carId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if user is not authenticated
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
    <div className="min-h-screen bg-slate-50 selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION WITH IMAGE SLIDER */}
      <section className="relative h-[90vh] w-full overflow-hidden">
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

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>

        <div className="relative z-10 h-full flex items-center px-10 md:px-24">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6 text-orange-500 font-black uppercase tracking-[0.3em] text-xs">
              <span className="w-12 h-[2px] bg-orange-500"></span>
              The Future of Driving
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-6">
              Mahato <br />
              <span className="text-orange-500">Motors.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-lg font-medium leading-relaxed mb-10">
              Discover the ultimate Maruti Suzuki experience. We combine 
              heritage with digital innovation to bring you the best in class vehicles.
            </p>
            <button
              onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white text-slate-900 px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-2xl flex items-center gap-4 group"
            >
              Explore Collection <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTERS */}
      <section id="collection" className="py-24 px-6 md:px-20">
        <div className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row gap-6 items-end justify-between">
          <div className="flex-1 w-full">
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Inventory</h2>
            <div className="h-1.5 w-24 bg-orange-600 mt-4 mb-8"></div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by Model Name..."
                  className="w-full bg-white border border-slate-200 pl-12 pr-6 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="bg-white border border-slate-200 px-8 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-slate-600 cursor-pointer"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
              >
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
          </div>
        </div>

        {/* CAR GRID */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Synchronizing Data...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {filteredCars.map((car) => (
              <div key={car._id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={car.image ? `${IMAGE_BASE_URL}${car.image}` : "https://via.placeholder.com/400x300"}
                    alt={car.modelName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Preview"; }}
                  />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm">
                    {car.fuelType}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{car.modelName}</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">{car.variant}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">On-Road Price</p>
                      <p className="text-2xl font-black text-orange-600">₹{car.onRoadPrice?.toLocaleString("en-IN")}</p>
                    </div>
                    <button
                      onClick={() => handleBookingRedirect(car._id)}
                      className="bg-slate-950 text-white p-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                    >
                      <ArrowRight size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER DETAILS */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 px-10 md:px-24">
        <div className="grid md:grid-cols-3 gap-20 mb-20">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Mahato <span className="text-orange-500">Motors.</span></h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-900 rounded-xl text-orange-500"><ShieldCheck size={24} /></div>
                <div>
                  <h4 className="font-bold text-sm uppercase mb-1">Certified Sales</h4>
                  <p className="text-slate-500 text-xs">Authorized Maruti Suzuki Dealership Partner.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-900 rounded-xl text-orange-500"><Zap size={24} /></div>
                <div>
                  <h4 className="font-bold text-sm uppercase mb-1">Rapid Delivery</h4>
                  <p className="text-slate-500 text-xs">Express vehicle processing and documentation.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-orange-500 font-black uppercase text-xs tracking-[0.2em] mb-6">Contact Us</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li>Showroom: Main Road, NH-33, Jharkhand</li>
              <li>Support: +91 99392 74587</li>
              <li>Hours: Mon - Sat (9:00 AM - 8:00 PM)</li>
            </ul>
          </div>
        </div>
        <p className="pt-12 border-t border-slate-900 text-slate-700 text-[10px] font-black uppercase tracking-[0.5em] text-center">
          © 2026 Mahato Motors Private Limited. Registered Dealer.
        </p>
      </footer>
    </div>
  );
}