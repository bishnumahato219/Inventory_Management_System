import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock, ChevronRight, ArrowLeft } from "lucide-react";
import API from "../../api/axios";

// STABLE HIGH-RES SUZUKI IMAGE LINKS
const slides = [
  {
    url: "https://i.pinimg.com/736x/db/f8/ba/dbf8baca4b534c56c8049b5def402ff2.jpg",
    title: "Premium Experience",
    desc: "Join the elite circle of automotive excellence at Mahato Motors."
  },
  {
    url: "https://c.ndtvimg.com/2025-02/tulmf6ro_maruti-suzuki-dzire-nascar-render_625x300_24_February_25.jpg?im=FitAndFill,algorithm=dnn,width=1200,height=800",
    title: "The Racing Spirit",
    desc: "Experience the thrill of precision engineering in every vehicle."
  },
  {
    url: "https://c.ndtvimg.com/2025-05/ad8b1mj8_dzire-south-africa_625x300_20_May_25.jpg?im=FaceCrop,algorithm=dnn,width=600,height=400",
    title: "Global Standards",
    desc: "Delivering Maruti Suzuki excellence across international borders."
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
      
      {/* 1. LEFT VISUAL SECTION */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-900">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === current ? "opacity-60 scale-100" : "opacity-0 scale-110"
            }`}
          >
            {/* Added onError to handle broken external links automatically */}
            <img 
              src={slide.url} 
              alt="Mahato Motors Fleet" 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop"; }}
            />
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

      {/* 2. RIGHT FORM SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md bg-white lg:bg-transparent p-8 md:p-10 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-2xl shadow-slate-200/50 lg:shadow-none animate-in fade-in slide-in-from-right-4 duration-700">
          
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Mahato <span className="text-orange-600">Motors.</span>
            </h1>
          </div>

          <div className="mb-6 mb-10 text-center lg:text-left">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 rounded-full transition-all duration-300 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
            </Link>
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