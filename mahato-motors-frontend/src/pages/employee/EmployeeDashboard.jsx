import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [employee, setEmployee] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const me = await fetch("http://localhost:5000/api/auth/me", { headers });
      const meData = await me.json();
      if (meData.role !== "employee") return navigate("/");
      setEmployee(meData);

      const bookingsRes = await fetch("http://localhost:5000/api/bookings", { headers });
      setBookings(await bookingsRes.json());

    } catch {
      localStorage.clear();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-24 text-center">Loading...</div>;

  return (
    <DashboardLayout role="employee">
      <div className="min-h-screen bg-slate-50 pt-24 px-10">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome, {employee?.name}</p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <StatCard title="Assigned Bookings" value={bookings.length} />
          <StatCard
            title="Delivered"
            value={bookings.filter(b => b.status === "delivered").length}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-slate-600">{title}</h2>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
