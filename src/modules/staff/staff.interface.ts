import { Document } from "mongoose";

export interface IStaff extends Document {
  name: string;
  serviceType: string;
  dailyCapacity: number;
  currentLoad?: number;
  availabilityStatus: "Available" | "On Leave";
  createdAt: Date;
  updatedAt: Date;
}
