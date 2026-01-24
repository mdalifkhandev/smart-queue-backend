import { Document } from "mongoose";

export interface IService extends Document {
  name: string;
  duration: number; // in minutes
  staffType: string;
  createdAt: Date;
  updatedAt: Date;
}
