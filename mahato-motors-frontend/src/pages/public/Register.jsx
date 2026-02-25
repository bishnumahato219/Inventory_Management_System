import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import API from "../../api/axios"; // Using your existing axios instance

const slides = [
  {
    url: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/107543/brezza-exterior-left-front-three-quarter-3.jpeg?isig=0&q=40",
    title: "Premium Experience",
    desc: "Join the elite circle of automotive excellence."
  },
  {
    url: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/147201/invicto-exterior-right-rear-three-quarter.jpeg?isig=0&q=40",
    title: "Expert Management",
    desc: "Precision tools for modern dealership operations."
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

  // Smooth Image slider
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
      // Replaced fetch with your API axios instance for consistency
      const res = await API.post("/users/register", form);
      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white">
      
      {/* LEFT VISUAL SECTION */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-900">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === current ? "opacity-60 scale-100" : "opacity-0 scale-110"
            }`}
          >
            <img src={slide.url} alt="Car" className="w-full h-full object-cover" />
          </div>
        ))}

        {/* Branding & Text Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-20 left-16 z-20 max-w-md">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            Mahato <span className="text-orange-500">Motors.</span>
          </h1>
          <div className="h-1 w-20 bg-orange-500 mb-6"></div>
          <h3 className="text-3xl font-bold text-white mb-2 transition-all duration-500">
            {slides[current].title}
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed">
            {slides[current].desc}
          </p>
          
          {/* Progress Indicators */}
          <div className="flex gap-2 mt-8">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-10 bg-orange-500" : "w-3 bg-slate-600"}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 font-medium mt-2">Join the Mahato Motors dealership team.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full border border-slate-200 pl-12 pr-4 py-4 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full border border-slate-200 pl-12 pr-4 py-4 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full border border-slate-200 pl-12 pr-4 py-4 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full border border-slate-200 pl-12 pr-12 py-4 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                  onChange={handleChange}
                  required
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
              className="w-full bg-slate-900 hover:bg-orange-600 transition-all text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-200/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Register Now →"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 font-medium text-sm">
            Already a member?{" "}
            <Link to="/login" className="text-orange-600 font-black hover:underline transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}