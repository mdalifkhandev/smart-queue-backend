import mongoose from "mongoose";
import { IAuditLog } from "./auditLog.interface";

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
