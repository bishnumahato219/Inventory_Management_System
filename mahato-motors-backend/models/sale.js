const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true
    },
    salePrice: {
      type: Number,
      required: true
    },
    paymentMode: {
      type: String,
      enum: ["cash", "card", "upi", "finance"],
      required: true
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    saleDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
