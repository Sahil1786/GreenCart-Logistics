import mongoose from "mongoose"

const SimulationSchema = new mongoose.Schema(
  {
    inputs: {
      drivers_count: Number,
      start_time: String,
      max_hours_per_day: Number,
    },
    results: {
      total_profit: Number,
      efficiency_score: Number,
      on_time_deliveries: Number,
      late_deliveries: Number,
      total_fuel_cost: Number,
      high_value_bonuses: Number,
      late_penalties: Number,
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

export default mongoose.models.Simulation || mongoose.model("Simulation", SimulationSchema)
