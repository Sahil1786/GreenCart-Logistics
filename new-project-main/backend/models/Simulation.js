const mongoose = require("mongoose")

const simulationSchema = new mongoose.Schema(
  {
    simulation_id: {
      type: String,
      required: true,
      unique: true,
    },
    inputs: {
      available_drivers: Number,
      start_time: String,
      max_hours_per_day: Number,
    },
    results: {
      total_profit: Number,
      efficiency_score: Number,
      on_time_deliveries: Number,
      late_deliveries: Number,
      fuel_cost: Number,
      penalties: Number,
      bonuses: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Simulation", simulationSchema)
