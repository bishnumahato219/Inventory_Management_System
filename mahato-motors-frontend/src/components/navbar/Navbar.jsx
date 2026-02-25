import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const token = localStorage.getItem("token");

  // Scroll detection for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user from backend
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Invalid token");
        }

        const data = await res.json();
        setUser(data);

      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "manager") return "/manager/dashboard";
    if (user.role === "employee") return "/employee/dashboard";
    return "/customer/dashboard";
  };

  return (
    <nav
      className={`
        fixed top-0 w-full z-50 transition-all duration-300
        ${
          scrolled
            ? "backdrop-blur-lg bg-white/70 shadow-md"
            : "bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-orange-500"
        >
          Mahato Motors
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6 text-slate-800 font-medium">

          <Link
            to="/"
            className="hover:text-orange-500 transition"
          >
            Home
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                className="hover:text-orange-500 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to={getDashboardPath()}
                className="hover:text-orange-500 transition"
              >
                Dashboard
              </Link>

              <span className="text-sm text-slate-600">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
