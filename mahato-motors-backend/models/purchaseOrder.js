const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
  },
  quantity: Number,
  pricePerUnit: Number,
  status: {
    type: String,
    enum: ["ordered", "received"],
    default: "ordered"
  }
}, { timestamps: true });

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
