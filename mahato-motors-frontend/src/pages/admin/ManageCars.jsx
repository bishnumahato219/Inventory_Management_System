import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Base URL for images - change this to match your backend port
  const IMAGE_BASE_URL = "http://localhost:5000/";

  const [formData, setFormData] = useState({
    modelName: "",
    variant: "",
    fuelType: "Petrol",
    color: "",
    exShowroomPrice: "",
    onRoadPrice: "",
    stock: 0,
    image: null,
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await API.get("/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // Append all fields to the FormData object for the backend
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editingId) {
        // Update product
        await API.put(`/cars/${editingId}`, data);
        alert("Car updated successfully!");
      } else {
        // Add product
        await API.post("/cars", data);
        alert("Car added to inventory!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchCars();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        // Delete product
        await API.delete(`/cars/${id}`);
        setCars(cars.filter((car) => car._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      modelName: "",
      variant: "",
      fuelType: "Petrol",
      color: "",
      exShowroomPrice: "",
      onRoadPrice: "",
      stock: 0,
      image: null,
    });
    setEditingId(null);
  };

  if (loading) return <div className="p-10 text-center">Syncing Inventory...</div>;

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Inventory Management</h2>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg transition"
        >
          + Add New Car
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div key={car._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="h-48 bg-slate-100">
              {/* Added IMAGE_BASE_URL to fix broken images */}
              <img 
                src={car.image ? `${IMAGE_BASE_URL}${car.image}` : "https://via.placeholder.com/400x250?text=No+Image"} 
                alt={car.modelName} 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=Error+Loading"; }}
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black text-slate-900 uppercase">{car.modelName}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${car.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {car.stock > 0 ? `Stock: ${car.stock}` : 'Out of Stock'}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-400 mb-4">{car.variant} • {car.fuelType} • {car.color}</p>
              
              <div className="space-y-1 mb-4">
                <p className="text-xs text-slate-400">Ex-Showroom: ₹{car.exShowroomPrice?.toLocaleString("en-IN")}</p>
                <p className="text-2xl font-black text-orange-600">On-Road: ₹{car.onRoadPrice?.toLocaleString("en-IN")}</p>
              </div>

              <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setEditingId(car._id); setFormData({ ...car, image: null }); setIsModalOpen(true); }}
                    className="text-xs font-black text-blue-600 uppercase hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(car._id)}
                    className="text-xs font-black text-red-600 uppercase hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{editingId ? "Update Vehicle" : "Add New Vehicle"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="modelName" placeholder="Model Name" required className="border p-3 rounded-lg" value={formData.modelName} onChange={handleInputChange} />
                <input name="variant" placeholder="Variant (VXI, ZXI)" required className="border p-3 rounded-lg" value={formData.variant} onChange={handleInputChange} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <select name="fuelType" className="border p-3 rounded-lg bg-white" value={formData.fuelType} onChange={handleInputChange} required>
                  <option value="Petrol">Petrol</option>
                  <option value="CNG">CNG</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Diesel">Diesel</option>
                </select>
                <input name="color" placeholder="Color" required className="border p-3 rounded-lg" value={formData.color} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input name="exShowroomPrice" type="number" placeholder="Ex-Showroom Price" required className="border p-3 rounded-lg" value={formData.exShowroomPrice} onChange={handleInputChange} />
                <input name="onRoadPrice" type="number" placeholder="On-Road Price" required className="border p-3 rounded-lg" value={formData.onRoadPrice} onChange={handleInputChange} />
              </div>

              <input name="stock" type="number" placeholder="Stock Quantity" required className="w-full border p-3 rounded-lg" value={formData.stock} onChange={handleInputChange} />
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Vehicle Image</label>
                <input name="image" type="file" className="w-full" onChange={handleInputChange} />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-400">Cancel</button>
                <button type="submit" className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition">
                  {editingId ? "Update Car" : "Save Car"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCars;