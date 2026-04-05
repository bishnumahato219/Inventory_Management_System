import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ChevronRight } from "lucide-react";
import API from "../../api/axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const slides = [
    {
      url: "https://images.livemint.com/img/2022/06/30/1600x900/Maruti_Suzuki_Breza_1656584283120_1656584283307.jpg",
      title: "Premium Inventory",
      desc: "Manage your Maruti Suzuki fleet with precision."
    },
    {
      url: "https://www.marutisuzuki.com/channels/nexa/car-models/grand-vitara/-/media/images/maruti/marutisuzuki/modules/car-details-page/grand-vitara/color/celestial-blue.png",
      title: "Real-time Tracking",
      desc: "Monitor showroom stock and sales instantly."
    },
    {
      url: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/139269/e-vitara-interior-dashboard.jpeg?isig=0&q=40",
      title: "Smart Analytics",
      desc: "Drive dealership growth with data-driven insights."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      
      {/* 1. LEFT SIDE: CINEMATIC SLIDER - Hidden on screens smaller than LG (1024px) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentSlide ? "opacity-60 scale-100" : "opacity-0 scale-110"
            }`}
          >
            <img src={slide.url} alt="Showroom" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        
        <div className="relative z-10 w-full p-16 self-end mb-16">
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">
            Mahato <span className="text-orange-500">Motors.</span>
          </h1>
          <h2 className="text-2xl font-bold text-white mb-2">{slides[currentSlide].title}</h2>
          <p className="text-slate-300 text-lg max-w-md font-medium">{slides[currentSlide].desc}</p>
          
          <div className="flex gap-2 mt-8">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? "w-10 bg-orange-500" : "w-3 bg-slate-700"}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE: AUTH FORM - Responsive Width & Padding */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md bg-white lg:bg-transparent p-8 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-2xl shadow-slate-200/50 lg:shadow-none">
          
          {/* Mobile Header (Only visible when slider is hidden) */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Mahato <span className="text-orange-600">Motors.</span>
            </h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Sign <span className="text-orange-600">In</span></h2>
            <p className="text-slate-500 font-medium mt-2 text-sm md:text-base">Identity verification for dealership access.</p>
          </div>

          {error && (
            <div className="mb-6 text-red-600 text-[10px] md:text-xs font-black uppercase tracking-widest bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="space-y-4">
              {/* EMAIL */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="Corporate Email"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none text-slate-800 font-bold text-sm"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* PASSWORD */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none text-slate-800 font-bold text-sm"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end px-2">
              <Link to="/forgot-password" size={18} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-colors">
                Forgot Credentials?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-orange-600 shadow-xl shadow-orange-600/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Access Dashboard"} <ChevronRight size={16} />
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest">
            Identity Not Found? <Link to="/register" className="text-orange-600 border-b-2 border-orange-100 hover:border-orange-600 transition-all ml-1">Request Enrollment</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;