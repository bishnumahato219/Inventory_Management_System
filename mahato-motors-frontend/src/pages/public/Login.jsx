import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react"; // Icons from your Register page
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
      url: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/127563/alto-k10-exterior-right-front-three-quarter-60.jpeg?isig=0&q=40",
      title: "Premium Inventory",
      desc: "Manage your luxury fleet with precision."
    },
    {
      url: "https://imgd.aeplcdn.com/664x374/n/cw/ec/45299/jimny-exterior-right-rear-three-quarter-2.jpeg?isig=0&q=80",
      title: "Real-time Tracking",
      desc: "Monitor stock levels and sales instantly."
    },
    {
      url: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/139269/e-vitara-interior-dashboard.jpeg?isig=0&q=40",
      title: "Smart Analytics",
      desc: "Drive growth with data-driven insights."
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
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE: CINEMATIC SLIDER */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentSlide ? "opacity-60 scale-100" : "opacity-0 scale-110"
            }`}
          >
            <img src={slide.url} alt="Car" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="relative z-10 w-full p-12 self-end mb-20">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none mb-4">
            Mahato <span className="text-orange-500">Motors.</span>
          </h1>
          <h2 className="text-2xl font-bold text-white mb-2">{slides[currentSlide].title}</h2>
          <p className="text-slate-300 text-lg max-w-md">{slides[currentSlide].desc}</p>
          
          <div className="flex gap-2 mt-8">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? "w-10 bg-orange-500" : "w-3 bg-slate-600"}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-slate-500 font-medium mt-2">Enter your dealership credentials.</p>
          </div>

          {error && <div className="mb-4 text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg border-l-4 border-red-500">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* EMAIL WITH ICON */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="Corporate Email"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none text-slate-800"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* PASSWORD WITH ICON & TOGGLE */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none text-slate-800"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 shadow-2xl shadow-orange-200/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Access Dashboard →"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-sm font-medium">
            Authorized personnel only. <Link to="/register" className="text-orange-600 font-bold hover:underline">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;