const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    invoiceNumber: String,
    status: {
      type: String,
      enum: ["ordered", "received"],
      default: "ordered"
    },
    receivedDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
