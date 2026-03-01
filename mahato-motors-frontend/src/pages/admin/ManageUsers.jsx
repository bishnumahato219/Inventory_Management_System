import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Users,
  UserMinus,
  RefreshCw,
  Shield,
  Briefcase,
  User,
  PlusCircle,
  X,
} from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "employee",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Administrative access required.");
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CREATE USER =================
  const createUser = async (e) => {
    e.preventDefault();

    try {
      let endpoint = "";

      if (formData.role === "manager") {
        endpoint = "/users/create-manager";
      } else if (formData.role === "employee") {
        endpoint = "/users/create-employee";
      } else {
        alert("Only Manager and Employee creation allowed.");
        return;
      }

      const res = await API.post(endpoint, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      // Add new user to table instantly
      setUsers([...users, res.data.user]);

      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "employee",
      });

    } catch (err) {
      console.error("CREATE USER ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "User creation failed.");
    }
  };

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Deletion failed.");
    }
  };

  // ================= ROLE BADGE =================
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return {
          style: "bg-purple-50 text-purple-600 border-purple-100",
          icon: <Shield size={12} />,
        };
      case "manager":
        return {
          style: "bg-blue-50 text-blue-600 border-blue-100",
          icon: <Briefcase size={12} />,
        };
      default:
        return {
          style: "bg-green-50 text-green-600 border-green-100",
          icon: <User size={12} />,
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Staff <span className="text-orange-600">Permissions</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Manage managers and employees.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg text-sm"
          >
            {showForm ? <X size={16} /> : <PlusCircle size={16} />}
            {showForm ? "Close" : "Add User"}
          </button>

          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-lg text-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Sync
          </button>
        </div>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow border">
          <form onSubmit={createUser} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 border rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 border rounded"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="p-3 border rounded"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="p-3 border rounded"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="p-3 border rounded"
            >
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>

            <button
              type="submit"
              className="md:col-span-2 bg-black text-white py-3 rounded font-semibold"
            >
              Create User
            </button>
          </form>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <Users size={18} />
          <span className="font-semibold text-sm uppercase">
            Authorized Users
          </span>
        </div>

        <table className="w-full text-left">
          <thead className="text-xs text-gray-500 uppercase border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const badge = getRoleBadge(u.role);
                return (
                  <tr key={u._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${badge.style}`}
                      >
                        {badge.icon}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-600 hover:text-white"
                      >
                        <UserMinus size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}