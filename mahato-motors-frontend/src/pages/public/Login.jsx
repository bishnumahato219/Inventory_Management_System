import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ChevronRight, ArrowLeft } from "lucide-react";
import API from "../../api/axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // STABLE MARUTI SUZUKI IMAGE LINKS
  const slides = [
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKuHj996NnYfAJEAClKqL3qNGzBDHe3_YXag&s",
      title: "Classic Reliability",
      desc: "Managing India's favorite reliable fleet with ease."
    },
    {
      url: "https://media.zigcdn.com/media/model/2025/Jul/model-extimg-196959712_600x400.jpg",
      title: "The Next Generation",
      desc: "Experience the future of Maruti Suzuki with the 2025 lineup."
    },
    {
      url: "https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/fronx-exterior-right-rear-three-quarter-6.jpeg?isig=0&q=80",
      title: "Fronx Performance",
      desc: "High-performance SUVs for the modern explorer."
    },
    {
      url: "https://imgd.aeplcdn.com/370x208/cw/ec/32475/Maruti-Suzuki-New-Swift-Exterior-116090.jpg?wm=1&q=80",
      title: "Swift Elegance",
      desc: "Optimized inventory control for the most loved hatchback."
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
      
      {/* 1. LEFT SIDE: CINEMATIC SLIDER */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentSlide ? "opacity-60 scale-100" : "opacity-0 scale-110"
            }`}
          >
            {/* Added onError fallback to handle any future broken links */}
            <img 
              src={slide.url} 
              alt="Mahato Motors Showroom" 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1562141961-b5d19729742e?q=80&w=1600&auto=format&fit=crop"; }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        
        <div className="relative z-10 w-full p-16 self-end mb-16">
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">
            Mahato <span className="text-orange-500">Motors.</span>
          </h1>
          <h2 className="text-2xl font-bold text-white mb-2">{slides[currentSlide].title}</h2>
          <p className="text-slate-300 text-lg max-w-md font-medium leading-relaxed">{slides[currentSlide].desc}</p>
          
          <div className="flex gap-2 mt-8">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? "w-10 bg-orange-500" : "w-3 bg-slate-700"}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md bg-white lg:bg-transparent p-8 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-2xl shadow-slate-200/50 lg:shadow-none animate-in fade-in slide-in-from-right-4 duration-700">
          
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Mahato <span className="text-orange-600">Motors.</span>
            </h1>
          </div>

          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 rounded-full transition-all duration-300 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Sign <span className="text-orange-600">In</span></h2>
            <p className="text-slate-500 font-medium mt-2 text-sm md:text-base italic">Identity verification for dealership access.</p>
          </div>

          {error && (
            <div className="mb-6 text-red-600 text-[10px] md:text-xs font-black uppercase tracking-widest bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="space-y-4">
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