import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Barcode from "react-barcode";
import { Plus, Edit3, Trash2, Package, X } from "lucide-react";

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });

    try {
      if (editingId) {
        await API.put(`/cars/${editingId}`, data);
      } else {
        await API.post("/cars", data);
      }
      setIsModalOpen(false);
      resetForm();
      fetchCars();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this vehicle?")) {
      try {
        await API.delete(`/cars/${id}`);
        setCars(cars.filter((car) => car._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      modelName: "", variant: "", fuelType: "Petrol",
      color: "", exShowroomPrice: "", onRoadPrice: "",
      stock: 0, image: null,
    });
    setEditingId(null);
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-bounce text-orange-600 font-black uppercase tracking-widest text-xs">Loading Fleet...</div>
    </div>
  );

  return (
    <div className="p-4 md:p-0">
      {/* HEADER: Stack on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Fleet <span className="text-orange-600">Inventory</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Dealership Stock Control</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-3 rounded-2xl shadow-lg transition"
        >
          <Plus size={20} /> Add New Car
        </button>
      </div>

      {/* GRID: 1 col (mobile) -> 2 col (tablet) -> 3 col (desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
            <div className="h-44 md:h-48 bg-slate-100 relative">
              <img
                src={car.image ? `${IMAGE_BASE_URL}${car.image}` : "https://via.placeholder.com/400x250"}
                alt={car.modelName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg ${
                  car.stock > 0 ? "bg-white text-green-600" : "bg-red-600 text-white"
                }`}>
                  {car.stock > 0 ? `${car.stock} IN STOCK` : "SOLD OUT"}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">
                {car.modelName}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                {car.variant} • {car.fuelType}
              </p>

              {/* BARCODE - Scaled for mobile */}
              <div className="bg-slate-50 p-3 rounded-2xl mb-4 overflow-hidden flex justify-center">
                <Barcode value={car.barcode} height={30} width={1.2} fontSize={10} background="transparent" />
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-[10px] text-slate-400 font-bold uppercase">On-Road Pricing</p>
                <p className="text-2xl font-black text-orange-600">
                  ₹{car.onRoadPrice?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(car._id);
                    setFormData({ ...car, image: null });
                    setIsModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white text-[10px] font-black uppercase py-3 rounded-xl hover:bg-slate-800 transition"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="px-4 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RESPONSIVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl overflow-y-auto max-h-[95vh] rounded-t-[2.5rem] sm:rounded-[2.5rem]">
            <div className="sticky top-0 bg-white p-6 border-b border-slate-50 flex justify-between items-center z-10">
              <h2 className="text-xl font-black text-slate-900 uppercase">
                {editingId ? "Update Asset" : "New Entry"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 pb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Model Name</label>
                  <input name="modelName" required className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm"
                    value={formData.modelName} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Variant</label>
                  <input name="variant" required className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm"
                    value={formData.variant} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Fuel Type</label>
                  <select name="fuelType" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm appearance-none"
                    value={formData.fuelType} onChange={handleInputChange}>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Color</label>
                  <input name="color" required className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm"
                    value={formData.color} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ex-Showroom</label>
                  <input name="exShowroomPrice" type="number" required className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm"
                    value={formData.exShowroomPrice} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">On-Road</label>
                  <input name="onRoadPrice" type="number" required className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm"
                    value={formData.onRoadPrice} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Stock Quantity</label>
                <input name="stock" type="number" required className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm"
                  value={formData.stock} onChange={handleInputChange} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Vehicle Image</label>
                <input name="image" type="file" className="text-xs block w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" onChange={handleInputChange} />
              </div>

              <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all mt-4">
                {editingId ? "Update Inventory" : "Finalize Asset"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCars;