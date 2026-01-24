import { Document, Types } from "mongoose";
import { IService } from "../service/service.interface";
import { IStaff } from "../staff/staff.interface";

export interface IAppointment extends Document {
  customerName: string;
  service: Types.ObjectId | IService;
  staff?: Types.ObjectId | IStaff;
  appointmentDate: Date;
  status: "Scheduled" | "Completed" | "Cancelled" | "No-Show" | "Waiting";
  queuePosition?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
