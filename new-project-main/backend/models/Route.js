const mongoose = require("mongoose")

const routeSchema = new mongoose.Schema(
  {
    route_id: {
      type: Number,
      required: true,
      unique: true,
    },
    distance_km: {
      type: Number,
      required: true,
      min: 0,
    },
    traffic_level: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    base_time_min: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Route", routeSchema)
