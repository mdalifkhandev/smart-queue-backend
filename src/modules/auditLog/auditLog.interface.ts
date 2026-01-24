import { Document } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  details: string;
  timestamp: Date;
}
