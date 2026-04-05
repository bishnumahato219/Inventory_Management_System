import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Barcode from "react-barcode";
import { Plus, Edit3, Trash2, X, Image as ImageIcon, ChevronDown } from "lucide-react";

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Production-ready URL logic
  const RENDER_URL = "https://inventory-management-system-ftg8.onrender.com";

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
    if (window.confirm("Delete this vehicle? This action is irreversible.")) {
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
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <p className="font-black uppercase tracking-widest text-slate-400 text-[10px]">Scanning Fleet Registry...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-0 space-y-8 overflow-x-hidden">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">
            Fleet <span className="text-orange-600">Inventory</span>
          </h2>
          <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-1">Dealership Stock Control</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Car
        </button>
      </div>

      {/* 2. GRID SYSTEM: 1 col (mobile) -> 2 col (tablet) -> 3 col (desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {cars.map((car) => (
          <div key={car._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
            
            {/* Image Container with Responsive Aspect Ratio */}
            <div className="h-48 md:h-56 bg-slate-50 relative overflow-hidden">
              <img
                src={car.image ? (car.image.startsWith('http') ? car.image : `${RENDER_URL}/${car.image}`.replace(/([^:]\/)\/+/g, "$1")) : "https://via.placeholder.com/400x250?text=No+Image"}
                alt={car.modelName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=Asset+NotFound"; }}
              />
              <div className="absolute top-4 right-4">
                <span className={`text-[9px] font-black px-4 py-2 rounded-full shadow-lg backdrop-blur-md ${
                  car.stock > 0 ? "bg-white/90 text-green-600" : "bg-red-600 text-white"
                }`}>
                  {car.stock > 0 ? `${car.stock} IN STOCK` : "SOLD OUT"}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight truncate">
                  {car.modelName}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  {car.variant} • <span className="text-orange-500">{car.fuelType}</span>
                </p>
              </div>

              {/* BARCODE - Perfectly Centered and Scaled */}
              <div className="bg-slate-50/50 p-4 rounded-3xl mb-6 flex justify-center border border-slate-100/50">
                <div className="mix-blend-multiply opacity-80">
                  <Barcode value={car.barcode} height={35} width={1.2} fontSize={10} background="transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">On-Road Price</p>
                  <p className="text-xl font-black text-slate-900">
                    ₹{car.onRoadPrice?.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Color Spec</p>
                  <p className="text-xs font-bold text-slate-700 uppercase">{car.color}</p>
                </div>
              </div>

              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => {
                    setEditingId(car._id);
                    setFormData({ ...car, image: null });
                    setIsModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-900 text-[10px] font-black uppercase py-4 rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                  <Edit3 size={14} /> Edit Asset
                </button>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="px-5 flex items-center justify-center bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. MODAL: Bottom-Sheet on Mobile, Center-Card on Desktop */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl shadow-2xl overflow-y-auto max-h-[92vh] rounded-t-[2.5rem] sm:rounded-[3rem] custom-scrollbar">
            
            <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 md:p-8 border-b border-slate-50 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                  {editingId ? "Update" : "Register"} <span className="text-orange-600">Asset</span>
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mahato Motors Inventory Unit</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
              >
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Model Name</label>
                  <input name="modelName" required placeholder="e.g. Swift Dzire" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                    value={formData.modelName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Variant</label>
                  <input name="variant" required placeholder="e.g. VXI" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                    value={formData.variant} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Fuel System</label>
                  <div className="relative">
                    <select name="fuelType" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:ring-orange-500 transition-all"
                      value={formData.fuelType} onChange={handleInputChange}>
                      <option value="Petrol">Petrol</option>
                      <option value="CNG">CNG</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Exterior Color</label>
                  <input name="color" required placeholder="e.g. Arctic White" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                    value={formData.color} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Ex-Showroom (₹)</label>
                  <input name="exShowroomPrice" type="number" required className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                    value={formData.exShowroomPrice} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">On-Road (₹)</label>
                  <input name="onRoadPrice" type="number" required className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                    value={formData.onRoadPrice} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Inventory Quantity</label>
                <input name="stock" type="number" required className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                  value={formData.stock} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Visual Asset (JPEG/PNG)</label>
                <div className="relative group">
                  <input name="image" type="file" className="hidden" id="car-image-upload" onChange={handleInputChange} />
                  <label htmlFor="car-image-upload" className="flex items-center justify-center gap-3 w-full border-2 border-dashed border-slate-200 p-8 rounded-[2rem] cursor-pointer group-hover:border-orange-500 transition-all group-hover:bg-orange-50/50">
                    <ImageIcon className="text-slate-400 group-hover:text-orange-500" size={24} />
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-orange-600">
                      {formData.image ? formData.image.name : "Select Image File"}
                    </span>
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-xs shadow-2xl shadow-slate-900/20 hover:bg-orange-600 transition-all mt-6 active:scale-95">
                {editingId ? "Update Audit Record" : "Synchronize Asset to Fleet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCars;