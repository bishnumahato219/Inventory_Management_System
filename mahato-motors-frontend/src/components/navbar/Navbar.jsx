import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// You may need to install lucide-react: npm install lucide-react
import { Menu, X } from "lucide-react"; 

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Invalid token");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      }
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    const roles = ["admin", "manager", "employee"];
    return roles.includes(user.role) ? `/${user.role}/dashboard` : "/customer/dashboard";
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled || isOpen ? "backdrop-blur-lg bg-white/90 shadow-md" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-orange-500 z-50">
          Mahato Motors
        </Link>

        {/* MOBILE TOGGLE BUTTON */}
        <button 
          className="md:hidden text-slate-800 z-50" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* NAV LINKS - Desktop & Mobile */}
        <div className={`
          fixed md:static top-0 left-0 w-full h-screen md:h-auto 
          bg-white md:bg-transparent flex flex-col md:flex-row 
          items-center justify-center md:justify-end gap-8 md:gap-6 
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}>
          
          <Link to="/" onClick={() => setIsOpen(false)} className="text-lg md:text-base font-medium hover:text-orange-500 transition">
            Home
          </Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg md:text-base font-medium hover:text-orange-500 transition">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to={getDashboardPath()} onClick={() => setIsOpen(false)} className="text-lg md:text-base font-medium hover:text-orange-500 transition">
                Dashboard
              </Link>
              <span className="text-slate-500 hidden md:block">|</span>
              <span className="text-slate-600 font-semibold">{user.name}</span>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-medium transition">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}