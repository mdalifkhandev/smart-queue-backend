import mongoose from "mongoose";
import { IStaff } from "./staff.interface";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    serviceType: { type: String, required: true }, // e.g., 'Doctor', 'Consultant'
    dailyCapacity: { type: Number, default: 5 },
    currentLoad: { type: Number, default: 0 },
    availabilityStatus: {
      type: String,
      enum: ["Available", "On Leave"],
      default: "Available",
    },
  },
  { timestamps: true },
);

export default mongoose.model<IStaff>("Staff", staffSchema);
