import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock, ChevronRight } from "lucide-react";
import API from "../../api/axios";

const slides = [
  {
    url: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/107543/brezza-exterior-left-front-three-quarter-3.jpeg?isig=0&q=40",
    title: "Premium Experience",
    desc: "Join the elite circle of automotive excellence at Mahato Motors."
  },
  {
    url: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/147201/invicto-exterior-right-rear-three-quarter.jpeg?isig=0&q=40",
    title: "Expert Management",
    desc: "Precision tools for modern dealership operations and stock control."
  }
];

export default function Register() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/users/register", form);
      alert("Registration Successful! Redirecting to Identity Portal...");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Verify protocol and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white">
      
      {/* 1. LEFT VISUAL SECTION - Hidden on Mobile/Tablet (LG breakpoint) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-900">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === current ? "opacity-60 scale-100" : "opacity-0 scale-110"
            }`}
          >
            <img src={slide.url} alt="Mahato Motors Fleet" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-20 left-16 z-20 max-w-md">
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase mb-2 leading-none">
            Mahato <span className="text-orange-500">Motors.</span>
          </h1>
          <div className="h-1.5 w-20 bg-orange-500 mb-6 rounded-full"></div>
          <h3 className="text-3xl font-bold text-white mb-2 transition-all duration-500 tracking-tight">
            {slides[current].title}
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed font-medium">
            {slides[current].desc}
          </p>
          
          <div className="flex gap-2 mt-10">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-12 bg-orange-500" : "w-3 bg-slate-700"}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. RIGHT FORM SECTION - Fully Responsive */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md bg-white lg:bg-transparent p-8 md:p-10 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-2xl shadow-slate-200/50 lg:shadow-none animate-in fade-in slide-in-from-right-4 duration-700">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Mahato <span className="text-orange-600">Motors.</span>
            </h1>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Create <span className="text-orange-600">Account</span>
            </h2>
            <p className="text-slate-500 font-medium mt-3 text-sm md:text-base italic">Enroll in the dealership ecosystem.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] md:text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3">
              <span className="shrink-0">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">
            <div className="space-y-4">
              {/* Responsive Inputs with Icons */}
              {[
                { icon: <User />, name: "name", type: "text", placeholder: "Staff Full Name" },
                { icon: <Mail />, name: "email", type: "email", placeholder: "Corporate Email" },
                { icon: <Phone />, name: "phone", type: "number", placeholder: "Contact Number" }
              ].map((field, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                    {React.cloneElement(field.icon, { size: 18 })}
                  </div>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="w-full border border-slate-100 pl-12 pr-4 py-3.5 md:py-4 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-bold text-sm text-slate-800"
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              {/* Password Field */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Security Credential"
                  className="w-full border border-slate-100 pl-12 pr-12 py-3.5 md:py-4 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-bold text-sm text-slate-800"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-orange-600 transition-all text-white py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-600/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? "Syncing Identity..." : "Finalize Enrollment"} <ChevronRight size={16} />
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest">
            Already Registered?{" "}
            <Link to="/login" className="text-orange-600 border-b-2 border-orange-100 hover:border-orange-600 transition-all ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}