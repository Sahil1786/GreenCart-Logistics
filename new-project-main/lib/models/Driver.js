import mongoose from "mongoose"

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shift_hours: {
      type: Number,
      required: true,
    },
    past_week_hours: {
      type: String,
      required: true, // Format: "7|10|7|7|9|9|8"
    },
    current_fatigue: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Driver || mongoose.model("Driver", DriverSchema)
