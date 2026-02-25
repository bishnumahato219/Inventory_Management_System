const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // React default Vite port
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

//use the auth routes
app.use("/api/auth", require("./routes/authRoutes"));
//use the car routes
app.use("/api/cars", require("./routes/carRoutes"));
//use the stock routes
app.use("/api/stock", require("./routes/stockRoutes"));
//use the supplier and purchase routes
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/purchases", require("./routes/purchaseRoutes"));
//use the booking routes
app.use("/api/bookings", require("./routes/bookingRoutes"));
//use the sales routes
app.use("/api/sales", require("./routes/salesRoutes"));
//use the report routes
app.use("/api/reports", require("./routes/reportRoutes"));
//use the user routes
app.use("/api/users", require("./routes/userRoutes"));
// Dashboard controller
app.use("/api/dashboard", dashboardRoutes);


const PORT = process.env.PORT || 5000;


app.get("/", (req, res) => {
  res.send("<h1>Toh chalea suru karte hain..😀</h1>");
});

app.listen(PORT, () =>
  console.log(` Mahato Motors Server running on port 😁 ${PORT}`)
);
