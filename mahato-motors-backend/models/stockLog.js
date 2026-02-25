const mongoose = require("mongoose");

const stockLogSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["car", "accessory"],
      required: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "itemType"
    },
    action: {
      type: String,
      enum: ["IN", "OUT"],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reason: {
      type: String
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockLog", stockLogSchema);
