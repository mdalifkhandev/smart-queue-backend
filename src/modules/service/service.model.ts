import mongoose from "mongoose";
import { IService } from "./service.interface";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    staffType: { type: String, required: true }, // e.g., 'Doctor'
  },
  { timestamps: true },
);

export default mongoose.model<IService>("Service", serviceSchema);
