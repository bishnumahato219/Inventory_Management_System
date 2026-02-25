const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    modelName: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "CNG", "Hybrid", "Diesel"],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    exShowroomPrice: {
      type: Number,
      required: true,
    },
    onRoadPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["available", "out_of_stock"],
      default: "available",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);