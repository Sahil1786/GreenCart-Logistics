const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    value_rs: {
      type: Number,
      required: true,
      min: 0,
    },
    route_id: {
      type: Number,
      required: true,
      ref: "Route",
    },
    delivery_time: {
      type: String,
      required: true,
    },
    assigned_driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "delivered", "late"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Order", orderSchema)
