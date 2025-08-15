import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    value_rs: {
      type: Number,
      required: true,
    },
    route_id: {
      type: Number,
      required: true,
    },
    delivery_time: {
      type: String,
      required: true, // Format: "HH:MM"
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

export default mongoose.models.Order || mongoose.model("Order", OrderSchema)
