import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";

export default function BookingPage() {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advanceAmount, setAdvanceAmount] = useState(10000);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch single car
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/cars/${carId}`
        );
        const data = await res.json();
        setCar(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car:", error);
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      setBookingLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            car: car._id,
            advanceAmount,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Booking created successfully!");
        navigate("/customer/dashboard");
      } else {
        alert(data.message || "Booking failed");
      }

      setBookingLoading(false);
    } catch (error) {
      console.error("Booking error:", error);
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading car details...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Car not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white shadow-lg rounded-xl p-8">

          <h2 className="text-3xl font-semibold mb-6">
            Confirm Booking
          </h2>

          <div className="space-y-3 text-gray-700">
            <p><strong>Model:</strong> {car.modelName}</p>
            <p><strong>Variant:</strong> {car.variant}</p>
            <p><strong>Fuel:</strong> {car.fuelType}</p>
            <p><strong>On Road Price:</strong> ₹ {car.onRoadPrice}</p>
            <p><strong>Available Stock:</strong> {car.stock}</p>
          </div>

          <div className="mt-6">
            <label className="block mb-2 font-medium">
              Advance Amount
            </label>
            <input
              type="number"
              value={advanceAmount}
              onChange={(e) =>
                setAdvanceAmount(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8100d1]"
            />
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={bookingLoading || car.stock <= 0}
            className="mt-8 w-full bg-gradient-to-r from-[#8100d1] to-[#b500b2] text-white py-3 rounded-lg transition hover:opacity-90 disabled:bg-gray-400"
          >
            {bookingLoading ? "Processing..." : "Confirm Booking"}
          </button>

        </div>
      </div>
    </div>
  );
}
