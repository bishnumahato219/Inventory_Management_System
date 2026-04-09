import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock, ChevronRight, ArrowLeft } from "lucide-react";
import API from "../../api/axios";

// STABLE HIGH-RES SUZUKI IMAGE LINKS
const slides = [
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCZav2a7ak9Yc2jJodH7OsZwzMY75vKC2rg&s",
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
  },
  {
    url: "data:image/jpeg;base64,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",
    title: "Precision Engineering",
    desc: "Every component managed with absolute accuracy for peak performance."
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