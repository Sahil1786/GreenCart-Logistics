const mongoose = require("mongoose")

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shift_hours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    past_week_hours: {
      type: [Number],
      required: true,
      validate: {
        validator: (v) => v.length === 7,
        message: "Past week hours must contain exactly 7 days",
      },
    },
    current_fatigue: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Driver", driverSchema)
